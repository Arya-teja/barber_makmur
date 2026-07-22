import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { BookingForm } from "@/components/booking/BookingForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBarbers } from "@/lib/api/barbers";
import { apiFetch } from "@/lib/api/client";
import { getBookingHistory } from "@/lib/api/booking";
import { getCatalogServices } from "@/lib/api/catalog";
import { getUserProfile } from "@/lib/api/user";

async function createBookingAction(formData: FormData) {
  "use server";

  const barberName = String(formData.get("barberName") ?? "");
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");
  const notes = String(formData.get("notes") ?? "");
  const cartItemsRaw = formData.get("cartItems");

  // Coba baca dari cartItems dulu, fallback ke dropdown serviceId
  let serviceId = String(formData.get("serviceId") ?? "");

  if (cartItemsRaw) {
    try {
      const cartItems = JSON.parse(String(cartItemsRaw)) as Array<{
        service: { id: string };
        quantity: number;
      }>;
      if (cartItems.length > 0 && cartItems[0].service?.id) {
        serviceId = cartItems[0].service.id;
      }
    } catch {
      // fallback ke serviceId dari dropdown
    }
  }

  if (!serviceId || !barberName || !date || !time) {
    redirect("/booking?error=missing");
  }

  const booking = await apiFetch<{ id: string }>("/bookings", {
    method: "POST",
    body: JSON.stringify({ serviceId, barberName, date, time, notes }),
  });

  revalidatePath("/booking");
  revalidatePath("/history");
  redirect(`/payment?bookingId=${booking.id}`);
}

export default async function BookingPage() {
  const [services, barbers, bookings, profile] = await Promise.all([
    getCatalogServices(),
    getBarbers(),
    getBookingHistory(),
    getUserProfile(),
  ]);

  const latestBooking = bookings[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <BookingForm
        services={services}
        barbers={barbers}
        action={createBookingAction}
        defaultName={profile?.name}
        defaultPhone={profile?.phone}
      />
      <Card className="bg-card/70">
        <CardHeader>
          <CardTitle>Ringkasan Booking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          {latestBooking ? (
            <>
              <p>Service: {latestBooking.serviceName}</p>
              <p>Barber: {latestBooking.barberName}</p>
              <p>
                Tanggal: {latestBooking.date} {latestBooking.time}
              </p>
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-3 text-xs">
                Booking akan dikonfirmasi otomatis, notifikasi dikirim via email
                dan dashboard.
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-border/60 bg-muted/10 p-3 text-xs">
              Belum ada booking terbaru.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
