import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, description, logoUrl, homepageLink, donateUrl, stripeId } = req.body;

    try {
      const charity = await prisma.charity.create({
        data: {
          name,
          description,
          logoUrl,
          homepageLink,
          donateUrl,
          stripeId,
        },
      });

      res.status(200).json(charity);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to add the charity' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
