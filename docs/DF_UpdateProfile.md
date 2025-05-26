```mermaid

graph TD
    A[Usuario edita campos en formulario de perfil] --> B{Frontend envía POST /perfil};
    B --> C{Backend recibe petición};
    C --> D{Backend verifica autenticación};
    D -- No autenticado --> E[Devuelve 401 - Authentication required];
    D -- Autenticado --> F{Backend obtiene nuevos datos de JSON};
    F --> G{Backend actualiza atributos de current_user};
    G --> H{Backend guarda cambios en DB};
    H --> I[Devuelve 200 - Profile updated successfully];
    I --> J{Frontend recibe respuesta};
    J --> K[Frontend muestra mensaje de éxito];
    K --> L[Frontend recarga datos de perfil];
    E --> M[Frontend muestra mensaje de error];