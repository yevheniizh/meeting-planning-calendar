export default class LogInModal {
  constructor() {
    this.members = JSON.parse(localStorage.getItem('membersDB'));
  }

  get template() {
    return `
    <div class="modal fade modal-dialog"  id="staticBackdrop">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Who are You?</h5>
          </div>
          <div class="modal-body">
            <div class='calendar__header_handling-dropdown'>
              <select class='form-select form-select-lg' id='membersDropdownModal'>
                ${this.members
                  .map((member) => {
                    return `<option value='${member.name}' data-rights='${member.rights}'>${member.name} (${member.rights})</option>`;
                  })
                  .join('')}
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="submitRoleButton">Confirm</button>
          </div>
        </div>
      </div>
    </div>`;
  }
}
