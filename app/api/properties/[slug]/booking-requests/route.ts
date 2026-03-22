import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { limitByKey } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email/send";
import {
  bookingReceivedGuestEmail,
  bookingReceivedHostEmail,
} from "@/lib/email/templates";
import { bookingRequestSchema } from "@/lib/validators/booking";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";

  if (!limitByKey(`${slug}:${ip}`, 8, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const formData = await request.formData();
  const parsed = bookingRequestSchema.safeParse({
    checkIn: formData.get("checkIn"),
    checkOut: formData.get("checkOut"),
    guestCount: formData.get("guestCount"),
    guestName: formData.get("guestName"),
    guestEmail: formData.get("guestEmail"),
    guestPhone: formData.get("guestPhone"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request." }, { status: 400 });
  }

  const property = await prisma.property.findUnique({
    where: { slug },
    include: { blockedDates: true },
  });

  if (!property) {
    return NextResponse.json({ error: "Property not found." }, { status: 404 });
  }

  const checkIn = new Date(parsed.data.checkIn);
  const checkOut = new Date(parsed.data.checkOut);
  const nights = differenceInCalendarDays(checkOut, checkIn);

  if (nights <= 0) {
    return NextResponse.json({ error: "Check-out must be after check-in." }, { status: 400 });
  }

  const conflictingDate = eachDayOfInterval({ start: checkIn, end: checkOut }).find((date) =>
    property.blockedDates.some(
      (blocked) => blocked.date.toISOString().slice(0, 10) === date.toISOString().slice(0, 10),
    ),
  );

  if (conflictingDate) {
    return NextResponse.json({ error: "Selected dates are unavailable." }, { status: 400 });
  }

  const extraGuests = Math.max(parsed.data.guestCount - 2, 0);
  const extras = (property.extraGuestFee ?? 0) * extraGuests * nights;
  const subtotal = nights * property.baseNightlyRate;

  await prisma.bookingRequest.create({
    data: {
      propertyId: property.id,
      checkIn,
      checkOut,
      guestCount: parsed.data.guestCount,
      guestName: parsed.data.guestName,
      guestEmail: parsed.data.guestEmail,
      guestPhone: parsed.data.guestPhone || null,
      message: parsed.data.message || null,
      estimatedSubtotal: subtotal,
      estimatedCleaning: property.cleaningFee,
      estimatedExtras: extras,
      estimatedTotal: subtotal + property.cleaningFee + extras,
    },
  });

  await prisma.analyticsEvent.create({
    data: {
      propertyId: property.id,
      path: `/preview/${slug}`,
      type: "BOOKING_REQUEST",
    },
  });

  await Promise.all([
    sendEmail({
      to: parsed.data.guestEmail,
      subject: "We received your booking request",
      html: bookingReceivedGuestEmail(property.name),
    }),
    sendEmail({
      to: property.hostEmail,
      subject: "New Stayro booking request",
      html: bookingReceivedHostEmail(property.name, parsed.data.guestName),
    }),
  ]);

  return NextResponse.json({ ok: true });
}
