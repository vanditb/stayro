"use server";

import { eachDayOfInterval } from "date-fns";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/auth/session";
import { sendEmail } from "@/lib/email/send";
import { bookingApprovedEmail, bookingDeclinedEmail } from "@/lib/email/templates";

export async function updateBookingStatusAction(bookingId: string, nextStatus: "APPROVED" | "DECLINED") {
  const user = await requireCurrentUser();

  const booking = await prisma.bookingRequest.findFirst({
    where: {
      id: bookingId,
      property: {
        userId: user.id,
      },
    },
    include: { property: true },
  });

  if (!booking) {
    return;
  }

  await prisma.bookingRequest.update({
    where: { id: booking.id },
    data: {
      status: nextStatus,
      approvedAt: nextStatus === "APPROVED" ? new Date() : null,
      declinedAt: nextStatus === "DECLINED" ? new Date() : null,
    },
  });

  if (nextStatus === "APPROVED") {
    const days = eachDayOfInterval({
      start: booking.checkIn,
      end: booking.checkOut,
    });

    await prisma.blockedDate.createMany({
      data: days.map((date) => ({
        propertyId: booking.propertyId,
        date,
        note: `Approved booking for ${booking.guestName}`,
        source: "approved_booking",
      })),
      skipDuplicates: true,
    });

    await prisma.analyticsEvent.create({
      data: {
        propertyId: booking.propertyId,
        path: "/dashboard/bookings",
        type: "BOOKING_APPROVED",
      },
    });

    await sendEmail({
      to: booking.guestEmail,
      subject: "Your booking request was approved",
      html: bookingApprovedEmail(booking.property.name),
    });
  }

  if (nextStatus === "DECLINED") {
    await prisma.analyticsEvent.create({
      data: {
        propertyId: booking.propertyId,
        path: "/dashboard/bookings",
        type: "BOOKING_DECLINED",
      },
    });

    await sendEmail({
      to: booking.guestEmail,
      subject: "Update on your Stayro booking request",
      html: bookingDeclinedEmail(booking.property.name),
    });
  }

  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard/calendar");
}

export async function blockDateAction(formData: FormData) {
  const user = await requireCurrentUser();
  const property = user.properties[0];
  const date = String(formData.get("date") ?? "");
  const note = String(formData.get("note") ?? "");

  if (!property || !date) {
    return;
  }

  await prisma.blockedDate.upsert({
    where: {
      propertyId_date: {
        propertyId: property.id,
        date: new Date(date),
      },
    },
    update: {
      note,
      source: "manual",
    },
    create: {
      propertyId: property.id,
      date: new Date(date),
      note,
      source: "manual",
    },
  });

  revalidatePath("/dashboard/calendar");
}

export async function unblockDateAction(blockedDateId: string) {
  const user = await requireCurrentUser();

  const blocked = await prisma.blockedDate.findFirst({
    where: {
      id: blockedDateId,
      property: {
        userId: user.id,
      },
    },
  });

  if (!blocked) {
    return;
  }

  await prisma.blockedDate.delete({
    where: { id: blockedDateId },
  });

  revalidatePath("/dashboard/calendar");
}
