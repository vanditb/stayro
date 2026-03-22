import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="container-shell flex items-center justify-between py-5 text-white">
        <Link href="/" className="font-display text-3xl font-semibold tracking-[-0.06em]">
          Stayro
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-white/82 md:flex">
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/demo">Demo</Link>
          <Link href="/sign-in">Sign in</Link>
        </nav>
        <Link href="/sign-up">
          <Button className="bg-white text-ink hover:bg-[#f6efe6]">Generate my site</Button>
        </Link>
      </div>
    </header>
  );
}
