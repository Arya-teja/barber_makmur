"use client";

import Link from "next/link";

import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils/formatters";
import { useCart } from "@/components/cart/CartProvider";

function getServicePrice(service: { price?: number; pricePackage?: number }) {
  return service.pricePackage ?? service.price ?? 0;
}

export function CartFloatingButton() {
  const [open, setOpen] = useState(false);
  const {
    items,
    totalItems,
    totalPrice,
    removeItem,
    incrementItem,
    decrementItem,
    clear,
  } = useCart();

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="group rounded-full bg-primary px-4 py-6 text-primary-foreground shadow-lg"
        >
          <ShoppingBag className="size-5" />
          <span className="ml-2 text-sm font-semibold">Keranjang</span>
          {totalItems > 0 ? (
            <span className="ml-3 rounded-full bg-black/60 px-2 py-0.5 text-xs text-gold">
              {totalItems}
            </span>
          ) : null}
        </Button>
      </div>

      {open ? (
        <div className="fixed bottom-20 right-6 z-50 w-[320px]">
          <Card className="card-glow">
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">Keranjang layanan</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {totalItems > 0
                    ? `${totalItems} item dipilih`
                    : "Belum ada layanan dipilih"}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Tambahkan layanan favorit dari catalog.
                </p>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.service.id}
                      className="rounded-2xl border border-border/60 bg-background/40 p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {item.service.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(getServicePrice(item.service))} per
                            item
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.service.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="inline-flex items-center rounded-full border border-border/60 bg-background">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="rounded-full"
                            onClick={() => decrementItem(item.service.id)}
                          >
                            <Minus className="size-3.5" />
                          </Button>
                          <span className="min-w-8 px-2 text-center text-sm font-semibold text-foreground">
                            {item.quantity}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="rounded-full"
                            onClick={() => incrementItem(item.service.id)}
                          >
                            <Plus className="size-3.5" />
                          </Button>
                        </div>
                        <p className="text-sm font-semibold text-foreground">
                          {formatCurrency(
                            getServicePrice(item.service) * item.quantity,
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      asChild
                      className="flex-1 bg-primary text-primary-foreground"
                    >
                      <Link href="/booking" onClick={() => setOpen(false)}>
                        Lanjut Booking
                      </Link>
                    </Button>
                    <Button type="button" variant="outline" onClick={clear}>
                      Bersihkan
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  );
}
