import "server-only";

import { cookies } from "next/headers";

import type { BookingItem } from "@/types";

import { apiFetch } from "@/lib/api/client";

interface BookingResponse {
  id: string;
  userId: string;
  barberName: string;
  date: string;
  time: string;
  status:
    | "PENDING_PAYMENT"
    | "WAITING_CONFIRMATION"
    | "CONFIRMED"
    | "CANCELLED";
  service: { name: string; price: number };
  user?: { name: string; phone?: string | null };
  payment?: {
    status: "WAITING" | "PAID" | "FAILED";
    paymentProofUrl?: string | null;
    amount: number;
  } | null;
}

function mapStatus(status: BookingResponse["status"]): BookingItem["status"] {
  if (status === "WAITING_CONFIRMATION") return "waiting_confirmation";
  if (status === "CONFIRMED") return "confirmed";
  if (status === "CANCELLED") return "cancelled";
  return "pending_payment";
}

function mapPaymentStatus(
  status?: NonNullable<BookingResponse["payment"]>["status"],
): BookingItem["paymentStatus"] {
  if (!status) return undefined;
  if (status === "PAID") return "paid";
  if (status === "FAILED") return "failed";
  return "waiting";
}

export async function getBookingHistory(): Promise<BookingItem[]> {
  const cookieStore = await cookies();
  const role = cookieStore.get("bn_user_role")?.value;
  const path = role === "ADMIN" ? "/bookings" : "/bookings/my";
  const bookings = await apiFetch<BookingResponse[]>(path);

  return bookings.map((booking) => {
    const fallbackName = cookieStore.get("bn_user_name")?.value ?? "";
    const fallbackPhone = cookieStore.get("bn_user_phone")?.value ?? "";

    return {
      id: booking.id,
      serviceName: booking.service?.name ?? "",
      barberName: booking.barberName,
      date: booking.date,
      time: booking.time,
      customerName: booking.user?.name ?? fallbackName,
      phone: booking.user?.phone ?? fallbackPhone,
      status: mapStatus(booking.status),
      paymentStatus: mapPaymentStatus(booking.payment?.status),
      paymentProofUrl: booking.payment?.paymentProofUrl ?? null,
      amount: booking.payment?.amount ?? booking.service?.price ?? 0,
    };
  });
}

export async function getBookingById(
  bookingId: string,
): Promise<BookingItem | null> {
  try {
    const booking = await apiFetch<BookingResponse>(`/bookings/${bookingId}`);

    const cookieStore = await cookies();
    const fallbackName = cookieStore.get("bn_user_name")?.value ?? "";
    const fallbackPhone = cookieStore.get("bn_user_phone")?.value ?? "";

    return {
      id: booking.id,
      serviceName: booking.service?.name ?? "",
      barberName: booking.barberName,
      date: booking.date,
      time: booking.time,
      customerName: booking.user?.name ?? fallbackName,
      phone: booking.user?.phone ?? fallbackPhone,
      status: mapStatus(booking.status),
      paymentStatus: mapPaymentStatus(booking.payment?.status),
      paymentProofUrl: booking.payment?.paymentProofUrl ?? null,
      amount: booking.payment?.amount ?? booking.service?.price ?? 0,
    };
  } catch {
    return null;
  }
}
