import "server-only";

import type { ServiceItem, ServicePackageDetail } from "@/types";

import { apiFetch } from "@/lib/api/client";

interface ServicePackageResponse {
  id: string;
  serviceId: string;
  packageName: string;
  price: number;
  benefits: string[];
}

export async function getCatalogServices(): Promise<ServiceItem[]> {
  return apiFetch<ServiceItem[]>("/services", {
    cache: "no-store",
  });
}

export async function getServiceById(
  serviceId: string,
): Promise<ServiceItem | null> {
  try {
    return await apiFetch<ServiceItem>(`/services/${serviceId}`, {
      cache: "no-store",
    });
  } catch {
    return null;
  }
}

export async function getServicePackages(
  serviceId: string,
): Promise<ServicePackageDetail[]> {
  const packages = await apiFetch<ServicePackageResponse[]>(
    `/services/${serviceId}/packages`,
  );
  return packages.map((item) => ({
    id: item.id,
    serviceId: item.serviceId,
    packageName: item.packageName,
    price: item.price,
    benefits: item.benefits,
  }));
}
