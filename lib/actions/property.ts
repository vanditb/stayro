"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/auth/session";
import { generateSiteContent } from "@/lib/ai/generate-site-content";
import { planDetails } from "@/lib/data/constants";
import { sendEmail } from "@/lib/email/send";
import { publishSuccessEmail } from "@/lib/email/templates";
import { propertyInputSchema } from "@/lib/validators/property";
import { slugify } from "@/lib/utils";

async function buildUniqueSlug(base: string, excludeId?: string) {
  let candidate = slugify(base);
  let suffix = 1;

  while (true) {
    const existing = await prisma.property.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing || existing.id === excludeId) {
      return candidate;
    }

    suffix += 1;
    candidate = `${slugify(base)}-${suffix}`;
  }
}

export async function savePropertyAction(formData: FormData) {
  const user = await requireCurrentUser();
  const existingProperty = user.properties[0];

  const photosRaw = String(formData.get("photos") ?? "[]");
  const amenitiesRaw = String(formData.get("amenities") ?? "[]");

  const parsed = propertyInputSchema.safeParse({
    importMethod: formData.get("importMethod"),
    importSourceUrl: formData.get("importSourceUrl"),
    name: formData.get("name"),
    propertyType: formData.get("propertyType"),
    location: formData.get("location"),
    guestCapacity: formData.get("guestCapacity"),
    bedrooms: formData.get("bedrooms"),
    beds: formData.get("beds"),
    bathrooms: formData.get("bathrooms"),
    shortDescription: formData.get("shortDescription"),
    amenities: JSON.parse(amenitiesRaw),
    checkInTime: formData.get("checkInTime"),
    checkOutTime: formData.get("checkOutTime"),
    minimumStay: formData.get("minimumStay"),
    houseRules: formData.get("houseRules"),
    petPolicy: formData.get("petPolicy"),
    parkingInfo: formData.get("parkingInfo"),
    wifiInfo: formData.get("wifiInfo"),
    baseNightlyRate: formData.get("baseNightlyRate"),
    cleaningFee: formData.get("cleaningFee"),
    extraGuestFee: formData.get("extraGuestFee"),
    petFee: formData.get("petFee"),
    taxNotes: formData.get("taxNotes"),
    hostEmail: formData.get("hostEmail"),
    availabilityBuffer: formData.get("availabilityBuffer"),
    cancellationPolicy: formData.get("cancellationPolicy"),
    maxAdvanceBookingWindow: formData.get("maxAdvanceBookingWindow"),
    theme: formData.get("theme"),
    brandColor: formData.get("brandColor"),
    logoUrl: formData.get("logoUrl"),
    subdomain: formData.get("subdomain"),
    photos: JSON.parse(photosRaw),
  });

  if (!parsed.success) {
    redirect("/onboarding?error=invalid");
  }

  const draftContent = await generateSiteContent(parsed.data);
  const slug = await buildUniqueSlug(parsed.data.name, existingProperty?.id);

  const property = existingProperty
    ? await prisma.property.update({
        where: { id: existingProperty.id },
        data: {
          slug,
          name: parsed.data.name,
          propertyType: parsed.data.propertyType,
          location: parsed.data.location,
          guestCapacity: parsed.data.guestCapacity,
          bedrooms: parsed.data.bedrooms,
          beds: parsed.data.beds,
          bathrooms: parsed.data.bathrooms,
          shortDescription: parsed.data.shortDescription,
          checkInTime: parsed.data.checkInTime,
          checkOutTime: parsed.data.checkOutTime,
          minimumStay: parsed.data.minimumStay,
          houseRules: parsed.data.houseRules,
          petPolicy: parsed.data.petPolicy,
          parkingInfo: parsed.data.parkingInfo,
          wifiInfo: parsed.data.wifiInfo,
          baseNightlyRate: parsed.data.baseNightlyRate,
          cleaningFee: parsed.data.cleaningFee,
          extraGuestFee: parsed.data.extraGuestFee ?? null,
          petFee: parsed.data.petFee ?? null,
          taxNotes: parsed.data.taxNotes ?? null,
          hostEmail: parsed.data.hostEmail,
          cancellationPolicy: parsed.data.cancellationPolicy,
          availabilityBuffer: parsed.data.availabilityBuffer ?? null,
          maxAdvanceBookingWindow: parsed.data.maxAdvanceBookingWindow ?? null,
          importMethod: parsed.data.importMethod,
          importSourceUrl: parsed.data.importSourceUrl || null,
          photos: {
            deleteMany: {},
            create: parsed.data.photos.map((photo) => ({
              url: photo.url,
              altText: photo.altText,
              sortOrder: photo.sortOrder,
              isCover: Boolean(photo.isCover),
            })),
          },
          amenities: {
            deleteMany: {},
            create: parsed.data.amenities.map((label) => ({ label })),
          },
          themeSettings: {
            upsert: {
              update: {
                theme: parsed.data.theme,
                brandColor: parsed.data.brandColor || null,
                logoUrl: parsed.data.logoUrl || null,
              },
              create: {
                theme: parsed.data.theme,
                brandColor: parsed.data.brandColor || null,
                logoUrl: parsed.data.logoUrl || null,
              },
            },
          },
          generatedContent: {
            upsert: {
              update: draftContent,
              create: draftContent,
            },
          },
          domains: {
            deleteMany: { isCustom: false },
            create: {
              hostname: `${parsed.data.subdomain}.stayro.co`,
              subdomain: parsed.data.subdomain,
              isPrimary: true,
              isCustom: false,
              verificationToken: `${parsed.data.subdomain}-token`,
              status: "VERIFIED",
            },
          },
        },
      })
    : await prisma.property.create({
        data: {
          userId: user.id,
          slug,
          name: parsed.data.name,
          propertyType: parsed.data.propertyType,
          location: parsed.data.location,
          guestCapacity: parsed.data.guestCapacity,
          bedrooms: parsed.data.bedrooms,
          beds: parsed.data.beds,
          bathrooms: parsed.data.bathrooms,
          shortDescription: parsed.data.shortDescription,
          checkInTime: parsed.data.checkInTime,
          checkOutTime: parsed.data.checkOutTime,
          minimumStay: parsed.data.minimumStay,
          houseRules: parsed.data.houseRules,
          petPolicy: parsed.data.petPolicy,
          parkingInfo: parsed.data.parkingInfo,
          wifiInfo: parsed.data.wifiInfo,
          baseNightlyRate: parsed.data.baseNightlyRate,
          cleaningFee: parsed.data.cleaningFee,
          extraGuestFee: parsed.data.extraGuestFee ?? null,
          petFee: parsed.data.petFee ?? null,
          taxNotes: parsed.data.taxNotes ?? null,
          hostEmail: parsed.data.hostEmail,
          cancellationPolicy: parsed.data.cancellationPolicy,
          availabilityBuffer: parsed.data.availabilityBuffer ?? null,
          maxAdvanceBookingWindow: parsed.data.maxAdvanceBookingWindow ?? null,
          importMethod: parsed.data.importMethod,
          importSourceUrl: parsed.data.importSourceUrl || null,
          photos: {
            create: parsed.data.photos.map((photo) => ({
              url: photo.url,
              altText: photo.altText,
              sortOrder: photo.sortOrder,
              isCover: Boolean(photo.isCover),
            })),
          },
          amenities: {
            create: parsed.data.amenities.map((label) => ({ label })),
          },
          themeSettings: {
            create: {
              theme: parsed.data.theme,
              brandColor: parsed.data.brandColor || null,
              logoUrl: parsed.data.logoUrl || null,
              hideBadge: user.subscription?.plan === "PRO",
            },
          },
          generatedContent: {
            create: draftContent,
          },
          domains: {
            create: {
              hostname: `${parsed.data.subdomain}.stayro.co`,
              subdomain: parsed.data.subdomain,
              isPrimary: true,
              isCustom: false,
              verificationToken: `${parsed.data.subdomain}-token`,
              status: "VERIFIED",
            },
          },
        },
      });

  revalidatePath("/dashboard");
  revalidatePath(`/preview/${property.slug}`);
  redirect("/dashboard?generated=1");
}

