import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
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
  res: NextApiResponse,
  functions: Record<string, Function>
) {
  // Let's get the event & payload from the request body
  const buf = await buffer(req);
  const rawBody = buf.toString('utf8');
  const body = JSON.parse(rawBody);

  const { event, payload } = body as {
    event: keyof typeof functions;
    payload: unknown;
  };

  // Process handler
  await functions[event]?.(payload);
}

export function withSpera(
  handler: NextApiHandler,
  client: Spera<Record<string, Function>, any>,
  verifySignature: (params: any) => NextApiHandler<any>
) {
  return async function nextApiHandler(req: NextApiRequest, res: NextApiResponse) {
    if (client.isDev) {
      await jobHandler(req, res, client.functions);
    } else {
      verifySignature(await jobHandler(req, res, client.functions));
    }

    return handler(req, res);
  };
}
