import {SpecifiedResponse} from '../services/api-requests/api-request';
import {ErrorResponse} from '../types/error-response';

export async function handleResponse<T>(response: SpecifiedResponse<T>): Promise<T|ErrorResponse> {
  const json: T = await response.json();

  if (!response.ok) {
    const error: ErrorResponse = {
      ...<T>json,
      status: response.status,
      statusText: response.statusText
    };

    return Promise.reject(error);
  }

  return <T>json;
}
