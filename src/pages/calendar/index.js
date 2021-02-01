export default class Page {
  element;

  constructor(teamMembers, events) {
    this.events = events;
    this.teamMembers = teamMembers;

    this.render();
  }

  get template() {
    return `
      <main class='calendar'>
        <div class='calendar__header'>
          <div>
            <h1>Calendar</h1>
          </div>
          <div class='calendar__header_handling'>
            <div class='calendar__header_handling-dropdown'>
              ${this.getTeamMemberEventsList()}
            </div>
            <div class='calendar__header_handling-newEventCreatingButton'>
              <button
                type='submit'
                name='newEvent'
                class='btn btn-outline-dark bg-secondary'
              >
                New event +
              </button>
            </div>
          </div>
        </div>

        <div class='calendar__table'>
          <ul class='calendar__table-column'>
            <li class='calendar__table-column-header'>Name</li>
            <li>10:00</li>
            <li>11:00</li>
            <li>12:00</li>
            <li>13:00</li>
            <li>14:00</li>
            <li>15:00</li>
            <li>16:00</li>
            <li>17:00</li>
            <li>18:00</li>
          </ul>

          <ul class='calendar__table-column'>
            <li class='calendar__table-column-header'>Mon</li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li>
              <div>
                Test
              </div>
            </li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        
          <ul class='calendar__table-column'>
            <li class='calendar__table-column-header'>Tue</li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
          
          <ul class='calendar__table-column'>
            <li class='calendar__table-column-header'>Wed</li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
          <ul class='calendar__table-column'>
            <li class='calendar__table-column-header'>Thu</li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
          <ul class='calendar__table-column'>
            <li class='calendar__table-column-header'>Fri</li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
      </main>
    `;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;

    this.element = element.firstElementChild;
  }

  getTeamMemberEventsList() {
    return `
      <select class='form-select form-select-lg border-dark bg-white'>
        <option selected>All members</option>
        ${this.teamMembers
          .map((member) => {
            return `<option value='${member.name}'>${member.name}</option>`;
          })
          .join('')}
      </select>
    `;
  }
}
