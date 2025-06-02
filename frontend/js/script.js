document.addEventListener('DOMContentLoaded', () => {
    const navRegister = document.getElementById('nav-register');
    const navLogin = document.getElementById('nav-login');
    const navAnunciarCoche = document.getElementById('nav-anunciar-coche');
    const navPerfil = document.getElementById('nav-perfil');
    const navVerCoches = document.getElementById('nav-ver-coches');
    const navMisAnuncios = document.getElementById('nav-mis-anuncios');
    const navLogout = document.getElementById('nav-logout');
    const logoutLink = document.getElementById('logout-link');

    async function checkLoginStatus() {
        try {
            //Intenta acceder a una ruta protegida
            const response = await fetch('/perfil', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) { //Usuario logueado
                showLoggedInNav();
            } else { //Usuario no logueado o sesion expirada
                showLoggedOutNav();
            }
        } catch (error) {
            console.error('Error al verificar el estado de login:', error);
            showLoggedOutNav(); //Por defecto, mostrar como no logueado en caso de error de red
        }
    }

    function showLoggedInNav() {
        navRegister.style.display = 'none';
        navLogin.style.display = 'none';
        navAnunciarCoche.style.display = 'list-item';
        navPerfil.style.display = 'list-item';
        navVerCoches.style.display = 'list-item'; //Mostrar también para logueados
        navMisAnuncios.style.display = 'list-item';
        navLogout.style.display = 'list-item';
    }

    function showLoggedOutNav() {
        navRegister.style.display = 'list-item';
        navLogin.style.display = 'list-item';
        navAnunciarCoche.style.display = 'none';
        navPerfil.style.display = 'none';
        navVerCoches.style.display = 'list-item'; //'Ver Coches' para todos
        navMisAnuncios.style.display = 'none';
        navLogout.style.display = 'none';
    }

    //Logica de logout
    logoutLink.addEventListener('click', async (event) => {
        event.preventDefault(); // Evitar que el enlace navegue

        try {
            const response = await fetch('/logout', {
                method: 'POST', //Usamos POST para logout
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message || 'Sesión cerrada exitosamente.');
                window.location.href = 'login.html'; // Redirigir al login
            } else {
                alert(data.message || 'Error al cerrar sesión.');
            }
        } catch (error) {
            console.error('Error durante el cierre de sesión:', error);
            alert('Error de conexión al intentar cerrar sesión.');
        }
    });

    //Al cargar la pagina, verificar el estado de login
    checkLoginStatus();
});