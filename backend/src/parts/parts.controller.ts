import { Controller, Get, Param, Query, Sse } from '@nestjs/common'
import { ApiExcludeEndpoint, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { Observable } from 'rxjs'
import { PartsService } from './parts.service'
import { EventsService } from './events.service'
import type { PartDetail } from './part.type'

@Controller('parts')
export class PartsController {

  constructor(
    private readonly partsService:  PartsService,
    private readonly eventsService: EventsService,
  ) {}

  @ApiExcludeEndpoint()
  @Sse('events')
  stream(): Observable<MessageEvent> {
    return this.eventsService.getStream()
  }

  // GET /parts?query=filtro&brand=KYB&make=Toyota&year=2015&page=1&limit=20
  @ApiQuery({ name: 'query', required: false, description: 'Texto libre (nombre, marca, código OEM)' })
  @ApiQuery({ name: 'brand', required: false, description: 'Filtrar por marca' })
  @ApiQuery({ name: 'make',  required: false, description: 'Filtrar por fabricante de vehículo' })
  @ApiQuery({ name: 'year',  required: false, description: 'Filtrar por año de compatibilidad' })
  @ApiQuery({ name: 'page',  required: false, description: 'Número de página (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Resultados por página (default: 20)' })
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
