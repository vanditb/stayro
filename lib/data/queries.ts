import { BookingStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { demoPropertyFallback } from "@/lib/data/demo";

const propertyInclude = Prisma.validator<Prisma.PropertyInclude>()({
  photos: { orderBy: { sortOrder: "asc" } },
  amenities: { orderBy: { label: "asc" } },
  generatedContent: true,
  faqItems: { orderBy: { sortOrder: "asc" } },
  reviews: true,
  blockedDates: { orderBy: { date: "asc" } },
  domains: true,
  themeSettings: true,
  bookingRequests: { orderBy: { createdAt: "desc" } },
  calendarFeeds: true,
});

export async function getPropertyBySlug(slug: string) {
  try {
    const property = await prisma.property.findUnique({
      where: { slug },
      include: propertyInclude,
    });

    return property;
  } catch {
    return demoPropertyFallback;
  }
}

export async function getDashboardData(userId: string) {
  const property = await prisma.property.findFirst({
    where: { userId },
    include: propertyInclude,
    orderBy: { createdAt: "desc" },
  });

  if (!property) {
    return null;
  }

  const pageViews = await prisma.analyticsEvent.count({
    where: { propertyId: property.id, type: "PAGE_VIEW" },
  });

  const requests = property.bookingRequests.length;
  const approved = property.bookingRequests.filter(
    (request) => request.status === BookingStatus.APPROVED,
  ).length;

  return {
    property,
    stats: {
      pageViews,
      requests,
      approved,
      conversionRate: requests === 0 ? 0 : Math.round((approved / requests) * 100),
    },
  };
}

export async function getPublishedProperties() {
  return prisma.property.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
  });
}
