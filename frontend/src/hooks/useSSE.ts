'use client'

import { useEffect, useRef, useState } from 'react'
import { getSSEUrl } from '@/lib/api'
import type { SSEPatch } from '@/lib/types'

export function useSSE() {
  const [patches, setPatches] = useState<Map<string, SSEPatch>>(new Map())
  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    const es = new EventSource(getSSEUrl())
    esRef.current = es

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as { sku: string; price: number; currency: string; stock: number }
        setPatches((prev) => {
          const next = new Map(prev)
          next.set(data.sku, { price: data.price, currency: data.currency, stock: data.stock })
          return next
        })
      } catch {
        // ignore malformed events
      }
    }

    return () => {
      es.close()
      esRef.current = null
    }
  }, [])

  return patches
}
