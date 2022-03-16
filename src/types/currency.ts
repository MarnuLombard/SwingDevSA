export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  PLN = 'PLN',
  SWD = 'SWD'
}

export const isCurrency = (token: string): token is Currency => {
  // tslint:disable-next-line:no-any
  return Object.values<any>(Currency)
    .includes(<Currency[keyof Currency]>token);
}
