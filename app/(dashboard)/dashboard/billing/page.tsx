import { requireCurrentUser } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { planDetails } from "@/lib/data/constants";

export default async function BillingPage() {
  const user = await requireCurrentUser();
  const plan = user.subscription?.plan ?? "FREE";

  return (
    <div className="p-5 md:p-8">
      <div className="space-y-3">
        <h1 className="text-4xl">Billing</h1>
        <p className="text-sm leading-6 text-muted">
          Manage your Stayro plan, upgrade to Pro for custom domains, and open the Stripe customer portal when billing is configured.
        </p>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {(["FREE", "PRO"] as const).map((key) => (
          <div key={key} className="panel p-6">
            <p className="text-3xl">{planDetails[key].name}</p>
            <p className="mt-2 text-sm text-muted">{planDetails[key].description}</p>
            <p className="mt-8 text-4xl">{planDetails[key].price}</p>
            <ul className="mt-6 space-y-3 text-sm text-muted">
              {planDetails[key].features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            {key === "PRO" ? (
              <form action="/api/stripe/checkout" method="post" className="mt-8">
                <Button type="submit" disabled={plan === "PRO"}>
                  {plan === "PRO" ? "Current plan" : "Upgrade to Pro"}
                </Button>
              </form>
            ) : (
              <Button variant="secondary" className="mt-8" disabled={plan === "FREE"}>
                {plan === "FREE" ? "Current plan" : "Downgrade to Free"}
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 panel p-6">
        <p className="text-2xl">Stripe portal</p>
        <p className="mt-2 text-sm leading-6 text-muted">
          If Stripe is configured, you can open the hosted customer portal to manage payment methods and subscription details.
        </p>
        <form action="/api/stripe/portal" method="post" className="mt-5">
          <Button type="submit" variant="secondary">Open customer portal</Button>
        </form>
      </div>
    </div>
  );
}
