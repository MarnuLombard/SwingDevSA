import nodeFetch, {HeadersInit, Response} from 'node-fetch';
import {URL, URLSearchParams} from 'url';

// Use an enum for easier ide-completion in code calling this
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
  HEAD = 'HEAD'
}

export declare interface SpecifiedResponse<T> extends Response {
  json(): Promise<T>;
}

type HttpMethodWithOutBody = HttpMethod.GET | HttpMethod.OPTIONS | HttpMethod.OPTIONS;
type HttpMethodWithBody = Exclude<HttpMethod, HttpMethodWithOutBody>;
// tslint:disable-next-line:no-any
export type BodyQuery = Record<string, any>;

const shouldHaveBody = (method: HttpMethod): method is HttpMethodWithBody => {
  return Boolean([
    HttpMethod.GET,
    HttpMethod.OPTIONS,
    HttpMethod.HEAD
  ].indexOf(method));
}

export abstract class ApiRequest {
  protected abstract baseUrl: string;

  // tslint:disable-next-line:max-line-length
  protected async request<T>(endPoint: string, method: HttpMethod = HttpMethod.GET, bodyQuery?: BodyQuery): Promise<SpecifiedResponse<T>> {
    let url: URL;
    let body: string|undefined;

    const headers = this.getHeaders();

    if (shouldHaveBody(method)) {
      url = new URL(endPoint, this.baseUrl);
      body = JSON.stringify(bodyQuery);
    } else if (bodyQuery) {
      const query = new URLSearchParams(bodyQuery);
      url = url = new URL(`${endPoint.replace(/\/$/, '')}?${query.toString()}`, this.baseUrl);
    } else {
      url = url = new URL(endPoint, this.baseUrl);
    }

    const fetch = await this.getFetch();

    return <SpecifiedResponse<T>> await fetch(url.toString(), {body, headers});
  }

  protected getHeaders(): HeadersInit {
    return {
      'content-type': 'application/json',
      accept: 'application/json'
    };
  }

  /**
   * Better testability
   * @protected
   */
  protected async getFetch(): Promise<typeof nodeFetch> {
    return nodeFetch;
  }
}
