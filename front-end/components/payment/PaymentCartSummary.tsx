"use client";

import Link from "next/link";

import { ShoppingBag } from "lucide-react";

import { useCart } from "@/components/cart/CartProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils/formatters";

function getServicePrice(service: {
  price?: number;
  pricePackage?: number | null;
}) {
  return service.pricePackage ?? service.price ?? 0;
}

export function PaymentCartSummary() {
  const { items, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <Card className="card-glow bg-card/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Ringkasan Keranjang <ShoppingBag className="size-4 text-gold" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Keranjang masih kosong. Tambahkan layanan dari catalog terlebih
            dulu.
          </p>
          <Button asChild className="bg-primary text-primary-foreground">
            <Link href="/catalog">Kembali ke Catalog</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-glow bg-card/70">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            Ringkasan Keranjang <ShoppingBag className="size-4 text-gold" />
          </CardTitle>
          <Badge variant="outline">{totalItems} item</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Ini isi keranjang aktif yang akan dilanjutkan ke proses booking.
        </p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <div className="space-y-3 rounded-2xl border border-border/60 bg-muted/20 p-4">
          {items.map((item) => (
            <div key={item.service.id} className="space-y-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">
                    {item.service.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} x{" "}
                    {formatCurrency(getServicePrice(item.service))}
                  </p>
                </div>
                <p className="font-semibold text-foreground">
                  {formatCurrency(
                    getServicePrice(item.service) * item.quantity,
                  )}
                </p>
              </div>
              <Separator className="bg-border/60" />
            </div>
          ))}
          <div className="flex items-center justify-between pt-1 font-semibold text-foreground">
            <span>Total</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button asChild className="bg-primary text-primary-foreground">
            <Link href="/booking">Lanjut isi Booking</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/catalog">Edit Keranjang</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
