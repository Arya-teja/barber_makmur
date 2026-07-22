import { CheckCircle2, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

interface ToastItem {
  id: string;
  title: string;
  description: string;
  variant: "success" | "error";
}

interface ToastStackProps {
  items: ToastItem[];
}

export function ToastStack({ items }: ToastStackProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/60 bg-muted/10 p-4 text-sm text-muted-foreground">
        Belum ada notifikasi terbaru.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm",
            toast.variant === "success"
              ? "border-emerald-500/40 bg-emerald-500/10"
              : "border-rose-500/40 bg-rose-500/10",
          )}
        >
          {toast.variant === "success" ? (
            <CheckCircle2 className="mt-0.5 size-5 text-emerald-400" />
          ) : (
            <XCircle className="mt-0.5 size-5 text-rose-400" />
          )}
          <div>
            <p className="font-semibold text-foreground">{toast.title}</p>
            <p className="text-muted-foreground">{toast.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
