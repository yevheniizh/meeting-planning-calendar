import { User, Admin } from '../../components/userRoles';
import LogInModal from '../../components/logIn-modal';

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
      </div>
    `;
  }

  async getUsers() {
    const system = 'yevhenii_zhyrov';
    const users = 'users';

    const response = await fetch(
      `http://158.101.166.74:8080/api/data/${system}/${users}`
    );

    const result = await response.json();

    if ((await result) === null) return console.log('No users');

    this.users = await result.map((item) => ({
      id: item.id,
      data: JSON.parse(item.data),
    }));
  }

  async getData() {
    const system = 'yevhenii_zhyrov';
    const entity = 'events';

    const response = await fetch(
      `http://158.101.166.74:8080/api/data/${system}/${entity}`
    );

    const result = await response.json();

    if ((await result) === null) return console.log('No data');

    this.meetings = await result.map((item) => ({
      id: item.id,
      data: JSON.parse(item.data),
    }));
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
  //   const system = 'yevhenii_zhyrov';
  //   const users = 'users';

  //   const response = await fetch(
  //     `http://158.101.166.74:8080/api/data/${system}/${users}`,
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json;charset=utf-8',
  //       },
  //       body: JSON.stringify({
  //         data: JSON.stringify(membersTemplate[0]),
  //       }),
  //     }
  //   );

  //   const result = await response.status;
  //   console.log(result);
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
