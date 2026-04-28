const BASE_URL = process.env.PROVIDERS_BASE_URL

export const ENDPOINTS = {
  globalparts: {
    catalog:  `${BASE_URL}/api/globalparts/inventory/catalog`,
    search:   `${BASE_URL}/api/globalparts/inventory/search`,
    metadata: `${BASE_URL}/api/globalparts/metadata`,
  },
  repuestosmax: {
    catalog: `${BASE_URL}/api/repuestosmax/catalogo`,
    search:  `${BASE_URL}/api/repuestosmax/productos`,
    info:    `${BASE_URL}/api/repuestosmax/info`,
  },
  autopartsplus: {
    catalog: `${BASE_URL}/api/autopartsplus/catalog`,
    search:  `${BASE_URL}/api/autopartsplus/parts`,
    status:  `${BASE_URL}/api/autopartsplus/status`,
  },
} as const
