import { Client, PublishJsonRequest } from '@upstash/qstash';

export interface SperaParams<FnType> {
  /** API Endpoint url, e.g: /api/queue */
  url: string;

  /** qStash token */
  qStashToken: string;

  /** Your "functions" object */
  functions: FnType;
}

export class Spera<FnType> {
  private qstash: Client;

  public url: string;

  public functions: FnType;

  constructor(params: SperaParams<FnType>) {
    this.url = params.url;
    this.qstash = new Client({
      token: params.qStashToken,
    });
    this.functions = params.functions;
  }

  async send<T extends keyof typeof this.functions>(
    name: T,
    // @ts-expect-error
    payload: Parameters<FnType[T]>[0],
    options?: Omit<PublishJsonRequest, 'body'>
  ) {
    if (process.env['NODE_ENV'] === 'development') {
      return fetch(this.url, {
        method: 'POST',
        body: JSON.stringify({ name, payload }),
      });
    }

    return this.qstash.publishJSON({
      url: this.url,
      body: { name, payload },
      ...options,
    });
  }
}
