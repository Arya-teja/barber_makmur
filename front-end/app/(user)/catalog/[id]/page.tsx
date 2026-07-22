import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, BadgeCheck, Clock, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getServiceById } from "@/lib/api/catalog";
import { formatCurrency } from "@/lib/utils/formatters";

interface ServiceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { id } = await params;
  const service = await getServiceById(id);

  if (!service) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-6 text-sm text-muted-foreground">
        Layanan tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Button asChild variant="ghost" className="w-fit">
        <Link href="/catalog" className="flex items-center gap-2">
          <ArrowLeft className="size-4" /> Kembali ke catalog
        </Link>
      </Button>

      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="text-2xl">{service.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{service.description}</p>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 text-sm text-muted-foreground">
            {service.imageURL && (
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border/40">
                <Image
                  src={service.imageURL}
                  alt={service.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                Harga:{" "}
                <span className="text-lg font-semibold text-gold">
                  {formatCurrency(service.price)}
                </span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border/40 bg-muted/20 px-2 py-0.5 text-xs">
                <Clock className="size-3" /> {service.durationMinutes} menit
              </span>
            </div>

            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="mb-2 text-xs uppercase text-muted-foreground">
                Benefit paket
              </p>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2 text-sm">
                  <BadgeCheck className="mt-0.5 size-4 shrink-0 text-gold" />
                  <span>Layanan premium dengan barber profesional</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <BadgeCheck className="mt-0.5 size-4 shrink-0 text-gold" />
                  <span>Alat steril dan higienis</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <BadgeCheck className="mt-0.5 size-4 shrink-0 text-gold" />
                  <span>Suasana lounge premium</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button asChild className="bg-primary text-primary-foreground">
                <Link href="/booking">Booking Sekarang</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
