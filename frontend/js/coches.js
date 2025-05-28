const cochesContainer = document.getElementById('coches-container');
const searchInput = document.getElementById('search-input');
const modeloFilter = document.getElementById('modelo-filter');
const descripcionFilter = document.getElementById('descripcion-filter');
const applyFiltersBtn = document.getElementById('apply-filters-btn');
const clearFiltersBtn = document.getElementById('clear-filters-btn');

async function obtenerCoches() {

    cochesContainer.innerHTML = '<p>Cargando coches...</p>'; //Mensaje de carga

    //Construir la URL con parametros de consulta
    const params = new URLSearchParams();

    //General
    if (searchInput.value) {
        params.append('search', searchInput.value);
    }
    //Filtro por modelo
    if (modeloFilter.value) {
        params.append('modelo', modeloFilter.value);
    }
    //Filtro por descripción
    if (descripcionFilter.value) {
        params.append('descripcion', descripcionFilter.value);
    }

    const queryString = params.toString();
    const url = `/coches${queryString ? `?${queryString}` : ''}`;
    try {
        const response = await fetch('/coches', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const coches = await response.json();

        cochesContainer.innerHTML = ''; //Limpia el mensaje de "Cargando..."

        if (response.ok) { // Asegurarse de que la respuesta del servidor fue exitosa (código 2xx)
            if (coches.length === 0) {
                cochesContainer.innerHTML = '<p>No hay coches disponibles en este momento.</p>';
                return;
            }

            coches.forEach(coche => {
                const carDiv = document.createElement('div');
                carDiv.classList.add('car-listing');

                const img = document.createElement('img');

                img.src = `/uploads/${coche.ruta_foto.split('\\').pop().split('/').pop()}`; // Ajusta la ruta para que solo sea el nombre del archivo
                img.alt = coche.modelo;

                const detailsDiv = document.createElement('div');
                detailsDiv.classList.add('car-details');
                detailsDiv.innerHTML = `
                    <h3>${coche.modelo}</h3>
                    <p>${coche.descripcion}</p>
                    <p>Publicado por usuario ID: ${coche.usuario_id}</p>
                `;

                carDiv.appendChild(img);
                carDiv.appendChild(detailsDiv);
                cochesContainer.appendChild(carDiv);
            });
        } else {
            //Manejar errores del servidor, por ejemplo, si la respuesta no es 200 OK
            cochesContainer.innerHTML = `<p>Error del servidor: ${coches.message || 'Desconocido'}</p>`;
        }

    } catch (error) {
        console.error('Error al obtener los coches:', error);
        cochesContainer.innerHTML = '<p>Error al cargar los coches. Intente de nuevo más tarde.</p>';
    }
}

//Llamar a la funcion al cargar la pagina
obtenerCoches();

//Botones de filtro
applyFiltersBtn.addEventListener('click', obtenerCoches);

clearFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    modeloFilter.value = '';
    descripcionFilter.value = '';
    obtenerCoches(); // Vuelve a cargar todos los coches
});