import { AxiosError } from 'axios';

interface data {
  message: string;
}

export function getErrorMessage(err: Error) {
  const error = err as AxiosError;
  const { data } = error.response as { data: data };
  return data.detail ?? 'An unexpected error occurred.';
}
