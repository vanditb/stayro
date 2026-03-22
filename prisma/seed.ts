import bcrypt from "bcryptjs";
import { subDays } from "date-fns";
import { PrismaClient, BookingStatus, PlanType, PropertyStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("stayro-demo", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@stayro.co" },
    update: {},
    create: {
      name: "Elena Hart",
      email: "demo@stayro.co",
      passwordHash,
      phone: "+1 (415) 555-0182",
      subscription: {
        create: {
          plan: PlanType.PRO,
          status: "active",
        },
      },
      emailPreference: {
        create: {
          marketing: false,
          bookingRequests: true,
          bookingStatusUpdates: true,
          publishUpdates: true,
          billingUpdates: true,
        },
      },
    },
  });

  await prisma.property.deleteMany({ where: { userId: user.id } });

  const property = await prisma.property.create({
    data: {
      userId: user.id,
      slug: "oceancrest-house",
      name: "Oceancrest House",
      propertyType: "Coastal villa",
      location: "Carmel-by-the-Sea, California",
      guestCapacity: 8,
      bedrooms: 4,
      beds: 5,
      bathrooms: 3.5,
      shortDescription:
        "A light-filled coastal retreat with Pacific views, cedar-lined interiors, and a short walk to the beach path.",
      checkInTime: "4:00 PM",
      checkOutTime: "10:00 AM",
      minimumStay: 3,
      houseRules:
        "Quiet hours after 10 PM. No parties. Registered guests only. Please shake off sand before coming inside.",
      petPolicy: "Dogs considered with prior approval and a refundable pet clean fee.",
      parkingInfo: "Two driveway spaces plus free street parking on the north side of the lane.",
      wifiInfo: "Fiber Wi-Fi throughout the home and patio.",
      baseNightlyRate: 625,
      cleaningFee: 185,
      extraGuestFee: 35,
      petFee: 95,
      taxNotes: "Transient occupancy tax is included in the final quote.",
      hostEmail: "elena@oceancrest.house",
      approvalMode: "manual",
      cancellationPolicy:
        "Full refund up to 14 days before arrival. 50% refund up to 7 days before arrival.",
      availabilityBuffer: 1,
      maxAdvanceBookingWindow: 365,
      siteStatus: PropertyStatus.PUBLISHED,
      isPublished: true,
      importMethod: "airbnb",
      importSourceUrl: "https://www.airbnb.com/rooms/demo-oceancrest",
      photos: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
            altText: "Oceancrest House exterior with sunset view",
            sortOrder: 0,
            isCover: true,
          },
          {
            url: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1600&q=80",
            altText: "Living room with fireplace and ocean-facing windows",
            sortOrder: 1,
          },
          {
            url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80",
            altText: "Primary bedroom with coastal decor",
            sortOrder: 2,
          },
          {
            url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
            altText: "Patio lounge with fire pit",
            sortOrder: 3,
          },
        ],
      },
      amenities: {
        create: [
          { label: "Ocean view" },
          { label: "Fire pit" },
          { label: "Chef's kitchen" },
          { label: "Fast Wi-Fi" },
          { label: "Washer + dryer" },
          { label: "Beach gear" },
          { label: "EV charger" },
          { label: "Pet-friendly", category: "policies" },
        ],
      },
      generatedContent: {
        create: {
          heroHeadline: "Wake up to salt air, soft light, and your own Pacific horizon.",
          heroIntro:
            "Oceancrest House pairs the ease of a private home with the feel of a design-forward coastal stay.",
          stayDescription:
            "Designed for slow mornings and long dinners, the house opens from cedar-lined interiors to a wind-sheltered terrace. Inside, four restful bedrooms and an oversized family kitchen make the stay feel easy for couples, families, or small groups.",
          amenitiesCopy:
            "Everything guests ask about most is already handled: fast Wi-Fi, beach storage, generous parking, a kitchen worth cooking in, and outdoor spaces that hold the afternoon light.",
          neighborhoodHighlights:
            "Walk the bluff trail at sunrise, reach downtown Carmel in under ten minutes, or spend the day moving between beach coves, local wine bars, and quiet cypress-lined roads.",
          faqIntro: "A few things guests usually want to know before they book.",
          houseRulesSummary:
            "The stay is relaxed but respectful: quiet evenings, approved guests only, and thoughtful care of the home.",
          seoTitle: "Oceancrest House | Direct Booking in Carmel-by-the-Sea",
          metaDescription:
            "Book Oceancrest House direct for a calm, design-forward stay near Carmel beaches, village dining, and scenic coastal walks.",
          ctaCopy: "Request your stay",
          sectionHeadings: {
            details: "A coastal home made for long weekends",
            gallery: "Inside the house",
            location: "What’s nearby",
            reviews: "Guest notes",
          },
          testimonialPlaceholders: {
            lead: "Guests consistently mention the view, the calm bedrooms, and how easy the house is for group stays.",
          },
        },
      },
      themeSettings: {
        create: {
          theme: "Luxury",
          brandColor: "#8b5a36",
          hideBadge: true,
        },
      },
      faqItems: {
        create: [
          {
            question: "Is the beach walkable?",
            answer: "Yes. The nearest beach access path is about a seven-minute walk from the front door.",
            sortOrder: 0,
          },
          {
            question: "Do you allow pets?",
            answer: "Dogs are considered with approval. Please mention breed and travel details in your request.",
            sortOrder: 1,
          },
          {
            question: "Is the kitchen stocked?",
            answer: "The kitchen includes cookware, serving pieces, coffee gear, and pantry basics for short stays.",
            sortOrder: 2,
          },
        ],
      },
      reviews: {
        create: [
          {
            guestName: "Maya",
            location: "San Francisco",
            source: "Direct guest",
            body: "The house felt quiet and elevated without being precious. Our group spent every evening by the fire pit.",
            rating: 5,
            stayMonth: "February 2026",
          },
          {
            guestName: "Thomas",
            location: "Austin",
            source: "Airbnb",
            body: "Beautifully laid out, easy parking, and the view from the upstairs bedroom was unreal at sunrise.",
            rating: 5,
            stayMonth: "January 2026",
          },
        ],
      },
      domains: {
        create: [
          {
            hostname: "oceancrest.stayro.co",
            subdomain: "oceancrest",
            isPrimary: true,
            verificationToken: "stayro-demo-token",
            status: "VERIFIED",
          },
        ],
      },
      calendarFeeds: {
        create: [
          {
            label: "Airbnb calendar",
            url: "https://www.airbnb.com/calendar/ical/demo.ics",
          },
        ],
      },
    },
  });

  await prisma.bookingRequest.createMany({
    data: [
      {
        propertyId: property.id,
        checkIn: new Date("2026-04-10"),
        checkOut: new Date("2026-04-14"),
        guestCount: 4,
        guestName: "Nina Patel",
        guestEmail: "nina@example.com",
        guestPhone: "+1 (917) 555-0104",
        message: "Celebrating a birthday weekend with two couples.",
        status: BookingStatus.PENDING,
        estimatedSubtotal: 2500,
        estimatedCleaning: 185,
        estimatedExtras: 0,
        estimatedTotal: 2685,
      },
      {
        propertyId: property.id,
        checkIn: new Date("2026-03-29"),
        checkOut: new Date("2026-04-02"),
        guestCount: 6,
        guestName: "Jordan Lee",
        guestEmail: "jordan@example.com",
        status: BookingStatus.APPROVED,
        estimatedSubtotal: 2500,
        estimatedCleaning: 185,
        estimatedExtras: 70,
        estimatedTotal: 2755,
        approvedAt: subDays(new Date(), 2),
      },
      {
        propertyId: property.id,
        checkIn: new Date("2026-05-18"),
        checkOut: new Date("2026-05-22"),
        guestCount: 2,
        guestName: "Rachel Kim",
        guestEmail: "rachel@example.com",
        message: "Would love a quiet anniversary stay.",
        status: BookingStatus.DECLINED,
        estimatedSubtotal: 2500,
        estimatedCleaning: 185,
        estimatedExtras: 0,
        estimatedTotal: 2685,
        declinedAt: subDays(new Date(), 4),
      },
    ],
  });

  await prisma.blockedDate.createMany({
    data: [
      { propertyId: property.id, date: new Date("2026-03-29"), note: "Approved direct booking", source: "approved_booking" },
      { propertyId: property.id, date: new Date("2026-03-30"), note: "Approved direct booking", source: "approved_booking" },
      { propertyId: property.id, date: new Date("2026-03-31"), note: "Approved direct booking", source: "approved_booking" },
      { propertyId: property.id, date: new Date("2026-04-01"), note: "Approved direct booking", source: "approved_booking" },
      { propertyId: property.id, date: new Date("2026-04-02"), note: "Cleaning buffer", source: "buffer" },
      { propertyId: property.id, date: new Date("2026-04-22"), note: "Owner stay", source: "manual" },
    ],
    skipDuplicates: true,
  });

  await prisma.analyticsEvent.createMany({
    data: [
      { propertyId: property.id, path: "/preview/oceancrest-house", type: "PAGE_VIEW" },
      { propertyId: property.id, path: "/preview/oceancrest-house", type: "PAGE_VIEW" },
      { propertyId: property.id, path: "/preview/oceancrest-house", type: "BOOKING_REQUEST" },
      { propertyId: property.id, path: "/dashboard/bookings", type: "BOOKING_APPROVED" },
    ],
  });

  console.log("Seeded Stayro demo data");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
