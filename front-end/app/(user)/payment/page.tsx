import { CreditCard, ShieldCheck, Banknote } from "lucide-react";

import { ClearCartOnMount } from "@/components/cart/ClearCartOnMount";
import { PaymentUploadForm } from "@/components/payment/PaymentUploadForm";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBookingById, getBookingHistory } from "@/lib/api/booking";
import { formatCurrency } from "@/lib/utils/formatters";
import { uploadProofAction } from "./actions";

const qrImageUrl =
  "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=BarbershopPayment";

function getBookingStatusVariant(status: string) {
  if (status === "confirmed") return "success" as const;
  if (status === "waiting_confirmation") return "info" as const;
  if (status === "cancelled") return "danger" as const;
  return "warning" as const;
}

function getBookingStatusLabel(status: string) {
  if (status === "confirmed") return "Terkonfirmasi ✓";
  if (status === "waiting_confirmation") return "Menunggu Konfirmasi Admin";
  if (status === "cancelled") return "Dibatalkan";
  return "Menunggu Pembayaran";
}

type PaymentPageProps = {
  searchParams?:
    | Promise<{ bookingId?: string | string[] }>
    | { bookingId?: string | string[] };
};

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const bookingIdParam = resolvedSearchParams?.bookingId;
  const bookingId = Array.isArray(bookingIdParam)
    ? bookingIdParam[0]
    : bookingIdParam ?? null;

  const bookingFromQuery = bookingId ? await getBookingById(bookingId) : null;
  const fallbackBooking =
    bookingFromQuery ?? (await getBookingHistory())[0] ?? null;
  const booking = fallbackBooking;

  if (!booking) {
    return (
      <Card className="bg-card/70">
        <CardHeader>
          <CardTitle className="font-(--font-heading)">
            Checkout Pembayaran
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Belum ada booking yang perlu dibayar. Silakan buat booking terlebih
          dulu.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <ClearCartOnMount />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="card-glow bg-card/70">
          <CardHeader>
            <CardTitle>Checkout Pembayaran</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="text-xs uppercase text-muted-foreground">
                Ringkasan Booking
              </p>
              <div className="mt-3 grid gap-2">
                <div className="flex items-center justify-between">
                  <span>Layanan</span>
                  <span className="text-foreground">{booking.serviceName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Barber</span>
                  <span className="text-foreground">{booking.barberName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tanggal</span>
                  <span className="text-foreground">
                    {booking.date} {booking.time}
                  </span>
                </div>
                <div className="flex items-center justify-between font-semibold text-foreground">
                  <span>Total</span>
                  <span>{formatCurrency(booking.amount ?? 0)}</span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 rounded-2xl border border-border/60 bg-background/40 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">
                    Metode Pembayaran
                  </p>
                  <p className="flex items-center gap-2 text-foreground">
                    <CreditCard className="size-4 text-gold" /> QR Statis Manual
                  </p>
                </div>
                <Badge variant="outline">QR Manual</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase text-muted-foreground">
                  Status Booking
                </span>
                <Badge variant={getBookingStatusVariant(booking.status)}>
                  {getBookingStatusLabel(booking.status)}
                </Badge>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-muted/10 px-4 py-3">
                <ShieldCheck className="size-4 text-gold" />
                <p className="text-xs text-muted-foreground">
                  Status booking akan berubah menjadi Menunggu Konfirmasi Admin
                  setelah bukti transfer diupload.
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/10 px-4 py-3 text-sm text-foreground">
                <Banknote className="size-4 text-gold" />
                <span>Bank BCA - 1234567890 a/n Barbershop Premium</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card className="card-glow bg-card/70">
            <CardHeader>
              <CardTitle>QR Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="mx-auto flex size-52 items-center justify-center rounded-2xl border border-border/60 bg-muted/10 p-4">
                <img
                  src={qrImageUrl}
                  alt="QR pembayaran manual"
                  className="size-full object-contain"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Scan QR ini, lalu upload bukti transfer di bawah.
              </p>
            </CardContent>
          </Card>

          <Card className="card-glow bg-card/70">
            <CardHeader>
              <CardTitle>Upload Bukti Transfer</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentUploadForm bookingId={booking.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}