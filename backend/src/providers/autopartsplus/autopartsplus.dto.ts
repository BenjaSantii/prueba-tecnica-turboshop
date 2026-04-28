// ─── Part compartido entre catálogo y búsqueda ───────────────────────────────

export interface AutoPartsPlusPartDto {
  part_id: string
  sku: string
  oem_code: string
  title: string
  desc: string
  brand_name: string
  category_name: string
  unit_price: number
  currency_code: string
  qty_available: number
  warehouse_location: string
  weight_value: number
  weight_unit: string
  img_urls: string[]
  fits_vehicles: string[]
  spec_keys: string[]
  spec_values: string[]
}

// ─── Respuesta: GET /catalog ──────────────────────────────────────────────────

export interface AutoPartsPlusCatalogResponseDto {
  success: boolean
  request_id: string
  timestamp: string
  latency_ms: number
  pagination: {
    total_items: number
    total_pages: number
    current_page: number
    items_per_page: number
    has_next: boolean
    has_prev: boolean
  }
  parts: AutoPartsPlusPartDto[]
}

// ─── Respuesta: GET /parts?sku= ───────────────────────────────────────────────

export interface AutoPartsPlusSearchResponseDto {
  success: boolean
  request_id: string
  timestamp: string
  latency_ms: number
  total_results: number
  parts: AutoPartsPlusPartDto[]
}

// ─── Respuesta: GET /status ───────────────────────────────────────────────────

export interface AutoPartsPlusStatusDto {
  supplier: string
  status: string
  version: string
  latencyConfig: { minMs: number; maxMs: number }
  errorRate: string
}
