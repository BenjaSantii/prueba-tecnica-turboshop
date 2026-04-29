import { Injectable, OnModuleInit, Logger } from '@nestjs/common'
import { PartsService } from './parts.service'
import { EventsService } from './events.service'
import { GlobalpartsService } from '../providers/globalparts/globalparts.service'
import { RepuestosMaxService } from '../providers/repuestosmax/repuestosmax.service'
import { AutoPartsPlusService } from '../providers/autopartsplus/autopartsplus.service'
import { mapGlobalpartsToPart } from '../providers/globalparts/globalparts.mapper'
import { mapRepuestosMaxToPart } from '../providers/repuestosmax/repuestosmax.mapper'
import { mapAutoPartsPlusToPart } from '../providers/autopartsplus/autopartsplus.mapper'
import type { Part, Provider } from './part.type'

const SYNC_INTERVAL_MS = 30_000

// El servidor devuelve este formato cuando un proveedor falla o hace timeout
function getServerError(res: any): { statusCode: number; error: string } | null {
  if ('statusCode' in res && res.statusCode >= 400) {
    return { statusCode: res.statusCode, error: res.error }
  }
  return null
}

@Injectable()
export class SyncService implements OnModuleInit {

  private readonly logger = new Logger(SyncService.name)

  constructor(
    private readonly partsService:         PartsService,
    private readonly eventsService:        EventsService,
    private readonly globalpartsService:   GlobalpartsService,
    private readonly repuestosMaxService:  RepuestosMaxService,
    private readonly autoPartsPlusService: AutoPartsPlusService,
  ) {}

  // Compara nuevos parts con el store actual y emite eventos por cada cambio
  private detectChanges(provider: Provider, newParts: Part[]): void {
    for (const newPart of newParts) {
      const old = this.partsService.getPartFromStore(provider, newPart.sku)
      if (!old) continue  // parte nueva, no es un cambio

      if (old.price !== newPart.price || old.stock !== newPart.stock) {
        this.eventsService.emit({
          sku:      newPart.sku,
          provider,
          price:    newPart.price,
          currency: newPart.currency,
          stock:    newPart.stock,
        })
      }
    }
  }

  onModuleInit() {
    this.sync()
    setInterval(() => this.sync(), SYNC_INTERVAL_MS)
  }

  private async sync() {
    this.logger.log('Sincronizando proveedores...')
    await Promise.all([
      this.syncGlobalparts(),
      this.syncRepuestosMax(),
      this.syncAutoPartsPlus(),
    ])
    this.logger.log('Sync completado')
  }

  // ─── GlobalParts ──────────────────────────────────────────────────────────

  private async syncGlobalparts() {
    try {
      const first   = await this.globalpartsService.getCatalog(1)
      const serverErr = getServerError(first)
      if (serverErr) {
        this.logger.warn(`GlobalParts — ${serverErr.error} (${serverErr.statusCode}) — manteniendo caché anterior`)
        return
      }

      const status = first.ResponseEnvelope.Footer.ResponseStatus.StatusCode
      if (status !== 'SUCCESS') {
        this.logger.warn('GlobalParts respondió con error — manteniendo caché anterior')
        return
      }

      const listing    = first.ResponseEnvelope.Body.CatalogListing
      const totalPages = listing.PaginationInfo.TotalPages

      const rest = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, i) =>
          this.globalpartsService.getCatalog(i + 2)
        )
      )

      const allItems = [
        ...listing.Items,
        ...rest.flatMap((r) => r.ResponseEnvelope.Body.CatalogListing.Items),
      ]

      const newParts = allItems.map(mapGlobalpartsToPart)
      this.detectChanges('globalparts', newParts)
      this.partsService.updateStore('globalparts', newParts)
    } catch (err) {
      this.logger.error('GlobalParts no disponible — manteniendo caché anterior', err)
    }
  }

  // ─── RepuestosMax ─────────────────────────────────────────────────────────

  private async syncRepuestosMax() {
    try {
      const first = await this.repuestosMaxService.getCatalog(1)
      const serverErr = getServerError(first)
      if (serverErr) {
        this.logger.warn(`RepuestosMax — ${serverErr.error} (${serverErr.statusCode}) — manteniendo caché anterior`)
        return
      }

      if (!first.exito) {
        this.logger.warn('RepuestosMax respondió con error — manteniendo caché anterior')
        return
      }

      const totalPages = first.paginacion.totalPaginas

      const rest = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, i) =>
          this.repuestosMaxService.getCatalog(i + 2)
        )
      )

      const allProductos = [
        ...first.productos,
        ...rest.flatMap((r) => r.productos),
      ]

      const newParts = allProductos.map(mapRepuestosMaxToPart)
      this.detectChanges('repuestosmax', newParts)
      this.partsService.updateStore('repuestosmax', newParts)
    } catch (err) {
      this.logger.error('RepuestosMax no disponible — manteniendo caché anterior', err)
    }
  }

  // ─── AutoPartsPlus ────────────────────────────────────────────────────────

  private async syncAutoPartsPlus() {
    try {
      const first = await this.autoPartsPlusService.getCatalog(1)
      const serverErr = getServerError(first)
      if (serverErr) {
        this.logger.warn(`AutoPartsPlus — ${serverErr.error} (${serverErr.statusCode}) — manteniendo caché anterior`)
        return
      }

      if (!first.success) {
        this.logger.warn('AutoPartsPlus respondió con error — manteniendo caché anterior')
        return
      }

      const totalPages = first.pagination.total_pages

      const rest = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, i) =>
          this.autoPartsPlusService.getCatalog(i + 2)
        )
      )

      const allParts = [
        ...first.parts,
        ...rest.flatMap((r) => r.parts),
      ]

      const newParts = allParts.map(mapAutoPartsPlusToPart)
      this.detectChanges('autopartsplus', newParts)
      this.partsService.updateStore('autopartsplus', newParts)
    } catch (err) {
      this.logger.error('AutoPartsPlus no disponible — manteniendo caché anterior', err)
    }
  }
}
