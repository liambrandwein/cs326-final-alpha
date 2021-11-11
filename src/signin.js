// If login (username) exists in localStorage, then redirect to the main page
if (window.localStorage.getItem('username')) {
    window.location.href = './';
}

async function validateLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password || email === '' || password === '') {
        alert('Error: Email and password cannot be empty.');
        return 0;
    }

    const url = '/getuserdata/' + email;

    const response = await fetch(url);
    const getReturn = await response.json();
    
    if (getReturn.hasOwnProperty('Error') || password !== getReturn.password) {
        alert('Incorrect username and/or password.');
        return 0;
    }
    // Store login info -- this only executes if you have an account
    window.localStorage.setItem('username', getReturn['user_id']);

    window.location.href = './';
}   

document.getElementById('sign-up').href = './signup';

const submitBtn = document.getElementById('sign-in');

submitBtn.addEventListener('click', validateLogin);
