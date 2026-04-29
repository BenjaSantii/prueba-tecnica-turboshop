import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { getCardImage } from '@/lib/images'
import type { PartSummary, SSEPatch } from '@/lib/types'

interface PartCardProps {
  part: PartSummary
  patch?: SSEPatch
  providerCount?: number
}

export function PartCard({ part, patch, providerCount = 1 }: PartCardProps) {
  const price = patch?.price ?? part.price
  const currency = patch?.currency ?? part.currency
  const stock = patch?.stock ?? part.stock
  const isUpdated = !!patch
  const imgSrc = getCardImage(part.images, part.sku, part.category)

  return (
    <Link
      href={`/parts/${part.sku}`}
      className="group flex flex-col bg-white border border-[#E8E6E1] rounded-xl overflow-hidden hover:shadow-md hover:border-[#2C5344]/20 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] bg-[#F0EEE9] overflow-hidden">
        <Image
          src={imgSrc}
          alt={part.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="flex flex-col flex-1 p-4">
        <p className="text-[10px] font-mono text-[#0F0E0D]/40 uppercase tracking-widest mb-0.5">
          {part.sku}
        </p>
        <h3 className="font-heading font-semibold text-[#0F0E0D] text-sm leading-snug line-clamp-2 group-hover:text-[#2C5344] transition-colors mb-1">
          {part.name}
        </h3>
        <p className="text-xs text-[#0F0E0D]/50 mb-3">{part.brand}</p>

        {/* Stock + providers */}
        <div className="flex items-center gap-2 mb-3">
          <Badge variant={stock > 0 ? 'lime' : 'pink'}>
            {stock > 0 ? `${stock} uds.` : 'Sin stock'}
          </Badge>
          <span className="text-[10px] text-[#0F0E0D]/40">
            {providerCount} proveedor{providerCount !== 1 ? 'es' : ''}
          </span>
        </div>

        {/* Price */}
        <div className="mt-auto flex items-end justify-between">
          <div>
            <p className="text-[10px] text-[#0F0E0D]/40 uppercase tracking-widest mb-0.5">Precio</p>
            <p
              className={`font-mono font-semibold text-lg leading-none transition-colors duration-500 ${
                isUpdated ? 'text-[#A589FF]' : 'text-[#0F0E0D]'
              }`}
            >
              {currency} {price.toLocaleString('es-CL')}
            </p>
          </div>
          <Badge variant="default" className="text-[10px]">
            {part.category}
          </Badge>
        </div>

        {isUpdated && (
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#A589FF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A589FF] animate-pulse" />
            Actualizado en vivo
          </div>
        )}
      </div>
    </Link>
  )
}
