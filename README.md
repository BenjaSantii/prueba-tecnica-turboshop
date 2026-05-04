# TurboShop

Catálogo de repuestos automotrices con precios y stock en tiempo real. Agrega ofertas de múltiples proveedores por repuesto, permite filtrar por categoría y buscar por nombre/SKU, y emite actualizaciones de precio/stock en vivo vía SSE.

## Deploy

- **Frontend**: https://frontend-prueba-tecnica-turboshop-production.up.railway.app
- **Backend**: https://prueba-tecnica-turboshop-production.up.railway.app

## Stack
- **Backend**: NestJS + TypeScript — puerto `3000`
- **Frontend**: Next.js + TypeScript — puerto `3001` en dev

## Variables de Entorno

**Frontend** (`frontend/.env.local`, copiar desde `frontend/.env.example`):
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Backend** (`backend/.env.local`, copiar desde `backend/.env.example`):
```
PROVIDERS_BASE_URL=<url del servicio de proveedores>
PORT=3000
```

## Documentación de la API

La documentación interactiva (Swagger UI) está disponible en:

```
http://localhost:3000/api                                                    (local)
https://prueba-tecnica-turboshop-production.up.railway.app/api               (producción)
```

Permite explorar y probar todos los endpoints directamente desde el browser.

> El endpoint SSE (`GET /parts/events`) no aparece en Swagger ya que es un stream de conexión persistente. Su formato está documentado en [Arquitectura.md](./Arquitectura.md).

## Instalación

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

## Ejecución Local

```bash
# Backend (puerto 3000)
cd backend && npm run start:dev

# Frontend (puerto 3001)
cd frontend && npm run dev
```
