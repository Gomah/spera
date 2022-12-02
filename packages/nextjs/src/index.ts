import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { verifySignature } from '@upstash/qstash/nextjs';
import type { Readable } from 'stream';
import { Spera } from '@spera/core';

async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

async function jobHandler(
  req: NextApiRequest,
  // @ts-ignore
  res: NextApiResponse,
  functions: Record<string, Function>
) {
  // Let's get the event & payload from the request body
  const buf = await buffer(req);
  const rawBody = buf.toString('utf8');
  const body = JSON.parse(rawBody);

  const { event, payload } = body as {
    event: keyof typeof functions;
    payload: any;
  };

  // Process handler
  await functions[event]?.(payload);
}

export function withSpera(
  handler: NextApiHandler,
  client: Spera<Record<string, Function>, any>
) {
  return async function nextApiHandler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if (process.env.NODE_ENV === 'development') {
      await jobHandler(req, res, client.functions);
      return handler?.(req, res);
    }

    verifySignature(jobHandler(req, res, client.functions) as any);
    return handler?.(req, res);
  };
}
