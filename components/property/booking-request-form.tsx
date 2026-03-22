"use client";

import { useMemo, useState } from "react";
import { differenceInCalendarDays, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";

type BookingRequestFormProps = {
  slug: string;
  baseNightlyRate: number;
  cleaningFee: number;
  extraGuestFee?: number | null;
  blockedDates: string[];
};

export function BookingRequestForm({
  slug,
  baseNightlyRate,
  cleaningFee,
  extraGuestFee,
  blockedDates,
}: BookingRequestFormProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestCount, setGuestCount] = useState(2);
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const estimate = useMemo(() => {
    if (!checkIn || !checkOut) {
      return null;
    }

    const nights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
    if (nights <= 0) {
      return null;
    }

    const extraGuests = Math.max(guestCount - 2, 0);
    const extras = extraGuestFee ? extraGuests * extraGuestFee * nights : 0;
    const subtotal = nights * baseNightlyRate;

    return {
      nights,
      subtotal,
      extras,
      total: subtotal + cleaningFee + extras,
    };
  }, [baseNightlyRate, checkIn, checkOut, cleaningFee, extraGuestFee, guestCount]);

  const unavailablePreview = blockedDates.slice(0, 6).map((date) => format(new Date(date), "MMM d"));

  async function handleSubmit(formData: FormData) {
    setState("submitting");
    setError("");

    const rangeBlocked = blockedDates.some((date) => {
      if (!checkIn || !checkOut) {
        return false;
      }

      const current = new Date(date);
      return current >= new Date(checkIn) && current <= new Date(checkOut);
    });

    if (rangeBlocked) {
      setState("error");
      setError("Those dates are currently unavailable. Please choose a different stay window.");
      return;
    }

    const response = await fetch(`/api/properties/${slug}/booking-requests`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const payload = await response.json();
      setState("error");
      setError(payload.error ?? "Unable to submit your request.");
      return;
    }

    setState("success");
  }

  return (
    <div className="panel p-5 md:p-6">
      <div className="space-y-2">
        <h3 className="text-2xl">Request your stay</h3>
        <p className="text-sm leading-6 text-muted">
          Guests request dates directly here. You review and approve each request manually.
        </p>
      </div>
      <form action={handleSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Check-in</label>
            <Input name="checkIn" type="date" value={checkIn} onChange={(event) => setCheckIn(event.target.value)} required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Check-out</label>
            <Input name="checkOut" type="date" value={checkOut} onChange={(event) => setCheckOut(event.target.value)} required />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Guests</label>
          <Input
            name="guestCount"
            type="number"
            min={1}
            max={12}
            value={guestCount}
            onChange={(event) => setGuestCount(Number(event.target.value))}
          />
        </div>

        {estimate && (
          <div className="rounded-xl border border-line bg-[#fbf4ec] p-4 text-sm text-muted">
            <div className="flex items-center justify-between">
              <span>{estimate.nights} nights</span>
              <span>{formatCurrency(estimate.subtotal)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span>Cleaning fee</span>
              <span>{formatCurrency(cleaningFee)}</span>
            </div>
            {!!estimate.extras && (
              <div className="mt-2 flex items-center justify-between">
                <span>Extra guest fee</span>
                <span>{formatCurrency(estimate.extras)}</span>
              </div>
            )}
            <div className="mt-3 flex items-center justify-between border-t border-line pt-3 font-semibold text-ink">
              <span>Estimated total</span>
              <span>{formatCurrency(estimate.total)}</span>
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input name="guestName" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input name="guestEmail" type="email" required />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Phone</label>
          <Input name="guestPhone" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Message</label>
          <Textarea name="message" className="min-h-24" />
        </div>

        <div className="rounded-lg border border-dashed border-line p-4 text-sm leading-6 text-muted">
          Upcoming unavailable dates: {unavailablePreview.join(", ")}
        </div>

        {state === "success" ? (
          <div className="rounded-lg border border-[#bfd8c9] bg-[#edf7f1] px-4 py-3 text-sm text-success">
            Request sent. The host has your dates and will reply by email.
          </div>
        ) : (
          <Button type="submit" disabled={state === "submitting"} className="w-full">
            {state === "submitting" ? "Sending request..." : "Send booking request"}
          </Button>
        )}

        {state === "error" && <p className="text-sm text-danger">{error}</p>}
      </form>
    </div>
  );
}
