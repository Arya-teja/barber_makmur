import "server-only"

import { apiFetch } from "@/lib/api/client"

export interface LandingFeature {
  id: string
  title: string
  description: string
}

export interface LandingTestimonial {
  id: string
  name: string
  role: string
  quote: string
}

export interface LandingMetric {
  id: string
  category: string
  label: string
  value: string
}

export async function getLandingContent(): Promise<{
  features: LandingFeature[]
  testimonials: LandingTestimonial[]
  metrics: LandingMetric[]
}> {
  return apiFetch<{
    features: LandingFeature[]
    testimonials: LandingTestimonial[]
    metrics: LandingMetric[]
  }>("/content/landing")
}
