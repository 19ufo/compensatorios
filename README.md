# 🎖️ Planificador de Horas de Compensación — Anderson CT (Online Cloud)

Aplicación web progresiva diseñada para el control, cálculo y auto-planificación de las **40 horas de compensación laboral** (20 horas de Teletrabajo + 20 horas Presenciales) con miras a la semana del **4 al 8 de enero de 2027**.

Ahora con **Sincronización en la Nube Multi-dispositivo 100% Gratuita** para abrirlo y actualizarlo desde cualquier computador o celular.

---

## 🌟 Características Principales

1. **Sincronización en la Nube en Tiempo Real (100% Gratis)**:
   - Conexión nativa con **Google Firebase Realtime Database** (Plan Spark gratuito, sin tarjeta).
   - Soporte alternativo con **Google Sheets** a través de Google Apps Script.
   - Sincronización bidireccional automática: los cambios hechos en el trabajo se ven reflejados de inmediato en la casa o en el celular.
   - Modo Offline con caché local automática (`localStorage`).
   
2. **Cálculo Estricto en Horas Enteras (Cero Decimales)**:
   - Reglas estrictas de horas enteras para auditoría laboral.
   - Meta General: 40 horas (8h por cada día de la semana 4–8 de enero 2027).
   - Metas por Modalidad: 20 horas exactas de Teletrabajo y 20 horas exactas Presenciales.

3. **Atajos Rápidos a 1 Clic**:
   - `Sábado Presencial (6h)`: Sábados de 7:00 am a 1:00 pm con cálculo automático de fecha.
   - `Antes de Jornada (1h)`: Días hábiles matutinos de 6:30 am a 7:30 am (Teletrabajo).
   - `Final de Jornada (1h)`: Días hábiles vespertinos de 4:20 pm a 5:20 pm (Teletrabajo).

4. **Motor Inteligente de Auto-planificación**:
   - Calcula el déficit de horas faltantes en cada modalidad y genera automáticamente el cronograma óptimo evitando solapamientos.

5. **Diseño Visual Ejecutivo**:
   - Paleta de color inspirada en las Alas de la Libertad (verde bosque `#1E382B`, cuero cálido `#6E4C33`, lienzos claros `#F7F6F2`).
   - Insignia heráldica vectorial SVG de alta definición.
   - Tarjetas de progreso con barras de textura suave.

---

## 📁 Estructura del Proyecto

```text
├── index.html                   # Aplicativo web completo de producción
├── config.js                    # Archivo de configuración para URL de la nube
├── google-apps-script.js        # Script opcional para sincronizar con Google Sheets
├── GUIA_DESPLIEGUE_GRATIS.md    # Guía paso a paso de despliegue en 2 minutos
├── Control_Horas_Compensacion - Anderson CT.xlsx  # Archivo Excel de referencia original
└── README.md                    # Documentación general del proyecto
```

---

## 🚀 Despliegue Rápido y Gratuito

Para tener tu enlace web público en internet y usarlo en cualquier lugar:

1. **Configura tu base de datos**: Lee `GUIA_DESPLIEGUE_GRATIS.md` para activar Firebase Realtime Database gratis en 2 minutos.
2. **Publica la web**: Arrastra esta carpeta a [Netlify Drop](https://app.netlify.com/drop) o súbela a **GitHub Pages** / **Vercel**.
3. ¡Abre tu nuevo enlace HTTPS y disfruta de tu planificador sincronizado en cualquier pantalla!
