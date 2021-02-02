export default class Calendar {
  element; //html element

  constructor(teamMembers, events, { start = 10, end = 18, step = 1 } = {}) {
    this.start = start;
    this.end = end;
    this.step = step;
    this.events = events;
    this.teamMembers = teamMembers;

    this.render();
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTable();

    const element = wrapper.firstElementChild;
    this.element = element;
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
            ${this.getHandlingDropdown()}
            ${this.getEventButton}
        </div>
      </div>
    `;
  }

  getHandlingDropdown() {
    return `
    <div class='calendar__header_handling-dropdown'>
      <select class='form-select form-select-lg border-dark bg-white'>
        <option>All members</option>
        ${this.teamMembers
          .map((member) => {
            return `<option>${member.name}</option>`;
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
        class='btn btn-outline-dark bg-secondary'
      >
        New event +
      </button>
    </div>`;
  }

  getTableBody() {
    return `
      <div class='calendar__table'>
        <ul class='calendar__table-column' data-dayColumn='Name'>
          <li class='calendar__table-column-header'>
            Name
          </li>
          ${this.getTableHoursColumn()}
        </ul>
  
        <ul class='calendar__table-column' data-dayColumn='Mon'>
          <li class='calendar__table-column-header'>
            Mon
          </li>
          ${this.getTableColumn()}
        </ul>
  
        <ul class='calendar__table-column' data-dayColumn='Tue'>
          <li class='calendar__table-column-header'>
            Tue
          </li>
          ${this.getTableColumn()}
        </ul>
  
        <ul class='calendar__table-column' data-dayColumn='Wed'>
          <li class='calendar__table-column-header'>
            Wed
          </li>
          ${this.getTableColumn()}
        </ul>
  
        <ul class='calendar__table-column' data-dayColumn='Thu'>
          <li class='calendar__table-column-header'>
            Thu
          </li>
          ${this.getTableColumn()}
        </ul>
  
        <ul class='calendar__table-column' data-dayColumn='Fri'>
          <li class='calendar__table-column-header'>
            Fri
          </li>
          ${this.getTableColumn()}
        </ul>
      </div>
    `;
  }

  getTableHoursColumn() {
    let a = [];

    for (let i = this.start; i <= this.end; i = i + this.step) {
      a.push(`<li
          data-start='${i}:00'
          data-end='${i + this.step}:00'
        >${i}:00</li>`);
    }

    return a.join('');
  }

  getTableColumn() {
    let a = [];

    for (let i = this.start; i <= this.end; i = i + this.step) {
      a.push(
        `<li
          data-start='${i}:00'
          data-end='${i + this.step}:00'
        >
        </li>`
      );
    }

    return a.join('');
  }
}
