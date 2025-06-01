const editCarForm = document.getElementById('edit-car-form');
const carIdInput = document.getElementById('car-id');
const modeloInput = document.getElementById('modelo');
const descripcionInput = document.getElementById('descripcion');
const carModelTitle = document.getElementById('car-model-title');
const editMessage = document.getElementById('edit-message');
// const currentPhotoImg = document.getElementById('current-photo'); // Si usas la foto actual

async function obtenerDatosCocheParaEdicion() {
    //Obtener el ID del coche de los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('id');

    if (!carId || isNaN(carId)) {
        editMessage.textContent = 'ID de coche no válido en la URL.';
        return;
    }

    try {
        const response = await fetch(`/coches/${carId}/editar`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            if (!data || !data.id) {
                editMessage.textContent = 'El coche no fue encontrado o no tienes permiso.';
                return;
            }

            //Rellenar el formulario con los datos actuales del coche
            carIdInput.value = data.id;
            modeloInput.value = data.modelo;
            descripcionInput.value = data.descripcion;
            carModelTitle.textContent = data.modelo; //Actualiza el título de la pagina

            // if (currentPhotoImg && data.ruta_foto) {
            //     const filename = data.ruta_foto.split('\\').pop().split('/').pop();
            //     currentPhotoImg.src = `/uploads/${filename}`;
            // }

        } else {
            editMessage.textContent = `Error del servidor: ${data.message || 'No se pudieron cargar los datos del coche para edición.'}`;
        }
    } catch (error) {
        console.error('Error al obtener los datos del coche para edición:', error);
        editMessage.textContent = 'Error al cargar los datos del coche. Intente de nuevo más tarde.';
    }
}

//Llamar a la funcion al cargar la página para precargar los datos
obtenerDatosCocheParaEdicion();

//Manejar el envío del formulario de edicion
editCarForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const carId = carIdInput.value; //Obtener el ID del coche
    const modelo = modeloInput.value;
    const descripcion = descripcionInput.value;

    //Construir el objeto de datos para enviar al backend
    const updatedData = {
        modelo: modelo,
        descripcion: descripcion
    };

    try {
        const response = await fetch(`/coches/${carId}/editar`, {
            method: 'PUT', //Usamos PUT para actualizar un recurso existente
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        const data = await response.json();

        if (response.ok) {
            editMessage.textContent = data.message;
            editMessage.style.color = 'green';

            setTimeout(() => {
                window.location.href = 'mis_coches.html';
            }, 1500);
        } else {
            editMessage.textContent = `Error al guardar: ${data.message || 'Desconocido'}`;
            editMessage.style.color = 'red';
        }
    } catch (error) {
        console.error('Error al actualizar el coche:', error);
        editMessage.textContent = 'Error de conexión al intentar actualizar el coche.';
        editMessage.style.color = 'red';
    }
});