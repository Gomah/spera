# Spera

> Run & schedule your code in the background with a fully typed client.

![Preview](https://user-images.githubusercontent.com/2362138/204499245-c2d0451f-b34c-4ea1-bdb2-f0fa7f8121f5.gif)

⚠️ Very early project – I'm currently using a similar version of this code in production but I don't think you should (:

## How it works ?

Spera is (for now), just a small typed client for the code you want to schedule in the background, it's using QStash and runs locally when running `next dev`.

All you need is to pass a functions object (key being the name of your event and the function to run as the value), e.g:

```ts
export const functions = {
  'app/account.created': accountCreated.handler,
};

export const client = new Spera({
  url: `${getBaseUrl()}/api/queues`,
  functions,
  qStashToken: process.env.QSTASH_TOKEN as string,
});

```

I plan to support different providers, frameworks & improve the project – there's a fair bit of boilerplate for now.

## Quickstart (With Next.js)

### Install dependencies
```bash
yarn add @spera/core
```

Notes:

This first version depends on [QStash](https://upstash.com/qstash), please make sure you have the following environment variables setup for your project:

- `QSTASH_URL`
- `QSTASH_TOKEN`
- `QSTASH_CURRENT_SIGNING_KEY`
- `QSTASH_NEXT_SIGNING_KEY`


### Define your "functions" / "jobs" you want to run in the background

See `apps/next/queues` as an example.

```bash
.
├── pages/                      # The magic happens here
│   ├── api/                    # Core API
│   │   ├── queues.ts            # The queue API handler
├── queues/                     # Your folder containing your functions
│   ├── account.created.ts      #
│   └── index.ts
└── ...
```

```ts
// queues/index.ts
import { Spera } from '@spera/core';
import * as accountCreated from './account.created';

export const functions = {
  [accountCreated.name]: accountCreated.handler,
};

export const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export const client = new Spera({
  url: `${getBaseUrl()}/api/queues`,
  functions,
  qStashToken: process.env.QSTASH_TOKEN as string,
});
```

```ts
// queues/account.created.ts
export const name = 'app/account.created';

export interface AccountCreatedPayload {
  id: string;
}

export async function handler(payload: AccountCreatedPayload) {
  const { id } = payload;
  console.info(`Account created: ${id}`);
  return id;
}
```

```ts
// pages/api/queues.ts

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
```

## Project "roadmap"

- Client API Design
- Abstract QStash as a "Provider" plugin.
- Cloudflare Queues as a "Provider" plugin.
- Docs
- Framework agnostic
