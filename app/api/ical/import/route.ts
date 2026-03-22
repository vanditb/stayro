import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { importICalDates } from "@/lib/calendar/ical";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const property = await prisma.property.findFirst({
    where: { id: body.propertyId, userId: session.user.id },
  });

  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  const dates = await importICalDates(body.url);

  await prisma.blockedDate.createMany({
    data: dates.map((date) => ({
      propertyId: property.id,
      date: new Date(date),
      note: "Imported from iCal",
      source: "ical",
    })),
    skipDuplicates: true,
  });

  return NextResponse.json({ imported: dates.length });
}
