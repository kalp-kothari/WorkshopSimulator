import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { workshopId } = await req.json();

    if (!workshopId) {
      return NextResponse.json(
        { error: "Workshop ID is required" },
        { status: 400 }
      );
    }

    // Fetch workshop details
    const workshop = await prisma.workshop.findUnique({
      where: { id: workshopId },
    });

    if (!workshop) {
      return NextResponse.json(
        { error: "Workshop not found" },
        { status: 404 }
      );
    }

    // Check capacity
    const registrationCount = await prisma.registration.count({
      where: {
        workshopId,
        status: "CONFIRMED",
      },
    });

    if (registrationCount >= workshop.capacity) {
      return NextResponse.json(
        { error: "Workshop is full" },
        { status: 409 }
      );
    }

    // Check for existing registration
    const existingRegistration = await prisma.registration.findUnique({
      where: {
        userId_workshopId: {
          userId: session.user.id,
          workshopId,
        },
      },
    });

    if (existingRegistration?.status === "CONFIRMED") {
      return NextResponse.json(
        { error: "You are already registered for this workshop" },
        { status: 409 }
      );
    }

    // Create or update registration as PENDING
    const registration = await prisma.registration.upsert({
      where: {
        userId_workshopId: {
          userId: session.user.id,
          workshopId,
        },
      },
      update: { status: "PENDING" },
      create: {
        userId: session.user.id,
        workshopId,
        status: "PENDING",
      },
    });

    const origin =
      req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL;

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: workshop.title,
              description: workshop.description.substring(0, 200),
            },
            unit_amount: workshop.price,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/workshop/${workshopId}`,
      customer_email: session.user.email || undefined,
      metadata: {
        userId: session.user.id,
        workshopId,
        registrationId: registration.id,
      },
    });

    // Store the Stripe session ID on the registration
    await prisma.registration.update({
      where: { id: registration.id },
      data: { stripeSessionId: checkoutSession.id },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
