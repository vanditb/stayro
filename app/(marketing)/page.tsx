import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Globe, Mail, Sparkles, CalendarRange } from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { Button } from "@/components/ui/button";
import { planDetails } from "@/lib/data/constants";
import { exampleProperties, marketingTestimonials } from "@/lib/data/site";

export default function HomePage() {
  return (
    <div>
      <section className="relative min-h-[100svh] overflow-hidden bg-[#1d140f] text-white">
        <Image
          src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1800&q=80"
          alt="Premium vacation rental interior"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(19,12,10,0.82)_0%,rgba(19,12,10,0.6)_42%,rgba(19,12,10,0.24)_100%)]" />
        <SiteHeader />
        <div className="container-shell relative z-10 flex min-h-[100svh] items-end pb-14 pt-32 md:pb-20">
          <div className="max-w-3xl space-y-7">
            <p className="font-display text-5xl leading-[0.92] tracking-[-0.06em] md:text-[7rem]">
              Stayro
            </p>
            <div className="max-w-2xl space-y-5">
              <h1 className="text-[clamp(2.5rem,5vw,4.25rem)] leading-[0.95]">
                Launch a beautiful direct-booking website for your rental in minutes.
              </h1>
              <p className="max-w-xl text-base leading-7 text-white/78 md:text-lg">
                Paste your Airbnb or Vrbo listing, shape the draft, and publish a premium guest-facing site without building from scratch.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/sign-up">
                <Button className="bg-white text-ink hover:bg-[#f6efe6]">
                  Generate my site
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="secondary" className="border-white/30 bg-white/10 text-white hover:bg-white/15">
                  See demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-[#f2e7da]">
        <div className="container-shell grid gap-6 py-5 text-sm text-muted md:grid-cols-4">
          <p className="text-ink">Small-host direct booking, without a full PMS.</p>
          <p>Generated sites with branded public pages</p>
          <p>Request-to-book workflow with email notifications</p>
          <p>Free subdomain or custom domain on Pro</p>
        </div>
      </section>

      <section className="container-shell grid gap-16 py-20 md:py-28 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <p className="text-4xl md:text-5xl">A focused workflow for hosts with one to five properties.</p>
          <p className="max-w-xl text-base leading-7 text-muted">
            Stayro is not a generic website builder and not a channel manager. It exists to help hosts own their brand, guest leads, and repeat traffic with a site guests actually trust.
          </p>
        </div>
        <div className="grid gap-10 md:grid-cols-2">
          {[
            ["Paste listing", "Start with an Airbnb or Vrbo URL, or switch to manual setup."],
            ["Review details", "Confirm photos, amenities, pricing, rules, and the booking setup."],
            ["Generate site", "Stayro writes the first draft, structures the pages, and shapes the theme."],
            ["Publish and accept requests", "Launch on a Stayro subdomain or connect a custom domain on Pro."],
          ].map(([title, body], index) => (
            <div key={title} className="space-y-3 border-t border-line pt-4">
              <p className="text-sm text-muted">0{index + 1}</p>
              <p className="text-2xl">{title}</p>
              <p className="text-sm leading-6 text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#fcf8f3] py-20 md:py-28">
        <div className="container-shell grid gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-12">
            <div className="space-y-4">
              <p className="text-4xl md:text-5xl">Built around the moments that matter most.</p>
              <p className="max-w-xl text-base leading-7 text-muted">
                Stayro keeps the product narrow on purpose: import a listing, generate a premium site, manage requests, and block dates once approved.
              </p>
            </div>
            <div className="grid gap-6">
              {[
                {
                  icon: Sparkles,
                  title: "AI listing import",
                  body: "Turn structured listing details into usable site copy and section layouts.",
                },
                {
                  icon: Globe,
                  title: "Beautiful site generation",
                  body: "Create a direct-booking property site that feels closer to boutique hospitality than a template marketplace.",
                },
                {
                  icon: Mail,
                  title: "Booking request workflow",
                  body: "Receive guest requests, review them in one inbox, and approve or decline with status emails.",
                },
                {
                  icon: CalendarRange,
                  title: "Calendar sync and blocking",
                  body: "Import iCal availability, prevent conflicts, and auto-block approved dates.",
                },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="grid gap-3 border-t border-line pt-4 md:grid-cols-[32px_1fr]">
                  <Icon className="mt-1 h-5 w-5 text-accent" />
                  <div className="space-y-2">
                    <p className="text-xl">{title}</p>
                    <p className="text-sm leading-6 text-muted">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px]">
              <Image
                src="https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1400&q=80"
                alt="Refined living room in a vacation rental"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
            <div className="space-y-4 rounded-[28px] bg-[#241915] p-8 text-white">
              <p className="text-3xl">Own the guest journey from first visit to booking request.</p>
              <p className="text-sm leading-7 text-white/72">
                Keep your own brand, email capture, repeat guest traffic, and a cleaner approval process without bolting together a dozen tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-20 md:py-28">
        <div className="grid gap-8 md:grid-cols-3">
          {exampleProperties.map((property) => (
            <div key={property.name} className="space-y-4">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[24px]">
                <Image src={property.image} alt={property.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl">{property.name}</p>
                <p className="text-sm text-muted">{property.location} • {property.theme}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f2e7da] py-20 md:py-24">
        <div className="container-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <p className="text-4xl">Hosts use Stayro to look more established on day one.</p>
            <p className="max-w-md text-base leading-7 text-muted">
              A few early examples of what a polished direct-booking presence can unlock for small hosts.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {marketingTestimonials.map((item) => (
              <div key={item.name} className="space-y-4 border-t border-line pt-4">
                <p className="text-base leading-7 text-ink">“{item.quote}”</p>
                <div className="text-sm text-muted">
                  <p className="font-semibold text-ink">{item.name}</p>
                  <p>{item.role}</p>
                  <p className="mt-3 text-ink">{item.result}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-2">
          {(["FREE", "PRO"] as const).map((key) => (
            <div key={key} className="rounded-[26px] border border-line bg-[#fcf8f3] p-8">
              <p className="text-3xl">{planDetails[key].name}</p>
              <p className="mt-3 text-sm text-muted">{planDetails[key].description}</p>
              <p className="mt-8 text-5xl">{planDetails[key].price}</p>
              <ul className="mt-8 space-y-3 text-sm text-muted">
                {planDetails[key].features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-accent" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href={key === "FREE" ? "/sign-up" : "/pricing"} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                {key === "FREE" ? "Start free" : "See Pro details"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell py-20 md:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <p className="text-4xl">FAQ</p>
            <p className="max-w-md text-base leading-7 text-muted">
              Everything a host usually wants to know before trying the first site.
            </p>
          </div>
          <div className="space-y-6">
            {[
              ["Do I need to code?", "No. Stayro is built for hosts, not developers. You paste a listing or fill in your property details, review the draft, and publish."],
              ["Can I use my own domain?", "Yes. Stayro Pro supports custom domains. Free sites publish to a Stayro subdomain."],
              ["How do booking requests work?", "Guests request dates from your site. You review each request, approve or decline it, and Stayro sends the status email."],
              ["Can I sync my calendar?", "Yes. The MVP supports iCal import and blocks approved dates to help prevent conflicts."],
              ["Can I edit the site after generation?", "Yes. The editor is section-based, so you can revise content, amenities, FAQs, and images without rebuilding from scratch."],
              ["What happens on the free plan?", "You get one property draft, a Stayro subdomain, the booking request form, and core notifications without adding payment details."],
            ].map(([question, answer]) => (
              <div key={question} className="border-t border-line pt-4">
                <p className="text-xl">{question}</p>
                <p className="mt-2 text-sm leading-7 text-muted">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#231813] py-20 text-white">
        <div className="container-shell flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <p className="text-5xl">Build your rental’s direct-booking home.</p>
            <p className="max-w-xl text-base leading-7 text-white/72">
              A polished website, a simple inbox, and a calm workflow for hosts who want more control over their bookings.
            </p>
          </div>
          <Link href="/sign-up">
            <Button className="bg-white text-ink hover:bg-[#f6efe6]">Generate my site</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
