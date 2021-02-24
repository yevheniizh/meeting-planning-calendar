import Calendar from '../calendar';

export class User extends Calendar {
  constructor() {
    super();
  }

  canDeleteMeetings() {
    return false;
  }

  canCreateMeetings() {
    return false;
  }
}

export class Admin extends User {
  constructor() {
    super();
  }

  canDeleteMeetings() {
    return true;
  }

  canCreateMeetings() {
    return true;
  }
}
