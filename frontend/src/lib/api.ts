import type { CatalogFilters, CatalogResponse, PartDetail } from './types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

export async function fetchCatalog(filters: CatalogFilters = {}): Promise<CatalogResponse> {
  const params = new URLSearchParams()
  if (filters.query) params.set('query', filters.query)
  if (filters.brand) params.set('brand', filters.brand)
  if (filters.make) params.set('make', filters.make)
  if (filters.year) params.set('year', filters.year)
  params.set('page', String(filters.page ?? 1))
  params.set('limit', String(filters.limit ?? 20))

  const res = await fetch(`${API_BASE}/parts?${params}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Catalog fetch failed: ${res.status}`)
  return res.json()
}

export async function fetchPartDetail(sku: string): Promise<PartDetail> {
  const res = await fetch(`${API_BASE}/parts/${sku}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Detail fetch failed: ${res.status}`)
  return res.json()
}

export function getSSEUrl(): string {
  return `${API_BASE}/parts/events`
}
