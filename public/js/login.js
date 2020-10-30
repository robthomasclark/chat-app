const {email, password} = Qs.parse(location.search, {ignoreQueryPrefix: true});

//console.log(email, password);

const login = async () => {
    const response = await fetch('/users/login',
        {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body:
                JSON.stringify({
                    "email": email,
                    "password": password
                })
        });
    if (response.status === 200) {
        //user is successfully logged in, so, let's set the sessionvariables
        const body = await response.json();
        //console.log('body', body)
        sessionStorage.setItem('token', body.token);
        sessionStorage.setItem('username', body.user.name);
        sessionStorage.setItem('email', body.user.email);
        return location.href = '/';
    } else {
        alert('User name or password is incorrect');
        return location.href = '/login';
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

if (email && password) {
    login();
}




