```mermaid

sequenceDiagram
    actor Usuario
    participant Navegador
    participant Servidor as Servidor (Flask)
    participant BaseDeDatos as Base de Datos (SQLite)

    Usuario->>Navegador: Introduce credenciales (username, password)
    Navegador->>Servidor: Petición POST /login (JSON con credenciales)
    Servidor->>Servidor: Extrae username y password
    Servidor->>BaseDeDatos: Busca Usuario por username
    BaseDeDatos-->>Servidor: Devuelve Usuario o None
    alt Usuario encontrado
        Servidor->>Servidor: Verifica password (check_password_hash)
        alt Contraseña correcta
            Servidor-->>Navegador: Respuesta 200 OK (Login successful)
            Navegador->>Usuario: Muestra mensaje de éxito
        else Contraseña incorrecta
            Servidor-->>Navegador: Respuesta 401 Unauthorized (Invalid username or password)
            Navegador->>Usuario: Muestra mensaje de error
        end
    else Usuario no encontrado
        Servidor-->>Navegador: Respuesta 401 Unauthorized (Invalid username or password)
        Navegador->>Usuario: Muestra mensaje de error
    end
