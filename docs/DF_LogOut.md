```mermaid

graph TD
    A[Usuario hace clic en "Cerrar Sesión"] --> B{Frontend envía POST /logout};
    B --> C{Backend recibe petición};
    C --> D{Backend verifica autenticación};
    D -- No autenticado --> E[Devuelve 401 - Unauthorized];
    D -- Autenticado --> F{Backend invalida sesión (logout_user())};
    F --> G[Devuelve 200 - Sesión cerrada exitosamente];
    G --> H{Frontend recibe respuesta};
    H --> I[Frontend muestra mensaje de confirmación];
    I --> J[Frontend redirige a login.html];
    J --> K[Frontend actualiza visibilidad de navegación];
    E --> L[Frontend muestra mensaje de error];