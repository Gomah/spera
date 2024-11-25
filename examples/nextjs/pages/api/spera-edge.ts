import { withSpera } from '@spera/nextjs';
import { verifySignatureEdge } from '@spera/plugin-qstash/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { spera } from '../../.spera';

export const config = {
  runtime: 'edge',
};

async function handler(req: NextRequest) {
  // This should be displayed after the background function is processed :)
  console.log('Hey there!');
  return Response.json({ success: true });
}

export default withSpera(handler, spera, verifySignatureEdge);
