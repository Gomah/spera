import { Receiver } from '@spera/plugin-upstash';
import { spera } from '../../.spera';

const isDev = process.env['NODE_ENV'] === 'development';

export default defineEventHandler(async (h3Event) => {
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
  // @ts-ignore
  await spera?.functions[event]?.(payload);

  return {
    status: 'OK',
  };
});
