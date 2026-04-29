**TurboShop — Arquitectura general**

**Flujo principal:**
```
Proveedores externos → Backend → Frontend
```

**Backend hace:**
1. Expone endpoints normalizados propios (unifica los 3 proveedores en un formato común)
2. Cuando llega una request, consulta los proveedores externos
3. Guarda la respuesta en caché con TTL para no martillarlos
4. Si el proveedor cae, devuelve el último dato conocido (stale)
5. Cada 30s hace polling en background a los proveedores para detectar cambios de precio/stock
6. Cuando detecta un cambio, empuja el update al frontend vía SSE

**Frontend hace:**
1. Consume los endpoints del backend (catálogo, búsqueda, detalle)
2. Mantiene una conexión SSE abierta con el backend
3. Cuando recibe un evento SSE, actualiza precio/stock en pantalla sin recargar

**Puntos clave:**
- El frontend **nunca** habla directo con los proveedores
- El backend es el que absorbe la latencia variable y los errores intermitentes
- La caché evita depender 100% de que los proveedores estén vivos
- SSE es unidireccional (servidor → cliente), suficiente porque el frontend solo necesita recibir updates
