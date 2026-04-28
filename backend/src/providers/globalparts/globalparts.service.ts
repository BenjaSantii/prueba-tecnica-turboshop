import { Injectable } from '@nestjs/common'
import { ENDPOINTS } from '../endpoints'
import {
  GlobalpartsCatalogResponseDto,
  GlobalpartsSearchResponseDto,
  GlobalpartsMetadataDto,
} from './globalparts.dto'

@Injectable()
export class GlobalpartsService {

  async getCatalog(page = 1, itemsPerPage = 20): Promise<GlobalpartsCatalogResponseDto> {
    const url = `${ENDPOINTS.globalparts.catalog}?page=${page}&itemsPerPage=${itemsPerPage}`
    const res = await fetch(url)
    return res.json()
  }

  async searchBySku(sku: string): Promise<GlobalpartsSearchResponseDto> {
    const url = `${ENDPOINTS.globalparts.search}?partNumber=${sku}`
    const res = await fetch(url)
    return res.json()
  }

  async getMetadata(): Promise<GlobalpartsMetadataDto> {
    const res = await fetch(ENDPOINTS.globalparts.metadata)
    return res.json()
  }
}
