```mermaid

sequenceDiagram
    actor Usuario
    participant Navegador
    participant Servidor as Servidor (Flask)
    participant BaseDeDatos as Base de Datos (SQLite)
    participant SistemaArchivos as Sistema de Archivos

    Usuario->>Navegador: Introduce datos coche y selecciona foto
    Navegador->>Servidor: Petición POST /anunciar_coche (FormData)
    Servidor->>Servidor: Verifica @login_required
    Servidor->>Servidor: Valida tipo de archivo (allowed_file)
    Servidor->>SistemaArchivos: Guarda foto (secure_filename)
    SistemaArchivos-->>Servidor: Ruta de la foto
    Servidor->>BaseDeDatos: Crea y guarda objeto Coche
    BaseDeDatos-->>Servidor: Confirmación
    Servidor-->>Navegador: Respuesta 201 Created (Car uploaded successfully)
    Navegador->>Usuario: Muestra mensaje de éxito / resetea formulario
