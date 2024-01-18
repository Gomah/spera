# Spera

> Run & schedule your code in the background with a fully typed client.

![Preview](https://user-images.githubusercontent.com/2362138/204499245-c2d0451f-b34c-4ea1-bdb2-f0fa7f8121f5.gif)

⚠️ Very early project – I'm currently using a similar version of this code in production but I don't think you should 🤷

## How it works ?

Spera is (for now), just a small typed client for the code you want to schedule in the background, it uses QStash and runs locally when running `NODE_ENV` is set to development.

All you need is to pass a functions object (key being the name of your event and the function to run as the value), e.g:

```ts
const functions = {
  'app/account.created': accountCreated.Handler
}
```

```ts
import qStashProvider from '@spera/plugin-qstash';
import { Spera } from '@spera/core';
import * as accountCreated from './account.created';

export const functions = {
  'app/account.created': accountCreated.handler,
};

export const spera = new Spera({
  url: `${getBaseUrl()}/api/spera`,
  functions,
  provider: qStashProvider({ token: process.env.QSTASH_TOKEN as string }),
});
```

I plan to support different providers, frameworks & improve the project – there's a fair bit of boilerplate for now.

## Quickstart (With Next.js)

### Install dependencies

```bash
yarn add @spera/core @spera/nextjs @spera/plugin-qstash
```

Notes:

This first version depends on [QStash](https://upstash.com/qstash) as a provider, please make sure you have the following environment variables setup for your project:

- `QSTASH_URL`
- `QSTASH_TOKEN`
- `QSTASH_CURRENT_SIGNING_KEY`
- `QSTASH_NEXT_SIGNING_KEY`


### Define your "functions" / "jobs" you want to run in the background

See `apps/next/.spera` as an example.

```bash
.
├── .spera/                     # Your folder containing your functions to run in the background
│   ├── account.created.ts
│   └── index.ts
├── pages/
│   ├── api/                    # Next.js API folder
│   │   ├── spera.ts            # The Spera API handler
└── ...
```

```ts
// .spera/index.ts
import * as accountCreated from './account.created';
import { Spera } from '@spera/core';
import qStashProvider from '@spera/plugin-qstash';

export const functions = {
  [accountCreated.name]: accountCreated.handler,
};

export const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export const spera = new Spera({
  url: `${getBaseUrl()}/api/spera`,
  functions,
  provider: qStashProvider({ token: process.env.QSTASH_TOKEN as string }),
});
```

```ts
// .spera/account.created.ts
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
// pages/api/spera.ts
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
  return res.status(200).end();
}

export default withSpera(handler, spera, verifySignature);

```

## Project "roadmap"

- [x] Abstract QStash as a "Provider" plugin.
- [x] Next.js helpers (Spera to extract "use" hooks to verify signatures based on X provider)
- [x] Dynamic Next.js helpers (based on provider)
- [ ] Add zod
- [ ] Client API Design
- [ ] Cloudflare Queues as a "Provider" plugin.
- [ ] Docs
- [ ] Cleanup code / repo
- [ ] Framework agnostic
