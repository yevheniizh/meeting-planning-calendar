export default class Calendar {
  element; //html element
  subElements = {};
  start = 10;
  end = 18;
  duration = 1;

  onRemoveMeetingClick = (event) => {
    const chosenMeeting = event.target.closest('[data-meeting]');
    const chosenMeetingName = chosenMeeting.dataset.name;

    const modal = confirm(
      `Are you sure you want to delete '${chosenMeetingName}' event?`
    );

    if (modal) {
      chosenMeeting.remove();
    }
  };

  constructor(members, meetings) {
    this.meetings = meetings;
    this.members = members;

    this.render();
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTable();

    const element = wrapper.firstElementChild;
    this.element = element;

    this.renderMeetings();

    this.subElements = this.getSubElements(this.element);

    this.initEventListeners();

    return this.element;
  }

  getSubElements(element) {
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
        <option selected value='All members'>All members</option>
        ${this.members
          .map((member) => {
            return `<option value='${member.name}'>${member.name}</option>`;
          })
          .join('')}
      </select>
    </div>`;
  }

  get getEventButton() {
    return `
    <div class='calendar__header_handling-newEventCreatingButton'>
      <button
        type='submit'
        name='newEvent'
        class='btn btn-outline-dark'
      >New event +</button>
    </div>`;
  }

  getTableBody() {
    return `
    <div class='calendar__table'>
      <ul class='calendar__table-column' data-day='Name'>
        <li class='calendar__table-column-header'>
          Name
        </li>
        ${this.getTableHoursColumn()}
      </ul>

      <ul class='calendar__table-column' data-day='Mon'>
        <li class='calendar__table-column-header'>
          Mon
        </li>
        ${this.getTableColumn()}
      </ul>

      <ul class='calendar__table-column' data-day='Tue'>
        <li class='calendar__table-column-header'>
          Tue
        </li>
        ${this.getTableColumn()}
      </ul>

      <ul class='calendar__table-column' data-day='Wed'>
        <li class='calendar__table-column-header'>
          Wed
        </li>
        ${this.getTableColumn()}
      </ul>

      <ul class='calendar__table-column' data-day='Thu'>
        <li class='calendar__table-column-header'>
          Thu
        </li>
        ${this.getTableColumn()}
      </ul>

      <ul class='calendar__table-column' data-day='Fri'>
        <li class='calendar__table-column-header'>
          Fri
        </li>
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

  renderMeetings(meetings = this.meetings) {
    const arr = [...meetings];
    arr.map((meeting) => {
      const currentColumn = this.element.querySelector(
        `[data-day='${meeting.day}']`
      );
      const currentRow = currentColumn.querySelector(
        `[data-time='${meeting.time}']`
      );

      return (currentRow.innerHTML = `
      <div data-meeting='${meeting.id}' data-name='${meeting.name}' style='visibility: visible'>
        <a href='/meetings/${meeting.id}' class='calendar__table-column_meeting'>
          ${meeting.name}
        </a>
        <span class='calendar__table-column_meeting_delete' data-element='header'>&times;</span>
      </div>`);
    });
  }

  initEventListeners() {
    //remove event from calendar
    for (let key of Object.keys(this.subElements)) {
      this.subElements[key].addEventListener(
        'pointerdown',
        this.onRemoveMeetingClick
      );
    }

    //filter events by team member
    const membersDropdown = this.element.querySelector('#membersDropdown');

    membersDropdown.addEventListener('change', () => {
      const chosenMember = membersDropdown.value;
      this.filterMeetings(chosenMember);
    });
  }

  filterMeetings(chosenMember = 'All members') {
    if (chosenMember === 'All members') {
      for (let item of Object.keys(this.subElements)) {
        this.subElements[item].style.visibility = 'visible';
      }

      return [...this.meetings];
    }

    const meetings = [...this.meetings];
    const members = [...this.members];
    const idOfChosenMember = members.find(({ name }) => name === chosenMember)
      .id;

    // get all meetings that must be disabled
    const filteredMeetings = meetings
      .filter(({ members }) =>
        members.every(({ id }) => id !== idOfChosenMember)
      )
      .map((item) => item.id);

    // insert style = 'display: none' into filtered meetings
    for (let item of filteredMeetings) {
      if (Object.keys(this.subElements).includes(item)) {
        for (let item of Object.keys(this.subElements)) {
          this.subElements[item].style.visibility = 'visible';
        }

        this.subElements[item].style.visibility = 'hidden';
      }
    }
  }
}
