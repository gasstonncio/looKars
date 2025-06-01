```mermaid

sequenceDiagram
    actor Usuario
    participant Navegador
    participant Servidor as Servidor (Flask)
    participant BaseDeDatos as Base de Datos (SQLite)
    participant SistemaArchivos as Sistema de Archivos

    Usuario->>Navegador: Navega a página "Mis Anuncios"
    activate Navegador
    Navegador->>Servidor: Petición GET /mis_coches
    activate Servidor
    Servidor->>Servidor: Verifica @login_required
    alt Usuario no autenticado
        Servidor-->>Navegador: Respuesta 401 Unauthorized
        deactivate Servidor
        Navegador->>Usuario: Redirige a Login
    else Usuario autenticado
        Servidor->>BaseDeDatos: Consulta Coche por usuario_id
        BaseDeDatos-->>Servidor: Devuelve lista de Coche
        Servidor-->>Navegador: Respuesta JSON con lista de coches
        deactivate Servidor
        Navegador->>Navegador: Renderiza lista de coches (mis_coches.js)
        Navegador->>Usuario: Muestra lista de anuncios

        alt Clic en "Editar"
            Usuario->>Navegador: Clic en "Editar" (coche ID: X)
            Navegador->>Navegador: Redirige a editar_coche.html?id=X
            Navegador->>Servidor: Petición GET /coches/X/editar
            activate Servidor
            Servidor->>Servidor: Verifica autenticación y propiedad
            Servidor->>BaseDeDatos: Obtiene datos de Coche X
            BaseDeDatos-->>Servidor: Devuelve datos de Coche X
            Servidor-->>Navegador: Respuesta JSON con datos de Coche X
            deactivate Servidor
            Navegador->>Navegador: Precarga formulario (editar_coche.js)
            Usuario->>Navegador: Modifica datos y clic en "Guardar"
            Navegador->>Servidor: Petición PUT /coches/X/editar (JSON con datos)
            activate Servidor
            Servidor->>Servidor: Verifica autenticación y propiedad
            Servidor->>BaseDeDatos: Actualiza Coche X
            BaseDeDatos-->>Servidor: Confirmación
            Servidor-->>Navegador: Respuesta 200 OK (Actualización exitosa)
            deactivate Servidor
            Navegador->>Usuario: Muestra mensaje de éxito y redirige a "Mis Anuncios"
        else Clic en "Eliminar"
            Usuario->>Navegador: Clic en "Eliminar" (coche ID: Y)
            Navegador->>Usuario: Pide confirmación
            Usuario->>Navegador: Confirma eliminación
            Navegador->>Servidor: Petición DELETE /coches/Y/eliminar
            activate Servidor
            Servidor->>Servidor: Verifica autenticación y propiedad
            Servidor->>BaseDeDatos: Elimina Coche Y
            BaseDeDatos-->>Servidor: Confirmación
            Servidor->>SistemaArchivos: Elimina foto (opcional)
            SistemaArchivos-->>Servidor: Confirmación
            Servidor-->>Navegador: Respuesta 200 OK (Eliminación exitosa)
            deactivate Servidor
            Navegador->>Usuario: Muestra mensaje de éxito y recarga "Mis Anuncios"
        end
    end
    deactivate Navegador