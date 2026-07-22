import "server-only";

import { cookies } from "next/headers";

import type { PaymentItem } from "@/types";

import { apiFetch } from "@/lib/api/client";

interface PaymentResponse {
  id: string;
  bookingId: string;
  amount: number;
  method: "QRIS";
  status: "WAITING" | "PAID" | "FAILED";
  createdAt: string;
  paymentProofUrl?: string | null;
  booking?: { service?: { name: string } };
}

function mapStatus(status: PaymentResponse["status"]): PaymentItem["status"] {
  if (status === "PAID") return "paid";
  if (status === "FAILED") return "failed";
  return "waiting";
}

export async function getPaymentHistory(): Promise<PaymentItem[]> {
  const role = (await cookies()).get("bn_user_role")?.value;
  const path = role === "ADMIN" ? "/payments" : "/payments/me";
  const payments = await apiFetch<PaymentResponse[]>(path);

  return payments.map((payment) => ({
    id: payment.id,
    bookingId: payment.bookingId,
    serviceName: payment.booking?.service?.name ?? "",
    amount: payment.amount,
    method: payment.method,
    status: mapStatus(payment.status),
    createdAt: payment.createdAt,
    paymentProofUrl: payment.paymentProofUrl ?? null,
  }));
}

export interface PaymentDetail {
  id: string;
  bookingId: string;
  serviceName: string;
  amount: number;
  method: "QRIS";
  status: PaymentItem["status"];
  createdAt: string;
  paymentProofUrl?: string | null;
}

export async function getLatestPaymentDetail(): Promise<PaymentDetail | null> {
  const role = (await cookies()).get("bn_user_role")?.value;
  const path = role === "ADMIN" ? "/payments" : "/payments/me";
  const payments = await apiFetch<PaymentResponse[]>(path);
  const payment = payments[0];
  if (!payment) {
    return null;
  }

  return {
    id: payment.id,
    bookingId: payment.bookingId,
    serviceName: payment.booking?.service?.name ?? "",
    amount: payment.amount,
    method: payment.method,
    status: mapStatus(payment.status),
    createdAt: payment.createdAt,
    paymentProofUrl: payment.paymentProofUrl ?? null,
  };
}
