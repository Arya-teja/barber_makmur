"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getApiBaseUrl } from "@/lib/api/client";

const apiBaseUrl = getApiBaseUrl();

export async function uploadProofAction(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("bn_token")?.value;

  if (!token) {
    redirect(
      "/payment?upload=error&message=Silakan%20login%20ulang%20terlebih%20dulu",
    );
  }

  const bookingId = String(formData.get("bookingId") ?? "");
  const file = formData.get("file");

  if (!bookingId) {
    redirect("/payment?upload=error&message=Booking%20ID%20tidak%20ditemukan");
  }

  if (!(file instanceof File) || file.size === 0) {
    redirect(
      "/payment?upload=error&message=Silakan%20pilih%20file%20bukti%20transfer%20terlebih%20dulu",
    );
  }

  const uploadFormData = new FormData();
  uploadFormData.append("file", file);

  const uploadResponse = await fetch(`${apiBaseUrl}/payments/upload-proof`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: uploadFormData,
  });

  if (!uploadResponse.ok) {
    redirect(
      "/payment?upload=error&message=Upload%20bukti%20gagal.%20Coba%20lagi%20beberapa%20saat",
    );
  }

  const uploadResult = (await uploadResponse.json()) as { url?: string };

  if (!uploadResult.url) {
    redirect(
      "/payment?upload=error&message=Server%20tidak%20mengembalikan%20URL%20bukti%20pembayaran",
    );
  }

  const updateResponse = await fetch(
    `${apiBaseUrl}/payments/booking/${bookingId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        paymentProofUrl: uploadResult.url,
        status: "WAITING_CONFIRMATION",
      }),
    },
  );

  if (!updateResponse.ok) {
    redirect(
      "/payment?upload=error&message=Bukti%20berhasil%20diupload%2C%20tapi%20status%20booking%20gagal%20diperbarui",
    );
  }

  revalidatePath("/payment");
  revalidatePath("/history");
  revalidatePath("/admin/bookings");

  redirect(`/payment?bookingId=${bookingId}&upload=success`);
}
