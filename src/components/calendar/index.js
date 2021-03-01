import showToast from '../notification';

const BACKEND_URL = process.env.BACKEND_URL;
const SYSTEM = process.env.SYSTEM;
const ENTITY_EVENTS = process.env.ENTITY_EVENTS;

export default class Calendar {
  element; //html element
  subElements = {}; //html element, meetings
  start = 10;
  end = 18;
  duration = 1;

  onRemoveMeetingClick = async (event) => {
    const chosenMeeting = event.target.closest('[data-meeting]');
    const chosenMeetingId = chosenMeeting.dataset.meeting;
    const chosenMeetingName = chosenMeeting.dataset.name;

    const modal = confirm(
      `Are you sure you want to delete '${chosenMeetingName}' event?`
    );

    if (modal) {
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
            return showToast(`API: ${result}`, 'error');
          } catch (error) {
            console.log(error);
          }
        }

        try {
          const result = await response.status;
          console.log(result);

          showToast('API: event deleted succesfully', 'succesful');

          chosenMeeting.remove();
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  constructor(meetings, users) {
    this.meetings = meetings;
    this.users = users;

    this.members = JSON.parse(localStorage.getItem('membersDB'));

    this.sessionUser = JSON.parse(sessionStorage.getItem('memberLoggedIn'));

    this.render();
  }

  async render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTable();

    const element = wrapper.firstElementChild;
    this.element = element;

    if (this.meetings.length) this.renderMeetings(this.meetings);

    this.subElements = this.getSubElements(this.element);

    this.initEventListeners();

    return this.element;
  }

