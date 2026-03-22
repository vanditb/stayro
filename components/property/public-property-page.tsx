import Image from "next/image";
import Link from "next/link";
import { MapPin, BedDouble, Bath, Users, Wifi, PawPrint, CarFront } from "lucide-react";
import { BookingRequestForm } from "@/components/property/booking-request-form";
import { formatCurrency } from "@/lib/utils";

type PublicPropertyPageProps = {
  property: any;
  preview?: boolean;
};

export function PublicPropertyPage({
  property,
  preview = false,
}: PublicPropertyPageProps) {
  const cover = property.photos.find((photo: any) => photo.isCover) ?? property.photos[0];
  const blockedDates = property.blockedDates.map((item: any) =>
    typeof item.date === "string" ? item.date : item.date.toISOString(),
  );
  const brandColor = property.themeSettings?.brandColor ?? "#8f5a2c";

  return (
    <div className="bg-[#f8f2ec] text-ink">
      <section className="relative min-h-[92svh] overflow-hidden">
        <Image
          src={cover.url}
          alt={cover.altText}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,11,9,0.72)_0%,rgba(17,11,9,0.58)_40%,rgba(17,11,9,0.1)_100%)]" />
        <div className="relative z-10 flex min-h-[92svh] flex-col">
          <header className="container-shell flex items-center justify-between py-6 text-white">
            <Link href="/" className="font-display text-3xl tracking-[-0.06em]">
              Stayro
            </Link>
            <div className="text-right text-sm text-white/80">
              {preview ? "Preview mode" : "Direct booking"}
            </div>
          </header>
          <div className="container-shell flex flex-1 items-end pb-14 pt-12 md:pb-20">
            <div className="max-w-2xl space-y-6 text-white">
              <p className="font-display text-[clamp(3rem,8vw,6.8rem)] leading-[0.94]">
                {property.generatedContent?.heroHeadline ?? property.name}
              </p>
              <p className="max-w-xl text-base leading-7 text-white/82 md:text-lg">
                {property.generatedContent?.heroIntro ?? property.shortDescription}
              </p>
              <div className="flex flex-wrap items-center gap-5 text-sm text-white/80">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {property.location}
                </span>
                <span>From {formatCurrency(property.baseNightlyRate)}/night</span>
              </div>
              <a
                href="#booking"
                className="inline-flex rounded-lg px-5 py-3 text-sm font-semibold text-white"
                style={{ backgroundColor: brandColor }}
              >
                Check availability
              </a>
            </div>
          </div>
        </div>
      </section>

      <main className="container-shell space-y-20 py-12 md:py-20">
        <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="max-w-3xl text-4xl leading-tight md:text-5xl">
              {property.name}
            </p>
            <p className="max-w-2xl text-base leading-7 text-muted md:text-lg">
              {property.generatedContent?.stayDescription ?? property.shortDescription}
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="panel p-4">
                <Users className="h-5 w-5 text-accent" />
                <p className="mt-3 text-sm text-muted">Sleeps</p>
                <p className="mt-1 text-lg font-semibold text-ink">{property.guestCapacity}</p>
              </div>
              <div className="panel p-4">
                <BedDouble className="h-5 w-5 text-accent" />
                <p className="mt-3 text-sm text-muted">Bedrooms</p>
                <p className="mt-1 text-lg font-semibold text-ink">{property.bedrooms}</p>
              </div>
              <div className="panel p-4">
                <Bath className="h-5 w-5 text-accent" />
                <p className="mt-3 text-sm text-muted">Bathrooms</p>
                <p className="mt-1 text-lg font-semibold text-ink">{property.bathrooms}</p>
              </div>
              <div className="panel p-4">
                <Wifi className="h-5 w-5 text-accent" />
                <p className="mt-3 text-sm text-muted">Wi-Fi</p>
                <p className="mt-1 text-lg font-semibold text-ink">Included</p>
              </div>
            </div>
          </div>
          <div id="booking">
            <BookingRequestForm
              slug={property.slug}
              baseNightlyRate={property.baseNightlyRate}
              cleaningFee={property.cleaningFee}
              extraGuestFee={property.extraGuestFee}
              blockedDates={blockedDates}
            />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-[1.35fr_0.65fr]">
          <div className="grid gap-4">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
              <Image src={cover.url} alt={cover.altText} fill className="object-cover" sizes="(max-width: 768px) 100vw, 66vw" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {property.photos.slice(1, 3).map((photo: any) => (
                <div key={photo.id} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image src={photo.url} alt={photo.altText} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <div>
              <p className="text-sm text-muted">Top amenities</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {property.amenities.slice(0, 8).map((amenity: any) => (
                  <span key={amenity.id} className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink">
                    {amenity.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-3 text-sm leading-7 text-muted">
              <p>{property.generatedContent?.amenitiesCopy ?? property.shortDescription}</p>
              <div className="flex items-start gap-3">
                <CarFront className="mt-1 h-4 w-4 text-accent" />
                <span>{property.parkingInfo}</span>
              </div>
              <div className="flex items-start gap-3">
                <PawPrint className="mt-1 h-4 w-4 text-accent" />
                <span>{property.petPolicy}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <p className="text-4xl">{property.generatedContent?.sectionHeadings?.location ?? "What’s nearby"}</p>
            <p className="text-base leading-7 text-muted">
              {property.generatedContent?.neighborhoodHighlights}
            </p>
            <div className="rounded-2xl border border-line bg-[#efe3d4] p-5 text-sm leading-7 text-muted">
              Scenic coastline, local dining, morning coffee stops, and an easy arrival for guests driving in from Monterey or San Jose.
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-line bg-white">
            <div className="aspect-[16/10] bg-[linear-gradient(135deg,#d9c2a7_0%,#f4ebe0_100%)] p-8">
              <div className="h-full rounded-2xl border border-white/60 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center" />
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="text-4xl">{property.generatedContent?.sectionHeadings?.reviews ?? "Guest notes"}</p>
            <div className="space-y-4">
              {property.reviews.map((review: any) => (
                <div key={review.id} className="panel p-5">
                  <p className="text-base leading-7 text-ink">“{review.body}”</p>
                  <p className="mt-4 text-sm text-muted">
                    {review.guestName}
                    {review.location ? `, ${review.location}` : ""}
                    {review.stayMonth ? ` • ${review.stayMonth}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <p className="text-4xl">Stay details</p>
            <div className="panel p-5">
              <div className="grid gap-4 text-sm leading-7 text-muted">
                <div>
                  <p className="font-semibold text-ink">Check-in / Check-out</p>
                  <p>{property.checkInTime} / {property.checkOutTime}</p>
                </div>
                <div>
                  <p className="font-semibold text-ink">House rules</p>
                  <p>{property.generatedContent?.houseRulesSummary ?? property.houseRules}</p>
                </div>
                <div>
                  <p className="font-semibold text-ink">Policies</p>
                  <p>{property.cancellationPolicy}</p>
                </div>
              </div>
            </div>
            <div className="panel p-5">
              <p className="font-semibold text-ink">FAQs</p>
              <div className="mt-4 space-y-4">
                {property.faqItems.map((faq: any) => (
                  <div key={faq.id}>
                    <p className="font-medium text-ink">{faq.question}</p>
                    <p className="mt-1 text-sm leading-6 text-muted">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] bg-[#201611] px-6 py-10 text-white md:px-10">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div className="space-y-3">
              <p className="text-4xl">Questions before you request?</p>
              <p className="max-w-2xl text-base leading-7 text-white/72">
                Contact the host directly at {property.hostEmail}. Published with Stayro.
              </p>
            </div>
            <div className="space-y-2 text-sm text-white/72">
              <Link href="/terms">Booking terms</Link>
              <br />
              <Link href="/privacy">Privacy</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
