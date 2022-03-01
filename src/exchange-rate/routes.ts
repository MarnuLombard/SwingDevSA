import { Request, Response, Router } from 'express'

export const routes: Router = Router()

routes.get('/', (req: Request, res: Response) => {
  throw new Error('Not implemented yet!')
})
