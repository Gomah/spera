import { verifySignature } from '@upstash/qstash/nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import { functions } from '../../queues';

async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

async function jobHandler(req: NextApiRequest, res: NextApiResponse) {
  // Let's get the name & payload from the request body
  const buf = await buffer(req);
  const rawBody = buf.toString('utf8');
  const body = JSON.parse(rawBody);

  const { name, payload } = body as {
    name: keyof typeof functions;
    payload: any;
  };

  // Process handler
  await functions[name](payload);

  res.status(200).end();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (process.env.NODE_ENV === 'development') {
    return await jobHandler(req, res);
  }
  return verifySignature(jobHandler(req, res) as any);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
