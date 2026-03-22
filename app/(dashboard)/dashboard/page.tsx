import Link from "next/link";
import { requireCurrentUser } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/data/queries";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { publishPropertyAction } from "@/lib/actions/property";

export default async function DashboardPage() {
  const user = await requireCurrentUser();
  const data = await getDashboardData(user.id);

  if (!data) {
    return (
      <div className="p-8">
        <p className="text-3xl">Start your first property</p>
        <p className="mt-2 text-sm text-muted">You haven’t created a property yet.</p>
        <Link href="/onboarding" className="mt-6 inline-block">
          <Button>Create property</Button>
        </Link>
      </div>
    );
  }

  const { property, stats } = data;

  return (
    <div className="p-5 md:p-8">
      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl">Overview</h1>
            <p className="text-sm leading-6 text-muted">
              Monitor your site status, recent guest requests, and the basics of direct-booking performance.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="panel p-5">
              <p className="text-sm text-muted">Plan</p>
              <p className="mt-2 text-2xl">{user.subscription?.plan ?? "FREE"}</p>
            </div>
            <div className="panel p-5">
              <p className="text-sm text-muted">Site visits</p>
              <p className="mt-2 text-2xl">{formatNumber(stats.pageViews)}</p>
            </div>
            <div className="panel p-5">
              <p className="text-sm text-muted">Requests</p>
              <p className="mt-2 text-2xl">{formatNumber(stats.requests)}</p>
            </div>
            <div className="panel p-5">
              <p className="text-sm text-muted">Approval rate</p>
              <p className="mt-2 text-2xl">{stats.conversionRate}%</p>
            </div>
          </div>

          <div className="panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <p className="text-2xl">{property.name}</p>
                <p className="text-sm text-muted">{property.location}</p>
              </div>
              <Badge tone={property.isPublished ? "success" : "warn"}>
                {property.isPublished ? "Published" : "Draft"}
              </Badge>
            </div>
            <div className="grid gap-6 px-5 py-5 md:grid-cols-[1fr_auto] md:items-end">
              <div className="space-y-3">
                <p className="text-sm text-muted">
                  Starting from {formatCurrency(property.baseNightlyRate)}/night with a {formatCurrency(property.cleaningFee)} cleaning fee.
                </p>
                <p className="text-sm leading-6 text-muted">
                  Primary domain: {property.domains[0]?.hostname ?? `${property.slug}.stayro.co`}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href={`/preview/${property.slug}`}>
                  <Button variant="secondary">View preview</Button>
                </Link>
                <form action={async () => {
                  "use server";
                  await publishPropertyAction(property.id);
                }}>
                  <Button type="submit">{property.isPublished ? "Republish" : "Publish site"}</Button>
                </form>
              </div>
            </div>
          </div>

          <div className="panel p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl">Recent booking requests</p>
                <p className="mt-1 text-sm text-muted">The latest guest activity across your direct-booking site.</p>
              </div>
              <Link href="/dashboard/bookings" className="text-sm font-semibold text-accent">
                Open inbox
              </Link>
            </div>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="text-muted">
                  <tr>
                    <th className="pb-3 font-medium">Guest</th>
                    <th className="pb-3 font-medium">Dates</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Estimate</th>
                  </tr>
                </thead>
                <tbody>
                  {property.bookingRequests.slice(0, 4).map((request) => (
                    <tr key={request.id} className="border-t border-line">
                      <td className="py-3">{request.guestName}</td>
                      <td className="py-3 text-muted">
                        {new Date(request.checkIn).toLocaleDateString()} - {new Date(request.checkOut).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        <Badge tone={request.status === "APPROVED" ? "success" : request.status === "PENDING" ? "warn" : "default"}>
                          {request.status.toLowerCase()}
                        </Badge>
                      </td>
                      <td className="py-3">{formatCurrency(request.estimatedTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="panel p-5">
            <p className="text-2xl">Next actions</p>
            <div className="mt-4 space-y-4 text-sm leading-6 text-muted">
              <p>Review the generated copy and site sections in the editor.</p>
              <p>Approve or decline new requests from the booking inbox.</p>
              <p>Keep your blocked dates current before promoting the direct-booking link.</p>
            </div>
          </div>
          <div className="panel p-5">
            <p className="text-2xl">Traffic snapshot</p>
            <div className="mt-5 space-y-4">
              {[
                { label: "Homepage", value: 72 },
                { label: "Availability", value: 48 },
                { label: "Gallery", value: 31 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="text-muted">{item.value}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-[#eadfce]">
                    <div className="h-2 rounded-full bg-accent" style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
