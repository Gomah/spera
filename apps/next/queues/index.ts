import { Spera } from '@spera/core';
import { getBaseUrl } from '../utils';
import * as accountCreated from './account.created';

export const functions = {
  [accountCreated.name]: accountCreated.handler,
};

export const client = new Spera({
  url: `${getBaseUrl()}/api/queues`,
  functions,
  qStashToken: process.env.QSTASH_TOKEN as string,
});
