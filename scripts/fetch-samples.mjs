// node scripts/fetch-samples.mjs

import { writeFileSync, mkdirSync } from 'fs'

const BASE = 'https://web-production-84144.up.railway.app'

const endpoints = [
  { name: 'health',                    url: '/health' },

  { name: 'autopartsplus-catalog',     url: '/api/autopartsplus/catalog' },
  { name: 'autopartsplus-status',      url: '/api/autopartsplus/status' },
  { name: 'autopartsplus-productos',   url: '/api/autopartsplus/parts?sku=FR-MOC6KG61' },

  { name: 'repuestosmax-catalogo',     url: '/api/repuestosmax/catalogo' },
  { name: 'repuestosmax-info',         url: '/api/repuestosmax/info' },
  { name: 'repuestosmax-productos',    url: '/api/repuestosmax/productos?codigo=IL-MOC6KG4Y' },

  { name: 'globalparts-catalog',       url: '/api/globalparts/inventory/catalog' },
  { name: 'globalparts-metadata',      url: '/api/globalparts/metadata' },
  { name: 'globalparts-inventory-search',  url: '/api/globalparts/inventory/search?partNumber=EL-MOC6KFV6' }
]

mkdirSync('samples', { recursive: true })

for (const { name, url } of endpoints) {
  try {
    const res = await fetch(BASE + url)
    const data = await res.json()
    if (data.error || data.exito === false || data.success === false) {
      writeFileSync(`samples/${name}-error.json`, JSON.stringify(data, null, 2))
    } else {
      writeFileSync(`samples/${name}.json`, JSON.stringify(data, null, 2))
    }
  } catch (e) {
    console.log(`❌ ${name}: ${e.message}`)
  }
}

// Endpoints disponibles:
// Health
// GET /health

// AutoPartsPlus
// GET /api/autopartsplus/parts?sku=:sku
// GET /api/autopartsplus/catalog?page=1&limit=20
// GET /api/autopartsplus/status

// RepuestosMax
// GET /api/repuestosmax/productos?codigo=:codigo
// GET /api/repuestosmax/catalogo?pagina=1&limite=20
// GET /api/repuestosmax/info

// GlobalParts
// GET /api/globalparts/inventory/search?partNumber=:partNumber
// GET /api/globalparts/inventory/catalog?page=1&itemsPerPage=20
// GET /api/globalparts/metadata
