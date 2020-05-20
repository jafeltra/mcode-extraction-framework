const { BaseFHIRModule } = require('../../src/modules');

const MOCK_URL = 'http://localhost';
const MOCK_REQUEST_HEADERS = {};

// Instantiate module with mocks
const baseFHIRModule = new BaseFHIRModule(MOCK_URL, MOCK_REQUEST_HEADERS);

test('updateHeaders fn should update the headers variable and the clients headers', () => {
  // Ensure that the request headers are as expected initially
  const newHeaders = {
    ...MOCK_REQUEST_HEADERS,
    Authorization: 'Bearer tokenGoesHere',
  };
  baseFHIRModule.updateRequestHeaders(newHeaders);

  Object.keys(newHeaders).forEach((key) => {
    const val = newHeaders[key];
    expect(baseFHIRModule.client.httpClient.defaults.headers).toHaveProperty(key, val);
  });
});
