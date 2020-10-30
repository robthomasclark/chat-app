const { generateMessage } = require('../src/utils/messages');

test('should get a valid message object', () => {
    const msg = generateMessage('Rob', 'Hello there');
    expect(msg.createdAt).toEqual(expect.any(Number));
})