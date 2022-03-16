import {HeadersInit} from 'node-fetch';
import {Currency} from '../../types/currency';
import {ExchangeRateResponse, SwingCentralResponse} from '../../types/exchange-rate-response';
import {ApiRequest, BodyQuery, HttpMethod, SpecifiedResponse} from './api-request';
import {ExchangeApiRequestInterface} from './exchange-api-request-interface';
import {ErrorResponse} from "../../types/error-response";
import {handleResponse} from "../../helpers/handleResponse";

class SwingCentralRateLimit {
  private lastRequest: number = 0;
  private perMinute = 100;

  public canRequest(): boolean {
    const secondsDiff = Date.now() / 1000 - this.lastRequest / 1000;

    if (secondsDiff >= 60) {
      return true;
    }

    const percentageLeft = 100 - (secondsDiff / 60);
    const limitLeft = this.perMinute * percentageLeft;

    return (this.perMinute - limitLeft) > 0;
  }

  public makeRequest() {
    this.lastRequest = Date.now();
  }
}

export class SwingCentralV2ApiRequest extends ApiRequest implements ExchangeApiRequestInterface {
  protected baseUrl: string = 'https://central-bank.sandbox.swing.dev/exchange/v2/';
  private rateLimit: SwingCentralRateLimit;

  constructor() {
    super();
    this.rateLimit = new SwingCentralRateLimit();
  }

  public async getRates(from: Currency, to: Currency): Promise<ExchangeRateResponse|ErrorResponse|undefined> {
    const data = await this.request<SwingCentralResponse>('/', HttpMethod.GET)
      .then(handleResponse);

    // This API uses USD as the base
    data[Currency.USD] = {
      bid: 1,
      ask: 1
    };

    const rate = data[to].ask / data[from].ask;

    return {
      base: from,
      target: to,
      rate,
      timestamp: data.time
    }
  }

  protected async request<T>(endPoint: string, method: HttpMethod = HttpMethod.GET, bodyQuery?: BodyQuery): Promise<SpecifiedResponse<T>> {
    if (!this.rateLimit.canRequest()) {
      throw new Error('Federal SwingDev Institute rate-limit reached.');
    }

    try {
      return super.request(endPoint, method, bodyQuery);
    } finally {
      this.rateLimit.makeRequest();
    }
  }

  protected getHeaders(): HeadersInit {
    const authHeaders = {
      'X-APIKEY': 'SWING' // typically, this should live in an .env
    };

    return {...authHeaders, ...super.getHeaders()};
  }

}
