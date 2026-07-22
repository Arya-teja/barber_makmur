import "server-only";

import type { UserProfile } from "@/types";

import { apiFetch } from "@/lib/api/client";

interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  membership: "STANDARD" | "GOLD" | "PLATINUM";
}

export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const profile = await apiFetch<UserProfileResponse>("/users/me");
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      phone: profile.phone ?? "",
      membership:
        profile.membership === "PLATINUM"
          ? "Platinum"
          : profile.membership === "GOLD"
            ? "Gold"
            : "Standard",
    };
  } catch {
    return null;
  }
}
