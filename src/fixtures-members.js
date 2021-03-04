export const members = [
  { id: '0001', name: 'Polina', rights: 'admin' },
  { id: '0002', name: 'Maria', rights: 'user' },
  { id: '0003', name: 'Bob', rights: 'user' },
  { id: '0004', name: 'Alex', rights: 'user' },
];

// users template to send to server
export const membersTemplate = [
  { id: 0, data: { name: 'Polina', rights: 'admin' } },
  { name: 'Polina', rights: 'admin' },
  { name: 'Maria', rights: 'user' },
  { name: 'Bob', rights: 'user' },
  { name: 'Alex', rights: 'user' },
];

export const noMembersMock = [
  { id: 0, data: { name: 'guest', rights: 'user' } },
];
