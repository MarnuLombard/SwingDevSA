import {Currency} from './currency';

export type ExchangeRateResponse = {
  base: Currency;
  target: Currency;
  rate: number;
  timestamp: number;
}

export type SwingCentralResponse = {
  [key in Currency]: {
    bid: number;
    ask: number;
  };
} & {time: number};
