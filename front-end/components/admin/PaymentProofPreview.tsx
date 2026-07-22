"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

export function PaymentProofPreview({ src }: { src?: string | null }) {
  const [open, setOpen] = useState(false);

  if (!src) {
    return <span className="text-xs text-muted-foreground">Belum upload</span>;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="overflow-hidden rounded-xl border border-border/60 transition hover:scale-[1.01]"
      >
        <img
          src={src}
          alt="Bukti pembayaran"
          className="h-20 w-20 object-cover"
        />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-border bg-background p-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-foreground">
                Preview Bukti Bayar
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Tutup
              </Button>
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-border/60">
              <img
                src={src}
                alt="Bukti pembayaran full size"
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
