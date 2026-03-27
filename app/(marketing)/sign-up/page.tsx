import Link from "next/link";
import { registerUserAction } from "@/lib/actions/auth";
import { AuthFormSubmit } from "@/components/forms/auth-form-submit";
import { Input } from "@/components/ui/input";

const errorMessages: Record<string, string> = {
  invalid: "Please check your name, email, and password.",
  exists: "An account with that email already exists.",
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

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
          {error && (
            <div className="rounded-lg border border-[#e2c5bb] bg-[#fff2ee] px-4 py-3 text-sm text-danger">
              {errorMessages[error] ?? "We couldn’t create your account."}
            </div>
          )}
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
