```mermaid

graph TD
    A[Usuario introduce datos en formulario] --> B{Frontend envía POST /register};
    B --> C{Backend recibe petición};
    C --> D{Backend extrae datos};
    D --> E{Backend verifica unicidad de Username};
    E -- Username existe --> F[Devuelve 400 - Username already exists];
    E -- Username no existe --> G{Backend hashea contraseña};
    G --> H{Backend crea objeto Usuario};
    H --> I{Backend inserta Usuario en DB};
    I --> J{Backend confirma transacción};
    J --> K[Devuelve 201 - User created successfully];
    K --> L[Frontend muestra mensaje de éxito];
    F --> M[Frontend muestra mensaje de error];