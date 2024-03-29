import { Client, PublishJsonRequest, Receiver } from '@upstash/qstash';
import type { ProviderPublishParams } from '@spera/core';

export { Receiver };

interface SperaQStashParams {
  token: string;
}

export default function speraQtashPlugin({ token }: SperaQStashParams) {
  const client = new Client({
    token,
  });

  return {
    publish: ({
      url,
      event,
      payload,
      options,
    }: ProviderPublishParams<Omit<PublishJsonRequest, 'body'>>) =>
      client.publishJSON({
        url,

        body: {
          event,
          payload,
        },

        ...(options as any),
      }),
  };
}
