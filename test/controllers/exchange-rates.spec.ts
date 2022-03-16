import {Request, Response} from 'express';
import {mockRequest, mockResponse} from 'mock-req-res';
import {AllRequest, ExchangeRateController} from '../../src/controllers/exchange-rate';
import {FederalInstituteApiRequest} from '../../src/services/api-requests/federal-institute-api-request';
import {SwingCentralV1ApiRequest} from '../../src/services/api-requests/swing-central-v1-api-request';
import {SwingCentralV2ApiRequest} from '../../src/services/api-requests/swing-central-v2-api-request';
import {Currency} from '../../src/types/currency';

jest.mock('../../src/services/api-requests/federal-institute-api-request');
jest.mock('../../src/services/api-requests/swing-central-v1-api-request');
jest.mock('../../src/services/api-requests/swing-central-v2-api-request');

let federalInstituteApiRequest: FederalInstituteApiRequest;
let swingCentralV1ApiRequest: SwingCentralV1ApiRequest;
let swingCentralV2ApiRequest: SwingCentralV2ApiRequest;
let from: Currency;
let to: Currency;
let exchangeRateController: ExchangeRateController;
let request: Request<null, null, null, AllRequest>;
let response: Response;

describe('exchange rate controller', () => {
  describe('all() method', () => {
    beforeEach(() => {
      federalInstituteApiRequest = new FederalInstituteApiRequest();
      swingCentralV1ApiRequest = new SwingCentralV1ApiRequest();
      swingCentralV2ApiRequest = new SwingCentralV2ApiRequest();

      exchangeRateController = new ExchangeRateController(
        federalInstituteApiRequest,
        swingCentralV1ApiRequest,
        swingCentralV2ApiRequest
      );

      from = Currency.USD;
      to = Currency.EUR;

      request = <Request<null, null, null, AllRequest>><unknown>mockRequest({query: {from, to}});
      response = mockResponse();

    })
    it('Tries swing central v1 after federal institute', async () => {
      // mock a failing federal institute
      const federalInstituteMock = jest.spyOn(federalInstituteApiRequest, 'getRates');
      federalInstituteMock.mockReturnValue(Promise.resolve(undefined));

      // mock a passing swing v1
      const swingV1Mock = jest.spyOn(swingCentralV1ApiRequest, 'getRates');
      swingV1Mock.mockReturnValue(Promise.resolve({
        base: from,
        target: to,
        // tslint:disable-next-line:insecure-random
        rate: Math.random(),
        timestamp: Date.now()
      }));

      // mock a failing swing v2
      const swingV2Mock = jest.spyOn(swingCentralV2ApiRequest, 'getRates');
      swingV2Mock.mockReturnValue(Promise.resolve(undefined));

      await exchangeRateController.all(request, response);

      expect(swingV1Mock).toHaveBeenCalled();

      // Swing v2 should only be called if v1 is down
      expect(swingV2Mock).not.toHaveBeenCalled();

      federalInstituteMock.mockRestore();
      swingV1Mock.mockRestore();
      swingV2Mock.mockRestore();
    });
    it('Tries swing central v1 after swing central v1', async () => {
      // mock a failing federal institute
      const federalInstituteMock = jest.spyOn(federalInstituteApiRequest, 'getRates');
      federalInstituteMock.mockReturnValue(Promise.resolve(undefined));

      // mock a failing swing v1
      const swingV1Mock = jest.spyOn(swingCentralV1ApiRequest, 'getRates');
      swingV1Mock.mockReturnValue(Promise.resolve(undefined));

      // mock a passing swing v2
      const swingV2Mock = jest.spyOn(swingCentralV2ApiRequest, 'getRates');
      swingV2Mock.mockReturnValue(Promise.resolve(Promise.resolve({
        base: from,
        target: to,
        // tslint:disable-next-line:insecure-random
        rate: Math.random(),
        timestamp: Date.now()
      })));

      await exchangeRateController.all(request, response);

      expect(swingV2Mock).toHaveBeenCalled();

      federalInstituteMock.mockRestore();
      swingV1Mock.mockRestore();
      swingV2Mock.mockRestore();
    });
  });
});
