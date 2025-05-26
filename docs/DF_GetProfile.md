```mermaid

graph TD
    A[Usuario autenticado navega a página de perfil] --> B{Frontend envía GET /perfil};
    B --> C{Backend recibe petición};
    C --> D{Backend verifica autenticación};
    D -- No autenticado --> E[Devuelve 401 - Authentication required];
    D -- Autenticado --> F{Backend accede a current_user};
    F --> G{Backend recupera atributos de perfil};
    G --> H[Devuelve 200 - Información de perfil JSON];
    H --> I{Frontend recibe respuesta};
    I --> J[Frontend rellena formulario con datos];
    E --> K[Frontend muestra mensaje de error];