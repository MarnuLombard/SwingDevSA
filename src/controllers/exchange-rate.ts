import {Request, Response} from 'express'
import {RetryingQueue} from '../helpers/queue';
import {ExchangeApiRequestInterface} from '../services/api-requests/exchange-api-request-interface';
import {Currency, isCurrency} from '../types/currency';
import {ErrorResponse} from '../types/error-response';
import {ExchangeRateResponse} from '../types/exchange-rate-response';

export type AllRequest = {
  from: Currency|undefined|string;
  to: Currency|undefined|string;
}

export class ExchangeRateController {
  constructor(
    private federalInstituteApiRequest: ExchangeApiRequestInterface,
    private swingCentralV1ApiRequest: ExchangeApiRequestInterface,
    private swingCentralV2ApiRequest: ExchangeApiRequestInterface
  ) {}

  public all = async (req: Request<null, null, null, AllRequest>, res: Response) => {
    const from = req.query.from;
    const to = req.query.to;

    // In a larger project, I would use a library like `zod` to fully validate input
    if (!from || !to) {
      return res.status(421).send({error: 'Please provide \'from\' and \'to\' fields'})
    }
    if (!isCurrency(from) || !isCurrency(to)) {
      return res.status(421)
        .send({error: `Invalid currency requested. Valid currencies are ${Object.values(Currency).join(', ')}`});
    }

    try {
      const queue = new RetryingQueue();
      queue.push(
        [async () => this.swingCentralV2ApiRequest.getRates(from, to), 3],
        [async () => this.federalInstituteApiRequest.getRates(from, to), 3],
        [async () => this.swingCentralV1ApiRequest.getRates(from, to), 1],
        [() => ({error: 'Could not contact any exchanges. Please try again later.'}), 1]
      );

      const response = await queue.runUntil<ExchangeRateResponse|ErrorResponse>();

      if (response?.hasOwnProperty('error')) {
        return res.status(503).send(JSON.stringify(response));
      }

      return res.status(200).send(JSON.stringify(response));
    } catch (e) {
      // In a larger app a more robust error logger would be written
      // as well as hooking it up to Sentry, LogRocket, DataDog, etc
      process.stderr.write(`ERROR: ${e instanceof Error ? e.message : e} \n`);

      return res.status(500).send('Internal server error!');
    }

  };
}
