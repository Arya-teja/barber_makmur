import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Coffee,
  Crown,
  MapPin,
  Phone,
  QrCode,
  Quote,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  Clock,
  Wifi,
  ArmchairIcon,
} from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { getCatalogServices } from "@/lib/api/catalog";
import { getLandingContent } from "@/lib/api/content";

const premiumFeatures = [
  {
    icon: Scissors,
    title: "Barber Profesional",
    desc: "Tim barber berpengalaman dengan sertifikasi internasional dan sense of style tinggi.",
  },
  {
    icon: QrCode,
    title: "Pembayaran QRIS",
    desc: "Bayar instant pakai QRIS. No cash, no hassle. Semua transaksi digital dan aman.",
  },
  {
    icon: CalendarCheck,
    title: "Booking Online",
    desc: "Pilih jadwal, pilih barber, booking dalam hitungan detik. Antrian? Bukan urusanmu.",
  },
  {
    icon: ShieldCheck,
    title: "Hygiene Standard",
    desc: "Setiap alat disterilisasi. Kursi dan area didesinfeksi setelah setiap pelanggan.",
  },
  {
    icon: ArmchairIcon,
    title: "Premium Lounge",
    desc: "Interior maskulin dengan kursi relax, free Wi-Fi, dan minuman premium sambil menunggu.",
  },
  {
    icon: Clock,
    title: "Tepat Waktu",
    desc: "Jadwal ketat tanpa overbooking. Waktumu berharga, kami hargai itu.",
  },
];

