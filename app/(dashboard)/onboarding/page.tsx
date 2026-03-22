import { requireCurrentUser } from "@/lib/auth/session";
import { OnboardingFlow } from "@/components/dashboard/onboarding-flow";

export default async function OnboardingPage() {
  const user = await requireCurrentUser();
  const property = user.properties[0] ?? null;

  return (
    <div className="p-5 md:p-8">
      <div className="mb-8 max-w-3xl space-y-3">
        <h1 className="text-4xl">Property setup and editor</h1>
        <p className="text-sm leading-6 text-muted">
          Move quickly through the core property details, then let Stayro generate a polished guest-facing first draft you can keep refining.
        </p>
      </div>
      <OnboardingFlow property={property} />
    </div>
  );
}
