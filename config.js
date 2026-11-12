/**
 * CONFIGURACIÓN DEL CLIENTE (100% SEGURO)
 * ========================================
 * Ninguna clave de API, contraseña ni URL de base de datos se almacena aquí.
 * Todo se gestiona a través de la API protegida del servidor: /api/sessions
 */

window.APP_CONFIG = {
    // Endpoint relativo al backend seguro
    apiEndpoint: '/api/sessions',

    // Frecuencia de sincronización en segundo plano (20 segundos)
    pollingIntervalMs: 20000
};
