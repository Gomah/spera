import type { NextApiRequest, NextApiResponse } from 'next';
import { client } from '../../queues';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  // Send some stuff in the queue

  const body = JSON.parse(req.body);

  await client.send('app/account.created', {
    id: body.id,
  });
}
