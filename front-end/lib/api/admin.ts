import "server-only";

import type { AdminAccount, AdminStats } from "@/types";

import { apiFetch } from "@/lib/api/client";

interface AdminAccountResponse {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE";
  membership: "STANDARD" | "GOLD" | "PLATINUM";
  createdAt: string;
}

export async function getAdminStats(): Promise<AdminStats> {
  return apiFetch<AdminStats>("/admin/stats");
}

export async function getAdminAccounts(): Promise<AdminAccount[]> {
  const accounts = await apiFetch<AdminAccountResponse[]>("/admin/accounts");
  return accounts.map((account) => ({
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role === "ADMIN" ? "admin" : "user",
    status: account.status === "INACTIVE" ? "inactive" : "active",
    membership:
      account.membership === "PLATINUM"
        ? "Platinum"
        : account.membership === "GOLD"
          ? "Gold"
          : "Standard",
    joinedAt: account.createdAt.split("T")[0] ?? account.createdAt,
  }));
}
