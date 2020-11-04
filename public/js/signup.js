const createUser = async (displayname, email, password) => {
    const response = await fetch('/users',
        {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body:
                JSON.stringify({
                    "name": displayname,
                    "email": email,
                    "password": password
                })
        });
    if (response.status === 201) {
        //user is successfully created and logged in, so, let's set the sessionvariables
        const body = await response.json();
        sessionStorage.setItem('token', body.token);
        sessionStorage.setItem('username', body.user.name);
        sessionStorage.setItem('email', body.user.email);
        sessionStorage.setItem('loggedInUser', body.user.email)
        return location.href = '/';
    } else {

        //check the response body/code to see if a more meaninful response can be given
        alert('User name or password is incorrect');
        $signupButton.removeAttribute('disabled')
    }
}

const $passwordMatchLabel = document.querySelector('#passwordmatch');
const $signupButton = document.querySelector('#signupbutton');
const $password = document.querySelector('#password');
const $password2 = document.querySelector('#password2');
const $email = document.querySelector('#email');
const $username = document.querySelector('#displayname');
const $roomList = document.querySelector('#room-list');
const $meHeader = document.querySelector('#me-header');

const passWordMatch = () => {
    const pw1 = $password.value;
    const pw2 = $password2.value;
    $signupButton.setAttribute('disabled', 'disabled');

    if (pw1 !== pw2) {
        $passwordMatchLabel.textContent = 'Passwords do not match'
        $passwordMatchLabel.style.color = 'red';
    } else {
        $passwordMatchLabel.textContent = '';
        if ($email.value && 
             $username.value &&
             $password.value &&
             $password2.value) {
            $signupButton.removeAttribute('disabled')
            $signupButton.focus();
        }
    }
}

const startupLogin = (e) => {
    e.preventDefault();
    $signupButton.setAttribute('disabled', 'disabled');
    createUser($username.value, $email.value, $password.value);
}

/* event listeners */
$password.addEventListener('change', passWordMatch);
$password2.addEventListener('change', passWordMatch);
$email.addEventListener('change', passWordMatch);
$username.addEventListener('change', passWordMatch);
$signupButton.addEventListener('click', startupLogin);

$signupButton.setAttribute('disabled', 'disabled');
$roomList.style.visibility = 'hidden';
$meHeader.href = 'login';
$meHeader.text = 'Login';
