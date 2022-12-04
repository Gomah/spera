import type { NextApiRequest, NextApiResponse } from 'next';
import { spera } from '../../queues';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Send some stuff in the queue

  const body = JSON.parse(req.body);

  await spera.send('app/account.created', {
    id: body.id,
  });

  return res.status(200).end();
}
