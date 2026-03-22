import { requireCurrentUser } from "@/lib/auth/session";
import { saveCustomDomainAction } from "@/lib/actions/property";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function SettingsPage() {
  const user = await requireCurrentUser();
  const property = user.properties[0];
  const customDomain = property?.domains.find((domain) => domain.isCustom);

  return (
    <div className="p-5 md:p-8">
      <div className="space-y-3">
        <h1 className="text-4xl">Settings</h1>
        <p className="text-sm leading-6 text-muted">
          Update host contact details, manage your public domains, and confirm how Stayro should handle notifications.
        </p>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-2">
        <section className="panel p-6">
          <p className="text-2xl">Host contact</p>
          <div className="mt-5 space-y-3 text-sm text-muted">
            <p>{user.name}</p>
            <p>{user.email}</p>
            <p>{property?.hostEmail ?? user.email}</p>
          </div>
        </section>

        <section className="panel p-6">
          <p className="text-2xl">Domain settings</p>
          <div className="mt-5 space-y-3 text-sm leading-6 text-muted">
            <p>Stayro subdomain: {property?.domains.find((domain) => !domain.isCustom)?.hostname ?? "Not set"}</p>
            <p>Custom domain status: {customDomain?.status.toLowerCase() ?? "not connected"}</p>
          </div>
          <form action={saveCustomDomainAction} className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Custom domain</label>
              <Input name="hostname" placeholder="stay.example.com" defaultValue={customDomain?.hostname ?? ""} />
            </div>
            <Button type="submit">Save custom domain</Button>
          </form>
        </section>
      </div>
    </div>
  );
}
