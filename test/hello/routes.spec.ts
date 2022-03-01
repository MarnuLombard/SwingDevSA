import * as request from 'supertest'

import { app } from '../../src/app'

describe('hello module routes', () => {
  describe('GET /hello', () => {
    it('should respond with "Hello, World!"', async () => {
      await request(app)
        .get('/hello')
        .expect(200, 'Hello, World!')
    })
  })
})
