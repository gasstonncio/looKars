document.addEventListener('DOMContentLoaded', () => {
    const navRegister = document.getElementById('nav-register');
    const navLogin = document.getElementById('nav-login');
    const navAnunciarCoche = document.getElementById('nav-anunciar-coche');
    const navPerfil = document.getElementById('nav-perfil');
    const navVerCoches = document.getElementById('nav-ver-coches');
    const navMisAnuncios = document.getElementById('nav-mis-anuncios');
    const navUsername = document.getElementById('nav-username');
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
                const userData = await response.json();
                showLoggedInNav(userData.username);
            } else { //Usuario no logueado o sesion expirada
                showLoggedOutNav();
            }
        } catch (error) {
            console.error('Error al verificar el estado de login:', error);
            showLoggedOutNav(); //Por defecto, mostrar como no logueado en caso de error de red
        }
    }

function showLoggedInNav(username) {
    navRegister.style.display = 'none';
    navLogin.style.display = 'none';
    navAnunciarCoche.style.display = 'inline-block';
    navPerfil.style.display = 'inline-block';
    navVerCoches.style.display = 'inline-block';
    navMisAnuncios.style.display = 'inline-block';
    navUsername.style.display = 'inline-block';
    navUsername.querySelector('span').textContent = `Hola, ${username}`;
    navLogout.style.display = 'inline-block';
}

function showLoggedOutNav() {
    navRegister.style.display = 'inline-block';
    navLogin.style.display = 'inline-block';
    navAnunciarCoche.style.display = 'none';
    navPerfil.style.display = 'none';
    navVerCoches.style.display = 'inline-block';
    navMisAnuncios.style.display = 'none';
    navUsername.style.display = 'none';
    navUsername.querySelector('span').textContent = '';
    navLogout.style.display = 'none';
}

    //Logica de logout
    logoutLink.addEventListener('click', async (event) => {
        event.preventDefault(); //Evitar que el enlace navegue

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