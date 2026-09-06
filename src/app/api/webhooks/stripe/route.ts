import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendRegistrationConfirmation } from "@/lib/email";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured.");
    return NextResponse.json(
      { error: "Webhook configuration error" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.payment_status === "paid") {
          await fulfillRegistration(session);
        }
        break;
      }

      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        await fulfillRegistration(session);
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const registrationId = session.metadata?.registrationId;
        if (registrationId) {
          await prisma.registration.update({
            where: { id: registrationId },
            data: { status: "CANCELLED" },
          });
        }
        break;
      }

      default:
        break;
    }
  } catch (err: any) {
    console.error("Webhook handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

async function fulfillRegistration(session: Stripe.Checkout.Session) {
  const registrationId = session.metadata?.registrationId;
  const userId = session.metadata?.userId;
  const workshopId = session.metadata?.workshopId;

  if (!registrationId || !userId || !workshopId) {
    console.error("Missing metadata in checkout session");
    return;
  }

  // Idempotency check
  const existing = await prisma.registration.findUnique({
    where: { id: registrationId },
  });

  if (existing?.status === "CONFIRMED") {
    console.log(`Registration ${registrationId} already confirmed, skipping.`);
    return;
  }

  // Update registration to CONFIRMED
  const registration = await prisma.registration.update({
    where: { id: registrationId },
    data: {
      status: "CONFIRMED",
      stripePaymentIntentId: session.payment_intent as string,
      amountPaid: session.amount_total,
    },
    include: {
      user: true,
      workshop: true,
    },
  });

  console.log(
    `✅ Registration confirmed: ${registration.user.name} for ${registration.workshop.title}`
  );

  // Send confirmation email
  if (registration.user.email) {
    await sendRegistrationConfirmation({
      to: registration.user.email,
      attendeeName: registration.user.name || "Attendee",
      workshopTitle: registration.workshop.title,
      workshopDate: registration.workshop.date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      workshopLocation: registration.workshop.location,
      confirmationNumber: registration.id.toUpperCase(),
      amountPaid: `$${(registration.amountPaid! / 100).toFixed(2)}`,
    });
  }
}
