"use client";

import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadProofAction } from "@/app/(user)/payment/actions";

type PaymentUploadFormProps = {
  bookingId: string;
};

export function PaymentUploadForm({ bookingId }: PaymentUploadFormProps) {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await uploadProofAction(formData);
      } catch {
        // redirect() throws internally, ini normal
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="bookingId" value={bookingId} />
      <div className="grid gap-2">
        <label className="text-sm font-medium text-foreground">
          Upload bukti transfer
        </label>
        <Input
          type="file"
          name="file"
          accept="image/*"
          required
          className="cursor-pointer"
        />
        <p className="text-xs text-muted-foreground">
          Format yang diterima: JPG, PNG, atau WEBP.
        </p>
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={pending}
      >
        {pending ? "Mengupload..." : "Upload Bukti Pembayaran"}
      </Button>
    </form>
  );
}