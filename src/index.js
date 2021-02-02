import Content from './pages/calendar';

export default class MainPage {
  element; //html element
  subElements = {}; //selected elements
  components = {}; //imported initialized components

  constructor() {
    this.render();
  }

  // initializeRouter() {
  //   this.router
  //     .addRoute(new RegExp(`^${URL_PATH}$`), 'calendar')
  //     .addRoute(new RegExp(`^${URL_PATH}$`), 'create-event')
  //     .addRoute(/404\/?$/, 'error404')
  //     .setNotFoundPagePath('error404')
  //     .listen();
  // }

  get template() {
    return `
      <main class='main'>
        <section class="content" id="content" data-element="content">
        
        </section>
      </main>
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
    const content = new Content();
    this.components.content = content;
  }

  renderComponents() {
    Object.keys(this.components).forEach((component) => {
      const root = this.subElements[component];
      const { element } = this.components[component];

      root.append(element);
    });
  }
}

const mainPage = new MainPage();

document.body.append(mainPage.element);

// mainPage.initializeRouter();
