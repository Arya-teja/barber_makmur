import "server-only";

import { apiFetch } from "@/lib/api/client";

export interface BarberItem {
  id: string;
  name: string;
}

export async function getBarbers(): Promise<BarberItem[]> {
  return apiFetch<BarberItem[]>("/barbers");
}
