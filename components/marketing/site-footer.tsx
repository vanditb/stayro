import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-[#f1e6d9]">
      <div className="container-shell grid gap-10 py-14 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="space-y-3">
          <Link href="/" className="font-display text-3xl font-semibold tracking-[-0.06em]">
            Stayro
          </Link>
          <p className="max-w-sm text-sm leading-6 text-muted">
            Launch a beautiful direct-booking website for your rental in minutes.
          </p>
        </div>
        <div className="space-y-3 text-sm text-muted">
          <p className="font-semibold text-ink">Product</p>
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/demo">Demo</Link>
        </div>
        <div className="space-y-3 text-sm text-muted">
          <p className="font-semibold text-ink">Company</p>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <a href="mailto:support@stayro.co">Support</a>
        </div>
        <div className="space-y-3 text-sm text-muted">
          <p className="font-semibold text-ink">Social</p>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="https://x.com" target="_blank" rel="noreferrer">
            X
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
