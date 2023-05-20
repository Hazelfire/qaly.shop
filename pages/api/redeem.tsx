import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";
import { PurchaserRedeemEmail, RecipientRedeemEmail } from "./_emails";
import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

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
    const { gift_card_id, charities } = req.body;

    try {
      const giftCard = await prisma.giftCard.findUnique({
        where: { id: gift_card_id },
      });

      if (!giftCard) {
        return res.status(404).json({ status: "Gift card not found" });
      }

      if (giftCard.isRedeemed) {
        return res.status(400).json({ status: "Gift card already redeemed" });
      }

      await prisma.giftCard.update({
        where: { id: gift_card_id },
        data: { isRedeemed: true },
      });

      for (const charity of charities) {
        const charityData = await prisma.charity.findUnique({
          where: { id: charity.id },
        });

        if (!charityData) {
          throw new Error(`Charity with id ${charity.id} not found`);
        }
        const stripe_params = {
          amount: charity.amount * 100, // Amount should be in cents
          currency: giftCard.currency, // replace with desired currency
          destination: charityData.stripeId, // Use the Stripe Account ID from the database
        };
        console.log(stripe_params);

        await stripe.transfers.create(stripe_params);
      }
      await resend.sendEmail({
        from: "noreply@qaly.shop", // replace with your company's noreply or support email
        to: giftCard.purchaserEmail,
        subject: "Your Gift Card was redeemed!",
        react: (
          <PurchaserRedeemEmail
            purchaserName={giftCard.purchaserName}
            recipientName={giftCard.recipientName}
          />
        ),
      });

      // Send email to recipient
      await resend.sendEmail({
        from: "noreply@qaly.shop", // replace with your company's noreply or support email
        to: giftCard.recipientEmail,
        subject: "Gift Card Redeemed Successfully!",
        react: (
          <RecipientRedeemEmail
            recipientName={giftCard.recipientName}
            charities={charities}
          />
        ),
      });

      res
        .status(200)
        .json({ status: "Gift card has been successfully redeemed" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ status: "Failed to redeem gift card", message: "" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
