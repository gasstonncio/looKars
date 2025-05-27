```mermaid

graph TD
    A[Usuario introduce datos y selecciona foto]
    B{Frontend envía POST /anunciar_coche (FormData)}
    C{Backend recibe petición}
    D{Backend verifica autenticación}
    E[Devuelve 401 - Authentication required]
    F{Backend verifica archivo y extensión}
    G[Devuelve 400 - Invalid file type]
    H{Backend guarda foto en Sistema de Archivos}
    I{Backend crea objeto Coche}
    J{Backend inserta Coche en DB}
    K[Devuelve 201 - Car uploaded successfully]
    L[Frontend muestra mensaje de éxito / resetea formulario]
    M[Frontend muestra mensaje de error]

    A --> B
    B --> C
    C --> D
    D -- No autenticado --> E
    D -- Autenticado --> F
    F -- Archivo inválido --> G
    F -- Archivo válido --> H
    H --> I
    I --> J
    J --> K
    K --> L
    G --> M