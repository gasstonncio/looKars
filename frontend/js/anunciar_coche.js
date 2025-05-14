const anunciarCocheForm = document.getElementById('anunciar-coche-form');
const anunciarCocheMessage = document.getElementById('anunciar-coche-message');

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
            anunciarCocheMessage.textContent = data.message;
            anunciarCocheForm.reset();
            //Redirigir a la página principal o hacer otra accion
        } else {
            anunciarCocheMessage.textContent = data.message;
        }
    } catch (error) {
        anunciarCocheMessage.textContent = 'Error al subir el coche.';
    }
});