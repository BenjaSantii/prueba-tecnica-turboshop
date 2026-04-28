import { Part, VehicleCompatibility } from '../../../parts/types/part.type'
import { GlobalpartsItemDto } from '../globalparts.dto'


function mapVehicles(item: GlobalpartsItemDto): VehicleCompatibility[] {
  return item.VehicleCompatibility.CompatibleVehicles.map((v) => ({
    make: v.Manufacturer.Name,
    model: v.Model.Name,
    yearFrom: v.YearRange.StartYear,
    yearTo: v.YearRange.EndYear,
    trim: v.TrimLevel?.Name,
  }))
}

function mapSpecs(item: GlobalpartsItemDto): Record<string, string> {
  return Object.fromEntries(
    item.TechnicalSpecifications.SpecificationList.map((s) => [s.SpecificationName, s.SpecificationValue])
  )
}

export function mapGlobalpartsToPart(item: GlobalpartsItemDto): Part {
  return {
    sku:               item.ItemHeader.ExternalReferences.SKU.Value,
    oemCode:           item.ItemHeader.ExternalReferences.OEM.Value,
    provider:          'globalparts',
    name:              item.ProductDetails.NameInfo.DisplayName,
    brand:             item.ProductDetails.BrandInfo.BrandName,
    category:          item.ProductDetails.CategoryInfo.PrimaryCategory.Name,
    images:            item.MediaAssets.Images.map((i) => i.ImageUrl),
    price:             item.PricingInfo.ListPrice.Amount,
    currency:          item.PricingInfo.ListPrice.CurrencyCode,
    taxIncluded:       item.PricingInfo.TaxInfo.TaxIncluded,
    discountAvailable: item.PricingInfo.DiscountInfo.DiscountAvailable,
    stock:             item.AvailabilityInfo.QuantityInfo.AvailableQuantity,
    warehouse:         item.AvailabilityInfo.WarehouseInfo.PrimaryWarehouse.Name,
    estimatedDispatch: `${item.AvailabilityInfo.ShippingInfo.EstimatedDeliveryDays} días`,
    description:       item.ProductDetails.Description.FullText,
    weight: {
      value: item.PhysicalAttributes.Weight.Value,
      unit:  item.PhysicalAttributes.Weight.Unit,
    },
    specs:                item.TechnicalSpecifications.SpecificationList.length ? mapSpecs(item) : {},
    vehicleCompatibility: mapVehicles(item),
  }
}
