import showToast from '../components/notification';
import Catch from './decorator';

const BACKEND_URL = process.env.BACKEND_URL;
const SYSTEM = process.env.SYSTEM;
const ENTITY_EVENTS = process.env.ENTITY_EVENTS;
const ENTITY_USERS = process.env.ENTITY_USERS;

class Get {
  constructor(data) {
    this.data = data;
    this.message = `${data} downloaded`;

    if (data === 'users') {
      this.url = `${BACKEND_URL}/${SYSTEM}/${ENTITY_USERS}`;
    }
    if (data === 'events') {
      this.url = `${BACKEND_URL}/${SYSTEM}/${ENTITY_EVENTS}`;
    }

    this.options = {
      method: 'GET',
    };
  }

  async getTry(response) {
    const result = await response.json();

    const dataResult = await result.map((item) => ({
      id: item.id,
      data: JSON.parse(item.data),
    }));

    setTimeout(
      () => showToast(`API: ${this.message} succesfully`, 'succesful'),
      100
    );

    return dataResult;
  }
}

class Post {
  constructor(data) {
    this.data = data;
    this.message = `${data} posted`;
    this.url = `${BACKEND_URL}/${SYSTEM}/${ENTITY_EVENTS}`;
    this.options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        data: JSON.stringify(data),
      }),
    };
  }

  async getTry() {
    showToast('API: event posted succesfully', 'succesful');
  }
}

class Delete {
  constructor(data) {
    this.data = data;
    this.url = `${BACKEND_URL}/${SYSTEM}/${ENTITY_EVENTS}/` + data;
    this.options = {
      method: 'DELETE',
    };
  }

  async getTry(response) {
    setTimeout(
      () => showToast(`API: event deleted succesfully`, 'succesful'),
      100
    );

    return response.ok;
  }
}

class IsTimeSlotEmpty {
  constructor(data) {
    this.data = data;
    this.url = `${BACKEND_URL}/${SYSTEM}/${ENTITY_EVENTS}`;
    this.options = {
      method: 'GET',
    };
  }

  async getTry(response) {
    const result = await response.json();

    if ((await result) === null) {
      showToast('No data', 'warning');
      return true;
    }

    const isTimeSlotFull = await result.some(
      (item) =>
        JSON.parse(item.data).day === this.data.day &&
        JSON.parse(item.data).time === this.data.time
    );

    if (isTimeSlotFull) {
      showToast(
        'API: This time slot is already occupied. Please choose another day or time',
        'warning'
      );
      return false;
    }

    return true;
  }
}

class Put {
  constructor(data) {
    this.data = data;
    this.url = `${BACKEND_URL}/${SYSTEM}/${ENTITY_EVENTS}/${data.id}`;
    this.options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        data: JSON.stringify(data.data),
      }),
    };
  }

  async getTry() {
    showToast('API: event changed succesfully', 'succesful');
  }
}

class QueriesFactory {
  static instance() {
    if (!this._instance) {
      this._instance = new QueriesFactory();
    }
    return this._instance;
  }

  static response = {
    get: Get,
    isTimeSlotEmpty: IsTimeSlotEmpty,
    post: Post,
    put: Put,
    delete: Delete,
  };

  /* this is the response body template for factory */
  response(type, data) {
    const Response = QueriesFactory.response[type];
    const query = new Response(data);
    query.type = type;

    const responseBody = async function () {
      const response = await fetch(this.url, this.options);

      if (!response.ok) {
        const message = `Error ${response.status}: ${response.statusText}`; // Not Found (for 404)
        showToast(`API: ${message}`, 'error');

        console.error(new FetchError(response, message));

        return response.ok;
      }

      /*  different body for different responses */
      return this.getTry(response);
    };

    /* Decorator */
    query.define = Catch(responseBody);

    return query;
  }
}

export default QueriesFactory.instance();
