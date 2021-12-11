async function createAcc() {
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;
	const confirm = document.getElementById('confirm').value;

	if (!email || !password || !confirm || email === '' || password === '' || confirm === '') {
		alert('Error: Email and password cannot be empty.');
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

	const url = '/createaccount';

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify({ id: email, pass: password })
	});

	const result = await response.json();

	if (result.status === 'fail') {
		alert('Error: Account already exists or invalid email.');
		return 0;
	}

	window.location.href = './';
}

const createBtn = document.getElementById('create');

createBtn.addEventListener('click', createAcc);