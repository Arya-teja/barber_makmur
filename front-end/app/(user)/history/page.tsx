import Link from "next/link";

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
  if (status === "confirmed") return "Terkonfirmasi ✓";
  if (status === "waiting_confirmation") return "Menunggu Konfirmasi";
  if (status === "cancelled") return "Dibatalkan";
  return "Menunggu Pembayaran";
}

export default async function HistoryPage() {
  const bookings = await getBookingHistory();

  return (
    <div className="flex flex-col gap-6">
      <Card className="bg-card/70">
        <CardHeader>
          <CardTitle className="font-(--font-heading)">
            Riwayat Booking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Layanan</TableHead>
                <TableHead>Barber</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium text-foreground">
                    {booking.serviceName}
                  </TableCell>
                  <TableCell>{booking.barberName}</TableCell>
                  <TableCell>
                    {booking.date} - {booking.time}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(booking.status)}>
                      {getStatusLabel(booking.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {booking.status === "pending_payment" ? (
                      <Button
                        asChild
                        size="sm"
                        className="bg-primary text-primary-foreground"
                      >
                        <Link href={`/payment?bookingId=${booking.id}`}>
                          Bayar Sekarang
                        </Link>
                      </Button>
                    ) : booking.status === "waiting_confirmation" ? (
                      <Badge variant="info">Menunggu Konfirmasi</Badge>
                    ) : booking.status === "confirmed" ? (
                      <Badge variant="success">Terkonfirmasi ✓</Badge>
                    ) : (
                      <Badge variant="danger">Dibatalkan</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
