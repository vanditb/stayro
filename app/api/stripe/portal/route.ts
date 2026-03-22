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

  if (!stripe) {
    return NextResponse.redirect(new URL("/dashboard/billing", process.env.APP_URL ?? "http://localhost:3000"));
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (!subscription?.stripeCustomerId) {
    return NextResponse.redirect(new URL("/dashboard/billing", process.env.APP_URL ?? "http://localhost:3000"));
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${process.env.APP_URL ?? "http://localhost:3000"}/dashboard/billing`,
  });

  return NextResponse.redirect(portal.url);
}
