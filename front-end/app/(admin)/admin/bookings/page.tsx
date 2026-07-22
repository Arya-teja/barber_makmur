import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { PaymentProofPreview } from "@/components/admin/PaymentProofPreview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getBookingHistory } from "@/lib/api/booking";

function getStatusBadgeVariant(status: string) {
  if (status === "confirmed") return "success" as const;
  if (status === "waiting_confirmation") return "info" as const;
  if (status === "cancelled") return "danger" as const;
  return "warning" as const;
}

function getStatusLabel(status: string) {
  if (status === "confirmed") return "Terkonfirmasi";
  if (status === "waiting_confirmation") return "Menunggu Konfirmasi";
  if (status === "cancelled") return "Dibatalkan";
  return "Menunggu Pembayaran";
}

async function confirmBookingAction(formData: FormData) {
  "use server";

  const token = (await cookies()).get("bn_token")?.value;
  if (!token) return { success: false, message: "Sesi login tidak ditemukan" };

  const bookingId = String(formData.get("bookingId") ?? "");
  if (!bookingId) return { success: false, message: "Booking ID tidak valid" };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/confirm`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    return { success: false, message: "Gagal mengonfirmasi booking" };
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin/dashboard");
  return { success: true, message: "Booking berhasil dikonfirmasi" };
}

async function cancelBookingAction(formData: FormData) {
  "use server";

  const token = (await cookies()).get("bn_token")?.value;
  if (!token) return { success: false, message: "Sesi login tidak ditemukan" };

  const bookingId = String(formData.get("bookingId") ?? "");
  if (!bookingId) return { success: false, message: "Booking ID tidak valid" };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/cancel`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    return { success: false, message: "Gagal membatalkan booking" };
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin/dashboard");
  return { success: true, message: "Booking berhasil dibatalkan" };
}

export default async function AdminBookingsPage() {
  const bookings = await getBookingHistory();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs uppercase text-muted-foreground">
          Kelola Booking
        </p>
        <h1 className="text-2xl font-semibold text-foreground">
          Booking Masuk
        </h1>
      </div>

      <Card className="bg-card/70">
        <CardHeader>
          <CardTitle>Daftar Booking Manual Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-2xl border border-border/60 bg-background/30 p-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Layanan</TableHead>
                  <TableHead>Barber</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Bukti Bayar</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-8 text-center text-sm text-muted-foreground"
                    >
                      Belum ada booking masuk.
                    </TableCell>
                  </TableRow>
                ) : (
                  bookings.map((booking, index) => (
                    <TableRow key={booking.id} className="hover:bg-muted/30">
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium text-foreground">
                        {booking.customerName}
                      </TableCell>
                      <TableCell>{booking.serviceName}</TableCell>
                      <TableCell>{booking.barberName}</TableCell>
                      <TableCell>
                        {booking.date} {booking.time}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(booking.status)}>
                          {getStatusLabel(booking.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <PaymentProofPreview src={booking.paymentProofUrl} />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {booking.status === "waiting_confirmation" ? (
                            <form action={confirmBookingAction}>
                              <input
                                type="hidden"
                                name="bookingId"
                                value={booking.id}
                              />
                              <Button
                                size="sm"
                                className="bg-emerald-600 text-white hover:bg-emerald-500"
                              >
                                Konfirmasi Booking
                              </Button>
                            </form>
                          ) : booking.status === "confirmed" ? (
                            <Badge variant="success">Terkonfirmasi</Badge>
                          ) : booking.status === "pending_payment" ? (
                            <span className="text-xs text-muted-foreground">
                              Belum Bayar
                            </span>
                          ) : (
                            <Badge variant="danger">Dibatalkan</Badge>
                          )}

                          {booking.status !== "confirmed" ? (
                            <form action={cancelBookingAction}>
                              <input
                                type="hidden"
                                name="bookingId"
                                value={booking.id}
                              />
                              <Button
                                size="sm"
                                variant="destructive"
                                type="submit"
                              >
                                Batalkan
                              </Button>
                            </form>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
