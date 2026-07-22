import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { CalendarDays, Scissors } from "lucide-react";

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
import { getAdminStats } from "@/lib/api/admin";
import { getBookingHistory } from "@/lib/api/booking";
import { getBarbers } from "@/lib/api/barbers";

async function createBarberAction(formData: FormData) {
  "use server";

  const token = (await cookies()).get("bn_token")?.value;
  if (!token) return;

  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: formData.get("name"),
      status: formData.get("status") || "ACTIVE",
    }),
  });

  revalidatePath("/admin/dashboard");
}

async function updateBarberAction(formData: FormData) {
  "use server";

  const token = (await cookies()).get("bn_token")?.value;
  if (!token) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbers/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: formData.get("name"),
      status: formData.get("status"),
    }),
  });

  revalidatePath("/admin/dashboard");
}

async function deleteBarberAction(formData: FormData) {
  "use server";

  const token = (await cookies()).get("bn_token")?.value;
  if (!token) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbers/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  revalidatePath("/admin/dashboard");
}

function getStatusBadgeVariant(status: string) {
  if (status === "confirmed") return "success" as const;
  if (status === "waiting_confirmation") return "info" as const;
  if (status === "cancelled") return "danger" as const;
  return "warning" as const;
}

function getStatusLabel(status: string) {
  if (status === "confirmed") return "Dikonfirmasi";
  if (status === "waiting_confirmation") return "Menunggu Konfirmasi";
  if (status === "cancelled") return "Dibatalkan";
  return "Menunggu Pembayaran";
}

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();
  const bookings = await getBookingHistory();
  const barbers = await getBarbers();
  const latestBookings = bookings.slice(0, 6);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card/70">
          <CardHeader>
            <CardTitle className="text-sm">Total User</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">
              {stats.totalUsers}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/70">
          <CardHeader>
            <CardTitle className="text-sm">Total Booking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">
              {stats.totalBookings}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/70">
          <CardHeader>
            <CardTitle className="text-sm">Total Transaksi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">
              {stats.totalTransactions}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/70">
          <CardHeader>
            <CardTitle className="text-sm">Total Layanan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">
              {stats.totalServices}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="card-glow bg-card/70">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              CRUD Barber
              <Scissors className="size-4 text-gold" />
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Tambah, ubah, atau hapus data barber untuk form booking online.
            </p>
          </div>
          <Badge variant="outline" className="w-fit">
            {barbers.length} barber aktif
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <form
            action={createBarberAction}
            className="grid gap-3 md:grid-cols-[1fr_180px_auto]"
          >
            <input
              name="name"
              placeholder="Nama barber"
              className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
              required
            />
            <select
              name="status"
              className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
              defaultValue="ACTIVE"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground"
            >
              Simpan Barber
            </Button>
          </form>

          <div className="rounded-2xl border border-border/60 bg-background/30 p-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Barber</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {barbers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="py-8 text-center text-sm text-muted-foreground"
                    >
                      Belum ada barber aktif.
                    </TableCell>
                  </TableRow>
                ) : (
                  barbers.map((barber) => (
                    <TableRow key={barber.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium text-foreground">
                        <form
                          action={updateBarberAction}
                          className="flex flex-col gap-2 md:flex-row md:items-center"
                        >
                          <input type="hidden" name="id" value={barber.id} />
                          <input
                            name="name"
                            defaultValue={barber.name}
                            className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                          />
                          <select
                            name="status"
                            defaultValue="ACTIVE"
                            className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
                          >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="INACTIVE">INACTIVE</option>
                          </select>
                          <Button type="submit" size="sm" variant="outline">
                            Update
                          </Button>
                        </form>
                      </TableCell>
                      <TableCell>
                        <Badge variant="success">ACTIVE</Badge>
                      </TableCell>
                      <TableCell>
                        <form action={deleteBarberAction}>
                          <input type="hidden" name="id" value={barber.id} />
                          <Button size="sm" variant="destructive">
                            Hapus
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card className="card-glow bg-card/70">
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                Booking Terbaru
                <CalendarDays className="size-4 text-gold" />
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Pantau booking masuk terbaru lengkap dengan layanan, barber, dan
                jadwal.
              </p>
            </div>
            <Badge variant="outline" className="w-fit">
              {latestBookings.length} booking terbaru
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="rounded-2xl border border-border/60 bg-background/30 p-1">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Layanan</TableHead>
                    <TableHead>Barber</TableHead>
                    <TableHead>Jadwal</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {latestBookings.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="py-8 text-center text-sm text-muted-foreground"
                      >
                        Belum ada booking terbaru.
                      </TableCell>
                    </TableRow>
                  ) : (
                    latestBookings.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium text-foreground">
                          {item.customerName || "-"}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-2 text-sm">
                            <Scissors className="size-3.5 text-gold" />
                            {item.serviceName || "-"}
                          </span>
                        </TableCell>
                        <TableCell>{item.barberName || "-"}</TableCell>
                        <TableCell>
                          <span className="text-sm text-foreground">
                            {item.date}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {item.time}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(item.status)}>
                            {getStatusLabel(item.status)}
                          </Badge>
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
    </div>
  );
}
