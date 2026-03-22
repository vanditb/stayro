import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/billing/stripe";
import { billingUpgradeEmail } from "@/lib/email/templates";
import { sendEmail } from "@/lib/email/send";

export async function POST(request: Request) {
  const stripe = getStripe();
  const signature = (await headers()).get("stripe-signature");

  if (!stripe || !signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ ok: true });
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.customer_email) {
      const user = await prisma.user.findUnique({
        where: { email: session.customer_email },
        include: { subscription: true },
      });

      if (user) {
        await prisma.subscription.upsert({
          where: { userId: user.id },
          update: {
            plan: "PRO",
            status: "active",
            stripeCustomerId: String(session.customer),
            stripeSubscriptionId: String(session.subscription),
          },
          create: {
            userId: user.id,
            plan: "PRO",
            status: "active",
            stripeCustomerId: String(session.customer),
            stripeSubscriptionId: String(session.subscription),
          },
        });

        await sendEmail({
          to: user.email,
          subject: "Your Stayro Pro plan is active",
          html: billingUpgradeEmail(),
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
