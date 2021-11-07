// If login (username) exists in localStorage, then redirect to the main page
if (window.localStorage.getItem('username')) {
    window.location.href = './';
}

const emailPattern = /(?:[a-z0-9!#$%&'*+\=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gm;

async function createAcc() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirm').value;

    if (!email || !password || !confirm || email === '' || password === '' || confirm === '') {
        alert('Error: Email and password cannot be empty.');
        return 0;
    }

    if (!emailPattern.test(email)) {
        alert('Error: Invalid email.');
        return 0;
    }

    if (password.length < 8) {
        alert('Error: Password must be at least 8 characters');
        return 0;
    }

    if (password !== confirm) {
        alert('Error: Password & confirmed password must match');
        return 0;
    }

    const url = '/createaccount'

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({ id: email, pass: password})
    });

    const result = await response.json();

    if (result.status === 'fail') {
        alert('Error: Account already exists.');
        return 0;
    }
    // Log in after account creation
    window.localStorage.setItem('username', email);

    window.location.href = './';
}

const createBtn = document.getElementById('create');

createBtn.addEventListener('click', createAcc);