import Link from "next/link";
import { Menu, Scissors, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold"
        >
          <span className="flex size-10 items-center justify-center rounded-full border border-gold bg-black">
            <Scissors className="size-5 text-gold" />
          </span>
          <span className="font-(--font-heading) tracking-wide">
            Barber Noir
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link className="transition hover:text-foreground" href="#about">
            Tentang
          </Link>
          <Link className="transition hover:text-foreground" href="#services">
            Layanan
          </Link>
          <Link
            className="transition hover:text-foreground"
            href="#testimonials"
          >
            Testimoni
          </Link>
          <Link className="transition hover:text-foreground" href="#location">
            Lokasi
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden md:inline-flex"
          >
            <Link href="/login">Login</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-primary text-primary-foreground"
          >
            <Link href="/register">Daftar</Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="size-5" />
          </Button>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 pb-3 text-xs text-muted-foreground md:hidden">
        <span className="flex items-center gap-2">
          <Sparkles className="size-4 text-gold" /> Premium booking & QRIS
        </span>
        <span>Barber Noir</span>
      </div>
    </header>
  );
}
