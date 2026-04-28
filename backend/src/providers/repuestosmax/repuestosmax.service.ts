import { Injectable } from '@nestjs/common'
import { ENDPOINTS } from '../endpoints'
import {
  RepuestosMaxCatalogoResponseDto,
  RepuestosMaxProductosResponseDto,
  RepuestosMaxInfoDto,
} from './repuestosmax.dto'

@Injectable()
export class RepuestosMaxService {

  async getCatalog(pagina = 1, limite = 20): Promise<RepuestosMaxCatalogoResponseDto> {
    const url = `${ENDPOINTS.repuestosmax.catalog}?pagina=${pagina}&limite=${limite}`
    const res = await fetch(url)
    return res.json()
  }

  async searchBySku(sku: string): Promise<RepuestosMaxProductosResponseDto> {
    const url = `${ENDPOINTS.repuestosmax.search}?codigo=${sku}`
    const res = await fetch(url)
    return res.json()
  }

  async getInfo(): Promise<RepuestosMaxInfoDto> {
    const res = await fetch(ENDPOINTS.repuestosmax.info)
    return res.json()
  }
}
