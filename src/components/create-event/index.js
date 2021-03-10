import escapeHtml from '../../utils/escape-html.js';
import showToast from '../notification';
import query from '../../database/index.js';

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
      .reduce((acc, item) => [...acc, { id: item.value }], []);

    if (!newEventData.name.length || !newEventData.members.length) {
      showToast('Please fill out all fields', 'warning');
    }

    if (newEventData.name.length && newEventData.members.length) {
      const checkResponse = await query.response(
        'isTimeSlotEmpty',
        newEventData
      );
      const isResponseOK = await checkResponse.define();

      if (isResponseOK) {
        const postResponse = await query.response('post', newEventData);
        await postResponse.define();

        setTimeout(() => {
          document.location.href = '/';
        }, 2000);
      }
    }
  };

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
      [...allMembers].forEach((item) => {
        item.checked = !item.checked;
      });
    });

    this.element.addEventListener('submit', this.onFormSubmit);
  }

  get template() {
    return `
    <div>
      <form class='create-event__form'>
        <div class='create-event__form-element'>
          <div class='create-event__form-description'>
            Name of the event
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
            Participants
          </div>
          ${this.getMembersDropdown()}
        </div>

        <div class='create-event__form-element'>
          <div class='create-event__form-description'>
            Day
          </div>
          ${this.getDaysDropdown()}
        </div>

        <div class='create-event__form-element'>
          <div class='create-event__form-description'>
            Time
          </div>
          ${this.getEventHoursDropdown()}
        </div>

        <div class='create-event__form-element'>
          <button type="submit" class="btn btn-outline-dark create-event__button_create">Create</button>
        </div>

        <div class='create-event__form-element'>
          <a href='/'>
            <button type="button" class="btn btn-outline-dark create-event__button_cancel">Cancel</button>
          </a>
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
        .map(
          (member) => `
          <div class="form-check">
            <input class="form-check-input" class="member" type="checkbox" data-member=${member.id} value=${member.id}>
            <label class="form-check-label">${member.data.name}</label>
          </div>`
        )
        .join('')}
    </div>`;
  }

  getDaysDropdown() {
    return `
    <div class='create-event__form-input'>
      <select class='form-select form-select-lg'>
        ${this.days
          .map(
            (day) => `<option data-day='${day}' value='${day}'>${day}</option>`
          )
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
    const a = [];

    for (let i = this.start; i <= this.end; i += this.duration) {
      a.push(`<option data-time='${i}'>${i}:00</option>`);
    }

    return a.join('');
  }

  destroy() {
    this.element.remove();
  }
}
