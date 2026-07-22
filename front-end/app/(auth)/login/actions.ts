"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.API_BASE_URL ??
  "http://localhost:3000";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const preferredRole = String(formData.get("preferredRole") ?? "USER");

  if (!email || !password) {
    redirect(`/login?error=${encodeURIComponent("Email dan password wajib diisi")}&errorType=auth`);
  }

  const response = await fetch(`${apiBaseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    redirect(`/login?error=${encodeURIComponent("Email atau password salah")}&errorType=auth`);
  }

  const data = (await response.json()) as {
    token: string;
    user: { name: string; email: string; role: "USER" | "ADMIN" };
  };

  const selectedRole = preferredRole.toUpperCase() === "ADMIN" ? "ADMIN" : "USER";
  const accountRole = data.user.role;

  if (accountRole !== selectedRole) {
    const roleMismatchMessage =
      accountRole === "ADMIN"
        ? "Akun admin hanya bisa login lewat tombol Login Admin"
        : "Akun user hanya bisa login lewat tombol Login User";
    redirect(`/login?error=${encodeURIComponent(roleMismatchMessage)}&errorType=role`);
  }

  const cookieStore = await cookies();
  cookieStore.set("bn_token", data.token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  cookieStore.set("bn_user_name", data.user.name, {
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  cookieStore.set("bn_user_email", data.user.email, {
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  cookieStore.set("bn_user_role", accountRole, {
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  const returnUrl = formData.get("returnUrl") as string | null;
  const defaultRedirect = accountRole === "ADMIN" ? "/admin/dashboard" : "/dashboard";
  redirect(returnUrl || defaultRedirect);
}