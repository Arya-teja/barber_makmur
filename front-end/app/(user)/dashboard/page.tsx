import { CalendarDays, CreditCard, Scissors, Sparkles } from "lucide-react";

import { ToastStack } from "@/components/feedback/ToastStack";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBookingHistory } from "@/lib/api/booking";
import { getCatalogServices } from "@/lib/api/catalog";
import { getPaymentHistory } from "@/lib/api/payment";
import { formatCurrency } from "@/lib/utils/formatters";

export default async function UserDashboardPage() {
  const services = await getCatalogServices();
  const bookings = await getBookingHistory();
  const payments = await getPaymentHistory();

  const notifications = [
    ...bookings.slice(0, 1).map((booking) => ({
      id: `booking-${booking.id}`,
      title:
        booking.status === "confirmed"
          ? "Booking dikonfirmasi"
          : "Booking menunggu konfirmasi",
      description: `${booking.serviceName} • ${booking.date} ${booking.time}`,
      variant:
        booking.status === "confirmed"
          ? "success"
          : "error",
    })),
    ...payments.slice(0, 1).map((payment) => ({
      id: `payment-${payment.id}`,
      title:
        payment.status === "paid"
          ? "Pembayaran sukses"
          : payment.status === "failed"
            ? "Pembayaran gagal"
            : "Pembayaran menunggu",
      description: `${payment.serviceName} • ${formatCurrency(payment.amount)}`,
      variant: payment.status === "paid" ? "success" : "error",
    })),
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card/70">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-sm">
              Layanan aktif <Scissors className="size-4 text-gold" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">
              {services.length}
            </p>
            <p className="text-xs text-muted-foreground">
              Paket premium tersedia
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/70">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-sm">
              Booking berikutnya <CalendarDays className="size-4 text-gold" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">
              {bookings[0]?.time}
            </p>
            <p className="text-xs text-muted-foreground">{bookings[0]?.date}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/70">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-sm">
              Total transaksi <CreditCard className="size-4 text-gold" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">
              {formatCurrency(
                payments.reduce((sum, item) => sum + item.amount, 0),
              )}
            </p>
            <p className="text-xs text-muted-foreground">Pembayaran QRIS</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Highlight layanan
              <Sparkles className="size-4 text-gold" />
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {services.slice(0, 4).map((service) => (
              <div
                key={service.id}
                className="rounded-2xl border border-border/60 p-4"
              >
                <p className="text-sm font-semibold text-foreground">
                  {service.name}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {service.description}
                </p>
                <p className="mt-3 text-xs text-gold">
                  Paket mulai {formatCurrency(service.price)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
