import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DemoPage() {
  return (
    <main className="container-shell py-16 md:py-24">
      <div className="max-w-3xl space-y-4">
        <Link href="/" className="text-sm text-muted">
          Back to Stayro
        </Link>
        <h1 className="text-5xl">See a generated Stayro property site.</h1>
        <p className="text-base leading-7 text-muted">
          Oceancrest House is the seeded demo property inside the MVP. It includes generated copy, guest reviews, a booking request flow, and host-side availability management.
        </p>
      </div>
      <div className="mt-10 rounded-[28px] border border-line bg-[#fcf8f3] p-8">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div className="space-y-4">
            <p className="text-3xl">Oceancrest House</p>
            <p className="max-w-2xl text-sm leading-7 text-muted">
              A premium coastal rental in Carmel-by-the-Sea, preloaded with realistic photos, FAQs, reviews, blocked dates, and mixed-status booking requests.
            </p>
          </div>
          <Link href="/preview/oceancrest-house">
            <Button>Open demo property</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
