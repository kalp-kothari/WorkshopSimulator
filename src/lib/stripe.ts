import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY environment variable is missing.");
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      typescript: true,
      appInfo: {
        name: "Event Platform",
        version: "1.0.0",
      },
    });
  }
  return stripeInstance;
}

// For convenience — lazy getter
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as any)[prop];
  },
});
