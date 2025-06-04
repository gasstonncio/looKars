const registerForm = document.getElementById('register-form');
// registerMessage ya no es necesario si usas showMessage globalmente
// const registerMessage = document.getElementById('register-message');

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(data.message || 'Usuario creado exitosamente.', 'success');
            registerForm.reset(); // Limpia el formulario
            setTimeout(() => {
                window.location.href = 'login.html'; // Redirigir al login
            }, 1500); // Dar tiempo para que el mensaje se vea
        } else {
            showMessage(data.message || 'Error al registrar el usuario.', 'error');
        }
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        showMessage('Error de conexión al registrar el usuario.', 'error');
    }
});
