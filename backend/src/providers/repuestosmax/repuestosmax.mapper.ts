import { Part, VehicleCompatibility } from '../../parts/part.type'
import { RepuestosMaxProductoDto } from './repuestosmax.dto'


function mapVehicles(producto: RepuestosMaxProductoDto): VehicleCompatibility[] {
  return producto.compatibilidad.vehiculos.map((v) => ({
    make:    v.fabricante,
    model:   v.modelo,
    yearFrom: v.anios.desde,
    yearTo:   v.anios.hasta,
    engine:  v.motor,
    trim:    v.version,
  }))
}

export function mapRepuestosMaxToPart(producto: RepuestosMaxProductoDto): Part {
  return {
    sku:               producto.identificacion.sku,
    oemCode:           producto.identificacion.codigoOEM,
    provider:          'repuestosmax',
    name:              producto.informacionBasica.nombre,
    brand:             producto.informacionBasica.marca.nombre,
    category:          producto.informacionBasica.categoria.nombre,
    images:            producto.multimedia.imagenes.map((i) => i.url),
    price:             producto.precio.valor,
    currency:          producto.precio.moneda,
    taxIncluded:       producto.precio.incluyeIVA,
    discountAvailable: producto.precio.descuentoDisponible,
    stock:             producto.inventario.cantidad,
    warehouse:         producto.inventario.ubicacion.bodega,
    estimatedDispatch: producto.inventario.tiempoDespachoEstimado,
    description:       producto.informacionBasica.descripcion,
    weight: {
      value: producto.caracteristicas.peso.valor,
      unit:  producto.caracteristicas.peso.unidad,
    },
    specs:                producto.caracteristicas.especificaciones,
    vehicleCompatibility: mapVehicles(producto),
  }
}
