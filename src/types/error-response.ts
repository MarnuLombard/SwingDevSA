export type ErrorResponse = {
  status: number;
  statusText: string;
// tslint:disable-next-line:no-any
} & Record<string, any>;
