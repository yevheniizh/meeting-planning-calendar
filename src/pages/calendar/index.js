import Calendar from '../../components/calendar/index.js';
import teamMembers from '../../fixtures-team-members';
import meetings from '../../fixtures-meetings';

export default class Page {
  element; //html element
  subElements = {}; //selected elements
  components = {}; //imported initialized components

  constructor() {
    this.render();
  }

  get template() {
    return `
      <div class='schedule'>
        <div data-element="calendar">
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

    this.initComponents();

    this.renderComponents();
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  initComponents() {
    const calendar = new Calendar(teamMembers, meetings);
    this.components.calendar = calendar;
  }

  renderComponents() {
    Object.keys(this.components).forEach((component) => {
      const root = this.subElements[component];
      const { element } = this.components[component];

      root.append(element);
    });
  }
}
