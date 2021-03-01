import escapeHtml from '../../utils/escape-html.js';
import showToast from '../notification';

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
      showToast('Please fill out all fields', 'warning');
    }

    if (newEventData.name.length && newEventData.members.length) {
      this.checkTimeSlotAvailability(newEventData);
    }
  };

  async checkTimeSlotAvailability(newEventData) {
    try {
      const response = await fetch(`${BACKEND_URL}/${SYSTEM}/${ENTITY_EVENTS}`);

      if (!response.ok) {
        try {
          const result = await response.statusText;
          return showToast(`API: ${result}`, (status = 'error'));
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
                document.location.href = '/meeting-planning-calendar/';
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
                ? showToast(
                    'API: This time slot is already occupied. Please choose another day or time.',
                    'warning'
                  )
                : (() => {
                    this.sendFormData(newEventData);

                    setTimeout(() => {
                      document.location.href = '/meeting-planning-calendar/';
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
          return showToast(`API: ${result}`, (status = 'error'));
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
      <form class='create-event__form'>
        <div class='create-event__form-element'>
          <div class='create-event__form-description'>
            Name of the event:
          </div>
          <div class='create-event__form-input'>
            <input
              placeholder='Type here'
              type='search'
              class='form-control'
              data-name='name'
            />
          </div>
        </div>

        <div class='create-event__form-element'>
          <div class='create-event__form-description'>
            Participants:
          </div>
          ${this.getMembersDropdown()}
        </div>

        <div class='create-event__form-element'>
          <div class='create-event__form-description'>
            Day:
          </div>
          ${this.getDaysDropdown()}
        </div>

        <div class='create-event__form-element'>
          <div class='create-event__form-description'>
            Time:
          </div>
          ${this.getEventHoursDropdown()}
        </div>

        <div class='create-event__buttons-container'>
          <a href='/meeting-planning-calendar/'>
            <button type="button" class="btn btn-outline-dark create-event__button">Cancel</button>
          </a>

          <button type="submit" class="btn btn-outline-dark create-event__button">Create</button>
        </div>
      </form>
    </div>`;
  }

  getMembersDropdown() {
    return `
    <div class='create-event__form-input_multiselect'>
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
    <div class='create-event__form-input'>
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
    <div class='create-event__form-input'>
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
