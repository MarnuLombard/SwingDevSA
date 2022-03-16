import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as morgan from 'morgan';

import { routes as exchangeRateRoutes } from './exchange-rate/routes';
import { routes as helloRoutes } from './hello/routes';

export const app: express.Application = express()

// Configuration
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

// Routes
app.use('/exchange-rate', exchangeRateRoutes)

app.use('*', (req: express.Request, res: express.Response) => {
  res.sendStatus(404)
})

// Error handlers
// tslint:disable-next-line:no-any
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res
    .status(500)
    .send(err.message ? err.message : err)
})
