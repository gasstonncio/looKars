const carDetailContainer = document.getElementById('car-detail-container');

async function obtenerDetallesCoche() {
    carDetailContainer.innerHTML = '<p>Cargando detalles del coche...</p>';

    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('id'); // Obtiene el valor del parámetro 'id'

    if (!carId || isNaN(carId)) {
        carDetailContainer.innerHTML = '<p>ID de coche no válido en la URL.</p>';
        return;
    }

    try {
        const response = await fetch(`/coches/${carId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            if (!data || !data.id) { //Si no se encuentra el coche o los datos son invalidos
                carDetailContainer.innerHTML = '<p>El coche solicitado no fue encontrado.</p>';
                return;
            }

            //Construir la ruta de la imagen correctamente
            const filename = data.ruta_foto.split('\\').pop().split('/').pop();
            const imageUrl = `/uploads/${filename}`;

            carDetailContainer.innerHTML = `
                <h2>${data.modelo}</h2>
                <img src="${imageUrl}" alt="${data.modelo}">
                <p>${data.descripcion}</p>
                <div class="meta-info">
                    <p>ID del Coche: ${data.id}</p>
                    <p>Publicado por usuario ID: ${data.usuario_id}</p>
                </div>
            `;
        } else {
            carDetailContainer.innerHTML = `<p>Error del servidor: ${data.message || 'No se pudieron cargar los detalles del coche.'}</p>`;
        }
    } catch (error) {
        console.error('Error al obtener los detalles del coche:', error);
        carDetailContainer.innerHTML = '<p>Error al cargar los detalles del coche. Intente de nuevo más tarde.</p>';
    }
}

//Llama a la función al cargar la pagina
obtenerDetallesCoche();
