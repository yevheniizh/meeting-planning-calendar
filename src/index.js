import Router from './router/index.js';

export default class MainPage {
  constructor() {
    this.router = Router.instance();
    this.render();
  }

  initializeRouter() {
    this.router
      // .addRoute(/^$/, 'calendar')
      // .addRoute(/^create-event$/, 'create-event')
      .addRoute(/^meeting-planning-calendar$/, 'calendar')
      .addRoute(/^meeting-planning-calendar\/create-event$/, 'create-event')
      .addRoute(/404\/?$/, 'error404')
      .setNotFoundPagePath('error404')
      .listen();
  }

  get template() {
    return `<main class='main'>
        <section class='content' id='content'>
        
        </section>
      </main>`;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    document.body.append(this.element);
  }
}

const mainPage = new MainPage();

document.body.append(mainPage.element);

mainPage.initializeRouter();
