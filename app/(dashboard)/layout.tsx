import { AppShell } from "@/components/dashboard/app-shell";
import { requireCurrentUser } from "@/lib/auth/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireCurrentUser();
  const property = user.properties[0];

  return (
    <AppShell
      propertyName={property?.name ?? "Your property"}
      plan={user.subscription?.plan ?? "FREE"}
    >
      {children}
    </AppShell>
  );
}
