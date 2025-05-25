# Diagrama de Clases UML del Proyecto

Aquí se muestra el diagrama de clases UML que representa las principales entidades y sus relaciones en la aplicación para las funcionalidades de registro, inicio de sesión y gestión del perfil.

```mermaid
classDiagram
    class Usuario {
        + id: int
        + username: String
        + password_hash: String
        + nombre: String
        + apellidos: String
        + email: String
        + telefono: String
        + set_password(password)
        + check_password(password)
    }

    class Coche {
        + id: int
        + modelo: String
        + descripcion: String
        + ruta_foto: String
        + usuario_id: int
    }

    class FlaskApp {
        <<Instance>>
        + app
        + register()
        + login()
        + anunciar_coche()
        + perfil()
    }

    class JavaScriptFrontend {
        + fetch()
        + Formularios HTML
    }

    class Decorador {
        <<Decorador>>
        + requires_auth()
    }

    Usuario "1" -- "0..*" Coche : tiene
    FlaskApp --|> Usuario : usa
    FlaskApp --|> Coche : usa
    FlaskApp --|> Decorador : usa
    JavaScriptFrontend --|> FlaskApp : realiza peticiones HTTP
    JavaScriptFrontend --|> Usuario : interactúa con formularios
    FlaskApp "1" -- "1" db : gestiona
    db -- Usuario : interactúa
    db -- Coche : interactúa

    note for FlaskApp "Representa la instancia 'app' en el backend"
    note for JavaScriptFrontend "Representa los archivos HTML y JS del frontend"