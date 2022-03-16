import {Currency} from '../../types/currency';
import {ErrorResponse} from '../../types/error-response';
import {ExchangeRateResponse} from '../../types/exchange-rate-response';

export interface ExchangeApiRequestInterface {
  getRates(from: Currency, to: Currency): Promise<ExchangeRateResponse|ErrorResponse|undefined>;
}
