// /pages/api/charities.ts
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
    const charities = await prisma.charity.findMany(); // Replace with your query
    return res.status(200).json({ charities });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
