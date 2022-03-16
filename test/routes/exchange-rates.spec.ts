import request from 'supertest'

import {app} from '../../src/app'

describe('exchange rate module routes', () => {
  describe('GET /exchange-rate', () => {
    it('Should give errors without params', async () => {
      await request(app)
        .get('/exchange-rate')
        .expect(421)
        .expect(/"error":/)
    })
    it('Should give errors with incorrect currencies', async () => {
      await request(app)
        .get('/exchange-rate?from=Foo&to=Bar')
        .expect(421)
        .expect(/Invalid currency/);
    })
    it('Should get exchange rates from the API', async () => {
      await request(app)
        .get('/exchange-rate?from=SWD&to=EUR')
        .expect(200)
        .expect(/"base":"SWD"/)
        .expect(/"target":"EUR"/)
        .expect(/"rate":[\d\.]+/)
        .expect(/"timestamp":\d{10}/)
    })
  })
})
