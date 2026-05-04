# TurboShop — Arquitectura General

## Visión general

```
┌─────────────────────────────────────────────────────────┐
│                     Proveedores externos                │
│   GlobalParts        RepuestosMax        AutoPartsPlus  │
└────────┬─────────────────┬───────────────────┬──────────┘
         │  polling c/30s  │                   │
         ▼                 ▼                   ▼
┌─────────────────────────────────────────────────────────┐
│                        Backend (NestJS)                 │
│                                                         │
│  SyncService ──► mappers ──► PartsService (in-memory)   │
│       │                            │                    │
│       └──► EventsService (SSE) ◄───┘                    │
│                     │                                   │
│              PartsController                            │
│         GET /parts  │  GET /parts/:sku  │  SSE /events  │
└─────────────────────┼───────────────────────────────────┘
                      │ HTTP + SSE
┌─────────────────────▼───────────────────────────────────┐
│                      Frontend (Next.js)                 │
│                                                         │
│   fetchCatalog / fetchPartDetail ──► Server Components  │
│   useSSE hook ──► actualiza precio/stock sin recargar   │
└─────────────────────────────────────────────────────────┘
```

---

## Backend

### Módulos

| Módulo | Responsabilidad |
|---|---|
| `PartsModule` | Núcleo del dominio: catálogo, detalle, SSE |
| `GlobalpartsModule` | Integración con proveedor GlobalParts |
| `RepuestosMaxModule` | Integración con proveedor RepuestosMax |
| `AutoPartsPlusModule` | Integración con proveedor AutoPartsPlus |

### Servicios principales

**`SyncService`** — Se ejecuta al iniciar el módulo (`OnModuleInit`) y cada 30 segundos:
1. Consulta en paralelo el catálogo paginado de los tres proveedores.
2. Normaliza las respuestas a través de los _mappers_ correspondientes.
3. Compara los nuevos datos con el estado anterior almacenado en `PartsService`.
4. Si detecta cambios de precio o stock, emite un evento SSE vía `EventsService`.
5. Actualiza el store en memoria con los datos frescos.
6. Si un proveedor falla o responde con error, mantiene la caché anterior sin interrumpir el servicio.

**`PartsService`** — Almacena los repuestos en memoria, separados por proveedor en tres `Map<sku, Part>`. Expone métodos para filtrar, buscar y paginar sin consultar los proveedores directamente.

**`EventsService`** — Mantiene un `Subject` de RxJS. Los clientes SSE suscriben a su stream observable; `SyncService` emite eventos cuando detecta cambios.

### Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/parts` | Catálogo con filtros (`query`, `brand`, `make`, `year`) y paginación (`page`, `limit`) |
| `GET` | `/parts/:sku` | Detalle de un repuesto con todas las ofertas por proveedor |
| `SSE` | `/parts/events` | Stream de cambios de precio/stock en tiempo real |

### Formato del evento SSE

```ts
{
  sku:      string    // identificador del repuesto afectado
  provider: string    // proveedor que reporta el cambio
  price:    number
  currency: string
  stock:    number
}
```

### Almacenamiento

Los datos se mantienen exclusivamente en memoria (no hay base de datos). El estado se reconstruye en cada reinicio del proceso a partir del primer ciclo de polling.

---

## Frontend

### Páginas

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | `page.tsx` + `CatalogClient` | Catálogo con filtros, búsqueda y paginación |
| `/parts/[sku]` | `page.tsx` | Detalle de repuesto con tabla de ofertas por proveedor |

### Flujo de datos

- **Catálogo e detalle**: llamadas HTTP al backend desde Server Components y Client Components usando `fetchCatalog` / `fetchPartDetail` (`src/lib/api.ts`).
- **Actualizaciones en tiempo real**: el hook `useSSE` abre una conexión `EventSource` a `/parts/events` y mantiene un `Map<sku, patch>`. Cuando llega un evento, el componente de catálogo aplica el patch sobre la card correspondiente sin necesidad de recargar la página.

### Estructura de componentes

```
src/
├── app/
│   ├── page.tsx                  # página principal (catálogo)
│   └── parts/[sku]/page.tsx      # página de detalle
├── components/
│   ├── common/
│   │   ├── CatalogClient.tsx     # lógica de filtros + SSE
│   │   ├── FiltersBar.tsx
│   │   ├── PartCard.tsx
│   │   ├── OfferRow.tsx
│   │   └── Pagination.tsx
│   ├── layout/
│   │   └── Navbar.tsx
│   └── ui/                       # componentes base (Badge, Button, Input, Spinner)
├── hooks/
│   └── useSSE.ts
└── lib/
    ├── api.ts                    # fetchCatalog, fetchPartDetail, getSSEUrl
    ├── types.ts
    └── images.ts
```

---

## Consideraciones de escalabilidad

El diseño actual (polling + almacenamiento en memoria) es adecuado para el volumen de datos de esta prueba. Si los proveedores expusieran catálogos de gran volumen, alta frecuencia de actualización o mayor cantidad de proveedores, la arquitectura evolucionaría de la siguiente forma:

- **Base de datos persistente**: los repuestos se almacenarían en una DB (PostgreSQL) en lugar de memoria, permitiendo consultas eficientes, índices y sobrevivir reinicios sin perder estado.
- **Servicio de sincronización independiente**: el polling y la normalización de proveedores se extraerían a un servicio separado (worker), desacoplándolo del backend que atiende las requests. Esto permite escalarlos de forma independiente y evita que una sincronización lenta impacte la latencia de la API.
- **Cola de mensajes**: los cambios detectados se publicarían en una cola (ej. Redis Pub/Sub, RabbitMQ) en lugar de emitirse directamente por SSE, permitiendo múltiples instancias del backend consumir y reenviar los eventos.

```
Proveedores → Worker de sync → DB ← Backend API → Frontend
                                  ↓
                            Cola de eventos → SSE
```

---

## Decisiones de diseño

- **Sin base de datos**: los datos viven en memoria para simplificar el despliegue. El polling periódico mantiene el estado actualizado.
- **Caché resiliente**: si un proveedor falla, se conserva el último dato conocido. El servicio nunca retorna vacío por una falla puntual.
- **SSE sobre WebSockets**: unidireccional (servidor → cliente) es suficiente, ya que el frontend solo necesita recibir actualizaciones, no enviarlas.
- **Frontend no habla con proveedores**: toda la complejidad de integración (formatos dispares, errores, paginación) queda encapsulada en el backend.
