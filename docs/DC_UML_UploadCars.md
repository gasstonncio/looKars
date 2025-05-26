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
        + anunciar_coche()
    }

    class JavaScriptFrontend {
        + fetch()
        + Formulario HTML (anunciar_coche.html)
    }

    class Decorador {
        <<Decorador>>
        + login_required()
    }

    Usuario "1" -- "0..*" Coche : tiene
    FlaskApp --|> Coche : usa
    FlaskApp --|> Decorador : usa
    JavaScriptFrontend --|> FlaskApp : realiza peticiones HTTP
    FlaskApp "1" -- "1" db : gestiona
    db -- Coche : interactúa
    FlaskApp --|> SistemaArchivos : guarda fotos

    note for FlaskApp "Representa la instancia 'app' en el backend"
    note for JavaScriptFrontend "Representa el frontend para subir coches"