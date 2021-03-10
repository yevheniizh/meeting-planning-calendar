/* eslint-disable no-useless-constructor */
import Calendar from '../calendar';

export class User extends Calendar {
  constructor(meetings, users) {
    super(meetings, users);
  }

  canDeleteMeetings() {
    return false;
  }

  canCreateMeetings() {
    return false;
  }
}

export class Admin extends User {
  constructor(meetings, users) {
    super(meetings, users);
  }

  canDeleteMeetings() {
    return true;
  }

  canCreateMeetings() {
    return true;
  }
}
