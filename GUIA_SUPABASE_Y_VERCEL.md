# 🚀 Guía Definitiva: Crear y Desplegar con Supabase y Vercel (100% Gratis)

Esta guía te explica paso a paso cómo tener tu aplicativo funcionando en internet con su enlace público oficial (`https://tu-proyecto.vercel.app`), respaldado por una base de datos **PostgreSQL en Supabase**, con **todas las credenciales 100% protegidas en el backend** y **sin pagar un solo centavo**.

---

## 📌 Resumen de la Arquitectura

* **Frontend**: Interfaz web ejecutiva, responsive (PC y celular), con paleta de las Alas de la Libertad y cálculo estricto en enteros.
* **Backend**: Serverless Function en **Vercel** (`/api/sessions`) que protege tus claves.
* **Base de datos**: **Supabase** (PostgreSQL gratuito en la nube).
* **Seguridad**: El navegador **nunca conoce** la URL ni las claves de Supabase.

---

## 🐘 PASO 1: Crear la Base de Datos en Supabase (3 minutos)

1. Ve a [supabase.com](https://supabase.com/) y haz clic en **"Start your project"** (inicia sesión con tu cuenta de GitHub o correo de Google).
2. Haz clic en **"New Project"**:
   * **Name**: `compensatorios` (o el nombre que prefieras).
   * **Database Password**: Haz clic en *Generate a password* y guárdala por si acaso.
   * **Region**: Selecciona `East US (North Virginia)` o la más cercana.
   * **Pricing Plan**: Selecciona **Free Plan** ($0 / mes).
3. Haz clic en **"Create new project"** y espera 1 minuto a que se inicialice.
4. En el menú de la izquierda, entra a **SQL Editor** (ícono de terminal `>_`).
5. Haz clic en **"New query"**, copia y pega todo el contenido de este archivo:
   👉 [supabase_schema.sql](file:///e:/Desarrollos/Antigravity/Compensatorios/supabase_schema.sql)
6. Haz clic en el botón verde **"Run"** (o presiona `Ctrl + Enter`).
   * *Verás el mensaje "Success. No rows returned". ¡Tu tabla `compensatorios_sessions` ya está lista con tus 5 registros iniciales del Excel!*
7. Ahora vamos a copiar las 2 credenciales para Vercel:
   * En el menú izquierdo abajo, entra en **Project Settings** (engranaje ⚙️) &rarr; **API**.
   * Copia **Project URL** (ej: `https://abcdefghijkl.supabase.co`).
   * En la sección **Project API keys**, copia la clave **`anon` `public`** (o `service_role`).

---

## 🐱 PASO 2: Subir tu Código a GitHub (1 minuto)

Ya he dejado el repositorio Git inicializado y listo en tu carpeta. Solo requieres subirlo a tu cuenta de GitHub:

1. Entra a [github.com](https://github.com) y crea un nuevo repositorio llamado `compensatorios` (puede ser público o privado, ya que no hay ninguna clave en el código).
2. En tu terminal ejecuta:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/compensatorios.git
   git push -u origin main
   ```

---

## ▲ PASO 3: Desplegar en Vercel con Claves Ocultas (2 minutos)

1. Ve a [vercel.com](https://vercel.com/) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en **"Add New Project"** y selecciona tu repositorio `compensatorios`.
3. Antes de desplegar, haz clic en la sección desplegable **"Environment Variables"** (Variables de Entorno).
4. Agrega las siguientes variables:

| Nombre de la Variable | Valor |
| :--- | :--- |
| **`SUPABASE_URL`** | Pega tu Project URL de Supabase (ej: `https://abcdef.supabase.co`) |
| **`SUPABASE_KEY`** | Pega tu clave de Supabase copiada en el Paso 1 |
| **`APP_PIN`** *(Opcional)* | Pon un PIN o clave numérica (ej. `1234`) si deseas proteger el acceso a tus horas |

5. Haz clic en el botón azul **"Deploy"**.
6. En 30 segundos Vercel compilará tu aplicativo y te entregará tu enlace oficial:
   ```text
   https://compensatorios-anderson.vercel.app
   ```

---

## 📱 PASO 4: ¡Disfrutar de tu Planificador Online!

1. **Abre el enlace en cualquier computador o en tu celular**:
   * En el encabezado verás el distintivo: **`🟢 Backend Seguro`**.
2. **Marca tus horas**:
   * Haz clic sobre cualquier sesión para pasarla a **Cumplido**.
   * Agrega nuevas sesiones o usa los atajos rápidos (**Sábado Presencial 6h**, **Antes de Jornada 1h**, **Final de Jornada 1h**).
   * Usa el **Auto-planificador** para proyectar las horas faltantes hasta completar exactamente las 40h (20h Teletrabajo / 20h Presencial).
3. **Persistencia instantánea**:
   * Cada clic se envía por debajo al backend de Vercel y se guarda en tu PostgreSQL de Supabase.
   * Si abres el enlace en la oficina, en la casa o en el celular, **siempre verás tus datos exactamente sincronizados**.
4. **Ver tus datos en Supabase**:
   * Si algún día quieres ver tus registros como una hoja de cálculo, puedes entrar a tu proyecto en Supabase &rarr; **Table Editor** &rarr; tabla **`compensatorios_sessions`**. ¡Verás todas tus filas organizadas con fechas, horas y observaciones!
