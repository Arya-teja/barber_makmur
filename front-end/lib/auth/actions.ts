"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("bn_token");
  cookieStore.delete("bn_user_name");
  cookieStore.delete("bn_user_email");
  cookieStore.delete("bn_user_phone");
  cookieStore.delete("bn_user_role");
  redirect("/");
}