export default async function LandingPage() {
  const [{ features, testimonials, metrics }, services] = await Promise.all([
    getLandingContent(),
    getCatalogServices(),
  ]);

  const heroMetrics = metrics.filter((item) => item.category === "hero");
  const aboutMetrics = metrics.filter((item) => item.category === "about");

  return (
    <div className="relative flex min-h-screen flex-col bg-hero bg-noise">
      {/* Decorative glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 size-[500px] rounded-full bg-[radial-gradient(circle,rgba(231,192,108,0.08),transparent_70%)]" />
        <div className="absolute -right-60 top-1/3 size-[600px] rounded-full bg-[radial-gradient(circle,rgba(231,192,108,0.05),transparent_70%)]" />
        <div className="absolute -bottom-60 left-1/4 size-[500px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.03),transparent_70%)]" />
      </div>

      <Navbar />

      <main className="relative z-10 flex-1">
        {/* ===== HERO SECTION ===== */}
        <section className="mx-auto flex w-full max-w-6xl animate-in fade-in slide-in-from-bottom-6 flex-col gap-10 px-4 py-16 md:px-6 lg:flex-row lg:items-center lg:py-24">
          <div className="flex-1 space-y-6">
            <div className="inline-flex animate-in fade-in slide-in-from-left-6 items-center gap-2 rounded-full border border-gold bg-black/60 px-4 py-2 text-xs text-gold duration-700">
              <Sparkles className="size-3" />
              Premium Barbershop Experience
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-foreground md:text-5xl lg:text-6xl">
              Style terbaik{" "}
              <span className="bg-gradient-to-r from-gold to-amber-300 bg-clip-text text-transparent">
                dimulai dari sini.
              </span>
            </h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground">
              Barber Noir menghadirkan layanan barbershop modern, booking online
              real-time, dan pembayaran digital QRIS. Semua dibuat untuk pria
              modern yang menghargai detail.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
              >
                <Link href="/login">
                  <Crown className="mr-2 size-4" /> Login User
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-gold/40 text-gold transition-all hover:bg-gold/10 hover:text-gold"
              >
                <Link href="/login">Login Admin</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/register">Daftar</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="#services" className="flex items-center gap-2">
                  Lihat Layanan <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              {heroMetrics.length === 0 ? (
                <span className="flex items-center gap-2">
                  <Crown className="size-4 text-gold" />
                  Data premium akan tampil di sini
                </span>
              ) : (
                heroMetrics.slice(0, 2).map((metric) => (
                  <span key={metric.id} className="flex items-center gap-2">
                    {metric.label.toLowerCase().includes("rating") ? (
                      <Star className="size-4 text-gold" />
                    ) : (
                      <Crown className="size-4 text-gold" />
                    )}
                    {metric.value} {metric.label}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Hero Visual - Barber Chair Mockup */}
          <div className="group relative flex-1 animate-in fade-in slide-in-from-right-6 duration-700">
            <div className="card-glow relative overflow-hidden rounded-3xl border border-border/60 bg-linear-to-br from-neutral-900 via-neutral-950 to-black p-8 transition-all duration-500 hover:border-gold/30">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(231,192,108,0.25),transparent_55%)] transition-opacity duration-500 group-hover:opacity-80" />

              {/* Decorative gold dots */}
              <div className="absolute right-4 top-4 grid grid-cols-3 gap-1.5">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="size-1 rounded-full bg-gold/30" />
                ))}
              </div>

              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-gold" />
                    Interior Barber Noir
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-gold">
                    <Sparkles className="size-3" /> Premium Lounge
                  </span>
                </div>

                {/* Main visual: barber chair mockup */}
                <div className="relative">
                  <div className="flex items-center justify-center">
                    {/* Chair base */}
                    <div className="relative flex flex-col items-center">
                      {/* Chair headrest */}
                      <div className="mb-1 h-8 w-24 rounded-t-2xl border border-border/40 bg-gradient-to-b from-neutral-800 to-neutral-900 shadow-lg" />
                      {/* Chair back */}
                      <div className="h-14 w-28 rounded-2xl border border-border/40 bg-gradient-to-b from-neutral-800 to-neutral-900 shadow-lg" />
                      {/* Chair seat */}
                      <div className="h-20 w-32 rounded-2xl border border-border/40 bg-gradient-to-b from-neutral-700 to-neutral-800 shadow-xl" />
                      {/* Chair base stem */}
                      <div className="h-8 w-3 rounded-full bg-neutral-700 shadow-md" />
                      {/* Chair base plate */}
                      <div className="h-3 w-20 rounded-full bg-neutral-600 shadow-md" />
                    </div>

                    {/* Mirror glow behind chair */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(231,192,108,0.12),transparent_60%)]" />
                  </div>
                </div>

                {/* Feature chips */}
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-border/40 bg-black/40 px-2.5 py-1 text-[10px] text-muted-foreground">
                    <Wifi className="size-3" /> Free Wi-Fi
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-border/40 bg-black/40 px-2.5 py-1 text-[10px] text-muted-foreground">
                    <Coffee className="size-3" /> Premium Drink
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-border/40 bg-black/40 px-2.5 py-1 text-[10px] text-muted-foreground">
                    <ArmchairIcon className="size-3" /> VIP Room
                  </span>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  Atmosfer maskulin, detail premium, dan kenyamanan lounge
                  modern.
                </p>
              </div>
            </div>

            {/* Decorative floating badge */}
            <div className="absolute -bottom-3 -right-3 z-20 hidden rounded-xl border border-gold/30 bg-black/80 px-4 py-2 shadow-lg backdrop-blur-sm md:block">
              <p className="flex items-center gap-2 text-xs text-gold">
                <Star className="size-3 fill-gold" /> 4.9 Rating
              </p>
            </div>
          </div>
        </section>

        {/* ===== ABOUT + FEATURES SECTION ===== */}
        <section
          id="about"
          className="mx-auto w-full max-w-6xl animate-in fade-in slide-in-from-bottom-6 px-4 py-16 md:px-6"
        >
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-black/40 px-4 py-1.5 text-xs text-muted-foreground">
              <Sparkles className="size-3 text-gold" /> About Us
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-foreground">
              Lebih dari Sekadar{" "}
              <span className="bg-gradient-to-r from-gold to-amber-300 bg-clip-text text-transparent">
                Potong Rambut
              </span>
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
              Kami menggabungkan teknik klasik dengan teknologi modern untuk
              pengalaman grooming terbaik.
            </p>
          </div>

          <div className=" gap-8">
            <Card className="card-glow overflow-hidden border border-border/60 bg-card/80 backdrop-blur-sm">
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Scissors className="size-5 text-gold" /> Tentang Barber Noir
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Barber Noir adalah studio grooming premium yang memadukan
                  teknik klasik dan gaya modern. Kami fokus pada detail,
                  kenyamanan, dan pengalaman digital yang mulus.
                </p>
                <p>
                  Dengan barbershop interior premium dan tim barber terkurasi,
                  setiap kunjungan terasa eksklusif. Booking online dan
                  pembayaran QRIS mempercepat semuanya.
                </p>
                {aboutMetrics.length > 0 && (
                  <>
                    <Separator className="bg-border/40" />
                    <div className="grid gap-4 sm:grid-cols-3">
                      {aboutMetrics.slice(0, 3).map((metric) => (
                        <div
                          key={metric.id}
                          className="rounded-xl border border-border/40 bg-muted/10 p-3 text-center"
                        >
                          <p className="text-2xl font-semibold text-foreground">
                            {metric.value}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {metric.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* <Card className="card-glow overflow-hidden border border-border/60 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:border-gold/30 h-full">
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="size-5 text-gold" /> Highlight Layanan
                </CardTitle>
              </CardHeader>
              <CardContent>
                {features.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-dashed border-gold/20 bg-gold/5">
                      <Sparkles className="size-7 text-gold/30" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Highlight layanan akan segera tersedia.
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground/60">
                      Fitur unggulan akan ditampilkan di sini.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {features.map((feature, i) => (
                      <div
                        key={feature.id}
                        className="flex items-start gap-3 rounded-xl border border-border/40 bg-muted/10 p-3 transition-all duration-200 hover:border-gold/20 hover:bg-gold/5"
                      >
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gold/10 text-xs font-semibold text-gold">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="flex-1 space-y-0.5">
                          <p className="text-sm font-semibold text-foreground">
                            {feature.title}
                          </p>
                          <p className="text-xs leading-relaxed text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card> */}
          </div>
        </section>

        {/* ===== PREMIUM FEATURES GRID ===== */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-black/40 px-4 py-1.5 text-xs text-muted-foreground">
              <Sparkles className="size-3 text-gold" /> Why Barber Noir
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-foreground">
              Kenapa{" "}
              <span className="bg-gradient-to-r from-gold to-amber-300 bg-clip-text text-transparent">
                Memilih Kami?
              </span>
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {premiumFeatures.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={i}
                  className="group card-glow overflow-hidden border border-border/60 bg-card/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-xl"
                >
                  <div className="h-0.5 w-0 bg-gradient-to-r from-gold to-amber-300 transition-all duration-500 group-hover:w-full" />
                  <CardContent className="pt-6">
                    <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent shadow-sm">
                      <Icon className="size-6 text-gold" />
                    </div>
                    <h3 className="mb-2 text-base font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {feature.desc}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* ===== SERVICES SECTION ===== */}
        <section
          id="services"
          className="mx-auto w-full max-w-6xl animate-in fade-in slide-in-from-bottom-6 px-4 py-16 md:px-6"
        >
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-black/40 px-4 py-1.5 text-xs text-muted-foreground">
                <Sparkles className="size-3 text-gold" /> Services
              </div>
              <h2 className="mt-3 text-3xl font-semibold text-foreground">
                Keunggulan{" "}
                <span className="bg-gradient-to-r from-gold to-amber-300 bg-clip-text text-transparent">
                  Layanan
                </span>
              </h2>
            </div>
            <Button
              asChild
              variant="outline"
              className="border-gold/40 text-gold transition-all hover:bg-gold/10 hover:text-gold"
            >
              <Link href="/catalog" className="flex items-center gap-2">
                Lihat Semua Catalog <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.length === 0 ? (
              <Card className="col-span-full bg-card/70">
                <CardContent className="py-12 text-center text-sm text-muted-foreground">
                  <Scissors className="mx-auto mb-3 size-8 text-muted-foreground/40" />
                  Catalog layanan akan tampil di sini.
                  <br />
                  <span className="text-xs">
                    Tambahkan layanan melalui halaman admin.
                  </span>
                </CardContent>
              </Card>
            ) : (
              services.slice(0, 6).map((service) => (
                <Card
                  key={service.id}
                  className="group card-glow overflow-hidden border border-border/60 bg-card/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-xl"
                >
                  <CardHeader className="pb-2">
                    <div className="mb-3 flex size-10 items-center justify-center rounded-xl border border-gold/20 bg-gold/10">
                      <Scissors className="size-5 text-gold" />
                    </div>
                    <CardTitle className="flex items-center justify-between text-base">
                      {service.name}
                      <span className="text-sm text-gold">
                        Rp{service.price.toLocaleString("id-ID")}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p className="line-clamp-2">{service.description}</p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="inline-flex items-center gap-1 rounded-full border border-border/40 bg-muted/20 px-2 py-0.5">
                        <Clock className="size-3" /> {service.durationMinutes}{" "}
                        menit
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-border/40 bg-muted/20 px-2 py-0.5">
                        {service.category}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* ===== TESTIMONIALS SECTION ===== */}
        {/* <section
          id="testimonials"
          className="mx-auto w-full max-w-6xl animate-in fade-in slide-in-from-bottom-6 px-4 py-16 md:px-6"
        >
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-black/40 px-4 py-1.5 text-xs text-muted-foreground">
              <Sparkles className="size-3 text-gold" /> Testimonials
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-foreground">
              Apa Kata{" "}
              <span className="bg-gradient-to-r from-gold to-amber-300 bg-clip-text text-transparent">
                Pelanggan
              </span>
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.length === 0 ? (
              <Card className="col-span-full bg-card/70">
                <CardContent className="py-12 text-center text-sm text-muted-foreground">
                  <Quote className="mx-auto mb-3 size-8 text-muted-foreground/40" />
                  Testimoni pelanggan akan tampil di sini.
                </CardContent>
              </Card>
            ) : (
              testimonials.map((item) => (
                <Card
                  key={item.id}
                  className="card-glow overflow-hidden border border-border/60 bg-card/70 backdrop-blur-sm transition-all duration-300 hover:border-gold/30"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent">
                        <span className="text-sm font-semibold text-gold">
                          {item.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold">
                          {item.name}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {item.role}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <Quote className="absolute -left-1 -top-1 size-6 text-gold/20" />
                      <p className="pl-5 text-sm leading-relaxed italic text-muted-foreground">
                        &ldquo;{item.quote}&rdquo;
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section> */}

        {/* ===== LOCATION SECTION ===== */}
        <section
          id="location"
          className="mx-auto w-full max-w-6xl animate-in fade-in slide-in-from-bottom-6 px-4 py-16 md:px-6"
        >
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-black/40 px-4 py-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3 text-gold" /> Location
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-foreground">
              Temukan{" "}
              <span className="bg-gradient-to-r from-gold to-amber-300 bg-clip-text text-transparent">
                Kami
              </span>
            </h2>
          </div>
          <Card className="card-glow overflow-hidden border border-border/60 bg-card/80 backdrop-blur-sm">
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
            <CardContent className="grid gap-8 p-0 md:grid-cols-[1.2fr_1fr]">
              <div className="space-y-5 p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-xl border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent">
                    <MapPin className="size-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Barber Makmur
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Jl. Kelurahan, Pd. Rajeg, Kec. Cibinong, Kabupaten Bogor,
                      Jawa Barat 16413
                    </p>
                  </div>
                </div>

                <Separator className="bg-border/40" />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border/40 bg-muted/10 p-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Clock className="size-4 text-gold" /> Jam Operasional
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Senin - Minggu
                      <br />
                      10.00 - 22.00 WIB
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/40 bg-muted/10 p-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Phone className="size-4 text-gold" /> Kontak
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      +62 812-3456-7890
                      <br />
                      info@barbernoir.com
                    </p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  Booking online tersedia 24/7. Walk-in terbatas untuk menjaga
                  kualitas service.
                </p>
              </div>

              {/* Map mockup */}
              <div className="relative flex min-h-[300px] items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-950 to-black md:min-h-full">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(231,192,108,0.08),transparent_60%)]" />
                <div className="relative z-10 text-center">
                  <MapPin className="mx-auto size-10 text-gold" />
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    Jl. Kelurahan, Pd. Rajeg, Kec. Cibinong, Kabupaten Bogor
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Premium Lounge Area
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="mt-4 border-gold/40 text-gold hover:bg-gold/10 hover:text-gold"
                  >
                    <Link
                      href="https://maps.app.goo.gl/zGgWGTzQqC7LV5FTA"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="mr-2 size-3" /> Buka Google Maps
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ===== CTA SECTION ===== */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6">
          <Card className="card-glow relative overflow-hidden border border-gold/20 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black">
            <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_50%_30%,rgba(231,192,108,0.12),transparent_60%)]" />
            <CardContent className="relative z-10 flex flex-col items-center gap-4 py-16 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl border border-gold bg-gold/10 shadow-[0_0_40px_rgba(231,192,108,0.15)]">
                <Scissors className="size-8 text-gold" />
              </div>
              <h2 className="text-3xl font-semibold text-foreground">
                Siap untuk{" "}
                <span className="bg-gradient-to-r from-gold to-amber-300 bg-clip-text text-transparent">
                  Tampil Beda?
                </span>
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Daftar sekarang dan nikmati kemudahan booking online, pembayaran
                QRIS, dan pengalaman grooming premium.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
                >
                  <Link href="/register">
                    <Crown className="mr-2 size-4" /> Daftar Sekarang
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-gold/40 text-gold hover:bg-gold/10 hover:text-gold"
                >
                  <Link href="/catalog">
                    Lihat Catalog <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 border-t border-border/60 bg-black/50 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 text-sm md:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2">
                <Scissors className="size-4 text-gold" />
                <span className="font-semibold text-foreground">
                  Barber Noir
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Premium grooming experience sejak 2026. Grooming untuk pria
                modern yang menghargai detail.
              </p>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Layanan
              </p>
              <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                <Link
                  href="/catalog"
                  className="hover:text-foreground transition-colors"
                >
                  Catalog Layanan
                </Link>
                <Link
                  href="/booking"
                  className="hover:text-foreground transition-colors"
                >
                  Booking Online
                </Link>
                <Link
                  href="/login"
                  className="hover:text-foreground transition-colors"
                >
                  Login / Daftar
                </Link>
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Kontak
              </p>
              <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <MapPin className="size-3 text-gold" /> Jl. Kelurahan, Pd.
                  Rajeg, Kec. Cibinong, Kabupaten Bogor, Jawa Barat 16413
                </span>
                <span className="flex items-center gap-2">
                  <Phone className="size-3 text-gold" /> +62 812-3456-7890
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="size-3 text-gold" /> 10.00 - 22.00 WIB
                </span>
              </div>
            </div>
          </div>
          <Separator className="bg-border/40" />
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Barber Makmur. All rights
              reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="#"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Instagram
              </Link>
              <Link
                href="#"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                WhatsApp
              </Link>
              <Link
                href="#"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
