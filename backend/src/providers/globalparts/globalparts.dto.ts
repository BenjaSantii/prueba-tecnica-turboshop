// ─── Item compartido entre catálogo y búsqueda ───────────────────────────────

export interface GlobalpartsItemDto {
  ItemHeader: {
    InternalId: string
    ExternalReferences: {
      SKU: { Value: string; Type: string }
      OEM: { Value: string; Manufacturer: string }
    }
  }
  ProductDetails: {
    NameInfo: { DisplayName: string; ShortName: string; TechnicalName: string }
    Description: { FullText: string; Language: string }
    BrandInfo: { BrandName: string; BrandCode: string; IsOEM: boolean }
    CategoryInfo: {
      PrimaryCategory: { Name: string; Code: string }
      SubCategory: { Name: string; Code: string }
    }
  }
  PricingInfo: {
    ListPrice: { Amount: number; CurrencyCode: string; CurrencySymbol: string }
    TaxInfo: { TaxIncluded: boolean; TaxRate: number; TaxAmount: number }
    DiscountInfo: { DiscountAvailable: boolean; MaxDiscountPercent: number }
  }
  AvailabilityInfo: {
    StockStatus: { Code: string; Description: string }
    QuantityInfo: {
      AvailableQuantity: number
      ReservedQuantity: number
      MinOrderQuantity: number
      MaxOrderQuantity: number
    }
    WarehouseInfo: {
      PrimaryWarehouse: { Name: string; Code: string; Country: string }
    }
    ShippingInfo: {
      EstimatedShipDate: string
      EstimatedDeliveryDays: number
      ShippingMethods: string[]
    }
  }
  PhysicalAttributes: {
    Weight: { Value: number; Unit: string; UnitCode: string }
  }
  TechnicalSpecifications: {
    SpecificationList: Array<{ SpecificationName: string; SpecificationValue: string }>
  }
  MediaAssets: {
    Images: Array<{
      ImageId: string
      ImageUrl: string
      ImageType: string
      Resolution: string
      IsPrimary: boolean
    }>
  }
  VehicleCompatibility: {
    CompatibilityCount: number
    CompatibleVehicles: Array<{
      VehicleId: string
      Manufacturer: { Name: string; Code: string }
      Model: { Name: string; Code: string }
      YearRange: { StartYear: number; EndYear: number }
      TrimLevel?: { Name: string }
      CompatibilityNotes: string
    }>
  }
}

// ─── Respuesta: GET /inventory/catalog ───────────────────────────────────────

export interface GlobalpartsCatalogResponseDto {
  ResponseEnvelope: {
    Header: {
      TransactionId: string
      Timestamp: string
      RequestInfo: {
        Method: string
        Endpoint: string
        Parameters: { Page: number; ItemsPerPage: number }
      }
      ProcessingMetrics: { LatencyMilliseconds: number; ServerNode: string; CacheHit: boolean }
    }
    Body: {
      CatalogListing: {
        TotalItems: number
        PaginationInfo: {
          CurrentPage: number
          TotalPages: number
          ItemsPerPage: number
          HasNextPage: boolean
          HasPreviousPage: boolean
        }
        Items: GlobalpartsItemDto[]
      }
    }
  }
}

// ─── Respuesta: GET /inventory/search ────────────────────────────────────────

export interface GlobalpartsSearchResponseDto {
  ResponseEnvelope: {
    Header: {
      TransactionId: string
      Timestamp: string
      RequestInfo: {
        Method: string
        Endpoint: string
        Parameters: { PartNumber: string }
      }
      ProcessingMetrics: { LatencyMilliseconds: number; ServerNode: string; CacheHit: boolean }
    }
    Body: {
      SearchResults: {
        TotalCount: number
        PageInfo: { CurrentPage: number; TotalPages: number; ItemsPerPage: number }
        Items: GlobalpartsItemDto[]
      }
    }
    Footer: {
      ResponseStatus: { StatusCode: string; StatusMessage: string }
      Pagination: { HasMoreResults: boolean }
      RateLimitInfo: { RemainingRequests: number; ResetTimestamp: string }
    }
  }
}

// ─── Respuesta: GET /metadata ─────────────────────────────────────────────────

export interface GlobalpartsMetadataDto {
  ServiceMetadata: {
    ServiceName: string
    ServiceVersion: string
    EnvironmentInfo: { Region: string; DataCenter: string; Timezone: string }
    PerformanceMetrics: {
      ExpectedLatency: { Minimum: string; Maximum: string; Average: string }
      ErrorRate: string
      RateLimitPerMinute: number
    }
    SupportedCurrencies: string[]
    DefaultCurrency: string
  }
}
