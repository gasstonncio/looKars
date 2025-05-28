```mermaid

sequenceDiagram
    actor Usuario
    participant Navegador
    participant Servidor as Servidor (Flask)
    participant BaseDeDatos as Base de Datos (SQLite)
    participant SistemaArchivos as Sistema de Archivos

    Usuario->>Navegador: Solicita página "Coches Disponibles"
    Navegador->>Servidor: Petición GET /coches.html
    Servidor-->>Navegador: Sirve coches.html, CSS, JS
    activate Navegador
    Navegador->>Servidor: Petición GET /coches (desde coches.js)
    activate Servidor
    Servidor->>BaseDeDatos: Consulta todos los Coche
    BaseDeDatos-->>Servidor: Devuelve lista de Coche
    Servidor->>Servidor: Formatea datos a JSON
    Servidor-->>Navegador: Respuesta JSON con lista de coches
    deactivate Servidor
    Navegador->>Navegador: Itera sobre lista de coches (coches.js)
    loop Por cada coche con foto
        Navegador->>Servidor: Petición GET /uploads/nombre_foto.jpg
        activate Servidor
        Servidor->>SistemaArchivos: Busca nombre_foto.jpg
        SistemaArchivos-->>Servidor: Devuelve imagen
        Servidor-->>Navegador: Sirve imagen
        deactivate Servidor
    end
    Navegador->>Usuario: Muestra coches dinámicamente
    deactivate Navegador