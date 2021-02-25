import { v4 as uuidv4 } from 'uuid';
import escapeHtml from '../../utils/escape-html.js';

export default class CreateEvent {
  element; //html element
  start = 10;
  end = 18;
  duration = 1;
  days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  eventData = {}; // fixture data template

  constructor() {
    this.meetings = JSON.parse(localStorage.getItem('meetingsDB'));
    this.members = JSON.parse(localStorage.getItem('membersDB'));

    this.render();
  }

  onFormSubmit = (event) => {
    event.preventDefault();
    this.setEventData(this.element);

    if (!this.eventData.name.length || !this.eventData.members.length) {
      this.element.querySelector('#create-event__alert_error').style.display =
        'block';
    } else {
      this.element.querySelector('#create-event__alert_error').style.display =
        'none';
    }

    if (this.eventData.name.length && this.eventData.members.length) {
      this.element.querySelector('#create-event__alert_success').style.display =
        'block';

      // add event to storage
      localStorage.setItem(
        'meetingsDB',
        JSON.stringify([...this.meetings, this.eventData])
      );
      // meetings.push(this.eventData);

      setTimeout(() => {
        document.location.href = '/meeting-planning-calendar/';
      }, 500);
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
      [...allMembers].forEach((item) => (item.checked = !item.checked));
    });

    this.element.addEventListener('submit', this.onFormSubmit);
  }

  get template() {
    return `
    <div>
      <div class="alert alert-warning" role="alert" style='display: none;' id='create-event__alert_error'>
        Please fill out all fields.
      </div>
      <div class="alert alert-success" role="alert" style='display: none;' id='create-event__alert_success'>
        New event created!
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
          <a href='/meeting-planning-calendar/'>
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
            <label class="form-check-label">${member.name}</label>
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

  setEventData(element) {
    const chosenDay = element.querySelectorAll('[data-day]');
    const chosenTime = element.querySelectorAll('[data-time]');
    const chosenMembers = element.querySelectorAll('[data-member]');
    const setEventName = element.querySelector('[data-name]').value;

    this.eventData.id = uuidv4();
    this.eventData.name = escapeHtml(setEventName);
    this.eventData.day = Object.values(chosenDay).find(
      (item) => item.selected
    ).value;
    this.eventData.time = Object.values(chosenTime).find(
      (item) => item.selected
    ).value;
    this.eventData.members = Object.values(chosenMembers)
      .filter((item) => item.checked)
      .reduce((acc, item) => {
        return [...acc, { id: item.value }];
      }, []);
  }

  destroy() {
    this.element.remove();
  }
}
