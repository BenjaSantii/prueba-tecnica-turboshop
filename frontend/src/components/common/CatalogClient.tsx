'use client'

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react'
import { PartCard } from './PartCard'
import { FiltersBar } from './FiltersBar'
import { Pagination } from './Pagination'
import { Spinner } from '@/components/ui/Spinner'
import { useSSE } from '@/hooks/useSSE'
import { fetchCatalog } from '@/lib/api'
import type { CatalogFilters, CatalogResponse } from '@/lib/types'

interface CatalogClientProps {
  initialData: CatalogResponse
}

export function CatalogClient({ initialData }: CatalogClientProps) {
  const [data, setData] = useState<CatalogResponse>(initialData)
  const [filters, setFilters] = useState<CatalogFilters>({ page: 1 })
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const patches = useSSE()

  const load = useCallback((nextFilters: CatalogFilters) => {
    setError(null)
    startTransition(async () => {
      try {
        const result = await fetchCatalog(nextFilters)
        setData(result)
      } catch {
        setError('No se pudo cargar el catálogo. Revisá que el backend esté activo.')
      }
    })
  }, [])

  const handleFiltersChange = useCallback(
    (nextFilters: CatalogFilters) => {
      setFilters(nextFilters)
      load(nextFilters)
    },
    [load]
  )

  const handlePageChange = useCallback(
    (page: number) => {
      const next = { ...filters, page }
      setFilters(next)
      load(next)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [filters, load]
  )

  // re-fetch on mount if initialData is empty (backend might not have been running)
  useEffect(() => {
    if (initialData.items.length === 0) load(filters)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const liveCount = patches.size

  const providerCounts = useMemo(() =>
    data.items.reduce((acc, item) => {
      acc[item.sku] = (acc[item.sku] ?? 0) + 1
      return acc
    }, {} as Record<string, number>),
    [data.items]
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading font-bold text-2xl text-[#0F0E0D] tracking-tight">
            Catálogo de repuestos
          </h1>
          <p className="text-sm text-[#0F0E0D]/50 mt-0.5">
            {data.total} productos · {data.totalPages} páginas
            {liveCount > 0 && (
              <span className="ml-3 inline-flex items-center gap-1 text-[#A589FF]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A589FF] animate-pulse" />
                {liveCount} actualización{liveCount > 1 ? 'es' : ''} en vivo
              </span>
            )}
          </p>
        </div>
      </div>

      <FiltersBar filters={filters} onChange={handleFiltersChange} />

      {error && (
        <div className="rounded-xl border border-[#FFABD4]/40 bg-[#FFABD4]/10 px-5 py-4 text-sm text-[#C0537A]">
          {error}
        </div>
      )}

      <div className="relative">
        {isPending && (
          <div className="absolute inset-0 z-10 flex items-start justify-center pt-20 bg-[#FAF9F6]/70 rounded-xl">
            <Spinner size="lg" />
          </div>
        )}

        {data.items.length === 0 && !isPending ? (
          <div className="text-center py-20 text-[#0F0E0D]/40">
            <p className="font-heading text-lg mb-1">Sin resultados</p>
            <p className="text-sm">Probá con otros filtros.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.items.map((part) => (
              <PartCard
                key={`${part.sku}-${part.provider}`}
                part={part}
                patch={patches.get(part.sku)}
                providerCount={providerCounts[part.sku]}
              />
            ))}
          </div>
        )}
      </div>

      <Pagination
        page={data.page}
        totalPages={data.totalPages}
        total={data.total}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
