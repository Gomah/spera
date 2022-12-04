export interface SperaParams<FnType, FnProvider> {
  /** API Endpoint url, e.g: /api/queue */
  url: string;

  /** In dev environment, Spera skips the provider client and will run your background functions locally at the given url
   * @default process.env.NODE_ENV === 'development'
   */
  isDev?: boolean;

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

  public isDev: boolean;

  public functions: FnType;

  constructor({
    functions,
    provider,
    url,
    isDev = process.env['NODE_ENV'] === 'development',
  }: SperaParams<FnType, FnProvider>) {
    this.url = url;
    this.isDev = isDev;
    this.provider = provider;
    this.functions = functions;
  }

  async send<T extends keyof typeof this.functions>(
    event: T,
    // @ts-expect-error
    payload: Parameters<FnType[T]>[0],
    // @ts-expect-error
    options?: Parameters<FnProvider['publish']>[0]['options']
  ) {
    if (this.isDev) {
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
