"use client";

import { useEffect, useActionState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { ServiceItem } from "@/types";

type UpdateServiceProps = {
  service: ServiceItem;
  UpdateAction: (formData: FormData) => Promise<{ success: boolean }>;
};

export function UpdateService({ service, UpdateAction }: UpdateServiceProps) {
  const [state, formAction, isPending] = useActionState(
    async (_: unknown, formData: FormData) => {
      try {
        await UpdateAction(formData); //panggil fungsi update yang dikirim dari parent
        return { success: true };
      } catch {
        return { success: false };
      }
    },
    null,
  )

  // Tampilkan notifikasi berdasarkan hasil update
  useEffect(() => {
    if (state?.success) {
      toast.success("Layanan berhasil diperbarui");
    } else if (state?.success === false) {
      toast.error("Gagal memperbarui layanan");
    }
  }, [state]);

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="id" value={service.id} />
      {/* Update Name */}
      <input
        name="name"
        defaultValue={service.name}
        className="h-8 w-32 rounded-lg border border-input bg-background px-2 text-xs"
      />
      {/* Update Category */}
      <select
        name="category"
        defaultValue={service.category}
        className="h-8 rounded-lg border border-input bg-background px-2 text-xs"
      >
        <option value="Dewasa">Dewasa</option>
        <option value="Anak-anak">Anak-anak</option>
        <option value="Promo">Promo</option>
      </select>
      {/* Update Price */}
      <input
        name="price"
        type="number"
        defaultValue={service.price}
        className="h-8 w-24 rounded-lg border border-input bg-background px-2 text-xs"
      />
      {/* Update Status */}
      <select
        name="status"
        defaultValue={service.status}
        className="h-8 rounded-lg border border-input bg-background px-2 text-xs"
      >
        <option value="active">active</option>
        <option value="inactive">inactive</option>
      </select>

      {/* Button Update */}
      <Button size="sm" variant="outline" type="submit" disabled={isPending}>
        {isPending ? "Menyimpan..." : "Update"}
      </Button>
    </form>
  );
}
