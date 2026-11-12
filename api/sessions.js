/**
 * BACKEND SEGURO / SERVERLESS API PARA VERCEL Y NETLIFY
 * ======================================================
 * Todas las claves, credenciales y URLs de la base de datos están
 * 100% PROTEGIDAS en variables de entorno del servidor.
 * NADA de claves ni URLs se expone al cliente (navegador).
 *
 * Variables de entorno soportadas (configúralas en Vercel/Netlify o .env):
 * 1. APP_PIN (Opcional): Clave o PIN numérico para que solo tú puedas editar tus horas.
 * 2. UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN (Opción recomendada - 100% gratis).
 * 3. O FIREBASE_DB_URL y FIREBASE_AUTH_SECRET (Google Firebase protegido en el backend).
 * 4. O GITHUB_TOKEN y GIST_ID (Base de datos privada en GitHub Gist).
 */

const fs = require('fs');
const path = require('path');

const INITIAL_FALLBACK_DATA = [
    {
        id: 'base-1',
        fecha: '2026-10-20',
        dia: 'Martes',
        horaInicio: '16:20',
        horaFin: '18:20',
        horas: 2,
        estado: 'Cumplido',
        modalidad: 'Teletrabajo',
        observaciones: 'Terminar correo Diana funcionario workstation. Actualizar datos Incidentes Tecnológicos para TCT'
    },
    {
        id: 'base-2',
        fecha: '2026-10-28',
        dia: 'Miércoles',
        horaInicio: '16:20',
        horaFin: '17:20',
        horas: 1,
        estado: 'Cumplido',
        modalidad: 'Teletrabajo',
        observaciones: 'Revisar contenido y detalles de la capacitación del jueves'
    },
    {
        id: 'base-3',
        fecha: '2026-10-31',
        dia: 'Sábado',
        horaInicio: '09:00',
        horaFin: '12:00',
        horas: 3,
        estado: 'Cumplido',
        modalidad: 'Presencial',
        observaciones: 'Analizar proyecto PQRSD para volverlo código modular'
    },
    {
        id: 'base-4',
        fecha: '2026-11-10',
        dia: 'Martes',
        horaInicio: '06:30',
        horaFin: '07:30',
        horas: 1,
        estado: 'Cumplido',
        modalidad: 'Teletrabajo',
        observaciones: 'Revisión correcciones proyecto denuncias'
    },
    {
        id: 'base-5',
        fecha: '2026-11-12',
        dia: 'Jueves',
        horaInicio: '06:30',
        horaFin: '07:30',
        horas: 1,
        estado: 'Planificado',
        modalidad: 'Teletrabajo',
        observaciones: 'Planificado matutino antes de jornada'
    }
];

const LOCAL_DATA_FILE = path.join(process.cwd(), 'data', 'sessions.json');

// Memoria volátil por si no hay disco ni variables de entorno configuradas
let memorySessions = null;

module.exports = async function handler(req, res) {
    // Configurar encabezados CORS y de respuesta
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-access-pin');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 1. Verificación de Seguridad por PIN (si APP_PIN está configurado en el servidor)
    const serverPin = process.env.APP_PIN;
    if (serverPin) {
        const clientPin = req.headers['x-access-pin'];
        if (!clientPin || clientPin.trim() !== serverPin.trim()) {
            return res.status(401).json({
                error: 'PIN de acceso inválido o no suministrado.',
                requiresPin: true
            });
        }
    }

    try {
        // 2. Manejo de GET: Leer sesiones
        if (req.method === 'GET') {
            const sessions = await getSessions();
            return res.status(200).json({
                status: 'ok',
                sessions: sessions,
                count: sessions.length,
                storage: getActiveStorageName()
            });
        }

        // 3. Manejo de POST / PUT: Guardar sesiones
        if (req.method === 'POST' || req.method === 'PUT') {
            let body = req.body;
            if (typeof body === 'string') {
                try {
                    body = JSON.parse(body);
                } catch (e) {
                    return res.status(400).json({ error: 'Cuerpo de petición JSON inválido' });
                }
            }

            const sessions = Array.isArray(body) ? body : (body && body.sessions ? body.sessions : null);
            if (!Array.isArray(sessions)) {
                return res.status(400).json({ error: 'Se esperaba un arreglo de sesiones' });
            }

            await saveSessions(sessions);
            return res.status(200).json({
                status: 'ok',
                message: 'Sesiones guardadas de forma segura en el backend',
                count: sessions.length,
                updatedAt: new Date().toISOString()
            });
        }

        return res.status(405).json({ error: 'Método HTTP no permitido' });
    } catch (err) {
        console.error('Error en API sessions:', err);
        return res.status(500).json({
            error: 'Error interno en el servidor seguro',
            details: err.message
        });
    }
};

