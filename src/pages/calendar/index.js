export default class Page {
  element;

  constructor(teamMembers, events) {
    this.events = events;
    this.teamMembers = teamMembers;

    this.render();
  }

  get template() {
    return `
      <main>
        <div class='calendar__handling'>
          <div>
            <h1 class='page-title'>Calendar</h1>
          </div>
          <div class='block'>
            <div class='calendar__handling-dropdown'>
              ${this.getTeamMemberEventsList()}
            </div>
            <div class='calendar__handling-newEventCreatingButton'>
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

        <div class='calendar__timeline'>
          <ul class='calendar__timeline-column'>
            <li>Name</li>
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

          <div class='events'>
            <ul class='wrap'>
              <li class="events-group">
                <div class="top-info"><span>Mon</span></div>
              </li>

              <li class="events-group">
                <div class="top-info"><span>Tue</span></div>

              <li class="events-group">
                <div class="top-info"><span>Wed</span></div>

              <li class="events-group">
                <div class="top-info"><span>Thu</span></div>

              <li class="events-group">
                <div class="top-info"><span>Fri</span></div>
              </li>
            </ul>
          </div>
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
            return `<option value="${member.name}">${member.name}</option>`;
          })
          .join('')}
      </select>
    `;
  }
}
