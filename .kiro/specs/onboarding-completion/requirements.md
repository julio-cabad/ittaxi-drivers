# Requirements Document

## Introduction

Este documento define los requerimientos para completar la funcionalidad de onboarding de conductores en la aplicación InstaTaxi Driver. Se implementarán las pantallas faltantes: DocumentsUploadScreen, VehiclePhotosScreen y ReviewAndSubmitScreen, con funcionalidad completa de captura/selección de imágenes, subida a Firebase Storage y validación de datos.

## Requirements

### Requirement 1: Document Upload Functionality

**User Story:** Como conductor, quiero subir mis documentos legales requeridos (cédula frontal/posterior, licencia de conducir, matrícula) para completar mi proceso de registro.

#### Acceptance Criteria

1. WHEN el usuario accede a DocumentsUploadScreen THEN el sistema SHALL mostrar campos para subir cédula frontal, cédula posterior, licencia de conducir y matrícula del vehículo
2. WHEN el usuario toca un campo de documento THEN el sistema SHALL mostrar opciones para tomar foto con cámara o seleccionar desde galería
3. WHEN el usuario selecciona una imagen THEN el sistema SHALL mostrar preview de la imagen seleccionada
4. WHEN el usuario confirma una imagen THEN el sistema SHALL subir la imagen a Firebase Storage y guardar la URL en Firestore
5. WHEN todos los documentos están subidos THEN el sistema SHALL habilitar el botón "Siguiente"
6. IF la subida de imagen falla THEN el sistema SHALL mostrar mensaje de error y permitir reintentar
7. WHEN el usuario completa la subida de documentos THEN el sistema SHALL navegar a VehiclePhotosScreen

### Requirement 2: Vehicle Photos Capture

**User Story:** Como conductor, quiero tomar fotos de mi vehículo desde diferentes ángulos para verificación visual de mi vehículo.

#### Acceptance Criteria

1. WHEN el usuario accede a VehiclePhotosScreen THEN el sistema SHALL mostrar campos para capturar foto frontal, posterior, lateral izquierda, lateral derecha e interior del vehículo
2. WHEN el usuario toca un campo de foto THEN el sistema SHALL mostrar opciones para tomar foto con cámara o seleccionar desde galería
3. WHEN el usuario toma/selecciona una foto THEN el sistema SHALL mostrar preview de la foto
4. WHEN el usuario confirma una foto THEN el sistema SHALL subir la imagen a Firebase Storage y guardar la URL
5. WHEN todas las fotos están capturadas THEN el sistema SHALL habilitar el botón "Siguiente"
6. IF la captura/subida falla THEN el sistema SHALL mostrar mensaje de error y permitir reintentar
7. WHEN el usuario completa las fotos THEN el sistema SHALL navegar a ReviewAndSubmitScreen

### Requirement 3: Review and Submit Screen

**User Story:** Como conductor, quiero revisar toda mi información personal, de vehículo, documentos y fotos antes de enviar mi solicitud de registro.

#### Acceptance Criteria

1. WHEN el usuario accede a ReviewAndSubmitScreen THEN el sistema SHALL mostrar resumen completo de datos personales, vehículo, documentos y fotos
2. WHEN el usuario revisa la información THEN el sistema SHALL mostrar todos los datos en formato legible y organizado
3. WHEN el usuario toca "Editar" en una sección THEN el sistema SHALL navegar a la pantalla correspondiente para edición
4. WHEN el usuario toca "Enviar Solicitud" THEN el sistema SHALL validar que todos los datos estén completos
5. IF faltan datos requeridos THEN el sistema SHALL mostrar mensaje indicando qué falta completar
6. WHEN todos los datos están completos y el usuario confirma THEN el sistema SHALL enviar la solicitud y navegar a PendingReviewScreen
7. WHEN la solicitud se envía exitosamente THEN el sistema SHALL mostrar confirmación de envío

### Requirement 4: Image Upload and Storage

**User Story:** Como sistema, necesito subir y almacenar de forma segura todas las imágenes de documentos y fotos de vehículos en Firebase Storage.

#### Acceptance Criteria

1. WHEN una imagen es seleccionada THEN el sistema SHALL comprimir la imagen para optimizar el tamaño
2. WHEN se sube una imagen THEN el sistema SHALL usar nombres únicos basados en userId y timestamp
3. WHEN se sube una imagen THEN el sistema SHALL mostrar progreso de subida al usuario
4. WHEN la subida es exitosa THEN el sistema SHALL guardar la URL de descarga en Firestore
5. WHEN hay error de red THEN el sistema SHALL reintentar automáticamente hasta 3 veces
6. IF la subida falla definitivamente THEN el sistema SHALL permitir al usuario reintentar manualmente
7. WHEN se reemplaza una imagen THEN el sistema SHALL eliminar la imagen anterior de Storage

### Requirement 5: UI Consistency and User Experience

**User Story:** Como conductor, quiero que todas las pantallas de onboarding tengan un diseño consistente y una experiencia de usuario fluida.

#### Acceptance Criteria

1. WHEN el usuario navega entre pantallas THEN el sistema SHALL mantener el mismo diseño visual (gradientes, colores, tipografía)
2. WHEN se muestran campos de imagen THEN el sistema SHALL usar componentes consistentes con estados vacío, cargando y completado
3. WHEN hay errores THEN el sistema SHALL mostrar mensajes de error consistentes con el resto de la app
4. WHEN se cargan imágenes THEN el sistema SHALL mostrar indicadores de progreso consistentes
5. WHEN el usuario interactúa con botones THEN el sistema SHALL proporcionar feedback visual inmediato
6. WHEN se completa una acción THEN el sistema SHALL mostrar confirmación visual (toasts, checkmarks)
7. WHEN el usuario navega hacia atrás THEN el sistema SHALL preservar el estado de las imágenes ya subidas

### Requirement 6: Data Persistence and Sync

**User Story:** Como sistema, necesito asegurar que todos los datos de documentos y fotos se persistan correctamente y se sincronicen entre dispositivos.

#### Acceptance Criteria

1. WHEN se sube una imagen THEN el sistema SHALL guardar la referencia en Realm local y Firestore
2. WHEN la app se cierra/abre THEN el sistema SHALL recuperar el estado de imágenes subidas
3. WHEN hay pérdida de conexión THEN el sistema SHALL guardar localmente y sincronizar cuando se recupere la conexión
4. WHEN se completa una pantalla THEN el sistema SHALL actualizar el progreso en el hook de onboarding
5. WHEN el usuario navega hacia atrás THEN el sistema SHALL mantener los datos ya guardados
6. WHEN hay conflictos de datos THEN el sistema SHALL priorizar los datos más recientes
7. WHEN se actualiza el progreso THEN el sistema SHALL sincronizar con Firebase inmediatamente