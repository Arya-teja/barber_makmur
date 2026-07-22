export type PaymentStatus = "waiting" | "paid" | "failed";

export interface PaymentItem {
  id: string;
  bookingId: string;
  serviceName: string;
  amount: number;
  method: "QRIS";
  status: PaymentStatus;
  createdAt: string;
  paymentProofUrl?: string | null;
}
