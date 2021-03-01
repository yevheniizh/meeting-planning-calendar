export default (message = 'API response: succesful', status) => {
  const toastDelay = 2000;

  const toastTemplate = `
    <div class="toast calendar__toast_${status} align-items-center" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
      </div>
    </div>`;

  const toastContainer = document.querySelector('.toast-container');

  // tramsform toast template to html element
  const wrapper = document.createElement('div');
  wrapper.innerHTML = toastTemplate;
  const toastElement = wrapper.firstElementChild;

  toastContainer.appendChild(toastElement);

  const toast = toastContainer.lastElementChild;
  const toastRender = new bootstrap.Toast(toast, {
    animation: true,
    autohide: true,
    delay: toastDelay,
  });

  toastRender.show();

  setTimeout(() => {
    toastContainer.firstElementChild.remove();
  }, toastDelay);
};
