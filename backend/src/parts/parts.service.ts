import { Injectable } from '@nestjs/common'
import { Part, Provider } from './part.type'

export interface SearchFilters {
  query?:    string   // texto libre (nombre, marca, oem)
  brand?:    string   // filtro por marca
  make?:     string   // filtro por fabricante de vehículo
  year?:     number   // filtro por año de compatibilidad
}

export interface PaginatedResult {
  items:      Part[]
  total:      number
  page:       number
  totalPages: number
}

@Injectable()
export class PartsService {

  private readonly stores: Record<Provider, Map<string, Part>> = {
    globalparts:   new Map(),
    repuestosmax:  new Map(),
    autopartsplus: new Map(),
  }

  // ─── Llamado por el sync/polling ─────────────────────────────────────────

  updateStore(provider: Provider, parts: Part[]): void {
    const store = this.stores[provider]
    store.clear()
    for (const part of parts) {
      store.set(part.sku, part)
    }
  }

  // ─── Todos los productos de los 3 stores combinados ──────────────────────

  private allParts(): Part[] {
    return [
      ...this.stores.globalparts.values(),
      ...this.stores.repuestosmax.values(),
      ...this.stores.autopartsplus.values(),
    ]
  }

  // ─── Usado por SyncService para comparar antes de actualizar ─────────────

  getPartFromStore(provider: Provider, sku: string): Part | undefined {
    return this.stores[provider].get(sku)
  }

  // ─── Catálogo con filtros y paginación ───────────────────────────────────

  getCatalog(filters: SearchFilters, page = 1, limit = 20): PaginatedResult {
    const filtered = this.allParts().filter((part) => this.matchesFilters(part, filters))
    return this.paginate(filtered, page, limit)
  }

  // ─── Detalle por SKU: devuelve las ofertas de cada proveedor ─────────────

  getBySkuAllProviders(sku: string): Part[] {
    return Object.values(this.stores)
      .map((store) => store.get(sku))
      .filter((part): part is Part => part !== undefined)
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────

  private matchesFilters(part: Part, filters: SearchFilters): boolean {
    if (filters.query) {
      const q = filters.query.toLowerCase()
      const matchesText =
        part.name.toLowerCase().includes(q)    ||
        part.brand.toLowerCase().includes(q)   ||
        part.oemCode.toLowerCase().includes(q)
      if (!matchesText) return false
    }

    if (filters.brand) {
      if (!part.brand.toLowerCase().includes(filters.brand.toLowerCase())) return false
    }

    if (filters.make) {
      const make = filters.make.toLowerCase()
      const compatible = part.vehicleCompatibility.some(
        (v) => v.make.toLowerCase().includes(make)
      )
      if (!compatible) return false
    }

    if (filters.year) {
      const compatible = part.vehicleCompatibility.some(
        (v) => filters.year! >= v.yearFrom && filters.year! <= v.yearTo
      )
      if (!compatible) return false
    }

    return true
  }

  private paginate(parts: Part[], page: number, limit: number): PaginatedResult {
    const total      = parts.length
    const totalPages = Math.ceil(total / limit)
    const items      = parts.slice((page - 1) * limit, page * limit)
    return { items, total, page, totalPages }
  }
}
