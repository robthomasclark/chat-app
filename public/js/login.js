const login = async (email, password) => {
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
        sessionStorage.setItem('token', body.token);
        sessionStorage.setItem('username', body.user.name);
        sessionStorage.setItem('email', body.user.email);
        sessionStorage.setItem('loggedInUser', body.user.email)
        return location.href = '/';
    } else {

        //check the response body/code to see if a more meaninful response can be given
        alert('User name or password is incorrect');
        $loginButton.removeAttribute('disabled')
    }
}

const $loginButton = document.querySelector('#loginbutton');
const $password = document.querySelector('#password');
const $email = document.querySelector('#email');

const formsFilled = () => {
    if ($email.value && $password.value) {
        $loginButton.removeAttribute('disabled')
        $loginButton.focus();
    }
}

const startupLogin = (e) => {
    e.preventDefault();
    $loginButton.setAttribute('disabled', 'disabled');
    login($email.value, $password.value);
}

/* event listeners */
$loginButton.addEventListener('click', startupLogin);
$password.addEventListener('change', formsFilled);
$email.addEventListener('change', formsFilled);

//disable login
$loginButton.setAttribute('disabled', 'disabled');

