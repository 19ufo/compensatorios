/**
 * CONFIGURACIÓN DE SINCRONIZACIÓN EN LA NUBE (100% GRATIS)
 * =========================================================
 * Para que puedas abrir el aplicativo en cualquier computador o celular
 * y todos tus cambios se guarden automáticamente en tiempo real.
 * 
 * Puedes configurar esto directamente aquí, o hacerlo desde la misma página web
 * haciendo clic en el botón de la nube "Sincronización".
 */

window.APP_CLOUD_CONFIG = {
    // Proveedor activo: 'firebase' | 'googlesheets' | 'local'
    // 'firebase' es el más rápido y recomendado (Google Spark Plan, 100% gratis).
    provider: 'firebase',

    // 1. SI USAS FIREBASE REALTIME DATABASE (Recomendado):
    // Pega aquí la URL de tu base de datos creada en https://console.firebase.google.com
    // Ejemplo: 'https://compensatorios-anderson-default-rtdb.firebaseio.com'
    firebaseUrl: '',

    // 2. SI USAS GOOGLE SHEETS / APPS SCRIPT:
    // Pega aquí la URL de la aplicación web de Google Apps Script
    // Ejemplo: 'https://script.google.com/macros/s/AKfycb.../exec'
    googleScriptUrl: '',

    // Nombre de la colección / clave de sincronización
    syncKey: 'compensatorios_anderson_v1',

    // Intervalo de sondeo en segundo plano (en milisegundos, ej: 15000 = cada 15 segundos)
    pollingIntervalMs: 15000
};
