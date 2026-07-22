"use client";

import { CalendarDays, Clock3, Phone, User } from "lucide-react";
import { useMemo, useTransition, useCallback } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/components/cart/CartProvider";
import type { ServiceItem } from "@/types";

import type { BarberItem } from "@/lib/api/barbers";

interface BookingFormProps {
  services: ServiceItem[];
  barbers: BarberItem[];
  action: (formData: FormData) => void;
  defaultName?: string;
  defaultPhone?: string;
}

export function BookingForm({
  services,
  barbers,
  action,
  defaultName,
  defaultPhone,
}: BookingFormProps) {
  const { items, totalPrice, clear } = useCart();
  const [isPending, startTransition] = useTransition();
  const cartItemsJson = useMemo(() => JSON.stringify(items), [items]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (items.length === 0) {
        toast.error("Keranjang kosong, tambahkan layanan terlebih dulu");
        return;
      }

      const formData = new FormData(e.currentTarget);

      startTransition(async () => {
        try {
          await action(formData);
        } finally {
          clear();
        }
      });
    },
    [items, action, clear, startTransition],
  );

  return (
    <Card className="card-glow">
      <CardHeader>
        <CardTitle>Booking Online</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* Hidden field to pass cart items to server action */}
          <input type="hidden" name="cartItems" value={cartItemsJson} />

          <div className="grid gap-2">
            <Label>Nama pelanggan</Label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                name="customerName"
                className="pl-10"
                placeholder="Nama lengkap"
                defaultValue={defaultName}
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Nomor HP</Label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                name="phone"
                className="pl-10"
                placeholder="+62 8xx xxxx xxxx"
                defaultValue={defaultPhone}
              />
            </div>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Tanggal</Label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
                <Input name="date" className="pl-10" type="date" required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Jam</Label>
              <div className="relative">
                <Clock3 className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
                <Input name="time" className="pl-10" type="time" required />
              </div>
            </div>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Barber</Label>
              <Select name="barberName" required>
                <SelectItem value="">Pilih barber</SelectItem>
                {barbers.map((barber) => (
                  <SelectItem key={barber.id} value={barber.name}>
                    {barber.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Layanan</Label>
              <Select name="serviceId" required>
                <SelectItem value="">Pilih layanan</SelectItem>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>

          {/* Cart summary (read-only) */}
          {items.length > 0 && (
            <div className="rounded-xl border border-border/40 bg-muted/10 p-3 text-xs text-muted-foreground">
              <p className="mb-2 font-semibold text-foreground">
                Ringkasan Keranjang ({items.length} item)
              </p>
              <div className="space-y-1">
                {items.map((item) => (
                  <div
                    key={item.service.id}
                    className="flex items-center justify-between"
                  >
                    <span>
                      {item.service.name} x{item.quantity}
                    </span>
                    <span className="text-foreground">
                      Rp
                      {((
                        item.service.pricePackage ?? item.service.price ?? 0
                      ) * item.quantity).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-2 font-semibold text-foreground">
                <span>Total</span>
                <span>Rp{totalPrice.toLocaleString("id-ID")}</span>
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label>Catatan tambahan</Label>
            <Textarea
              name="notes"
              placeholder="Preferensi gaya atau note tambahan"
            />
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary text-primary-foreground"
          >
            {isPending ? "Memproses..." : "Konfirmasi Booking"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}