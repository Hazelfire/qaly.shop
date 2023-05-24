import { Storage } from '@google-cloud/storage';
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    // The Storage object uses your GOOGLE_APPLICATION_CREDENTIALS
    const storage = new Storage();
    const bucketName = 'qaly-shop-charity-images';
    const filename = req.body.filename; // the name for your file

    const options = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: 'image/jpeg', // or whatever your content type is
    };

    // Get a v4 signed URL for uploading file
    const [url] = await storage
      .bucket(bucketName)
      .file(filename)
      .getSignedUrl(options);

    res.status(200).json({ url });
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
