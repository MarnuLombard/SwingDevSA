import {handleResponse} from '../../helpers/handleResponse';
import {Currency} from '../../types/currency';
import {ErrorResponse} from '../../types/error-response';
import {ExchangeRateResponse} from '../../types/exchange-rate-response';
import {ApiRequest, HttpMethod} from './api-request';
import {ExchangeApiRequestInterface} from './exchange-api-request-interface';

export class FederalInstituteApiRequest extends ApiRequest  implements ExchangeApiRequestInterface {
  protected baseUrl: string = 'https://federal-institute.sandbox.swing.dev/';

  public async getRates(from: Currency, to: Currency): Promise<ExchangeRateResponse|ErrorResponse|undefined> {
    return this.request<ExchangeRateResponse>('/rates/', HttpMethod.GET, {base: from, target: to})
      .then(handleResponse);
  }
}
