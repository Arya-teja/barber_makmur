import "server-only";

import { cookies } from "next/headers";

export interface SessionUser {
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const name = cookieStore.get("bn_user_name")?.value;
  const email = cookieStore.get("bn_user_email")?.value;
  const role = cookieStore.get("bn_user_role")?.value;

  if (!name || !email || !role) {
    return null;
  }

  return {
    name,
    email,
    role: role === "ADMIN" ? "ADMIN" : "USER",
  };
}
