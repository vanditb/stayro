import { blockDateAction, unblockDateAction } from "@/lib/actions/bookings";
import { requireCurrentUser } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function CalendarPage() {
  const user = await requireCurrentUser();
  const property = user.properties[0];

  return (
    <div className="p-5 md:p-8">
      <div className="space-y-3">
        <h1 className="text-4xl">Calendar</h1>
        <p className="text-sm leading-6 text-muted">
          Manual blocks and approved requests both feed this availability view. Imported iCal dates also land here once synced.
        </p>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="panel p-5">
          <p className="text-2xl">Block dates</p>
          <form action={blockDateAction} className="mt-5 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input type="date" name="date" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Note</label>
              <Input name="note" placeholder="Owner stay, maintenance, buffer..." />
            </div>
            <Button type="submit">Block date</Button>
          </form>
        </section>

        <section className="panel p-5">
          <p className="text-2xl">Blocked dates</p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-muted">
                <tr>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Source</th>
                  <th className="pb-3 font-medium">Note</th>
                  <th className="pb-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {property?.blockedDates.map((item) => (
                  <tr key={item.id} className="border-t border-line">
                    <td className="py-3">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="py-3 capitalize text-muted">{item.source.replace("_", " ")}</td>
                    <td className="py-3 text-muted">{item.note ?? "Unavailable"}</td>
                    <td className="py-3 text-right">
                      <form action={async () => {
                        "use server";
                        await unblockDateAction(item.id);
                      }}>
                        <Button type="submit" variant="ghost">Unblock</Button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
