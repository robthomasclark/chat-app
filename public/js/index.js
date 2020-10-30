const socket = io();

//if we are already logged in via JWT token, dont show username/password fields

//onsole.log('SessionToken', sessionStorage.getItem('token'))

if (sessionStorage.getItem('token')) {
    const $formlabel1 = document.querySelector('#label1');
    const $formlabel2 = document.querySelector('#label2');
    const $formusername = document.querySelector('#username')
    const $formpassword = document.querySelector('#password');

    $formlabel1.remove();
    $formlabel2.remove();
    $formusername.remove();
    $formpassword.remove();
}

//templates
const roomListTemplate = document.querySelector('#roomlist-template').innerHTML;

socket.on('roomlist', (roomList) => {
    const html = Mustache.render(roomListTemplate, {
        //roomlist is array of objects of form {room: 'name'}
        rooms: roomList
    });
    document.querySelector('#roomSelector').innerHTML = html;
});

//console.log('emitting getroomlist');
socket.emit('getroomlist');
