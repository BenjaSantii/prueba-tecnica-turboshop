export type Provider = 'globalparts' | 'repuestosmax' | 'autopartsplus'

export interface VehicleCompatibility {
  make: string
  model: string
  yearFrom: number
  yearTo: number
  engine?: string
  trim?: string
}

export interface PartSummary {
  sku: string
  oemCode: string
  provider: Provider
  name: string
  brand: string
  category: string
  images: string[]
  price: number
  currency: string
  taxIncluded: boolean
  discountAvailable: boolean
  stock: number
  warehouse: string
  estimatedDispatch?: string
}

export interface PartOffer {
  provider: Provider
  price: number
  currency: string
  taxIncluded: boolean
  discountAvailable: boolean
  stock: number
  warehouse: string
  estimatedDispatch?: string
}

export interface PartDetail {
  found: boolean
  sku: string
  oemCode: string
  name: string
  brand: string
  category: string
  description: string
  images: string[]
  weight?: { value: number; unit: string }
  specs: Record<string, string>
  vehicleCompatibility: VehicleCompatibility[]
  offers: PartOffer[]
}

export interface CatalogResponse {
  items: PartSummary[]
  total: number
  page: number
  totalPages: number
}

export interface SSEPatch {
  price: number
  currency: string
  stock: number
}

export interface CatalogFilters {
  query?: string
  brand?: string
  make?: string
  year?: string
  page?: number
  limit?: number
}
