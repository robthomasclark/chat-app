const { generateMessage } = require('../src/utils/messages');

test('should get a valid message object', () => {
    const msg = generateMessage('Rob', 'Hello there');
    console.log(msg)
    expect(msg.createdAt).toEqual(expect.any(Number));
})