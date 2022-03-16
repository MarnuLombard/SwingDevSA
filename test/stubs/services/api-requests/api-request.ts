import nodeFetch, {RequestInfo, RequestInit, Response} from 'node-fetch';
import {ApiRequest as Base} from '../../../../src/services/api-requests/api-request';

/**
 * Due to time constraints a stub is the better option,
 * Were this a unit test for a production system,
 * I would rather spin up something like `json-server` and
 * test the real `ApiRequest` against that as an endpoint
 */
export class ApiRequest extends Base {
  public baseUrl = 'http://localhost';

  public async getFoo(): Promise<{data: object}> {
    return this.request('/foo')
      .then(response => <Promise<{data: object}>>response.json());
  }

  protected async getFetch(): Promise<typeof nodeFetch> {
    return Promise.resolve((url: RequestInfo, init?: RequestInit) => {
      return Promise.resolve(new Response('{"data": "foo"}'))
    });
  }
}
