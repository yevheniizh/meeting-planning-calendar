import showToast from '../components/notification';

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
    } else if (data === 'events') {
      this.url = `${BACKEND_URL}/${SYSTEM}/${ENTITY_EVENTS}`;
    } else {
      this.url = `${BACKEND_URL}/${SYSTEM}/${ENTITY_EVENTS}`;
    }

    this.options = {
      method: 'GET',
    };
  }

  async getTry(response) {
    const result = await response.json();

    if ((await result) === null)
      return showToast(`API: no ${this.data}`, 'warning');

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
    showToast(`API: event deleted succesfully`, 'succesful');

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
    delete: Delete,
  };

  /* this is the response body template for factory */
  response(type = 'get', data) {
    const Response = QueriesFactory.response[type];
    const query = new Response(data);
    query.type = type;
    query.define = async function () {
      try {
        const response = await fetch(this.url, this.options);

        if (!response.ok) {
          try {
            const result = await response.statusText;
            showToast(`API: ${result}`, 'error');

            return response.ok;
          } catch (error) {
            console.log(error);
          }
        }

        try {
          /**  for different responses this element has different body **/
          return await this.getTry(response);
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
    };

    return query;
  }
}

export default QueriesFactory.instance();
