const cochesContainer = document.getElementById('coches-container');
const searchInput = document.getElementById('search-input');
const modeloFilter = document.getElementById('modelo-filter');
const descripcionFilter = document.getElementById('descripcion-filter');
const applyFiltersBtn = document.getElementById('apply-filters-btn');
const clearFiltersBtn = document.getElementById('clear-filters-btn');

async function obtenerCoches() {
    cochesContainer.innerHTML = '<p>Cargando coches...</p>';

    const params = new URLSearchParams();
    if (searchInput.value) {
        params.append('search', searchInput.value);
    }
    if (modeloFilter.value) {
        params.append('modelo', modeloFilter.value);
    }
    if (descripcionFilter.value) {
        params.append('descripcion', descripcionFilter.value);
    }

    const queryString = params.toString();
    const url = `/coches${queryString ? `?${queryString}` : ''}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const coches = await response.json();

        cochesContainer.innerHTML = '';

        if (response.ok) {
            if (coches.length === 0) {
                cochesContainer.innerHTML = '<p>No hay coches disponibles que coincidan con los criterios de búsqueda.</p>';
                return;
            }

            coches.forEach(coche => {
                const carDiv = document.createElement('div');
                carDiv.classList.add('car-listing');
                carDiv.style.cursor = 'pointer';

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
                    <p>Publicado por: <strong>${coche.vendedor_username}</strong></p> <!-- CAMBIO AQUÍ -->
                `;

                carDiv.appendChild(img);
                carDiv.appendChild(detailsDiv);
                cochesContainer.appendChild(carDiv);
            });
        } else {
            cochesContainer.innerHTML = `<p>Error del servidor: ${coches.message || 'Desconocido'}</p>`;
        }

    } catch (error) {
        console.error('Error al obtener los coches:', error);
        cochesContainer.innerHTML = '<p>Error al cargar los coches. Intente de nuevo más tarde.</p>';
    }
}

obtenerCoches();
applyFiltersBtn.addEventListener('click', obtenerCoches);
clearFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    modeloFilter.value = '';
    descripcionFilter.value = '';
    obtenerCoches();
});
