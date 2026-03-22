import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/billing/stripe";

export async function POST() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/sign-in", process.env.APP_URL ?? "http://localhost:3000"));
  }

  const stripe = getStripe();

  if (!stripe || !process.env.STRIPE_PRO_PRICE_ID) {
    return NextResponse.redirect(new URL("/dashboard/billing", process.env.APP_URL ?? "http://localhost:3000"));
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  });

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: user?.subscription?.stripeCustomerId ?? undefined,
    customer_email: user?.email,
    line_items: [
      {
        price: process.env.STRIPE_PRO_PRICE_ID,
        quantity: 1,
      },
    ],
    success_url: `${process.env.APP_URL ?? "http://localhost:3000"}/dashboard/billing?upgraded=1`,
    cancel_url: `${process.env.APP_URL ?? "http://localhost:3000"}/dashboard/billing`,
  });

  return NextResponse.redirect(checkout.url ?? `${process.env.APP_URL ?? "http://localhost:3000"}/dashboard/billing`);
}
