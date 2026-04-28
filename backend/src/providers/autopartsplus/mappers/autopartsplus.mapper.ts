import { Part, VehicleCompatibility } from '../../../parts/types/part.type'
import { AutoPartsPlusPartDto } from '../autopartsplus.dto'

// Parsea strings como "Nissan Frontier 2009-2014 SR5" o "Ford Edge 2006-2008 3.5L V6"
function parseVehicleString(raw: string): VehicleCompatibility | null {
  const match = raw.match(/^(.+?)\s+(\d{4})-(\d{4})(.*)$/)
  if (!match) return null

  const [, makeModel, yearFrom, yearTo, rest] = match
  const parts = makeModel.trim().split(' ')
  const make  = parts[0]
  const model = parts.slice(1).join(' ')

  const extra   = rest.trim()
  const hasYear = /^\d/.test(extra)
  const engine  = hasYear ? extra : undefined
  const trim    = hasYear ? undefined : extra || undefined

  return { make, model, yearFrom: +yearFrom, yearTo: +yearTo, engine, trim }
}

function mapVehicles(part: AutoPartsPlusPartDto): VehicleCompatibility[] {
  return part.fits_vehicles
    .map(parseVehicleString)
    .filter((v): v is VehicleCompatibility => v !== null)
}

function mapSpecs(part: AutoPartsPlusPartDto): Record<string, string> {
  return Object.fromEntries(
    part.spec_keys.map((key, i) => [key, part.spec_values[i]])
  )
}

export function mapAutoPartsPlusToPart(part: AutoPartsPlusPartDto): Part {
  return {
    sku:               part.sku,
    oemCode:           part.oem_code,
    provider:          'autopartsplus',
    name:              part.title,
    brand:             part.brand_name,
    category:          part.category_name,
    images:            part.img_urls,
    price:             part.unit_price,
    currency:          part.currency_code,
    taxIncluded:       false,
    discountAvailable: false,
    stock:             part.qty_available,
    warehouse:         part.warehouse_location,
    description:       part.desc,
    weight: {
      value: part.weight_value,
      unit:  part.weight_unit,
    },
    specs:                mapSpecs(part),
    vehicleCompatibility: mapVehicles(part),
  }
}
