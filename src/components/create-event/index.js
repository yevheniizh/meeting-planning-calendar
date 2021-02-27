import escapeHtml from '../../utils/escape-html.js';

const BACKEND_URL = process.env.BACKEND_URL;
const SYSTEM = process.env.SYSTEM;
const ENTITY_EVENTS = process.env.ENTITY_EVENTS;

export default class CreateEvent {
  element; //html element
  start = 10;
  end = 18;
  duration = 1;
  days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  constructor(users) {
    this.members = users;

    this.render();
  }

  onFormSubmit = async (event) => {
    event.preventDefault();

    const chosenDay = this.element.querySelectorAll('[data-day]');
    const chosenTime = this.element.querySelectorAll('[data-time]');
    const chosenMembers = this.element.querySelectorAll('[data-member]');
    const setEventName = this.element.querySelector('[data-name]').value;

    const newEventData = {}; // event data template

    newEventData.name = escapeHtml(setEventName);
    newEventData.day = Object.values(chosenDay).find(
      (item) => item.selected
    ).value;
    newEventData.time = Object.values(chosenTime).find(
      (item) => item.selected
    ).value;
    newEventData.members = Object.values(chosenMembers)
      .filter((item) => item.checked)
      .reduce((acc, item) => {
        return [...acc, { id: item.value }];
      }, []);

    if (!newEventData.name.length || !newEventData.members.length) {
      this.element.querySelector('.create-event__alert_error').style.display =
        'block';
    }

    if (newEventData.name.length && newEventData.members.length) {
      this.checkTimeSlotAvailability(newEventData);
    }
  };

  async checkTimeSlotAvailability(newEventData) {
    try {
      const getEventsFromServer = await fetch(
        `${BACKEND_URL}/${SYSTEM}/${ENTITY_EVENTS}`
      );
      const result = await getEventsFromServer.json();

      (await result) === null
        ? (() => {
            this.element.querySelector(
              '.create-event__alert_success'
            ).style.display = 'block';

            this.sendFormData(newEventData);

            setTimeout(() => {
              document.location.href = '/';
            }, 500);
            console.log('No data');
          })()
        : (() => {
            const isTableCellFull = result.some(
              (item) =>
                JSON.parse(item.data).day === newEventData.day &&
                JSON.parse(item.data).time === newEventData.time
            );

            isTableCellFull
              ? (() => {
                  this.element.querySelector(
                    '.create-event__alert_error'
                  ).style.display = 'none';

                  this.element.querySelector(
                    '.create-event__alert_success'
                  ).style.display = 'none';

                  this.element.querySelector(
                    '.create-event__alert_occupied'
                  ).style.display = 'block';
                })()
              : (() => {
                  this.element
                    .querySelectorAll('.alert-warning')
                    .forEach((item) => (item.style.display = 'none'));

                  this.element.querySelector(
                    '.create-event__alert_success'
                  ).style.display = 'block';

                  this.sendFormData(newEventData);

                  setTimeout(() => {
                    document.location.href = '/';
                  }, 500);
                })();
          })();
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

      const result = await response.status;
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template;

    const element = wrapper.firstElementChild;
    this.element = element;

    this.initEventListeners();

    return this.element;
  }

  initEventListeners() {
    // set active all checkboxes
    const allMembersCheckbox = this.element.querySelector(
      '#allMembersCheckbox'
    );

    allMembersCheckbox.addEventListener('click', () => {
      const allMembers = document.querySelectorAll('[data-member]');
      [...allMembers].forEach((item) => (item.checked = !item.checked));
    });

    this.element.addEventListener('submit', this.onFormSubmit);
  }

  get template() {
    return `
    <div>
      <div class="alert alert-warning create-event__alert_error" role="alert" style='display: none;'>
        Please fill out all fields.
      </div>
      <div class="alert alert-success create-event__alert_success" role="alert" style='display: none;'>
        New event created!
      </div>
      <div class="alert alert-warning create-event__alert_occupied" role="alert" style='display: none;'>
        This time slot is already occupied. Please choose another day or time.
      </div>
      <form>
        <div>
          <span>Name of the event</span>
          <input
            placeholder='Type here'
            type='search'
            class='form-control rounded'
            data-name='name'
          />
        </div>

        <div>
          <span>Participants</span>
          ${this.getMembersDropdown()}
        </div>

        <div>
          <span>Day</span>
          ${this.getDaysDropdown()}
        </div>
        <div>
          <span>Time</span>
          ${this.getEventHoursDropdown()}
        </div>

        <div>
          <a href='/'>
            <button type="button" class="btn btn-secondary">Cancel</button>
          </a>

          <button type="submit" class="btn btn-primary">Create</button>
        </div>
      </form>
    </div>`;
  }

  getMembersDropdown() {
    return `
    <div style='height:2.5rem; overflow: scroll; border: 1px solid black'>
      <div class="form-check">
        <input class="form-check-input"type="checkbox" id='allMembersCheckbox' value='All members'>
        <label class="form-check-label" for="allMembersCheckbox">All members</label>
      </div>
      ${this.members
        .map((member) => {
          return `
          <div class="form-check">
            <input class="form-check-input" class="member" type="checkbox" data-member=${member.id} value=${member.id}>
            <label class="form-check-label">${member.data.name}</label>
          </div>`;
        })
        .join('')}
    </div>`;
  }

  getDaysDropdown() {
    return `
    <div>
      <select class='form-select form-select-lg'>
        ${this.days
          .map((day) => {
            return `<option data-day='${day}' value='${day}'>${day}</option>`;
          })
          .join('')}
      </select>
    </div>`;
  }

  getEventHoursDropdown() {
    return `
    <div class='calendar__header_handling-dropdown'>
      <select class='form-select form-select-lg'>
        ${this.getEventHours()}
      </select>
    </div>`;
  }

  getEventHours() {
    let a = [];

    for (let i = this.start; i <= this.end; i = i + this.duration) {
      a.push(`<option data-time='${i}'>${i}:00</option>`);
    }

    return a.join('');
  }

  destroy() {
    this.element.remove();
  }
}
