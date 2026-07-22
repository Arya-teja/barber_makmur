export type ServiceCategory =
  | "Haircut"
  | "Treatment"
  | "Color"
  | "Package"
  | "Grooming"

export interface ServiceItem {
  id: string
  name: string
  description: string
  price: number
  durationMinutes: number
  category: ServiceCategory
  status: "active" | "inactive"
  imageURL: string
  pricePackage?: number | null
}

export interface ServicePackageDetail {
  id: string
  serviceId: string
  packageName: string
  price: number
  benefits: string[]
}
