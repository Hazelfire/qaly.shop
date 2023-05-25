import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "pages/api/auth/[...nextauth]"

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);
    if(!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { name, description, logoUrl, homepageUrl, donateUrl, stripeId } = req.body;

    try {
      const charity = await prisma.charity.create({
        data: {
          name,
          description,
          logoUrl,
          homepageUrl,
          donateUrl,
          stripeId,
          createdOn: new Date(),
          createdBy: session.user?.email // I assume this won't ever fail me?
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
