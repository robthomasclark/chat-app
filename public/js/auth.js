if (!sessionStorage.getItem('token')) {
    location.href = ('/login');
}