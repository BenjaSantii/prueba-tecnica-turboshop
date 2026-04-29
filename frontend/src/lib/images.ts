const FAKE_HOSTS = ['example.com', 'placeholder.com', 'via.placeholder']

const BASE = 'https://images.unsplash.com'
const Q    = '?w=600&h=400&fit=crop&auto=format'

const CATEGORY_IMAGES: Record<string, string> = {
  'Frenos':        `${BASE}/photo-1613214150384-14921ff659b2${Q}`,
  'Carrocería':    `${BASE}/photo-1613214150384-14921ff659b2${Q}`,
  'Suspensión':    `${BASE}/photo-1669136048337-5daa3adef7b2${Q}`,
  'Iluminación':   `${BASE}/photo-1542282088-fe8426682b8f${Q}`,
  'Transmisión':   `${BASE}/photo-1528307869100-e1bad0b9a1c0${Q}`,
  'Climatización': `${BASE}/photo-1542399204-b8dd4af5113d${Q}`,
  'Filtros':       `${BASE}/photo-1542399204-b8dd4af5113d${Q}`,
  'Encendido':     `${BASE}/photo-1663642775693-6628f65358be${Q}`,
  'Refrigeración': `${BASE}/photo-1663642775693-6628f65358be${Q}`,
  'Combustible':   `${BASE}/photo-1527383418406-f85a3b146499${Q}`,
  'Lubricación':   `${BASE}/photo-1527383418406-f85a3b146499${Q}`,
  'Eléctrico':     `${BASE}/photo-1640556795357-71d4078d6228${Q}`,
  'Motor':         `${BASE}/photo-1663642775693-6628f65358be${Q}`,
  'Escape':        `${BASE}/photo-1527383418406-f85a3b146499${Q}`,
}

function isFake(url: string): boolean {
  return !url || FAKE_HOSTS.some((h) => url.includes(h))
}

export function resolveImage(url: string, sku: string, category?: string, index = 0): string {
  if (!isFake(url)) return url
  if (category && CATEGORY_IMAGES[category]) return CATEGORY_IMAGES[category]
  return `https://picsum.photos/seed/${sku}-${index}/600/400`
}

export function getCardImage(images: string[], sku: string, category?: string): string {
  return resolveImage(images[0] ?? '', sku, category, 0)
}
