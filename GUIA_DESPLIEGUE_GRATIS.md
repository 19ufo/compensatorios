# 🚀 Guía de Despliegue Online Gratuito — Planificador de Horas de Compensación

Esta guía te muestra cómo tener tu aplicativo funcionando en internet con su propio enlace web (**URL pública HTTPS**), accesible desde cualquier computador o celular, guardando todos tus registros y marcas en la nube en tiempo real, **100% gratis de por vida** y **sin ingresar ninguna tarjeta de crédito**.

---

## 📋 Resumen de la Solución

| Componente | Antes | Ahora (Versión Online) | Costo |
| :--- | :--- | :--- | :--- |
| **Almacenamiento** | `localStorage` (encerrado en un solo navegador) | **Base de Datos en la Nube** (Firebase o Google Sheets) | **$0 / mes** |
| **Acceso** | Archivo local en tu disco `E:\...` | **Enlace Web HTTPS** (accesible desde cualquier PC o teléfono) | **$0 / mes** |
| **Sincronización** | Ninguna (manual) | **Automática e instantánea** entre computadores | **$0 / mes** |

---

## ☁️ PASO 1: Activar la Base de Datos Gratuita (2 Minutos)

Para que tus datos persistan cuando marques "Cumplido", edites horas o agregues sesiones desde cualquier computador, usamos **Firebase Realtime Database** de Google (Plan Spark Gratuito para siempre).

### Pasos rápidos:
1. Ve a [console.firebase.google.com](https://console.firebase.google.com/) e inicia sesión con tu cuenta de Google.
2. Haz clic en **"Crear un proyecto"** (puedes nombrarlo `compensatorios-anderson` o lo que gustes). Desactiva Google Analytics para crear más rápido y dale a **Continuar**.
3. En el menú de la izquierda, entra a **Compilación** (Build) &rarr; **Realtime Database**.
4. Haz clic en el botón azul **"Crear base de datos"**:
   - Ubicación: Estados Unidos (`us-central1`).
   - Modo de seguridad: Elige **"Modo de prueba"** (o Modo bloqueado).
5. Ve a la pestaña **Reglas** (Rules) arriba y asegúrate de que diga:
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
   *(Haz clic en **Publicar** para guardar las reglas).*
6. En la pestaña **Datos** (Data), copia la URL que aparece arriba (tiene este formato):
   ```text
   https://tu-proyecto-default-rtdb.firebaseio.com
   ```
7. Pega esa URL en tu archivo `config.js` en la variable `firebaseUrl`:
   ```javascript
   window.APP_CLOUD_CONFIG = {
       provider: 'firebase',
       firebaseUrl: 'https://tu-proyecto-default-rtdb.firebaseio.com',
       ...
   };
   ```
   *(También puedes pegarla directamente en la pantalla de la aplicación haciendo clic en el botón **"Modo Local / Sincronización"**).*

---

## 🌐 PASO 2: Publicar la Página Web en Internet (Elige tu método favorito)

El aplicativo no necesita servidores complejos de Node ni bases de datos de pago: es un desarrollo web moderno, ultrarrápido y seguro. Tienes 3 formas 100% gratuitas de publicarlo:

### 🟢 Método A: Netlify Drop (El más fácil y rápido — 30 segundos, sin instalar nada)
1. Ve a [app.netlify.com/drop](https://app.netlify.com/drop) en tu navegador.
2. Inicia sesión o crea una cuenta gratuita (con Google o GitHub).
3. **Arrastra la carpeta** `E:\Desarrollos\Antigravity\Compensatorios` directamente al círculo en la página.
4. En 10 segundos Netlify te generará un enlace público como:
   `https://nombre-aleatorio.netlify.app`
5. En **Site configuration &rarr; Change site name**, puedes cambiarle el nombre a algo como:
   `https://compensacion-anderson.netlify.app`
6. ¡Listo! Abre ese enlace en el computador del trabajo, en tu portátil de la casa o en tu celular.

---

### 🐱 Método B: GitHub Pages (Ideal si usas Git y quieres control de versiones)
1. Crea un repositorio en [GitHub.com](https://github.com) llamado `compensatorios` (puede ser público).
2. Sube los archivos ejecutando en la consola:
   ```bash
   git init
   git add .
   git commit -m "Versión online con sincronización en la nube"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/compensatorios.git
   git push -u origin main
   ```
3. En GitHub, entra a **Settings &rarr; Pages**.
4. En **Branch**, selecciona `main` y guarda.
5. En 1 minuto tendrás tu enlace permanente:
   `https://TU_USUARIO.github.io/compensatorios/`

---

### ▲ Método C: Vercel (Excelente velocidad y CDN global)
1. Ve a [vercel.com](https://vercel.com/) e inicia sesión con tu cuenta de GitHub o Google.
2. Haz clic en **"Add New Project"** e importa tu repositorio de GitHub o arrastra la carpeta.
3. Haz clic en **Deploy**.
4. Obtendrás tu enlace: `https://compensatorios-anderson.vercel.app`.

---

## 📱 ¿Cómo usarlo en el día a día?

1. **Abre el enlace en tu navegador** (puedes guardarlo en tus marcadores o favoritos).
2. Verás el indicador en el encabezado: **🟢 En la Nube**.
3. **Marca tus sesiones**:
   - Haz clic en el botón de estado **Planificado** para pasarlo a **Cumplido**.
   - Haz clic en **Modalidad** para alternar entre Teletrabajo y Presencial.
   - Agrega o edita sesiones según cumplas tus horarios.
4. **Cierra el navegador con tranquilidad**: Todos tus cambios se transmiten automáticamente a la base de datos.
5. **Abre el mismo enlace en otro computador**: Todo lo que marcaste estará cargado de inmediato.
6. Si tienes la página abierta en dos dispositivos a la vez, se actualizará en tiempo real sin recargar.

---

## 🔒 ¿Qué pasa si te quedas sin internet?
El aplicativo cuenta con **modo offline automático**:
- Guarda los cambios en la memoria del navegador (`localStorage`).
- Muestra el indicador en color amarillo o rojo notificándote.
- Apenas vuelva la conexión a internet, se sincroniza solo con la nube.
- Además, tienes botones para **Descargar copia JSON** o **Exportar a CSV** en cualquier momento.
