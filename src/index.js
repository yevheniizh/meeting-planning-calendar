export default class MainPage {
  constructor() {
    this.render();
  }

  get template() {
    return `
      <div>
        Hello world!
      </div>
    `;
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
