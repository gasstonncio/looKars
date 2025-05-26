```mermaid

graph TD
    A[Usuario introduce credenciales en formulario] --> B{Frontend envía POST /login};
    B --> C{Backend recibe petición};
    C --> D{Backend extrae datos};
    D --> E{Backend busca Usuario en DB};
    E -- Usuario no encontrado --> F[Devuelve 401 - Invalid username or password];
    E -- Usuario encontrado --> G{Backend verifica contraseña};
    G -- Contraseña incorrecta --> F;
    G -- Contraseña correcta --> H[Devuelve 200 - Login successful];
    H --> I[Frontend muestra mensaje de éxito];
    F --> J[Frontend muestra mensaje de error];
