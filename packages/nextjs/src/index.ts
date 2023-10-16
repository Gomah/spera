import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import type { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from 'next/server';
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
  req: NextApiRequest & NextRequest,
  res: NextApiResponse,
  functions: Record<string, Function>
) {
  let body: { event: string; payload: unknown };

  if ('json' in req) {
    body = await req.json();
  } else {
    // Let's get the event & payload from the request body
    const buf = await buffer(req);
    const rawBody = buf.toString('utf8');
    body = JSON.parse(rawBody);
  }

  const { event, payload } = body;

  // Process handler
  await functions[event]?.(payload);
}

type VerifySignatureType = (
  params: any
) =>
  | NextApiHandler<any>
  | ((req: NextRequest, nfe: NextFetchEvent) => Promise<NextResponse<unknown>>);

export function withSpera(
  handler: NextApiHandler | NextMiddleware,
  client: Spera<Record<string, any>, any>,
  verifySignature: VerifySignatureType
) {
  return async function nextApiHandler(
    req: NextApiRequest & NextRequest,
    res: NextApiResponse & NextFetchEvent
  ) {
    if (client.isDev) {
      await jobHandler(req, res, client.functions);
    } else {
      verifySignature(await jobHandler(req, res, client.functions));
    }

    return handler(req, res);
  };
}
