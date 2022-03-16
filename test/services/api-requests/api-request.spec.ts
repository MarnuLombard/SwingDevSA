import { ApiRequest } from '../../stubs/services/api-requests/api-request';

describe('Base ApiRequest tests', () => {
  it('makes an api call', async () => {
    const response = await new ApiRequest().getFoo()

    expect(response).toHaveProperty('data');
    expect(response.data).toBe('foo');
  });
});
