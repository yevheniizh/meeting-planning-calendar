export default class FetchError extends Error {
  name = 'FetchError';

  constructor(response, message) {
    super(message);
    this.response = response;
  }
}
