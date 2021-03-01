import CreateEvent from '../../components/create-event/index.js';

const BACKEND_URL = process.env.BACKEND_URL;
const SYSTEM = process.env.SYSTEM;
const ENTITY_USERS = process.env.ENTITY_USERS;

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
    try {
      const response = await fetch(`${BACKEND_URL}/${SYSTEM}/${ENTITY_USERS}`);

      if (!response.ok) {
        try {
          const result = await response.statusText;
          return console.log(result);
        } catch (error) {
          console.log(error);
        }
      }

      try {
        const result = await response.json();

        if ((await result) === null) return console.log('No users');

        this.users = await result.map((item) => ({
          id: item.id,
          data: JSON.parse(item.data),
        }));
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
