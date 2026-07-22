import Link from "next/link";
import { ArrowLeft, Crown, Mail, Scissors, Sparkles } from "lucide-react";

import { loginAction } from "./actions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordField } from "@/components/auth/PasswordField";

type LoginPageProps = {
  searchParams?:
    | Promise<{ error?: string | string[]; errorType?: string | string[]; returnUrl?: string }>
    | { error?: string | string[]; errorType?: string | string[]; returnUrl?: string };
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const errorParam = resolvedSearchParams?.error;
  const errorTypeParam = resolvedSearchParams?.errorType;
  const errorMessage = Array.isArray(errorParam) ? errorParam[0] : errorParam;
  const errorType = Array.isArray(errorTypeParam)
    ? errorTypeParam[0]
    : errorTypeParam;
  const passwordErrorMessage = errorType === "role" ? undefined : errorMessage;
  const roleWarningMessage = errorType === "role" ? errorMessage : undefined;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-hero bg-noise px-4 py-16">
      {/* Decorative radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_400px_at_50%_20%,rgba(231,192,108,0.15),transparent_60%)]" />
      <div className="pointer-events-none absolute -right-40 -top-40 size-96 rounded-full bg-[radial-gradient(circle,rgba(231,192,108,0.08),transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 size-80 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.04),transparent_70%)]" />

      <div className="relative z-10 w-full max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Brand header */}
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-gold bg-black/60 shadow-[0_0_30px_rgba(231,192,108,0.15)]">
            <Scissors className="size-7 text-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Barber Noir
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Premium grooming experience
            </p>
          </div>
        </div>

        <Card className="card-glow overflow-hidden border border-border/60 bg-card/80 backdrop-blur-sm">
          {/* Gold accent line at top */}
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

          <CardHeader>
            <Button asChild variant="ghost" className="w-fit px-0 text-muted-foreground">
              <Link href="/" className="flex items-center gap-2 text-sm hover:text-foreground">
                <ArrowLeft className="size-4" /> Kembali
              </Link>
            </Button>
            <CardTitle className="mt-2 text-2xl">Selamat Datang</CardTitle>
            <p className="text-sm text-muted-foreground">
              Pilih peran dan masuk ke akun premium kamu.
            </p>
          </CardHeader>

          <CardContent className="grid gap-8 md:grid-cols-[1fr_1fr]">
            {/* Left panel: Role selector */}
            <div className="grid gap-4">
              <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-muted/30 to-muted/10 p-5 text-sm">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg border border-gold/30 bg-gold/10">
                    <Crown className="size-4 text-gold" />
                  </div>
                  <p className="font-semibold text-foreground">Akun Terdaftar</p>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Masuk menggunakan email dan password yang sudah terdaftar.
                  Pilih peran sesuai kebutuhanmu.
                </p>
              </div>

              <div className="rounded-2xl border border-dashed border-border/40 bg-muted/10 p-5 text-sm">
                <p className="flex items-center gap-2 font-semibold text-foreground">
                  <Sparkles className="size-4 text-gold" /> Belum punya akun?
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Daftar sekarang dan nikmati layanan premium kami.
                </p>
                <Button asChild variant="outline" size="sm" className="mt-3 w-full border-gold/40 text-gold hover:bg-gold/10 hover:text-gold">
                  <Link href="/register">Daftar Akun Baru</Link>
                </Button>
              </div>
            </div>

            {/* Right panel: Login form */}
            <form action={loginAction} className="grid gap-4">
              <input type="hidden" name="returnUrl" value={resolvedSearchParams?.returnUrl ?? ""} />
              <div className="grid gap-2">
                <Label className="text-xs font-medium text-muted-foreground">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    name="email"
                    type="email"
                    placeholder="nama@email.com"
                    className="border-border/50 pl-10 transition-colors focus:border-gold/50"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="text-xs font-medium text-muted-foreground">Password</Label>
                <PasswordField errorMessage={passwordErrorMessage} />
              </div>

              {roleWarningMessage ? (
                <p
                  className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300"
                  role="alert"
                >
                  {roleWarningMessage}
                </p>
              ) : null}

              <div className="mt-2 flex flex-col gap-3">
                <Button
                  type="submit"
                  name="preferredRole"
                  value="USER"
                  className="w-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
                >
                  <Crown className="mr-2 size-4" /> Login sebagai User
                </Button>
                <Button
                  type="submit"
                  name="preferredRole"
                  value="ADMIN"
                  variant="outline"
                  className="w-full border-gold/40 text-gold transition-all hover:bg-gold/10 hover:text-gold"
                >
                  <Sparkles className="mr-2 size-4" /> Login sebagai Admin
                </Button>
              </div>

              <p className="mt-1 text-center text-xs text-muted-foreground">
                Lupa password? Hubungi admin studio.
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted-foreground/60">
          Barber Noir &copy; {new Date().getFullYear()} &mdash; Premium grooming experience.
        </p>
      </div>
    </div>
  );
}
