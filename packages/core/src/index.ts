export interface SperaParams<FnType, FnProvider> {
  /** API Endpoint url, e.g: /api/queue */
  url: string;

  /** Your "functions" object */
  functions: FnType;

  /** Provider plugin */
  provider: FnProvider;
}

export interface ProviderPublishParams<T> {
  url: string;
  event: string;
  payload: unknown;
  options?: T;
}

export class Spera<FnType, FnProvider> {
  private provider: FnProvider;

  private url: string;

  public functions: FnType;

  constructor(params: SperaParams<FnType, FnProvider>) {
    this.url = params.url;
    this.provider = params.provider;
    this.functions = params.functions;
  }

  async send<T extends keyof typeof this.functions>(
    event: T,
    // @ts-expect-error
    payload: Parameters<FnType[T]>[0],
    // @ts-expect-error
    options?: Parameters<FnProvider['publish']>[0]['options']
  ) {
    if (process.env['NODE_ENV'] === 'development') {
      return fetch(this.url, {
        method: 'POST',
        body: JSON.stringify({ event, payload }),
      });
    }

    // @ts-expect-error
    return this.provider.publish({
      url: this.url,
      event: event as any,
      payload,
      ...options,
    });
  }
}
