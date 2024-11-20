import axios, { Method } from 'axios';

const baseUrl = 'https://api.paystack.co';

export default async function APICall<T>(
  url: string,
  method: Method,
  data: Object,
): Promise<T> {
  const response = await axios({
    method,
    url: baseUrl + (url.startsWith('/') ? url : `/${url}`),
    data,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
  });

  return response.data as T;
}
