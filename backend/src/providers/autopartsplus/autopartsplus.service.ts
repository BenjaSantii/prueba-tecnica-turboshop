import { Injectable } from '@nestjs/common'
import { ENDPOINTS } from '../endpoints'
import {
  AutoPartsPlusCatalogResponseDto,
  AutoPartsPlusSearchResponseDto,
  AutoPartsPlusStatusDto,
} from './autopartsplus.dto'

@Injectable()
export class AutoPartsPlusService {

  async getCatalog(page = 1, limit = 20): Promise<AutoPartsPlusCatalogResponseDto> {
    const url = `${ENDPOINTS.autopartsplus.catalog}?page=${page}&limit=${limit}`
    const res = await fetch(url)
    return res.json()
  }

  async searchBySku(sku: string): Promise<AutoPartsPlusSearchResponseDto> {
    const url = `${ENDPOINTS.autopartsplus.search}?sku=${sku}`
    const res = await fetch(url)
    return res.json()
  }

  async getStatus(): Promise<AutoPartsPlusStatusDto> {
    const res = await fetch(ENDPOINTS.autopartsplus.status)
    return res.json()
  }
}
