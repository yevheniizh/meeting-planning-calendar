export default class CreateEvent {
  element; //html element
  start = 10;
  end = 18;
  duration = 1;
  days = ['Monday', 'Thuesday', 'Wednesday', 'Thirsday', 'Friday'];

  constructor(members, meetings) {
    this.meetings = meetings;
    this.members = members;

    this.render();
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
  }

  get template() {
    return `
    <div>
      <div>
        <span>Name of the event</span>
        <input
          placeholder='Type here'
          type='search'
          class='form-control rounded'
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
        <button type="button" class="btn btn-secondary">Cancel</button>
        <button type="button" class="btn btn-primary">Create</button>
      </div>
    </div>`;
  }

  getMembersDropdown() {
    return `
    <div style='height:3rem; overflow: scroll'>
      <div class="form-check">
        <input class="form-check-input"type="checkbox" id='allMembersCheckbox' value='All members'>
        <label class="form-check-label" for="allMembersCheckbox">All members</label>
      </div>
      ${this.members
        .map((member) => {
          return `
          <div class="form-check">
            <input class="form-check-input" class="member" type="checkbox" data-member=${member.id} value=${member.name}>
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
            return `<option value='${day}'>${day}</option>`;
          })
          .join('')}
      </select>
    </div>`;
  }

  getEventHoursDropdown() {
    return `
    <div class='calendar__header_handling-dropdown'>
      <select class='form-select form-select-lg' data-id='membersDropdown'>
        ${this.getEventHours()}
      </select>
    </div>`;
  }

  getEventHours() {
    let a = [];

    for (let i = this.start; i <= this.end; i = i + this.duration) {
      a.push(`<option>${i}:00</option>`);
    }

    return a.join('');
  }

  initEventListener;
}
