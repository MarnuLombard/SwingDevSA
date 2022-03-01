// tslint:disable:insecure-random

import { Request, Response, Router } from 'express';

export const routes: Router = Router()

routes.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!')
})
