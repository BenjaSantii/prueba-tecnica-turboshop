// ─── Producto compartido entre catálogo y búsqueda ───────────────────────────

export interface RepuestosMaxProductoDto {
  identificacion: {
    codigoInterno: string
    sku: string
    codigoOEM: string
  }
  informacionBasica: {
    nombre: string
    descripcion: string
    marca: { nombre: string }
    categoria: { nombre: string; id: string }
  }
  precio: {
    valor: number
    moneda: string
    incluyeIVA: boolean
    descuentoDisponible: boolean
  }
  inventario: {
    cantidad: number
    estado: string
    ubicacion: { bodega: string; sector: string }
    tiempoDespachoEstimado: string
  }
  caracteristicas: {
    peso: { valor: number; unidad: string }
    especificaciones: Record<string, string>
  }
  multimedia: {
    imagenes: Array<{ url: string; tipo: string }>
  }
  compatibilidad: {
    vehiculos: Array<{
      fabricante: string
      modelo: string
      anios: { desde: number; hasta: number }
      motor?: string
      version?: string
    }>
  }
}

// ─── Respuesta: GET /catalogo ─────────────────────────────────────────────────

export interface RepuestosMaxCatalogoResponseDto {
  exito: boolean
  consulta: {
    id: string
    fechaHora: string
    tiempoRespuestaMs: number
  }
  paginacion: {
    totalProductos: number
    totalPaginas: number
    paginaActual: number
    productosPorPagina: number
    tieneSiguiente: boolean
    tieneAnterior: boolean
  }
  productos: RepuestosMaxProductoDto[]
}

// ─── Respuesta: GET /productos?codigo= ───────────────────────────────────────

export interface RepuestosMaxProductosResponseDto {
  exito: boolean
  consulta: {
    id: string
    fechaHora: string
    parametros: { codigo: string }
    tiempoRespuestaMs: number
  }
  resultado: {
    cantidadTotal: number
    productos: RepuestosMaxProductoDto[]
  }
}

// ─── Respuesta: GET /info ─────────────────────────────────────────────────────

export interface RepuestosMaxInfoDto {
  proveedor: {
    nombre: string
    version: string
    pais: string
    moneda: string
  }
  servicio: {
    estado: string
    latencia: { minimo: string; maximo: string }
    tasaError: string
  }
}
