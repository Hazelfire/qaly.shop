import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2020-08-27",
});

// When a gift card is purchased
export const createCharge = async (
  amount: number,
  source: string,
  description: string
) => {
  const charge = await stripe.charges.create({
    amount: amount * 100, // Stripe amounts are in cents
    currency: "usd",
    source: source,
    description: description,
  });

  return charge.id;
};

// When the gift card is redeemed and a charity is selected
export const createTransfer = async (
  amount: number,
  destinationAccountId: string
) => {
  const transfer = await stripe.transfers.create({
    amount: amount * 100, // Stripe amounts are in cents
    currency: "usd",
    destination: destinationAccountId,
  });

  return transfer.id;
};
