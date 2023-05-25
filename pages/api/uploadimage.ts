import { Storage } from '@google-cloud/storage';
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    // The Storage object uses your GOOGLE_APPLICATION_CREDENTIALS
    const storage = new Storage();
    const bucketName = 'qaly-shop-charity-images';
    const filename = uuidv4();

    // TODO. This allows arbitrarily large uploads. Not ideal!
    const options = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: req.body.type, 
    };

    // Get a v4 signed URL for uploading file
    const [url] = await storage
      .bucket(bucketName)
      .file(filename)
      .getSignedUrl(options);

    res.status(200).json({ url, imageUrl: `https://storage.googleapis.com/qaly-shop-charity-images/${filename}` });
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
