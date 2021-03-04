import FetchError from '../utils/fetch-error';
import showToast from '../components/notification';

function Catch(fn) {
  return async function (...args) {
    let response;

    try {
      response = await fn.apply(this, args);
      return response;
    } catch (error) {
      if (error instanceof TypeError)
        console.error(new FetchError(response, error));

      setTimeout(() => {
        showToast(
          `API: something went wrong with getting ${this.data}`,
          'error'
        );
      }, 100);
    }
  };
}

export default Catch;
