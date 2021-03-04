export default class FetchError extends Error {
  name = 'FetchError';

  constructor(response, message) {
    super(message);
    this.response = response;
  }
}

// handle uncaught failed fetch through
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason instanceof FetchError) {
    alert(event.reason.message);
  }
});
