import { requireCurrentUser } from "@/lib/auth/session";
import { updateBookingStatusAction } from "@/lib/actions/bookings";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function BookingsPage() {
  const user = await requireCurrentUser();
  const property = user.properties[0];

  return (
    <div className="p-5 md:p-8">
      <div className="space-y-3">
        <h1 className="text-4xl">Booking inbox</h1>
        <p className="text-sm leading-6 text-muted">
          Review incoming requests, keep the guest response fast, and approve or decline stays manually.
        </p>
      </div>
      <div className="mt-8 space-y-4">
        {property?.bookingRequests.map((request) => (
          <div key={request.id} className="panel p-5">
            <div className="grid gap-5 md:grid-cols-[1fr_auto]">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-2xl">{request.guestName}</p>
                  <Badge tone={request.status === "APPROVED" ? "success" : request.status === "PENDING" ? "warn" : "default"}>
                    {request.status.toLowerCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted">
                  {new Date(request.checkIn).toLocaleDateString()} - {new Date(request.checkOut).toLocaleDateString()} • {request.guestCount} guests
                </p>
                <p className="text-sm leading-6 text-muted">
                  {request.message || "No guest note included."}
                </p>
                <p className="text-sm text-muted">
                  {request.guestEmail}
                  {request.guestPhone ? ` • ${request.guestPhone}` : ""}
                </p>
              </div>
              <div className="space-y-4 text-right">
                <p className="text-2xl">{formatCurrency(request.estimatedTotal)}</p>
                {request.status === "PENDING" ? (
                  <div className="flex flex-wrap justify-end gap-3">
                    <form action={async () => {
                      "use server";
                      await updateBookingStatusAction(request.id, "DECLINED");
                    }}>
                      <Button type="submit" variant="secondary">Decline</Button>
                    </form>
                    <form action={async () => {
                      "use server";
                      await updateBookingStatusAction(request.id, "APPROVED");
                    }}>
                      <Button type="submit">Approve</Button>
                    </form>
                  </div>
                ) : (
                  <p className="text-sm text-muted">
                    Updated {new Date(request.updatedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
