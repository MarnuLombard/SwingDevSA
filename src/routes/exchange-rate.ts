import {Router} from 'express'
import {ExchangeRateController} from '../controllers/exchange-rate';
import {FederalInstituteApiRequest} from '../services/api-requests/federal-institute-api-request';
import {SwingCentralV1ApiRequest} from '../services/api-requests/swing-central-v1-api-request';
import {SwingCentralV2ApiRequest} from '../services/api-requests/swing-central-v2-api-request';

export const routes: Router = Router()

const federalInstituteApiRequest = new FederalInstituteApiRequest();
const swingCentralV1ApiRequest = new SwingCentralV1ApiRequest();
const swingCentralV2ApiRequest = new SwingCentralV2ApiRequest();

const exchangeRateController = new ExchangeRateController(
  federalInstituteApiRequest,
  swingCentralV1ApiRequest,
  swingCentralV2ApiRequest
);

routes.get('*', exchangeRateController.all);
