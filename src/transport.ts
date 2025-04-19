export type Transport = (options: TransportOptions) => Promise<Response>;

export type TransportOptions = {
  url: URL;
  headers?: HeadersInit;
  signal?: AbortSignal;
};

export function fetchTransport({ url, ...options }: TransportOptions): Promise<Response> {
  return fetch(url, options);
}
