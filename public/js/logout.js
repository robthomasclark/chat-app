const logout = async () => {
    const response = await fetch('/users/logout',
        {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });
    if (response.status === 200) {
        //user is successfully logged out, so, let's unset the sessionvariables
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('loggedInUser');
        return location.href = '/';
    } else {
        alert('There is no user logged in');
        return location.href = '/';
    }
}

logout();
