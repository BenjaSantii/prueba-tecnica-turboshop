import { Badge } from '@/components/ui/Badge'
import type { PartOffer } from '@/lib/types'

const providerLabels: Record<string, string> = {
  globalparts:   'GlobalParts',
  repuestosmax:  'RepuestosMax',
  autopartsplus: 'AutoParts+',
}

interface OfferRowProps {
  offer: PartOffer
}

export function OfferRow({ offer }: OfferRowProps) {
  return (
    <div className="flex flex-col gap-2 py-4 px-5 bg-white border border-[#E8E6E1] rounded-xl hover:border-[#2C5344]/20 transition-colors">
      {/* Línea 1: proveedor */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#FAF9F6] border border-[#E8E6E1] flex items-center justify-center shrink-0">
          <span className="text-[10px] font-mono font-bold text-[#2C5344]">
            {offer.provider.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="font-semibold text-sm text-[#0F0E0D]">
            {providerLabels[offer.provider] ?? offer.provider}
          </p>
          <p className="text-xs text-[#0F0E0D]/40">{offer.warehouse}</p>
        </div>
      </div>

      {/* Línea 2: precio, stock, IVA */}
      <div className="flex items-center gap-3 flex-wrap pl-11">
        <p className="font-mono font-bold text-[#0F0E0D] text-base">
          {offer.currency} {offer.price.toLocaleString('es-CL')}
        </p>
        <span className="text-[#E8E6E1]">·</span>
        <Badge variant={offer.stock > 0 ? 'lime' : 'pink'}>
          {offer.stock > 0 ? `${offer.stock} en stock` : 'Sin stock'}
        </Badge>
        {offer.taxIncluded && <Badge variant="sky">IVA inc.</Badge>}
        {offer.discountAvailable && <Badge variant="violet">Descuento</Badge>}
        {offer.estimatedDispatch && (
          <span className="text-xs text-[#0F0E0D]/40">{offer.estimatedDispatch}</span>
        )}
      </div>
    </div>
  )
}
