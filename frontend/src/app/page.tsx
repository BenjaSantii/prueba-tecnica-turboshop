import { CatalogClient } from '@/components/common/CatalogClient'
import { fetchCatalog } from '@/lib/api'
import type { CatalogResponse } from '@/lib/types'

export default async function HomePage() {
  let initialData: CatalogResponse

  try {
    initialData = await fetchCatalog({ page: 1, limit: 20 })
  } catch {
    initialData = { items: [], total: 0, page: 1, totalPages: 0 }
  }

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10">
      <CatalogClient initialData={initialData} />
    </div>
  )
}
