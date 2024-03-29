import { withSpera } from '@spera/nextjs';
import { verifySignature } from '@spera/plugin-qstash/nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { spera } from '../../.spera';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // This should be displayed after the background function is processed :)
  console.log('Hey there!');
  return res.status(200).json({ success: true });
}

export default withSpera(handler, spera, verifySignature);
