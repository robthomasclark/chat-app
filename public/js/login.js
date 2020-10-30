const {username, password, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});

//before we do anything else, make sure the user is valid and logged in.
const login = async () => {

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
        localStorage.setItem('token', body.token);
        localStorage.setItem('username', body.user.name);
        localStorage.setItem('room', room);
        location.href = '/chat';
    } else {
        location.href = '/';
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




