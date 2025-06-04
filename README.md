# LooKars

Bienvenido al repositorio de LooKars, una aplicación web para la compraventa de coches.

## Descripción del Proyecto

LooKars es una plataforma web desarrollada para facilitar la gestión de anuncios de vehículos. La idea principal es ofrecer un espacio donde tanto empresas de compraventa como particulares puedan publicar sus coches en venta de manera eficiente y sencilla. Los usuarios también pueden buscar y ver los detalles de los vehículos disponibles.

## Características Principales

**Registro de Usuarios:** Permite a nuevos usuarios crear una cuenta en la plataforma.

**Inicio de Sesión:** Los usuarios registrados pueden acceder a sus funcionalidades personalizadas.

**Gestión de Perfil:** Los usuarios logueados pueden ver y editar su información personal.

**Anunciar Coche:** Los usuarios autenticados pueden subir nuevos anuncios de coches, incluyendo modelo, descripción y fotos.

**Galería de Coches:** Muestra todos los vehículos disponibles en la plataforma.

**Filtrado y Búsqueda:** Permite a los usuarios buscar coches por modelo o descripción.

**Detalle de Coche:** Visualiza información ampliada de cada vehículo al hacer clic en él.

**Gestión de Anuncios Propios:** Los usuarios pueden ver, editar y eliminar sus propios anuncios.

**Cierre de Sesión:** Permite a los usuarios finalizar su sesión de forma segura.

## Tecnologías Utilizadas

Frontend: HTML, CSS, JavaScript.
Backend: Python con Flask.
Base de Datos: SQLite.

## Instalación y Ejecución Local

### Para poner en marcha LooKars en tu máquina local, sigue estos pasos:

Clonar el repositorio:

    git clone [URL_DE_TU_REPOSITORIO]
    cd LooKars

(Reemplaza [URL_DE_TU_REPOSITORIO] con la URL real de tu repositorio en GitHub).

Crear y activar el entorno virtual:

    python -m venv venv
    .\venv\Scripts\Activate.ps1

Instalar dependencias:

    pip install Flask Flask-SQLAlchemy Werkzeug Flask-Login

Configurar y ejecutar la aplicación Flask:

    $env:FLASK_APP="backend"
    flask run --debug

(Si tienes problemas con flask run, asegúrate de que el entorno virtual está activo y que estás en la raíz del proyecto).

Acceder a la aplicación:
      Abre tu navegador web y ve a http://127.0.0.1:5000/.

## Estructura del Proyecto
LooKars/    
├── .git/    
├── backend/    
│   ├── __init__.py    
│   ├── auth.py    
│   ├── cars.py    
│   ├── models.py    
│   ├── user_profile.py    
│   └── views.py    
├── frontend/    
│   ├── css/    
│   │   └── style.css    
│   ├── js/    
│   │   ├── script.js    
│   │   ├── anunciar_coche.js    
│   │   ├── coches.js    
│   │   ├── detalle_coche.js    
│   │   ├── editar_coche.js    
│   │   ├── login.js    
│   │   └── mis_coches.js    
│   ├── anunciar_coche.html    
│   ├── coches.html    
│   ├── detalle_coche.html    
│   ├── editar_coche.html    
│   ├── index.html    
│   ├── login.html    
│   ├── mis_coches.html    
│   ├── perfil.html    
│   └── register.html    
├── docs/    
│   └── memoria_pfc.md    
├── instance/ (Contiene coches.db - ignorado por Git)        
└── README.md    

Contacto
gcaramesu23@fpcoruna.afundacion.org

© 2025 LooKars. Todos los derechos reservados.
