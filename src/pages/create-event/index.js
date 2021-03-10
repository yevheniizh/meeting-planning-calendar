import CreateEvent from '../../components/create-event/index.js';
import query from '../../database';

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
      <div aria-live="polite" aria-atomic="true" class="position-relative">
        <div class="toast-container position-fixed bottom-0 end-0 p-3">
          <!-- toast element -->
        </div>
      </div>
    </div>`;
  }

  async render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    // query data from database
    const response = await query.response('get', 'users');
    this.users = await response.define();

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
    Object.values(this.components).forEach((component) => component.destroy());
  }
}
