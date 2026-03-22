"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarRange, Mail, CreditCard, Settings, PencilLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/bookings", label: "Booking inbox", icon: Mail },
  { href: "/dashboard/calendar", label: "Calendar", icon: CalendarRange },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/onboarding", label: "Editor", icon: PencilLine },
];

export function AppShell({
  children,
  propertyName,
  plan,
}: {
  children: React.ReactNode;
  propertyName: string;
  plan: string;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f6efe7]">
      <div className="mx-auto grid min-h-screen max-w-[1440px] md:grid-cols-[248px_minmax(0,1fr)]">
        <aside className="border-r border-line bg-[#f2e8dc] px-5 py-6">
          <div className="space-y-1">
            <Link href="/" className="font-display text-3xl tracking-[-0.06em]">
              Stayro
            </Link>
            <p className="text-sm text-muted">{propertyName}</p>
          </div>
          <div className="mt-5">
            <Badge tone={plan === "PRO" ? "success" : "default"}>
              {plan === "PRO" ? "Pro plan" : "Free plan"}
            </Badge>
          </div>
          <nav className="mt-10 space-y-1">
            {nav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted transition hover:bg-white hover:text-ink",
                  pathname === href && "bg-white text-ink",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
