/* eslint-disable no-undef */
import query from './index.js';
import meetingsMock from '../fixtures-meetings';
import { membersMock } from '../fixtures-members';

describe('tests-for-async-CRUD-operations', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should get meetings from server', async () => {
    const correctFormatOfMeetingsMock = [...meetingsMock].reduce(
      (acc, item) => {
        const newItem = {
          id: item.id,
          data: JSON.stringify(item.data),
        };

        return [...acc, newItem];
      },
      []
    );

    fetchMock.mockResponseOnce(JSON.stringify(correctFormatOfMeetingsMock));

    const response = await query.response('get', 'events');
    const meetingsFromServer = await response.define();

    expect(response.constructor.name).toBe('Get');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(meetingsFromServer).toEqual(meetingsMock);
  });

  it('should get users from server', async () => {
    const correctFormatOfMembersMock = [...membersMock].reduce((acc, item) => {
      const newItem = {
        id: item.id,
        data: JSON.stringify(item.data),
      };

      return [...acc, newItem];
    }, []);

    fetchMock.mockResponseOnce(JSON.stringify(correctFormatOfMembersMock));

    const response = await query.response('get', 'users');
    const usersFromServer = await response.define();

    expect(response.constructor.name).toBe('Get');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(usersFromServer).toEqual(membersMock);
  });

  it('should delete event from server', async () => {
    const response = await query.response('delete', '0000-0000-0000-0001');
    const isResponseOK = await response.define();

    expect(response.constructor.name).toBe('Delete');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(isResponseOK).toBeTruthy();
  });
});
