import { User, Admin } from '../../components/userRoles';
import LogInModal from '../../components/logIn-modal';
import showToast from '../../components/notification';

const BACKEND_URL = process.env.BACKEND_URL;
const SYSTEM = process.env.SYSTEM;
const ENTITY_EVENTS = process.env.ENTITY_EVENTS;
const ENTITY_USERS = process.env.ENTITY_USERS;

export default class Page {
  element; //html element
  subElements = {}; //selected elements
  components = {}; //imported initialized components
  meetings = {};
  users = {};

  get template() {
    return `
      <div>
        <div data-element="calendar" id="calendarPage">
          <!-- Calendar component -->
        </div>
        <div aria-live="polite" aria-atomic="true" class="position-relative">
          <div class="toast-container position-fixed bottom-0 end-0 p-3">

          </div>
        </div>
      </div>
    `;
  }

  async getUsers() {
    try {
      const response = await fetch(`${BACKEND_URL}/${SYSTEM}/${ENTITY_USERS}`);

      if (!response.ok) {
        try {
          const result = await response.statusText;
          return showToast(`API: ${result}`, 'error');
        } catch (error) {
          console.log(error);
        }
      }

      try {
        const result = await response.json();

        if ((await result) === null)
          return showToast('API: no users', 'succesful');

        this.users = await result.map((item) => ({
          id: item.id,
          data: JSON.parse(item.data),
        }));

        setTimeout(
          () => showToast('API: users downloaded succesfully', 'succesful'),
          100
        );
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getData() {
    try {
      const response = await fetch(`${BACKEND_URL}/${SYSTEM}/${ENTITY_EVENTS}`);

      if (!response.ok) {
        try {
          const result = await response.statusText;
          return showToast(`API: ${result}`, 'error');
        } catch (error) {
          console.log(error);
        }
      }

      try {
        const result = await response.json();

        if ((await result) === null)
          return showToast('API: no events', 'warning');

        this.meetings = await result.map((item) => ({
          id: item.id,
          data: JSON.parse(item.data),
        }));

        setTimeout(
          () => showToast('API: data downloaded succesfully', 'succesful'),
          100
        );
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    await this.getData();
    await this.getUsers();

    const getSessionUser = JSON.parse(sessionStorage.getItem('memberLoggedIn'));

    if (getSessionUser) {
      this.initComponents(getSessionUser.rights);
      this.renderComponents();

      return this.element;
    }

    this.modal();

    return this.element;
  }

  // async sendUsersToServer() {
  //   // post users to server
  //   try {
  //     const response = await fetch(`${BACKEND_URL}/${SYSTEM}/${ENTITY_USERS}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json;charset=utf-8',
  //       },
  //       body: JSON.stringify({
  //         data: JSON.stringify(membersTemplate[0]),
  //       }),
  //     });

  //     const result = await response.status;
  //     console.log(result);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  modal() {
    const logInModal = new LogInModal(this.users);
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

    const getName = getMembers.value;
    const getRights = getMembers.options[getMembers.selectedIndex].getAttribute(
      'data-rights'
    );

    const memberLoggedInData = { name: getName, rights: getRights };

    // set session user rights
    sessionStorage.setItem(
      'memberLoggedIn',
      JSON.stringify(memberLoggedInData)
    );

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
      const calendar = new Admin(this.meetings, this.users);
      return (this.components.calendar = calendar);
    }

    const calendar = new User(this.meetings, this.users);
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
