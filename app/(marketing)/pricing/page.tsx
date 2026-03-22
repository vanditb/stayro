import Link from "next/link";
import { Check } from "lucide-react";
import { planDetails } from "@/lib/data/constants";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  return (
    <main className="container-shell py-16 md:py-24">
      <div className="max-w-3xl space-y-4">
        <Link href="/" className="text-sm text-muted">
          Back to Stayro
        </Link>
        <h1 className="text-5xl">Simple pricing for one premium property site.</h1>
        <p className="text-base leading-7 text-muted">
          Only two plans. Start free without entering a card, then upgrade to Pro when you’re ready to publish live and connect your own domain.
        </p>
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {(["FREE", "PRO"] as const).map((key) => (
          <div key={key} className="rounded-[26px] border border-line bg-[#fcf8f3] p-8">
            <p className="text-3xl">{planDetails[key].name}</p>
            <p className="mt-2 text-sm text-muted">{planDetails[key].description}</p>
            <p className="mt-8 text-5xl">{planDetails[key].price}</p>
            <ul className="mt-8 space-y-3 text-sm text-muted">
              {planDetails[key].features.map((feature) => (
                <li key={feature} className="flex gap-3">
                  <Check className="mt-0.5 h-4 w-4 text-accent" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="/sign-up" className="mt-8 inline-block">
              <Button variant={key === "PRO" ? "primary" : "secondary"}>
                {key === "PRO" ? "Start Pro trial setup" : "Start free"}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
