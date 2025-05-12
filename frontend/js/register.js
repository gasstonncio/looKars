const registerForm = document.getElementById('register-form');
const registerMessage = document.getElementById('register-message');

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
            registerMessage.textContent = data.message;
            registerForm.reset(); // Limpia el formulario
            // Redirigir al login o hacer otra acción si es necesario
        } else {
            registerMessage.textContent = data.message;
        }
    } catch (error) {
        registerMessage.textContent = 'Error al registrar el usuario.';
    }
});