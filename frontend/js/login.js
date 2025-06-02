const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password })
        });

        const data = await response.json();

        if (response.ok) {
            loginMessage.textContent = data.message;
            loginForm.reset();
            window.location.href = 'coches.html';
        } else {
            loginMessage.textContent = data.message;
        }
    } catch (error) {
        loginMessage.textContent = 'Error al iniciar sesión.';
    }
});