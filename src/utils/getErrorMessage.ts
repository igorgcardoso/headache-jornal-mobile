import { AxiosError } from 'axios';

interface data {
  detail: {
    msg: string;
  };
}

export function getErrorMessage(err: Error) {
  try {
    const error = err as AxiosError;
    const { data } = error.response as { data: data };
    return data.detail?.msg ?? 'An unexpected error occurred.';
  } catch (error) {
    return 'An unexpected error occurred.';
  }
}
