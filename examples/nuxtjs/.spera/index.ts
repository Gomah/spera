import { Spera } from '@spera/core';
import qStashProvider from '@spera/plugin-qstash';
import { getBaseUrl } from '../utils';
import * as accountCreated from './account.created';

export const functions = {
  [accountCreated.name]: accountCreated.handler,
};

export const spera = new Spera({
  url: `${getBaseUrl()}/api/spera`,
  functions,
  provider: qStashProvider({ token: process.env.QSTASH_TOKEN as string }),
});
