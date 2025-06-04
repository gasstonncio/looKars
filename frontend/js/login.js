const loginForm = document.getElementById('login-form');
// loginMessage ya no es necesario si usas showMessage globalmente
// const loginMessage = document.getElementById('login-message');

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
            showMessage(data.message || 'Inicio de sesión exitoso.', 'success');
            loginForm.reset();
            setTimeout(() => {
                window.location.href = 'coches.html'; // Redirigir a la página de ver coches
            }, 1500); // Dar tiempo para que el mensaje se vea
        } else {
            showMessage(data.message || 'Credenciales inválidas.', 'error');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        showMessage('Error de conexión al iniciar sesión.', 'error');
    }
});
