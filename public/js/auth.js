const isLoggedIn = async ()  => {
    const token = localStorage.getItem('token');
    //console.log('token', token);
    if (!token) return false;
    return token;
}

const autoRedirect = async () => {
    const validLogin = await isLoggedIn();
    //console.log('Valid', validLogin);
    if (!validLogin && location.pathname !== '/') location.href=('/');
    if (validLogin && location.pathname === '/') location.href=('/chat');
}

autoRedirect();