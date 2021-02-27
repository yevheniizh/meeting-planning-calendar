export default class LogInModal {
  constructor(users) {
    this.members = users;
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
                    return `<option value='${member.data.name}' data-rights='${member.data.rights}'>${member.data.name} (${member.data.rights})</option>`;
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
