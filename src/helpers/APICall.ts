import axios, { Method, RawAxiosRequestHeaders } from 'axios';

const baseUrl = 'https://api.paystack.co';

export default async function APICall<T>(
  url: string,
  method: Method,
  data: Object,
  headers: RawAxiosRequestHeaders
): Promise<T> {
  const response = await axios({
    method,
    url: baseUrl + (url.startsWith('/') ? url : `/${url}`),
    data,
    headers
  });

  return response.data as T;
}
