import showToast from '../components/notification';

const BACKEND_URL = process.env.BACKEND_URL;
const SYSTEM = process.env.SYSTEM;
const ENTITY_EVENTS = process.env.ENTITY_EVENTS;
const ENTITY_USERS = process.env.ENTITY_USERS;

export default class Database {
  static instance() {
    if (!this._instance) {
      this._instance = new Database();
    }
    return this._instance;
  }

  async getUsers() {
    try {
      const response = await fetch(`${BACKEND_URL}/${SYSTEM}/${ENTITY_USERS}`);

      if (!response.ok) {
        try {
          const result = await response.statusText;
          showToast(`API: ${result}`, 'error');
        } catch (error) {
          console.log(error);
        }
      }

      try {
        const result = await response.json();

        if ((await result) === null)
          return showToast('API: no users', 'succesful');

        const users = await result.map((item) => ({
          id: item.id,
          data: JSON.parse(item.data),
        }));

        setTimeout(
          () => showToast('API: users downloaded succesfully', 'succesful'),
          100
        );

        return users;
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getData() {
    try {
      const response = await fetch(`${BACKEND_URL}/${SYSTEM}/${ENTITY_EVENTS}`);

      if (!response.ok) {
        try {
          const result = await response.statusText;
          showToast(`API: ${result}`, 'error');
        } catch (error) {
          console.log(error);
        }
      }

      try {
        const result = await response.json();

        if ((await result) === null)
          return showToast('API: no events', 'warning');

        const meetings = await result.map((item) => ({
          id: item.id,
          data: JSON.parse(item.data),
        }));

        setTimeout(
          () => showToast('API: data downloaded succesfully', 'succesful'),
          100
        );

        return meetings;
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteMeeting(chosenMeetingId) {
    try {
      const response = await fetch(
        `${BACKEND_URL}/${SYSTEM}/${ENTITY_EVENTS}/` + chosenMeetingId,
        {
          method: 'DELETE',
        }
      );

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
        const result = await response.status;
        console.log(result);

        showToast('API: event deleted succesfully', 'succesful');

        return response.ok;
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async sendFormData(newEventData) {
    // post event to server
    try {
      const response = await fetch(
        `${BACKEND_URL}/${SYSTEM}/${ENTITY_EVENTS}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({
            data: JSON.stringify(newEventData),
          }),
        }
      );

      if (!response.ok) {
        try {
          const result = await response.statusText;
          showToast(`API: ${result}`, 'error');
        } catch (error) {
          console.log(error);
        }
      }

      try {
        const result = await response.status;
        console.log(result);

        showToast('API: event posted succesfully', 'succesful');
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async checkTimeSlotAvailability(newEventData) {
    try {
      const response = await fetch(`${BACKEND_URL}/${SYSTEM}/${ENTITY_EVENTS}`);

      if (!response.ok) {
        try {
          const result = await response.statusText;
          showToast(`API: ${result}`, (status = 'error'));
        } catch (error) {
          console.log(error);
        }
      }

      try {
        const result = await response.json();

        (await result) === null
          ? (() => {
              this.sendFormData(newEventData);

              setTimeout(() => {
                document.location.href = '/';
              }, 500);

              showToast('No data', 'warning');
            })()
          : (() => {
              const isTableCellFull = result.some(
                (item) =>
                  JSON.parse(item.data).day === newEventData.day &&
                  JSON.parse(item.data).time === newEventData.time
              );

              isTableCellFull
                ? showToast(
                    'API: This time slot is already occupied. Please choose another day or time.',
                    'warning'
                  )
                : (() => {
                    this.sendFormData(newEventData);

                    setTimeout(() => {
                      document.location.href = '/';
                    }, 2000);
                  })();
            })();
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
