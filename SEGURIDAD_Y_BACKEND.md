# 🛡️ Arquitectura Segura: Cero Credenciales en el Frontend

Esta versión resuelve completamente tu requerimiento de seguridad: **ninguna clave de API, contraseña, token ni URL de base de datos queda expuesta en el código del navegador (frontend)**.

---

## 🔒 ¿Cómo protegemos tus credenciales y datos?

### Antes (Riesgoso) ❌
En la arquitectura tradicional del lado del cliente, la URL de la base de datos o el token se ponían en un archivo JavaScript como `config.js`. Cualquier persona que abriera las **Herramientas de Desarrollador (F12) &rarr; pestaña Red (Network) o Código Fuente (Sources)** podía ver las claves y la base de datos.

### Ahora (Arquitectura Segura y Profesional) ✅
```
[ NAVEGADOR EN CUALQUIER COMPUTADOR / CELULAR ]
                        │
                        ▼ (Petición limpia sin claves ni URLs)
                /api/sessions
                        │
                        ▼
[ SERVIDOR / SERVERLESS BACKEND (Vercel / Netlify / Node) ]
   🔒 Variables de entorno protegidas (process.env):
      • UPSTASH_REDIS_REST_URL o FIREBASE_DB_URL
      • UPSTASH_REDIS_REST_TOKEN o FIREBASE_AUTH_SECRET
      • APP_PIN (Tu clave secreta opcional)
                        │
                        ▼ (Conexión privada y cifrada)
[ BASE DE DATOS GRATUITA EN LA NUBE (Upstash / Firebase / Gist) ]
```

* **Lo que ve un usuario en el navegador**: Solo ve que la página llama a `/api/sessions`. Nada más.
* **Lo que sabe el navegador sobre la base de datos**: Absolutamente nada. No sabe si usas Redis, Firebase, PostgreSQL ni qué contraseña tiene.
* **Protección adicional con PIN (`APP_PIN`)**: Puedes configurar una clave o PIN de 4 dígitos en el servidor. Si alguien intenta abrir tu enlace o llamar a la API sin tu PIN, el servidor le responderá `401 Unauthorized` y no le mostrará ni permitirá cambiar ninguna de tus horas.

---

## 🚀 Despliegue 100% Gratis en Vercel con Variables de Entorno Ocultas

La plataforma ideal para esta arquitectura es **Vercel** (Plan Hobby, 100% gratuito de por vida y sin tarjeta de crédito).

### Pasos para desplegar:
1. Sube tu código a un repositorio en **GitHub** (puede ser privado o público, ya que las claves NO están en el código).
2. Entra a [vercel.com](https://vercel.com/) e inicia sesión con tu cuenta de GitHub.
3. Haz clic en **"Add New Project"** y selecciona tu repositorio.
4. Antes de hacer clic en Deploy, despliega la sección **"Environment Variables"** (Variables de Entorno) y agrega las que elijas:

#### Opción A: Upstash Redis (Recomendada — 100% gratis, sin tarjeta)
1. Ve a [upstash.com](https://upstash.com/) e inicia sesión con Google o GitHub.
2. Crea una base de datos Redis gratuita (haz clic en **"Create Database"**, región `us-east-1`).
3. En la pestaña **REST API**, copia las dos credenciales y agrégalas en Vercel:
   * `UPSTASH_REDIS_REST_URL` = `https://...upstash.io`
   * `UPSTASH_REDIS_REST_TOKEN` = `AX...`
   * *(Opcional)* `APP_PIN` = `1234` (tu clave personal)

#### Opción B: Firebase en el Backend (Si prefieres Google)
En Vercel agregas:
* `FIREBASE_DB_URL` = `https://tu-proyecto-default-rtdb.firebaseio.com`
* *(Opcional)* `FIREBASE_AUTH_SECRET` = `tu_secreto_de_firebase`
* *(Opcional)* `APP_PIN` = `1234`

5. Haz clic en **"Deploy"**.
6. En 30 segundos tendrás tu enlace público HTTPS:
   `https://compensatorios-anderson.vercel.app`

---

## 💻 ¿Y si quieres probarlo en tu computador local antes de subirlo?

Ya dejamos incluido un servidor listo para usar:
1. Abre tu terminal en esta carpeta y ejecuta:
   ```bash
   node server.js
   ```
2. Abre en tu navegador:
   ```text
   http://localhost:3000
   ```
3. El servidor atenderá la aplicación y guardará tus datos de forma segura en `data/sessions.json`.
