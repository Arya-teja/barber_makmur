import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QrCardProps {
  status: "waiting" | "success" | "failed";
  qrUrl?: string | null;
}

export function QrCard({ status, qrUrl }: QrCardProps) {
  const statusLabel =
    status === "success"
      ? "Berhasil"
      : status === "failed"
        ? "Gagal"
        : "Menunggu";

  const badgeVariant =
    status === "success"
      ? "success"
      : status === "failed"
        ? "danger"
        : "warning";

  return (
    <Card className="card-glow">
      <CardHeader>
        <CardTitle>QRIS Midtrans</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Status pembayaran</p>
          <Badge variant={badgeVariant}>{statusLabel}</Badge>
        </div>
        {qrUrl ? (
          <div className="mx-auto flex size-48 items-center justify-center rounded-2xl border border-border bg-muted/20 p-4">
            <img src={qrUrl} alt="QRIS" className="size-full object-contain" />
          </div>
        ) : (
          <div className="mx-auto flex size-48 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/10 text-xs text-muted-foreground">
            QR belum tersedia
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Scan QR ini melalui aplikasi pembayaran favorit kamu. Status akan
          ter-update otomatis via webhook Midtrans.
        </p>
      </CardContent>
    </Card>
  );
}
