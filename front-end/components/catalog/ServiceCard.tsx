"use client";

import Link from "next/link";
import {  Scissors, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCart } from "@/components/cart/CartProvider";
import type { ServiceItem } from "@/types";
import { formatCurrency } from "@/lib/utils/formatters";

interface ServiceCardProps {
  service: ServiceItem;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const { addItem } = useCart();

  return (
    <Card className="card-glow bg-card/70 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="outline">{service.category}</Badge>
          <div className="flex size-10 items-center justify-center rounded-full border border-border bg-muted/30">
            <Scissors className="size-4 text-gold" />
          </div>
        </div>
        <CardTitle className="mt-4 flex items-center gap-2">
          {service.name}
          <Sparkles className="size-4 text-gold" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{service.description}</p>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Harga</p>
            <p className="font-semibold text-foreground">
              {formatCurrency(service.price)}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Durasi {service.durationMinutes} menit
          </p>
        </div>
      </CardContent>
      <CardFooter className="items-center justify-between">
        <div className="flex flex-col gap-2">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="bg-primary text-primary-foreground"
          >
            <Link href={`/catalog/${service.id}`}>Lihat Detail</Link>
          </Button>
          <Button
            type="button"
            size="sm"
            className="bg-primary text-primary-foreground"
            onClick={() => addItem(service)}
          >
            Tambah ke Keranjang
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
