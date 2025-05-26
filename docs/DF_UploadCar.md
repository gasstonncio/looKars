```mermaid

graph TD
    A[Usuario introduce datos y selecciona foto] --> B{Frontend envía POST /anunciar_coche (FormData)}
    B --> C{Backend recibe petición}
    C --> D{Backend verifica autenticación}
    D -- No autenticado --> E[Devuelve 401 - Authentication required]
    D -- Autenticado --> F{Backend verifica archivo y extensión}
    F -- Archivo inválido --> G[Devuelve 400 - Invalid file type]
    F -- Archivo válido --> H{Backend guarda foto en Sistema de Archivos}
    H --> I{Backend crea objeto Coche}
    I --> J{Backend inserta Coche en DB}
    J --> K[Devuelve 201 - Car uploaded successfully]
    K --> L[Frontend muestra mensaje de éxito / resetea formulario]
    G --> M[Frontend muestra mensaje de error]