```mermaid

classDiagram
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
        + get_coches()
    }

    class CochesHTML {
        + coches.html
        + div#coches-container
    }

    class CochesJS {
        + coches.js
        + obtenerCoches()
    }

    class JavaScriptFrontend {
        + fetch()
        + Rutas de views.py para archivos estáticos
    }

    Coche --|> FlaskApp : fuente de datos
    FlaskApp --|> CochesJS : devuelve JSON
    CochesJS --|> CochesHTML : inserta dinámicamente
    JavaScriptFrontend --|> FlaskApp : realiza petición GET /coches
    JavaScriptFrontend --|> CochesHTML : sirve página
    JavaScriptFrontend --|> CochesJS : sirve script

    note for FlaskApp "Gestiona la ruta /coches"
    note for CochesHTML "Interfaz de usuario"
    note for CochesJS "Lógica de frontend"
    note for JavaScriptFrontend "Representa la comunicación entre frontend y backend"