import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!stripeClient) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
  stripeClient = new Stripe(secretKey, {
    apiVersion: "2026-08-26.dahlia",
  });
  }
  return stripeClient;
}

export async function createStripePaymentIntent(
  amount: number,
  currency: string = "usd",
  metadata?: Record<string, string>
): Promise<Stripe.PaymentIntent> {
  const stripe = getStripeClient();
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    metadata: metadata || {},
    automatic_payment_methods: { enabled: true },
  });
}

export async function constructStripeWebhookEvent(
  payload: string | Buffer,
  signature: string
): Promise<Stripe.Event> {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
  }
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}
