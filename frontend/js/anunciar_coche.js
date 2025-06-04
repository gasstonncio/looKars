const anunciarCocheForm = document.getElementById('anunciar-coche-form');
const anunciarCocheMessage = document.getElementById('anunciar-coche-message'); // Este ya no se usará directamente para mostrar el mensaje

anunciarCocheForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('modelo', document.getElementById('modelo').value);
    formData.append('descripcion', document.getElementById('descripcion').value);
    formData.append('foto', document.getElementById('foto').files[0]);

    try {
        const response = await fetch('/anunciar_coche', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            // Usar showMessage del script.js global
            if (typeof showMessage === 'function') {
                showMessage(data.message || 'Coche subido exitosamente.', 'success');
            } else {
                alert(data.message || 'Coche subido exitosamente.'); // Fallback
            }
            anunciarCocheForm.reset();
            //Redirigir a la página principal o hacer otra accion
        } else {
            // Usar showMessage del script.js global
            if (typeof showMessage === 'function') {
                showMessage(data.message || 'Error al subir el coche.', 'error');
            } else {
                alert(data.message || 'Error al subir el coche.'); // Fallback
            }
        }
    } catch (error) {
        console.error('Error al subir el coche:', error);
        // Usar showMessage del script.js global
        if (typeof showMessage === 'function') {
            showMessage('Error de conexión al subir el coche.', 'error');
        } else {
            alert('Error de conexión al subir el coche.'); // Fallback
        }
    }
});
