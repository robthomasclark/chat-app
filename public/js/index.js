const socket = io();

//templates
const roomListTemplate = document.querySelector('#roomlist-template').innerHTML;
const $meHeader = document.querySelector('#me-header');

$meHeader.href = 'logout';
$meHeader.text = 'Logout';


socket.on('roomlist', (roomList) => {
    const html = Mustache.render(roomListTemplate, {
        //roomlist is array of objects of form {room: 'name'}
        rooms: roomList
    });
    document.querySelector('#roomSelector').innerHTML = html;
});

//console.log('emitting getroomlist');
socket.emit('getroomlist');
