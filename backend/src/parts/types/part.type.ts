export interface VehicleCompatibility {
  make: string
  model: string
  yearFrom: number
  yearTo: number
  engine?: string
  trim?: string
}

export type Provider = 'globalparts' | 'repuestosmax' | 'autopartsplus'

export interface Part {
  // identidad
  sku: string
  oemCode: string
  provider: Provider

  // búsqueda y lista
  name: string
  brand: string
  category: string
  images: string[]

  // precio
  price: number
  currency: string
  taxIncluded: boolean
  discountAvailable: boolean

  // stock
  stock: number
  warehouse: string
  estimatedDispatch?: string

  // detalle
  description: string
  weight?: { value: number; unit: string }
  specs: Record<string, string>
  vehicleCompatibility: VehicleCompatibility[]
}
