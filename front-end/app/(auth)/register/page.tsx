import Link from "next/link";
import { ArrowLeft, Phone, User } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

async function registerAction(formData: FormData) {
  "use server";

  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const phone = String(formData.get("phone") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    redirect("/register?error=missing");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password }),
    },
  );

  if (!response.ok) {
    redirect("/register?error=invalid");
  }

  const data = (await response.json()) as {
    token: string;
    user: { name: string; email: string; role: "USER" | "ADMIN" };
  };

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
  });
  cookieStore.set("bn_user_email", data.user.email, {
    sameSite: "lax",
    path: "/",
  });
  cookieStore.set("bn_user_phone", phone, { sameSite: "lax", path: "/" });
  cookieStore.set("bn_user_role", data.user.role ?? "USER", {
    sameSite: "lax",
    path: "/",
  });

  redirect("/dashboard");
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-hero px-4 py-16">
      <Card className="w-full max-w-xl bg-card/80">
        <CardHeader>
          <Button asChild variant="ghost" className="w-fit px-0">
            <Link href="/" className="flex items-center gap-2 text-sm">
              <ArrowLeft className="size-4" /> Kembali ke landing
            </Link>
          </Button>
          <CardTitle>
            Daftar User
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Buat akun untuk booking barbershop premium secara instan.
          </p>
        </CardHeader>
        <CardContent>
          <form action={registerAction} className="grid gap-4">
            <div className="grid gap-2">
              <Label>Nama Lengkap</Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
                <Input
                  name="name"
                  className="pl-10"
                  placeholder="Nama lengkap"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input
                name="email"
                type="email"
                placeholder="nama@email.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Nomor HP</Label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
                <Input
                  name="phone"
                  className="pl-10"
                  placeholder="+62 8xx xxxx xxxx"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Password</Label>
              <Input
                name="password"
                type="password"
                placeholder="********"
                required
              />
            </div>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground"
            >
              Daftar
            </Button>
            <p className="text-xs text-muted-foreground">
              Sudah punya akun? <Link href="/login">Login sekarang</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
