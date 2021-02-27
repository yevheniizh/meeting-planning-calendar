import CreateEvent from '../../components/create-event/index.js';

export default class Page {
  element; //html element
  subElements = {}; //selected elements
  components = {}; //imported initialized components
  users = {};

  get template() {
    return `<div>
      <div data-element="createEvent">
        <!-- CreateEvent component -->
      </div>
    </div>`;
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

  async render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    await this.getUsers();

    this.initComponents();

    this.renderComponents();

    return this.element;
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  initComponents() {
    const createEvent = new CreateEvent(this.users);
    this.components.createEvent = createEvent;
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
