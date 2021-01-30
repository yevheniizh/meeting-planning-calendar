export default class Calendar {
  element; //html element

  constructor(teamMembers, events) {
    this.events = events;
    this.teamMembers = teamMembers;

    this.render();
  }

  get template() {
    return `
      <div>
        ${this.getTeamMemberEventsList()}
        ${this.getNewEventTemplate()}
      </div>
    `;
  }

  getTeamMemberEventsList() {
    return `
      <div>
        <select>
          <option>All members</option>
          ${this.teamMembers
            .map((member) => {
              return `<option>${member.name}</option>`;
            })
            .join('')}
        </select>
      </div>
    `;
  }

  getNewEventTemplate() {
    return `
      <div>
        <button type='submit' name='newEvent'>
          New event
        </button>
      </div>
    `;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template;

    const element = wrapper.firstElementChild;
    this.element = element;
  }

  update(data) {
    this.subElements.body.innerHTML = this.getColumnBody(data);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}
