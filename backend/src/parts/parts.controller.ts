import { Controller, Get, Param, Query } from '@nestjs/common'
import { PartsService } from './parts.service'
import type { PartDetail } from './part.type'

@Controller('parts')
export class PartsController {

  constructor(private readonly partsService: PartsService) {}

  // GET /parts?query=filtro&brand=KYB&make=Toyota&year=2015&page=1&limit=20
  @Get()
  getCatalog(
    @Query('query') query?: string,
    @Query('brand') brand?: string,
    @Query('make')  make?:  string,
    @Query('year')  year?:  string,
    @Query('page')  page?:  string,
    @Query('limit') limit?: string,
  ) {
    return this.partsService.getCatalog(
      { query, brand, make, year: year ? +year : undefined },
      page  ? +page  : 1,
      limit ? +limit : 20,
    )
  }

  // GET /parts/:sku  →  info consolidada + ofertas por proveedor
  @Get(':sku')
  getDetail(@Param('sku') sku: string): PartDetail {
    const parts = this.partsService.getBySkuAllProviders(sku)
    if (!parts.length) return { found: false, sku, oemCode: '', name: '', brand: '', category: '', description: '', images: [], specs: {}, vehicleCompatibility: [], offers: [] }

    const [base] = parts

    return {
      found:                true,
      sku:                  base.sku,
      oemCode:              base.oemCode,
      name:                 base.name,
      brand:                base.brand,
      category:             base.category,
      description:          base.description,
      images:               base.images,
      weight:               base.weight,
      specs:                base.specs,
      vehicleCompatibility: base.vehicleCompatibility,
      offers: parts.map((p) => ({
        provider:          p.provider,
        price:             p.price,
        currency:          p.currency,
        taxIncluded:       p.taxIncluded,
        discountAvailable: p.discountAvailable,
        stock:             p.stock,
        warehouse:         p.warehouse,
        estimatedDispatch: p.estimatedDispatch,
      })),
    }
  }
}
