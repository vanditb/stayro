import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { AuthFormSubmit } from "@/components/forms/auth-form-submit";
import { Input } from "@/components/ui/input";

async function loginAction(formData: FormData) {
  "use server";

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/sign-in?error=invalid");
    }

    throw error;
  }

  redirect("/dashboard");
}

const errorMessages: Record<string, string> = {
  invalid: "That email/password combination didn’t work.",
};

export default async function SignInPage({
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
          <h1 className="text-5xl">Sign in to your host dashboard.</h1>
          <p className="max-w-lg text-base leading-7 text-muted">
            Demo account after seeding: <span className="font-semibold text-ink">demo@stayro.co</span> with password <span className="font-semibold text-ink">stayro-demo</span>.
          </p>
        </div>
      </div>
      <div className="panel p-6 md:p-8">
        <form action={loginAction} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-[#e2c5bb] bg-[#fff2ee] px-4 py-3 text-sm text-danger">
              {errorMessages[error] ?? "We couldn’t sign you in."}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input name="password" type="password" required />
          </div>
          <AuthFormSubmit label="Sign in" />
        </form>
        <p className="mt-4 text-sm text-muted">
          Need an account?{" "}
          <Link href="/sign-up" className="font-semibold text-accent">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
