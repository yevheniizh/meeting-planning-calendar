/* eslint-disable no-undef */
import Calendar from './index.js';
import meetingsMock from '../../fixtures-meetings';
import { membersMock } from '../../fixtures-members';

describe('tests-for-calendar-component', () => {
  let calendar;

  beforeEach(() => {
    fetchMock.resetMocks();
    sessionStorage.setItem(
      'memberLoggedIn',
      JSON.stringify({ name: 'Polina', rights: 'admin' })
    );
    Calendar.prototype.canCreateMeetings = () => true;
    Calendar.prototype.canDeleteMeetings = () => true;
    calendar = new Calendar(meetingsMock, membersMock);
    document.body.append(calendar.element);
  });

  afterEach(() => {
    calendar.destroy();
    calendar = null;
  });

  it('should be rendered correctly', () => {
    expect(calendar.element).toBeVisible();
    expect(calendar.element).toBeInTheDocument();
  });

  it('should have ability to be destroyed', () => {
    calendar.destroy();

    expect(calendar.element).not.toBeInTheDocument();
  });

  it('should render loaded meetings correctly', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(meetingsMock));

    await calendar.render();

    expect(calendar.meetings.length).toEqual(5);

    const [meeting1] = calendar.meetings;

    expect(meeting1).toStrictEqual({
      data: {
        day: 'Mon',
        members: [
          { id: '0001' },
          { id: '0002' },
          { id: '0003' },
          { id: '0004' },
        ],
        name: 'Daily Standup',
        time: '11:00',
      },
      id: '0000-0000-0000-0001',
    });
  });

  it('should render loaded users correctly', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(membersMock));

    await calendar.render();

    expect(calendar.users.length).toEqual(4);

    const [member1] = calendar.users;

    expect(member1).toStrictEqual({
      id: '0001',
      data: { name: 'Polina', rights: 'admin' },
    });
  });
});
