'use client'

import { useCallback, useRef } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { CatalogFilters } from '@/lib/types'

interface FiltersBarProps {
  filters: CatalogFilters
  onChange: (filters: CatalogFilters) => void
}

const BRANDS = ['KYB', 'Bosch', 'Monroe', 'NGK', 'Denso', 'ACDelco', 'Mahle', 'Valeo']
const MAKES  = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Volkswagen', 'Nissan', 'Hyundai', 'Kia']

export function FiltersBar({ filters, onChange }: FiltersBarProps) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleQuery = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        onChange({ ...filters, query: value || undefined, page: 1 })
      }, 350)
    },
    [filters, onChange]
  )

  const handleSelect = useCallback(
    (key: keyof CatalogFilters, value: string) => {
      onChange({ ...filters, [key]: value || undefined, page: 1 })
    },
    [filters, onChange]
  )

  const handleReset = useCallback(() => {
    onChange({ page: 1 })
  }, [onChange])

  const hasFilters = filters.query || filters.brand || filters.make || filters.year

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex-1 min-w-[220px] max-w-sm">
        <Input
          placeholder="Buscar por nombre, OEM, SKU…"
          defaultValue={filters.query ?? ''}
          onChange={handleQuery}
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          }
        />
      </div>

      <select
        value={filters.brand ?? ''}
        onChange={(e) => handleSelect('brand', e.target.value)}
        className="rounded-lg border border-[#E8E6E1] bg-white px-3 py-2 text-sm text-[#0F0E0D] outline-none focus:border-[#2C5344] focus:ring-2 focus:ring-[#2C5344]/10 transition-all cursor-pointer"
      >
        <option value="">Todas las marcas</option>
        {BRANDS.map((b) => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>

      <select
        value={filters.make ?? ''}
        onChange={(e) => handleSelect('make', e.target.value)}
        className="rounded-lg border border-[#E8E6E1] bg-white px-3 py-2 text-sm text-[#0F0E0D] outline-none focus:border-[#2C5344] focus:ring-2 focus:ring-[#2C5344]/10 transition-all cursor-pointer"
      >
        <option value="">Todos los vehículos</option>
        {MAKES.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={handleReset} className="text-[#0F0E0D]/50">
          Limpiar filtros
        </Button>
      )}
    </div>
  )
}