  getSubElements(element = this.element) {
    const elements = element.querySelectorAll('[data-meeting]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.meeting] = subElement;

      return accum;
    }, {});
  }

  getTable() {
    return `
      <div class='calendar'>
        ${this.getTableHeader()}
        ${this.getTableBody()}
        ${this.getTableFooter()}
        <div aria-live="polite" aria-atomic="true" class="position-relative">
          <div class="toast-container position-fixed bottom-0 end-0 p-3">

          </div>
        </div>
      </div>`;
  }

  getTableFooter() {
    return `<div class='calendar__footer'>
      <div>
        You are logged in as ${this.sessionUser.name} (${this.sessionUser.rights})
      </div>
      <button type='button' class='btn btn-outline-secondary' id='logOutButton'>
        Log out
      </button>
    </div>`;
  }

  getTableHeader() {
    return `
      <div class='calendar__header'>
        <div>
          <h1>Calendar</h1>
        </div>
        <div class='calendar__header_handling'>
            ${this.getMembersDropdown()}
            ${this.getEventButton}
        </div>
      </div>
    `;
  }

  getMembersDropdown() {
    return `
    <div class='calendar__header_handling-dropdown'>
      <select class='form-select form-select-lg' id='membersDropdown'>
        <option value='All members'>All members</option>
        ${this.membersList}
      </select>
    </div>`;
  }

  get membersList() {
    return this.users
      .map((user) => {
        return `<option value='${user.data.name}' data-member='${user.data.name}'>${user.data.name}</option>`;
      })
      .join('');
  }

  get getEventButton() {
    if (this.canCreateMeetings()) {
      return `
    <div class='calendar__header_handling-newEventCreatingButton'>
      <a href='/create-event'>
        <button
          type='submit'
          name='newEvent'
          class='btn btn-outline-dark'
        >
        New event +
        </button>
      </a>
    </div>`;
    }

    return `
    <div class='calendar__header_handling-newEventCreatingButton'>
        <button
          type='submit'
          name='newEvent'
          class='btn btn-outline-dark disabled'
        >
        New event +
        </button>
    </div>`;
  }

  getTableBody() {
    return `<div class='calendar__table'>
      <ul class='calendar__table-column' data-day='Name'>
        <li class='calendar__table-column-header'>Name</li>
        ${this.getTableHoursColumn()}
      </ul>

      <ul class='calendar__table-column' data-day='Mon'>
        <li class='calendar__table-column-header'>Mon</li>
        ${this.getTableColumn()}
      </ul>

      <ul class='calendar__table-column' data-day='Tue'>
        <li class='calendar__table-column-header'>Tue</li>
        ${this.getTableColumn()}
      </ul>

      <ul class='calendar__table-column' data-day='Wed'>
        <li class='calendar__table-column-header'>Wed</li>
        ${this.getTableColumn()}
      </ul>

      <ul class='calendar__table-column' data-day='Thu'>
        <li class='calendar__table-column-header'>Thu</li>
        ${this.getTableColumn()}
      </ul>

      <ul class='calendar__table-column' data-day='Fri'>
        <li class='calendar__table-column-header'>Fri</li>
        ${this.getTableColumn()}
      </ul>
    </div>`;
  }

  getTableHoursColumn() {
    let a = [];

    for (let i = this.start; i <= this.end; i = i + this.duration) {
      a.push(`<li>${i}:00</li>`);
    }

    return a.join('');
  }

  getTableColumn() {
    let a = [];

    for (let i = this.start; i <= this.end; i = i + this.duration) {
      a.push(
        `<li
          data-time='${i}:00'
        ></li>`
      );
    }

    return a.join('');
  }

  renderMeetings(meetings) {
    const arr = [...meetings];
    arr.map((meeting) => {
      const currentColumn = this.element.querySelector(
        `[data-day='${meeting.data.day}']`
      );
      const currentRow = currentColumn.querySelector(
        `[data-time='${meeting.data.time}']`
      );

      if (this.canDeleteMeetings()) {
        return (currentRow.innerHTML = `
      <div data-meeting='${meeting.id}' data-name='${meeting.data.name}' style='visibility: visible'>
        <a href='/meetings/${meeting.id}' class='calendar__table-column_meeting'>
          ${meeting.data.name}
        </a>
        <button class='calendar__table-column_meeting_delete' data-delete='delete'>&times;</button>
      </div>`);
      }

      return (currentRow.innerHTML = `
      <div data-meeting='${meeting.id}' data-name='${meeting.data.name}' style='visibility: visible'>
        <div class='calendar__table-column_meeting'>
          ${meeting.data.name}
        </div>
      </div>`);
    });
  }

  initEventListeners() {
    // remove event from calendar
    if (this.canDeleteMeetings()) {
      const deleteButton = this.element.querySelectorAll('[data-delete]');
      for (let button of deleteButton) {
        button.addEventListener('pointerdown', this.onRemoveMeetingClick);
      }
    }

    // filter events by team member
    const membersDropdown = this.element.querySelector('#membersDropdown');
    membersDropdown.addEventListener('change', () => {
      const chosenMember = membersDropdown.value;
      this.filterMeetings(chosenMember);
    });

    // log out from user session
    const logOutButton = this.element.querySelector('#logOutButton');
    logOutButton.addEventListener('click', () => {
      sessionStorage.clear();
      window.location.reload();
    });
  }

  filterMeetings(chosenMember) {
    if (!this.meetings.length)
      return showToast('No events to filter', 'warning');

    if (chosenMember === 'All members') {
      for (let item of Object.keys(this.subElements)) {
        this.subElements[item].style.visibility = 'visible';
      }

      return [...this.meetings];
    }

    const meetings = [...this.meetings];
    const users = [...this.users];
    const idOfChosenMember = users.find(
      ({ data }) => data.name === chosenMember
    ).id;

    // get all meetings that must be disabled
    const filteredMeetings = meetings
      .filter((meeting) =>
        meeting.data.members.every((member) => member.id !== idOfChosenMember)
      )
      .map((item) => item.id);

    // insert style = 'display: visible' into all meetings
    for (let item of Object.keys(this.subElements)) {
      this.subElements[item].style.visibility = 'visible';
    }

    // insert style = 'display: none' into filtered¸ meetings
    for (let item of filteredMeetings) {
      if (Object.keys(this.subElements).includes(item)) {
        this.subElements[item].style.visibility = 'hidden';
      }
    }

    return filteredMeetings;
  }

  destroy() {
    this.element.remove();
  }
}
