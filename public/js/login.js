const {username, password, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});

console.log(username, password, room);

//before we do anything else, make sure the user is valid and logged in.
const login = async () => {

    //user already logged in
    if (!username && sessionStorage.getItem('token')) {
        sessionStorage.setItem('room', room);
        return location.href = '/chat';
    }
    const response = await fetch('/users/login',
        {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body:
                JSON.stringify({
                    "email": username,
                    "password": password
                })
        });
    if (response.status === 200) {
        const body = await response.json();
        //console.log('body', body)
        sessionStorage.setItem('token', body.token);
        sessionStorage.setItem('username', body.user.name);
        sessionStorage.setItem('room', room)
        sessionStorage.setItem('email', body.user.email);
        return location.href = '/chat';
    } else {
        alert('User name or password is incorrect');
        return location.href = '/';
    }
}

// const logout = async () => {
//     const response = await fetch('/users/logout',
//         {
//             method: 'post',
//             headers: {
//                 'Content-Type': 'application/json'}
//         });
//
// }



const user = login();




