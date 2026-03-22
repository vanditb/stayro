import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="container-shell py-16 md:py-24">
      <div className="max-w-4xl space-y-6">
        <Link href="/" className="text-sm text-muted">
          Back to Stayro
        </Link>
        <h1 className="text-5xl">Terms of Service</h1>
        <div className="space-y-5 text-sm leading-7 text-muted">
          <p>Stayro provides software for creating and managing direct-booking websites for short-term rentals. It is not a property management system, channel manager, or guest payment processor in this MVP.</p>
          <p>Hosts remain responsible for guest screening, booking approval decisions, taxes, insurance, local compliance, and the final terms they communicate to guests.</p>
          <p>Pro subscriptions are billed monthly through Stripe and can be managed through the Stripe customer portal. Free accounts do not require payment details.</p>
          <p>By using Stayro, you agree not to upload unlawful content, misuse guest contact data, or interfere with the service.</p>
        </div>
      </div>
    </main>
  );
}
