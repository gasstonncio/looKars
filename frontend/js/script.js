// Estas constantes y la función showMessage deben estar fuera del DOMContentLoaded
// para que sean accesibles globalmente por otros scripts.
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
    const navLogout = document.getElementById('nav-logout');
    const logoutLink = document.getElementById('logout-link');

    // Nuevo: Contenedor para coches destacados en la página principal
    const featuredCarsContainer = document.getElementById('featured-cars-container');


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
        if (navLogout) navLogout.style.display = 'inline-block';
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
        if (navVerCoches) navVerCoches.style.display = 'inline-block';
        if (navMisAnuncios) navMisAnuncios.style.display = 'none';

        // Ocultar nombre de usuario y enlace de logout
        if (navUsername) {
            navUsername.style.display = 'none';
            const usernameSpan = navUsername.querySelector('span');
            if (usernameSpan) usernameSpan.textContent = '';
        }
        if (navLogout) navLogout.style.display = 'none';
    }

    // Lógica de logout
    if (logoutLink) {
        logoutLink.addEventListener('click', async (event) => {
            event.preventDefault();

            try {
                const response = await fetch('/logout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });

                const data = await response.json();

                if (response.ok) {
                    showMessage(data.message || 'Sesión cerrada exitosamente.', 'success');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1500);
                } else {
                    showMessage(data.message || 'Error al cerrar sesión.', 'error');
                }
            } catch (error) {
                console.error('Error durante el cierre de sesión:', error);
                showMessage('Error de conexión al intentar cerrar sesión.', 'error');
            }
        });
    }

    /**
     * Carga y muestra una cantidad limitada de coches destacados en la página principal.
     */
    async function loadFeaturedCars() {
        if (!featuredCarsContainer) return; // Salir si el contenedor no existe (no estamos en index.html)

        featuredCarsContainer.innerHTML = '<p>Cargando coches destacados...</p>';

        try {
            // Solicitar un número limitado de coches (ej. 3)
            const response = await fetch('/coches?limit=3', { // Usamos el endpoint /coches con un límite
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const coches = await response.json();

            featuredCarsContainer.innerHTML = ''; // Limpiar mensaje de carga

            if (response.ok) {
                if (coches.length === 0) {
                    featuredCarsContainer.innerHTML = '<p>No hay coches destacados disponibles en este momento.</p>';
                    return;
                }

                coches.forEach(coche => {
                    const carDiv = document.createElement('div');
                    carDiv.classList.add('car-listing'); // Reutilizamos la clase de estilo de car-listing
                    carDiv.style.cursor = 'pointer'; // Para indicar que es clicable

                    // Añadir evento de clic para redirigir a la página de detalle
                    carDiv.addEventListener('click', () => {
                        window.location.href = `detalle_coche.html?id=${coche.id}`;
                    });

                    const img = document.createElement('img');
                    const filename = coche.ruta_foto.split('\\').pop().split('/').pop();
                    img.src = `/uploads/${filename}`;
                    img.alt = coche.modelo;

                    const detailsDiv = document.createElement('div');
                    detailsDiv.classList.add('car-details');
                    detailsDiv.innerHTML = `
                        <h3>${coche.modelo}</h3>
                        <p>${coche.descripcion}</p>
                        <p>Publicado por: <strong>${coche.vendedor_username}</strong></p>
                    `;

                    carDiv.appendChild(img);
                    carDiv.appendChild(detailsDiv);
                    featuredCarsContainer.appendChild(carDiv);
                });
            } else {
                featuredCarsContainer.innerHTML = `<p>Error del servidor al cargar coches destacados: ${coches.message || 'Desconocido'}</p>`;
            }
        } catch (error) {
            console.error('Error al cargar coches destacados:', error);
            featuredCarsContainer.innerHTML = '<p>Error de conexión al cargar coches destacados. Intente de nuevo más tarde.</p>';
        }
    }


    // Al cargar la página, verificar el estado de login
    checkLoginStatus();

    // Si estamos en la página principal, cargar los coches destacados
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        loadFeaturedCars();
    }
});