function getActiveStorageName() {
    if (process.env.UPSTASH_REDIS_REST_URL) return 'Upstash Redis (Serverless)';
    if (process.env.FIREBASE_DB_URL) return 'Firebase Realtime DB (Server-side)';
    if (process.env.GITHUB_TOKEN && process.env.GIST_ID) return 'GitHub Private Gist';
    return 'Almacenamiento Local / Memoria Servidor';
}

async function getSessions() {
    // Opción 1: Upstash Redis (Serverless)
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        const url = `${process.env.UPSTASH_REDIS_REST_URL}/get/anderson_compensatorios_sessions`;
        const r = await fetch(url, {
            headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` }
        });
        const json = await r.json();
        if (json && json.result) {
            const parsed = typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    }

    // Opción 2: Firebase Realtime DB (Protegido por el backend, no visible en frontend)
    if (process.env.FIREBASE_DB_URL) {
        let fbUrl = process.env.FIREBASE_DB_URL.trim().replace(/\/+$/, '');
        if (!fbUrl.endsWith('.json')) fbUrl += '/sessions.json';
        if (process.env.FIREBASE_AUTH_SECRET) {
            fbUrl += (fbUrl.includes('?') ? '&' : '?') + `auth=${process.env.FIREBASE_AUTH_SECRET}`;
        }
        const r = await fetch(fbUrl);
        if (r.ok) {
            const data = await r.json();
            if (Array.isArray(data) && data.length > 0) return data;
        }
    }

    // Opción 3: GitHub Private Gist
    if (process.env.GITHUB_TOKEN && process.env.GIST_ID) {
        const r = await fetch(`https://api.github.com/gists/${process.env.GIST_ID}`, {
            headers: {
                'Authorization': `token ${process.env.GITHUB_TOKEN}`,
                'User-Agent': 'Compensatorios-Backend'
            }
        });
        if (r.ok) {
            const gist = await r.json();
            if (gist.files && gist.files['sessions.json']) {
                const parsed = JSON.parse(gist.files['sessions.json'].content);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        }
    }

    // Opción 4: Archivo local (si se ejecuta con Node.js en máquina local o contenedor)
    try {
        if (fs.existsSync(LOCAL_DATA_FILE)) {
            const raw = fs.readFileSync(LOCAL_DATA_FILE, 'utf-8');
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {
        // En Vercel el filesystem de lectura/escritura es efímero
    }

    // Opción 5: Memoria del proceso
    if (memorySessions && Array.isArray(memorySessions) && memorySessions.length > 0) {
        return memorySessions;
    }

    // Si aún no hay nada guardado, retornar los datos base iniciales del Excel
    return INITIAL_FALLBACK_DATA;
}

async function saveSessions(sessions) {
    memorySessions = sessions;

    // Opción 1: Upstash Redis
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        const url = `${process.env.UPSTASH_REDIS_REST_URL}/set/anderson_compensatorios_sessions`;
        await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(JSON.stringify(sessions))
        });
        return;
    }

    // Opción 2: Firebase Realtime DB
    if (process.env.FIREBASE_DB_URL) {
        let fbUrl = process.env.FIREBASE_DB_URL.trim().replace(/\/+$/, '');
        if (!fbUrl.endsWith('.json')) fbUrl += '/sessions.json';
        if (process.env.FIREBASE_AUTH_SECRET) {
            fbUrl += (fbUrl.includes('?') ? '&' : '?') + `auth=${process.env.FIREBASE_AUTH_SECRET}`;
        }
        await fetch(fbUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sessions)
        });
        return;
    }

    // Opción 3: GitHub Private Gist
    if (process.env.GITHUB_TOKEN && process.env.GIST_ID) {
        await fetch(`https://api.github.com/gists/${process.env.GIST_ID}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${process.env.GITHUB_TOKEN}`,
                'User-Agent': 'Compensatorios-Backend',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: {
                    'sessions.json': {
                        content: JSON.stringify(sessions, null, 2)
                    }
                }
            })
        });
        return;
    }

    // Opción 4: Archivo local (si se ejecuta en Node local)
    try {
        const dir = path.dirname(LOCAL_DATA_FILE);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(LOCAL_DATA_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
    } catch (e) {
        // En Vercel el filesystem es de solo lectura, se mantiene en memoria
    }
}
