import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchPartDetail } from '@/lib/api'
import { resolveImage } from '@/lib/images'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { OfferRow } from '@/components/common/OfferRow'

interface PageProps {
  params: Promise<{ sku: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { sku } = await params
  return { title: `${sku} — TurboShop` }
}

export default async function PartDetailPage({ params }: PageProps) {
  const { sku } = await params

  let detail
  try {
    detail = await fetchPartDetail(sku)
  } catch {
    notFound()
  }

  if (!detail.found) notFound()

  const bestPrice = detail.offers.length
    ? Math.min(...detail.offers.map((o) => o.price))
    : null
  const bestOffer = detail.offers.find((o) => o.price === bestPrice)
  const totalStock = detail.offers.reduce((acc, o) => acc + o.stock, 0)

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-[#0F0E0D]/50 -ml-2">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al catálogo
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
        {/* Left column */}
        <div className="space-y-8">
          {/* Images */}
          {(() => {
            const resolved = detail.images
              .map((url) => resolveImage(url, detail.category))
              .filter((src): src is string => src !== null)
            const mainSrc = resolved[0] ?? null

            return (
              <div className="space-y-2">
                <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-[#F0EEE9] flex items-center justify-center">
                  {mainSrc ? (
                    <Image
                      src={mainSrc}
                      alt={detail.name}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 800px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-[#0F0E0D]/20">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs uppercase tracking-widest">Imagen no disponible</span>
                    </div>
                  )}
                </div>
                {resolved.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {resolved.slice(1).map((src, i) => (
                      <div
                        key={i}
                        className="relative shrink-0 w-20 h-16 rounded-lg overflow-hidden bg-[#F0EEE9] border border-[#E8E6E1]"
                      >
                        <Image
                          src={src}
                          alt={`${detail.name} ${i + 2}`}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })()}

          {/* Header */}
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="default">{detail.category}</Badge>
              <Badge variant="green">{detail.brand}</Badge>
              {totalStock > 0 && <Badge variant="lime">{totalStock} uds. disponibles</Badge>}
            </div>
            <h1 className="font-heading font-bold text-3xl text-[#0F0E0D] tracking-tight leading-tight mb-2">
              {detail.name}
            </h1>
            <div className="flex items-center gap-4 text-sm text-[#0F0E0D]/50">
              <span className="font-mono">SKU: {detail.sku}</span>
              {detail.oemCode && <span className="font-mono">OEM: {detail.oemCode}</span>}
            </div>
          </div>

          {/* Description */}
          {detail.description && (
            <div>
              <h2 className="font-heading font-semibold text-sm uppercase tracking-widest text-[#0F0E0D]/40 mb-3">
                Descripción
              </h2>
              <p className="text-sm text-[#0F0E0D]/70 leading-relaxed">{detail.description}</p>
            </div>
          )}

          {/* Specs */}
          {Object.keys(detail.specs).length > 0 && (
            <div>
              <h2 className="font-heading font-semibold text-sm uppercase tracking-widest text-[#0F0E0D]/40 mb-3">
                Especificaciones
              </h2>
              <div className="rounded-xl border border-[#E8E6E1] overflow-hidden">
                {Object.entries(detail.specs).map(([key, val], i) => (
                  <div
                    key={key}
                    className={`flex justify-between px-5 py-3 text-sm ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAF9F6]'}`}
                  >
                    <span className="text-[#0F0E0D]/50">{key}</span>
                    <span className="font-mono font-medium text-[#0F0E0D]">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compatibility */}
          {detail.vehicleCompatibility.length > 0 && (
            <div>
              <h2 className="font-heading font-semibold text-sm uppercase tracking-widest text-[#0F0E0D]/40 mb-3">
                Compatibilidad vehicular
              </h2>
              <div className="rounded-xl border border-[#E8E6E1] overflow-hidden">
                <div className="grid grid-cols-4 px-5 py-2.5 bg-[#FAF9F6] text-[10px] font-semibold uppercase tracking-widest text-[#0F0E0D]/40 border-b border-[#E8E6E1]">
                  <span>Marca</span>
                  <span>Modelo</span>
                  <span>Años</span>
                  <span>Motor</span>
                </div>
                {detail.vehicleCompatibility.map((v, i) => (
                  <div
                    key={i}
                    className={`grid grid-cols-4 px-5 py-3 text-sm ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAF9F6]/50'}`}
                  >
                    <span className="font-medium text-[#0F0E0D]">{v.make}</span>
                    <span className="text-[#0F0E0D]/70">{v.model}</span>
                    <span className="font-mono text-[#0F0E0D]/60">{v.yearFrom}–{v.yearTo}</span>
                    <span className="text-[#0F0E0D]/50">{v.engine ?? '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column — price summary */}
        <div className="space-y-4">
          {bestOffer && (
            <div className="rounded-xl border border-[#2C5344]/20 bg-white p-6 sticky top-20">
              <p className="text-xs uppercase tracking-widest text-[#0F0E0D]/40 mb-1">Mejor precio</p>
              <p className="font-mono font-bold text-4xl text-[#0F0E0D] mb-1">
                {bestOffer.currency} {bestPrice?.toLocaleString('es-CL')}
              </p>
              <p className="text-xs text-[#0F0E0D]/40 mb-6">
                vía {bestOffer.provider} · {bestOffer.warehouse}
              </p>

              {detail.weight && (
                <div className="flex justify-between text-sm border-t border-[#E8E6E1] pt-4">
                  <span className="text-[#0F0E0D]/50">Peso</span>
                  <span className="font-mono">{detail.weight.value} {detail.weight.unit}</span>
                </div>
              )}
            </div>
          )}

          <div>
            <p className="text-xs uppercase tracking-widest text-[#0F0E0D]/40 mb-3 px-1">
              {detail.offers.length} proveedor{detail.offers.length !== 1 ? 'es' : ''}
            </p>
            <div className="space-y-2">
              {detail.offers
                .sort((a, b) => a.price - b.price)
                .map((offer) => (
                  <OfferRow key={offer.provider} offer={offer} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
