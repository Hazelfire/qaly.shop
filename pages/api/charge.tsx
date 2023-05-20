import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import { Resend } from "resend";
import { RecipientEmail, PurchaserEmail } from "./_emails"; // Import the email components

const resend = new Resend(process.env.RESEND_SECRET_KEY);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

const prisma = new PrismaClient();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      purchaserName,
      purchaserEmail,
      recipientName,
      recipientEmail,
      message,
      giftCardValue,
      stripeToken,
      currency,
    } = req.body; // added currency here

    try {
      // Generate a UUID for the gift card
      const uuid = uuidv4();

      const charge = await stripe.charges.create({
        amount: giftCardValue * 100, // still in cents
        currency: currency, // use the provided currency
        source: stripeToken,
        receipt_email: purchaserEmail,
      });

      // Create a new gift card in the database
      await prisma.giftCard.create({
        data: {
          total: giftCardValue,
          id: uuid,
          recipientName,
          recipientEmail,
          purchaserName,
          purchaserEmail,
          stripeChargeId: charge.id,
          currency,
        },
      });

      // Send email to recipient
      await resend.sendEmail({
        from: "roreply@qaly.shop",
        to: recipientEmail,
        subject: "Congratulations on your Gift Card!",
        react: (
          <RecipientEmail
            purchaserName={purchaserName}
            giftCardId={uuid}
            customMessage={message}
          />
        ),
      });

      // Send email to purchaser
      await resend.sendEmail({
        from: "noreply@qaly.shop",
        to: purchaserEmail,
        subject: "Your Gift Card has been sent!",
        react: (
          <PurchaserEmail
            purchaserName={purchaserName}
            recipientName={recipientName}
            giftCardId={uuid}
          />
        ),
      });

      res.status(200).json({ status: "Your payment was successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "Your payment failed", message: "" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
