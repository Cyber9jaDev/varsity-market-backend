import axios, { AxiosHeaders, Method } from 'axios';

const baseUrl = 'https://api.paystack.co';

export default async function APICall<T>(
  url: string,
  method: Method,
  data: Object,
  headers?: {
    [key: string]: string;
  }
): Promise<T> {
  const response = await axios({
    method,
    url: baseUrl + (url.startsWith('/') ? url : `/${url}`),
    data,
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      // 'Content-Type': 'application/json',
    },
  });

  return response.data as T;
}
