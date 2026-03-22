import Link from "next/link";
import { registerUserAction } from "@/lib/actions/auth";
import { AuthFormSubmit } from "@/components/forms/auth-form-submit";
import { Input } from "@/components/ui/input";

export default function SignUpPage() {
  return (
    <main className="container-shell grid min-h-screen items-center py-16 md:grid-cols-[1fr_440px]">
      <div className="space-y-6 pr-0 md:pr-16">
        <Link href="/" className="font-display text-4xl tracking-[-0.06em]">
          Stayro
        </Link>
        <div className="space-y-4">
          <h1 className="text-5xl">Create your host account.</h1>
          <p className="max-w-lg text-base leading-7 text-muted">
            Start on the free plan, generate your first property draft, and upgrade to Pro only when you’re ready to publish live.
          </p>
        </div>
      </div>
      <div className="panel p-6 md:p-8">
        <form action={registerUserAction} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full name</label>
            <Input name="name" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input name="password" type="password" required />
          </div>
          <AuthFormSubmit label="Create account" />
        </form>
        <p className="mt-4 text-sm text-muted">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-semibold text-accent">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
