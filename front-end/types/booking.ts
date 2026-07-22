import type { PaymentStatus } from "./payment";

export type BookingStatus =
  | "pending_payment"
  | "waiting_confirmation"
  | "confirmed"
  | "cancelled";

export interface BookingItem {
  id: string;
  serviceName: string;
  barberName: string;
  date: string;
  time: string;
  customerName: string;
  phone: string;
  status: BookingStatus;
  paymentStatus?: PaymentStatus;
  paymentProofUrl?: string | null;
  amount?: number;
}
