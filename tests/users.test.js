const {addUser, removeUser, getUser, getUsersInRoom} = require('../src/utils/users');

const userOneObject = {
    id: 1,
    username: 'Robert Clark',
    room: "My Room"
};

const userTwoObject = {
    id: 2,
    username: 'Betty Clark',
    room: "My Room"
};

const invalidUserObject = {
    id: 2,
    username: '',
    room: "My Room"
};

let userOne = null;
let invalidUser = null;

beforeEach(() => {
    removeUser(1);
    removeUser(2);
    userOne = addUser(userOneObject)
    invalidUser = addUser(invalidUserObject)
    //console.log(getUsersInRoom('my room'));
})

test('Should be able to add valid user', () => {
    expect(userOne).toMatchObject({
        id: 1,
        username: 'robert clark',
        room: 'my room'
    })
})

test('Should not be able to add invalid user', () => {
    expect(invalidUser).toMatchObject({
        error: 'User name and/or room is required'
    })
})

test('Should not be able to add user to same room more than once', () => {
    const user2 = addUser(userOneObject);
    expect(user2).toMatchObject({
        error: 'User is already in room'
    })
    console.log
})

test('Should get users in room', () => {
    const user2 = addUser(userTwoObject);
    expect (getUsersInRoom(user2.room).length).toEqual(2)
})

test('Should remove user from room', () => {
    const user2 = addUser(userTwoObject);
    expect (getUsersInRoom(user2.room).length).toEqual(2)
    removeUser(1);
    expect (getUsersInRoom(user2.room).length).toEqual(1)
})
