const globalMessageContainer = document.getElementById('global-message-container');
const globalMessageText = document.getElementById('global-message-text');

/**
 * Muestra un mensaje global en la interfaz de usuario.
 * @param {string} message - El texto del mensaje a mostrar.
 * @param {'info' | 'success' | 'error'} type - El tipo de mensaje (para aplicar estilos CSS).
 * @param {number} duration - Duración en milisegundos que el mensaje estará visible.
 */
function showMessage(message, type = 'info', duration = 3000) {
    // Verificar si los elementos del mensaje existen antes de usarlos
    if (!globalMessageContainer || !globalMessageText) {
        console.error('Contenedores de mensaje no encontrados. Asegúrate de que el HTML tiene #global-message-container y #global-message-text.');
        // Si los contenedores no existen, recurrimos a alert como fallback de emergencia
        alert(message);
        return;
    }

    globalMessageText.textContent = message;
    globalMessageContainer.style.display = 'block';

    // Limpiar clases de estilo previas y añadir la nueva
    globalMessageContainer.classList.remove('info', 'success', 'error');
    globalMessageContainer.classList.add(type);

    // Ocultar el mensaje después de la duración especificada
    setTimeout(() => {
        globalMessageContainer.style.display = 'none';
        globalMessageText.textContent = ''; // Limpiar el texto
        globalMessageContainer.classList.remove('info', 'success', 'error');
    }, duration);
}


document.addEventListener('DOMContentLoaded', () => {
    // Constantes para los elementos de navegación
    const navRegister = document.getElementById('nav-register');
    const navLogin = document.getElementById('nav-login');
    const navAnunciarCoche = document.getElementById('nav-anunciar-coche');
    const navPerfil = document.getElementById('nav-perfil');
    const navVerCoches = document.getElementById('nav-ver-coches');
    const navMisAnuncios = document.getElementById('nav-mis-anuncios');
    const navUsername = document.getElementById('nav-username');
    const navLogout = document.getElementById('nav-logout'); // <-- CORRECCIÓN AQUÍ: ID del <li>
    const logoutLink = document.getElementById('logout-link'); // ID del <a> dentro del <li>nav-logout

    // NOTA: globalMessageContainer y globalMessageText ya son constantes globales

    /**
     * Verifica el estado de autenticación del usuario y ajusta la navegación.
     */
    async function checkLoginStatus() {
        try {
            // Intenta acceder a una ruta protegida para verificar el login
            const response = await fetch('/perfil', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) { // Usuario logueado (respuesta 200 OK)
                const userData = await response.json();
                showLoggedInNav(userData.username);
            } else { // Usuario no logueado o sesión expirada (ej. 401 Unauthorized)
                showLoggedOutNav();
            }
        } catch (error) {
            console.error('Error al verificar el estado de login:', error);
            // Mostrar mensaje de error global en caso de fallo de red
            showMessage('Error de conexión al verificar el estado de login.', 'error');
            showLoggedOutNav(); // Por defecto, mostrar como no logueado en caso de error
        }
    }

    /**
     * Ajusta la visibilidad de la navegación para usuarios logueados.
     * @param {string} username - El nombre de usuario logueado.
     */
    function showLoggedInNav(username) {
        // Ocultar enlaces de registro/login
        if (navRegister) navRegister.style.display = 'none';
        if (navLogin) navLogin.style.display = 'none';

        // Mostrar enlaces de usuario logueado
        if (navAnunciarCoche) navAnunciarCoche.style.display = 'inline-block';
        if (navPerfil) navPerfil.style.display = 'inline-block';
        if (navVerCoches) navVerCoches.style.display = 'inline-block';
        if (navMisAnuncios) navMisAnuncios.style.display = 'inline-block';

        // Mostrar nombre de usuario y enlace de logout
        if (navUsername) {
            navUsername.style.display = 'inline-block';
            const usernameSpan = navUsername.querySelector('span');
            if (usernameSpan) usernameSpan.textContent = `Hola, ${username}`;
        }
        if (navLogout) navLogout.style.display = 'inline-block'; // Controla el <li> padre
    }

    /**
     * Ajusta la visibilidad de la navegación para usuarios no logueados.
     */
    function showLoggedOutNav() {
        // Mostrar enlaces de registro/login
        if (navRegister) navRegister.style.display = 'inline-block';
        if (navLogin) navLogin.style.display = 'inline-block';

        // Ocultar enlaces de usuario logueado
        if (navAnunciarCoche) navAnunciarCoche.style.display = 'none';
        if (navPerfil) navPerfil.style.display = 'none';
        if (navVerCoches) navVerCoches.style.display = 'inline-block'; // 'Ver Coches' puede ser para todos
        if (navMisAnuncios) navMisAnuncios.style.display = 'none';

        // Ocultar nombre de usuario y enlace de logout
        if (navUsername) {
            navUsername.style.display = 'none';
            const usernameSpan = navUsername.querySelector('span');
            if (usernameSpan) usernameSpan.textContent = '';
        }
        if (navLogout) navLogout.style.display = 'none'; // Controla el <li> padre
    }

    // Lógica de logout
    if (logoutLink) { // Asegurarse de que el enlace de logout existe antes de añadir el listener
        logoutLink.addEventListener('click', async (event) => {
            event.preventDefault(); // Evitar que el enlace navegue

            try {
                const response = await fetch('/logout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });

                const data = await response.json();

                if (response.ok) {
                    showMessage(data.message || 'Sesión cerrada exitosamente.', 'success');
                    setTimeout(() => {
                        window.location.href = 'login.html'; // Redirigir al login
                    }, 1500); // Dar tiempo para que el mensaje se vea
                } else {
                    showMessage(data.message || 'Error al cerrar sesión.', 'error');
                }
            } catch (error) {
                console.error('Error durante el cierre de sesión:', error);
                showMessage('Error de conexión al intentar cerrar sesión.', 'error');
            }
        });
    }

    // Al cargar la pagina, verificar el estado de login
    checkLoginStatus();
});
