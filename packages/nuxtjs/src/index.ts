import type { EventHandler, EventHandlerRequest } from 'h3';
import { defineEventHandler, readRawBody, getRequestHeader } from 'h3';
import { Receiver } from '@spera/plugin-qstash';
import type { Spera } from '@spera/core';

const isDev = process.env['NODE_ENV'] === 'development';

export const withSpera = <T extends EventHandlerRequest, D>(
  handler: EventHandler<T, D>,
  client: Spera<Record<string, any>, any>
): EventHandler<T, D> =>
  defineEventHandler<T>(async (h3Event) => {
    const body = (await readRawBody(h3Event)) as string;

    if (!isDev) {
      const r = new Receiver({
        currentSigningKey: process.env['QSTASH_CURRENT_SIGNING_KEY'] as string,
        nextSigningKey: process.env['QSTASH_NEXT_SIGNING_KEY'] as string,
      });

      const signature = getRequestHeader(h3Event, 'upstash-signature');

      await r.verify({
        signature: signature as string,
        body: body as string,
      });
    }

    const { event, payload } = JSON.parse(body);

    // Process handler
    await client?.functions[event]?.(payload);

    return handler(h3Event);
  });
