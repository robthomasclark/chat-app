const users = [];
const rooms = [];

const addUser = ({id, username, room}) => {
    //clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //validate the data
    if (!username || !room) {
        return {error: 'User name and/or room is required'};
    }

    const existingUser = users.find((user) => {
        return user.room === room && user.username === username;
    });

    if (existingUser) {
        return {error: 'User is already in room'};
    }

    const user = {id, username, room};
    users.push(user);
    //if the room isn't in the room list, add it
    roomInList = rooms.find((r) => r.name === room);
     if (!roomInList) {
        rooms.push({name: room});
    }
    return user;
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room);
}

const getRoomList = () => {
    return rooms;
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getRoomList
}