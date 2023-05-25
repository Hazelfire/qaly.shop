import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function editCharity(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { id, name, description, logoUrl, homepageLink, donateUrl } = req.body;

  try {
    const updatedCharity = await prisma.charity.update({
      where: { id: Number(id) },
      data: { name, description, logoUrl, homepageLink, donateUrl },
    });

    return res.status(200).json({ message: 'Charity updated successfully', charity: updatedCharity });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
