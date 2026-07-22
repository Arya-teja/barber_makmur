import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

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
import { getPaymentHistory } from "@/lib/api/payment";
import { formatCurrency } from "@/lib/utils/formatters";

function getPaymentBadgeVariant(status: string) {
  if (status === "paid") return "success" as const;
  if (status === "failed") return "danger" as const;
  return "warning" as const;
}

function getPaymentLabel(status: string) {
  if (status === "paid") return "Lunas";
  if (status === "failed") return "Gagal";
  return "Menunggu";
}

async function updatePaymentStatusAction(formData: FormData) {
  "use server";

  const token = (await cookies()).get("bn_token")?.value;
  if (!token) return;

  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      paymentId: formData.get("paymentId"),
      status: formData.get("status"),
    }),
  });

  revalidatePath("/admin/payments");
}

export default async function AdminPaymentsPage() {
  const payments = await getPaymentHistory();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs uppercase text-muted-foreground">
          Kelola Pembayaran
        </p>
        <h1 className="text-2xl font-semibold text-foreground">
          Transaksi QRIS
        </h1>
      </div>

      <Card className="bg-card/70">
        <CardHeader>
          <CardTitle>Daftar Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Booking</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.id}</TableCell>
                  <TableCell>{payment.serviceName}</TableCell>
                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={getPaymentBadgeVariant(payment.status)}>
                      {getPaymentLabel(payment.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <form action={updatePaymentStatusAction}>
                        <input
                          type="hidden"
                          name="paymentId"
                          value={payment.id}
                        />
                        <input type="hidden" name="status" value="PAID" />
                        <Button size="sm" variant="secondary" type="submit">
                          Konfirmasi Manual
                        </Button>
                      </form>
                      <form action={updatePaymentStatusAction}>
                        <input
                          type="hidden"
                          name="paymentId"
                          value={payment.id}
                        />
                        <input type="hidden" name="status" value="FAILED" />
                        <Button size="sm" variant="outline" type="submit">
                          Tandai Gagal
                        </Button>
                      </form>
                    </div>
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
