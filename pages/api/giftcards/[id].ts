// /pages/api/giftcards/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client"; // Replace with your ORM

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { id } = req.query;
    const giftCard = await prisma.giftCard.findUnique({
      where: { id: Number(id) },
    }); // Replace with your query

    if (!giftCard) {
      return res.status(404).json({ message: "Gift Card not found" });
    }

    return res.status(200).json(giftCard);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
