const socket = io();

//Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');
const $roomList = document.querySelector('#room-list');
const $meHeader = document.querySelector('#me-header');

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//Options
const { room } = Qs.parse(location.search, { ignoreQueryPrefix: true });
const username = sessionStorage.getItem('username');
const token = sessionStorage.getItem('token');
const email = sessionStorage.getItem('email');
//console.log('email', email);

$roomList.style.visibility = 'visible';
$meHeader.href = 'logout';
$meHeader.text = 'Logout';


const autoscroll = () => {
    const $newMessage = $messages.lastElementChild;
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;
    const visibleHeight = $messages.offsetHeight;
    const containerHeight = $messages.scrollHeight;
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }
}

socket.on('message', (msg) => {
    const html = Mustache.render(messageTemplate, {
        username: msg.username,
        message: msg.text,
        createdAt: moment(msg.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
});

socket.on('locationMessage', (msg) => {
    const html = Mustache.render(locationTemplate, {
        username: msg.username,
        url: msg.text,
        createdAt: moment(msg.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
});

socket.on('roomData', (roomData) => {
    const html = Mustache.render(sidebarTemplate, {
        room: roomData.room,
        email: sessionStorage.getItem('loggedInUser'),
        users: roomData.users
    });
    document.querySelector('#sidebar').innerHTML = html;
});

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    $messageFormButton.setAttribute('disabled', 'disabled');
    const message = e.target.elements.message.value;
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();

        if (error) {
            return console.log(error);
        }
        //console.log('Message Delivered');
    });
});

$sendLocationButton.addEventListener('click', (e) => {
    if (!navigator.geolocation) {
        return alert('Your browser does not support geolocation, please use a modern browser');
    }
    e.preventDefault();

    $sendLocationButton.setAttribute('disabled', 'disabled');
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (error) => {
            $sendLocationButton.removeAttribute('disabled');
            if (error) {
                return console.log(error);
            }
            //console.log('Location Delivered')
        });
    });
});

socket.emit('join', { email, username, room, token }, (error) => {
    //console.log('joining')
    if (error) {
        if (error.status===2) {
            sessionStorage.removeItem('token');
        }
        alert(error.msg);
        location.href = '/';
    }
});