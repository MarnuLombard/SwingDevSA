import {HeadersInit} from 'node-fetch';
import {handleResponse} from '../../helpers/handleResponse';
import {Currency} from '../../types/currency';
import {ErrorResponse} from '../../types/error-response';
import {ExchangeRateResponse, SwingCentralResponse} from '../../types/exchange-rate-response';
import {ApiRequest, HttpMethod} from './api-request';
import {ExchangeApiRequestInterface} from './exchange-api-request-interface';

export class SwingCentralV1ApiRequest extends ApiRequest implements ExchangeApiRequestInterface {
  protected baseUrl: string = 'https://central-bank.sandbox.swing.dev/exchange/v1/';

  public async getRates(from: Currency, to: Currency): Promise<ExchangeRateResponse|ErrorResponse|undefined> {
    const data = await this.request<SwingCentralResponse>(
      '/rates/',
      HttpMethod.GET
    ).then(handleResponse);

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

  protected getHeaders(): HeadersInit {
    const authHeaders = {
      'X-APIKEY': 'SWING' // typically, this should live in an .env
    };

    return {...authHeaders, ...super.getHeaders()};
  }
}
