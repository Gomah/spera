import { Spera } from '@spera/core';
import qStashProvider from '@spera/plugin-upstash';
import { getBaseUrl } from '../utils';
import * as accountCreated from './account.created';

export const functions = {
  [accountCreated.name]: accountCreated.handler,
};

export const client = new Spera({
  url: `${getBaseUrl()}/api/queues`,
  functions,
  provider: qStashProvider({ token: process.env.QSTASH_TOKEN as string }),
});
