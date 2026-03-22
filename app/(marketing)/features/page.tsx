import Link from "next/link";

export default function FeaturesPage() {
  return (
    <main className="container-shell py-16 md:py-24">
      <div className="max-w-3xl space-y-4">
        <Link href="/" className="text-sm text-muted">
          Back to Stayro
        </Link>
        <h1 className="text-5xl">Features shaped for direct-booking hosts.</h1>
        <p className="text-base leading-7 text-muted">
          Stayro focuses on what a small host actually needs to launch a clean guest-facing presence and manage requests without a bulky operating system.
        </p>
      </div>
      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {[
          ["AI-assisted onboarding", "Paste an Airbnb or Vrbo listing URL or enter property details manually, then generate structured copy and page sections."],
          ["Public property websites", "Publish image-led direct-booking pages with amenities, reviews, FAQs, policies, and a request-to-book form."],
          ["Booking inbox", "Review new requests, approve or decline them manually, and keep the workflow clear for both host and guest."],
          ["Availability management", "Import iCal feeds, mark dates blocked, and auto-block approved bookings."],
          ["Domain control", "Use a free Stayro subdomain or connect your own custom domain on Pro."],
          ["Basic analytics", "Track visits, request volume, approvals, and top traffic pages without adding a separate analytics tool."],
        ].map(([title, body]) => (
          <div key={title} className="border-t border-line pt-5">
            <h2 className="text-3xl">{title}</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted">{body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
