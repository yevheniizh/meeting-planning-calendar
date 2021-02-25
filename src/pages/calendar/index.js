import members from '../../fixtures-members';
import meetings from '../../fixtures-meetings';

import { User, Admin } from '../../components/userRoles';
import LogInModal from '../../components/logIn-modal';

export default class Page {
  element; //html element
  subElements = {}; //selected elements
  components = {}; //imported initialized components

  constructor() {
    if (JSON.parse(localStorage.getItem('meetingsDB')) === null) {
      localStorage.setItem('meetingsDB', JSON.stringify(meetings));
    }

    localStorage.setItem('membersDB', JSON.stringify(members));
  }

  get template() {
    return `
      <div>
        <div data-element="calendar" id="calendarPage">
          <!-- Calendar component -->
        </div>
      </div>
    `;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    const getSessionUser = JSON.parse(sessionStorage.getItem('memberLoggedIn'));

    if (getSessionUser) {
      this.initComponents(getSessionUser);
      this.renderComponents();

      return this.element;
    }

    this.modal();

    return this.element;
  }

  modal() {
    const logInModal = new LogInModal();
    this.element.querySelector('#calendarPage').innerHTML = logInModal.template;

    const myModal = new bootstrap.Modal(
      this.element.querySelector('#staticBackdrop'),
      {}
    );

    myModal.show();

    const submitRoleButton = this.element.querySelector('#submitRoleButton');
    submitRoleButton.addEventListener('pointerdown', this.onDefineRights);
  }

  onDefineRights = () => {
    // set logged in member as default selected member in calendar dropdown
    const getMembers = this.element.querySelector('#membersDropdownModal');

    const getRights = getMembers.options[getMembers.selectedIndex].getAttribute(
      'data-rights'
    );

    // set session user rights
    sessionStorage.setItem('memberLoggedIn', JSON.stringify(getRights));

    document.querySelector('#staticBackdrop').remove();
    document.querySelector('.modal-backdrop').remove();

    this.initComponents(getRights);
    this.renderComponents();
  };

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  initComponents(rights) {
    if (rights === 'admin') {
      const calendar = new Admin();
      return (this.components.calendar = calendar);
    }

    const calendar = new User();
    return (this.components.calendar = calendar);
  }

  renderComponents() {
    Object.keys(this.components).forEach((component) => {
      const root = this.subElements[component];
      const { element } = this.components[component];

      root.append(element);
    });
  }

  destroy() {
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
  }
}
