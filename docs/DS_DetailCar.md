```mermaid

sequenceDiagram
    actor Usuario
    participant Navegador
    participant Servidor as Servidor (Flask)
    participant BaseDeDatos as Base de Datos (SQLite)
    participant SistemaArchivos as Sistema de Archivos

    Usuario->>Navegador: Navega a página de detalle (clic en galería)
    Navegador->>Servidor: Petición GET /detalle_coche.html
    Servidor-->>Navegador: Sirve detalle_coche.html, CSS, JS
    activate Navegador
    Navegador->>Servidor: Petición GET /coches/ID_DEL_COCHE (desde detalle_coche.js)
    activate Servidor
    Servidor->>BaseDeDatos: Consulta Coche por ID
    BaseDeDatos-->>Servidor: Devuelve Coche o None
    alt Coche encontrado
        Servidor->>Servidor: Formatea datos a JSON
        Servidor-->>Navegador: Respuesta JSON con detalles del coche
        deactivate Servidor
        Navegador->>Navegador: Procesa datos (detalle_coche.js)
        Navegador->>SistemaArchivos: Petición GET /uploads/nombre_foto.jpg
        activate SistemaArchivos
        SistemaArchivos-->>Navegador: Sirve imagen
        deactivate SistemaArchivos
        Navegador->>Usuario: Muestra detalles del coche
    else Coche no encontrado o error
        Servidor-->>Navegador: Respuesta 404 Not Found / Error
        deactivate Servidor
        Navegador->>Usuario: Muestra mensaje de error
    end
    deactivate Navegador