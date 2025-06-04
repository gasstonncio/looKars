const misCochesContainer = document.getElementById('mis-coches-container');

async function obtenerMisCoches() {
    misCochesContainer.innerHTML = '<p>Cargando tus anuncios...</p>';

    try {
        const response = await fetch('/mis_coches', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401) { // Si no está autenticado
            misCochesContainer.innerHTML = '<p>Necesitas iniciar sesión para ver tus anuncios. Redirigiendo al Login...</p>';
            if (typeof showMessage === 'function') {
                showMessage('Necesitas iniciar sesión para ver tus anuncios. Redirigiendo al Login...', 'info', 2000);
            }
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return;
        }

        const coches = await response.json();

        misCochesContainer.innerHTML = ''; // Limpia el mensaje de carga

        if (response.ok) {
            if (coches.length === 0) {
                misCochesContainer.innerHTML = '<p>No tienes anuncios publicados todavía.</p>';
                return;
            }

            coches.forEach(coche => {
                const carDiv = document.createElement('div');
                carDiv.classList.add('my-car-listing');
                carDiv.dataset.carId = coche.id; // Guarda el ID del coche en un atributo de datos

                const img = document.createElement('img');
                const filename = coche.ruta_foto.split('\\').pop().split('/').pop();
                img.src = `/uploads/${filename}`;
                img.alt = coche.modelo;

                const detailsDiv = document.createElement('div');
                detailsDiv.classList.add('my-car-details');
                detailsDiv.innerHTML = `
                    <h3>${coche.modelo}</h3>
                    <p>${coche.descripcion}</p>
                    <p>ID: ${coche.id}</p>
                `;

                const actionsDiv = document.createElement('div');
                actionsDiv.classList.add('my-car-actions');

                const editBtn = document.createElement('button');
                editBtn.classList.add('edit-btn');
                editBtn.textContent = 'Editar';
                editBtn.addEventListener('click', () => {
                    window.location.href = `editar_coche.html?id=${coche.id}`;
                });

                const deleteBtn = document.createElement('button');
                deleteBtn.classList.add('delete-btn');
                deleteBtn.textContent = 'Eliminar';
                deleteBtn.addEventListener('click', async () => {
                    if (confirm(`¿Estás seguro de que quieres eliminar el coche ${coche.modelo}?`)) {
                        try {
                            const deleteResponse = await fetch(`/coches/${coche.id}/eliminar`, {
                                method: 'DELETE'
                            });

                            const deleteData = await deleteResponse.json();

                            if (deleteResponse.ok) {
                                if (typeof showMessage === 'function') {
                                    showMessage(deleteData.message || 'Coche eliminado exitosamente.', 'success');
                                } else {
                                    alert(deleteData.message || 'Coche eliminado exitosamente.'); // Fallback
                                }
                                obtenerMisCoches(); // Recargar la lista de coches
                            } else {
                                if (typeof showMessage === 'function') {
                                    showMessage(`Error al eliminar: ${deleteData.message || 'Desconocido'}`, 'error');
                                } else {
                                    alert(`Error al eliminar: ${deleteData.message || 'Desconocido'}`); // Fallback
                                }
                            }
                        } catch (deleteError) {
                            console.error('Error al eliminar el coche:', deleteError);
                            if (typeof showMessage === 'function') {
                                showMessage('Error de conexión al intentar eliminar el coche.', 'error');
                            } else {
                                alert('Error de conexión al intentar eliminar el coche.'); // Fallback
                            }
                        }
                    }
                });

                actionsDiv.appendChild(editBtn);
                actionsDiv.appendChild(deleteBtn);

                carDiv.appendChild(img);
                carDiv.appendChild(detailsDiv);
                carDiv.appendChild(actionsDiv);
                misCochesContainer.appendChild(carDiv);
            });
        } else {
            misCochesContainer.innerHTML = `<p>Error del servidor: ${coches.message || 'No se pudieron cargar tus anuncios.'}</p>`;
        }

    } catch (error) {
        console.error('Error al obtener mis coches:', error);
        misCochesContainer.innerHTML = '<p>Error al cargar tus anuncios. Intente de nuevo más tarde.</p>';
    }
}

// Llama a la función al cargar la página
obtenerMisCoches();
