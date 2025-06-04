```mermaid
gantt
    title Planificación del Proyecto (4 Semanas)
    dateFormat  YYYY-MM-DD
    section Semana 1: Asentar bases de la lógica del programa
    Configuración Entorno            : s1_t1, 2025-06-02, 2d
    Diseño DB y Modelos             : s1_t2, after s1_t1, 2d
    Implementación Lógica Registro  : s1_t3, after s1_t2, 2d
    Implementación Lógica Login     : s1_t4, after s1_t3, 1d

    section Semana 2: Desarrollo de la funcionalidad principal
    Backend Subida Coches           : s2_t1, 2025-06-09, 2d
    Frontend Subida Coches          : s2_t2, after s2_t1, 2d
    Visualización Galería           : s2_t3, after s2_t2, 2d
    Filtrado y Búsqueda             : s2_t4, after s2_t3, 1d

    section Semana 3: Experiencia de Usuario
    Detalle Coche Individual        : s3_t1, 2025-06-16, 2d
    Diseño UI/UX y Estilos          : s3_t2, after s3_t1, 3d
    Gestión Anuncios (CRUD)         : s3_t3, after s3_t2, 2d

    section Semana 4: Finalización
    Pruebas Integrales              : s4_t1, 2025-06-23, 2d
    Corrección Bugs y Pulido        : s4_t2, after s4_t1, 3d
    Preparación para Entrega        : s4_t3, after s4_t2, 2d
