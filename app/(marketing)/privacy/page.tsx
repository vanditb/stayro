import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="container-shell py-16 md:py-24">
      <div className="max-w-4xl space-y-6">
        <Link href="/" className="text-sm text-muted">
          Back to Stayro
        </Link>
        <h1 className="text-5xl">Privacy Policy</h1>
        <div className="space-y-5 text-sm leading-7 text-muted">
          <p>Stayro collects account details, property content, booking requests, analytics events, and basic operational metadata needed to run direct-booking websites for hosts.</p>
          <p>Hosts are responsible for the accuracy of their listing content, house rules, pricing, and guest-facing policies. Stayro processes guest inquiry data only to deliver booking requests, notifications, and dashboard records.</p>
          <p>We use third-party services such as Stripe for billing, Resend for email delivery, and OpenAI for optional content generation. Each provider handles data according to its own terms.</p>
          <p>If you need account deletion or data export support, contact support@stayro.co.</p>
        </div>
      </div>
    </main>
  );
}