export async function publishPropertyAction(propertyId: string) {
  const user = await requireCurrentUser();
  const property = await prisma.property.findFirst({
    where: { id: propertyId, userId: user.id },
    include: { domains: true },
  });

  if (!property) {
    return;
  }

  await prisma.property.update({
    where: { id: property.id },
    data: {
      isPublished: true,
      siteStatus: "PUBLISHED",
    },
  });

  await prisma.analyticsEvent.create({
    data: {
      propertyId: property.id,
      path: `/preview/${property.slug}`,
      type: "PUBLISH",
    },
  });

  const primaryDomain = property.domains.find((domain) => domain.isPrimary)?.hostname;

  await sendEmail({
    to: property.hostEmail,
    subject: "Your Stayro site is live",
    html: publishSuccessEmail(
      property.name,
      `${process.env.APP_URL ?? "http://localhost:3000"}/preview/${property.slug}`,
    ),
  });

  revalidatePath("/dashboard");
  revalidatePath(`/preview/${property.slug}`);

  return {
    domain: primaryDomain,
    plan: planDetails[user.subscription?.plan ?? "FREE"],
  };
}

export async function saveCustomDomainAction(formData: FormData) {
  const user = await requireCurrentUser();
  const property = user.properties[0];
  const hostname = String(formData.get("hostname") ?? "").trim().toLowerCase();

  if (!property || !hostname) {
    redirect("/dashboard/settings?error=missing-domain");
  }

  if (user.subscription?.plan !== "PRO") {
    redirect("/dashboard/settings?error=pro-required");
  }

  await prisma.domain.upsert({
    where: { hostname },
    update: {
      propertyId: property.id,
      isCustom: true,
      isPrimary: true,
      status: "PENDING",
      verificationToken: `${hostname.replace(/\./g, "-")}-verify`,
    },
    create: {
      propertyId: property.id,
      hostname,
      isCustom: true,
      isPrimary: true,
      status: "PENDING",
      verificationToken: `${hostname.replace(/\./g, "-")}-verify`,
    },
  });

  revalidatePath("/dashboard/settings");
  redirect("/dashboard/settings?domain_saved=1");
}
