export type HttpClient = typeof fetchClient;

export function fetchClient(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return fetch(input, init);
}
