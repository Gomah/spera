export interface SperaParams<TFunctions, TProvider> {
  /**
   * API Endpoint url,
   * @example /api/spera
   */
  url: string;

  /**
   * In dev environment, Spera skips the provider client and will run your background functions locally at the given url
   * @default process.env.NODE_ENV === 'development'
   */
  isDev?: boolean;

  /**
   * Your "functions" object
   */
  functions: TFunctions;

  /**
   * Provider plugin
   */
  provider: TProvider;
}

export interface ProviderPublishParams<T> {
  url: string;
  event: string;
  payload: unknown;
  options?: T;
}

export class Spera<
  TFunctions extends Record<string, any>,
  TProvider extends { publish: (args: ProviderPublishParams<any>) => any },
> {
  private provider: TProvider;

  private url: string;

  public isDev: boolean;

  public functions: TFunctions;

  constructor({
    functions,
    provider,
    url,
    isDev = process.env['NODE_ENV'] === 'development',
  }: SperaParams<TFunctions, TProvider>) {
    this.url = url;
    this.isDev = isDev;
    this.provider = provider;
    this.functions = functions;
  }

  async send<T extends keyof TFunctions>(
    event: T,
    payload: Parameters<TFunctions[T]>[0],
    options?: Parameters<TProvider['publish']>[0]['options']
  ) {
    if (this.isDev) {
      return fetch(this.url, {
        method: 'POST',
        body: JSON.stringify({ event, payload }),
      });
    }

    return this.provider.publish({
      url: this.url,
      event: event as string,
      payload,
      ...options,
    });
  }
}
