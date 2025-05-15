const perfilForm = document.getElementById('perfil-form');
const perfilMessage = document.getElementById('perfil-message');

//Funcion para obtener la información del perfil del usuario
async function obtenerPerfil() {
    try {
        const response = await fetch('/perfil', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            //Rellena el formulario con la información del usuario
            document.getElementById('username').value = data.username;
            document.getElementById('nombre').value = data.nombre || '';
            document.getElementById('apellidos').value = data.apellidos || '';
            document.getElementById('email').value = data.email || '';
            document.getElementById('telefono').value = data.telefono || '';
        } else {
            perfilMessage.textContent = data.message;
        }
    } catch (error) {
        perfilMessage.textContent = 'Error al obtener el perfil.';
    }
}

//Llama a la funcion para obtener el perfil al cargar la pagina
obtenerPerfil();

perfilForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const apellidos = document.getElementById('apellidos').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;

    try {
        const response = await fetch('/perfil', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, apellidos, email, telefono })
        });

        const data = await response.json();

        if (response.ok) {
            perfilMessage.textContent = data.message;
            //Actualizar la informacion mostrada en la pagina
            obtenerPerfil();
        } else {
            perfilMessage.textContent = data.message;
        }
    } catch (error) {
        perfilMessage.textContent = 'Error al actualizar el perfil.';
    }
});
