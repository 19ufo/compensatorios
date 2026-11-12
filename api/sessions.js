/**
 * BACKEND SEGURO / SERVERLESS API PARA VERCEL Y NETLIFY
 * ======================================================
 * Todas las claves y URLs de Supabase / Base de datos están
 * 100% PROTEGIDAS en variables de entorno del servidor (process.env).
 * NADA de claves ni URLs se expone al cliente (navegador).
 *
 * Variables de entorno soportadas en Vercel:
 * 1. SUPABASE_URL: URL de tu proyecto Supabase (ej: https://xyz.supabase.co)
 * 2. SUPABASE_KEY: Tu clave anon o service_role de Supabase
 * 3. SUPABASE_TABLE (Opcional, por defecto 'compensatorios_sessions')
 * 4. APP_PIN (Opcional): Clave o PIN numérico para proteger tus registros
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
let memorySessions = null;

module.exports = async function handler(req, res) {
    // Encabezados CORS seguros con validación de origen
    const origin = req.headers.origin;
    if (origin) {
        if (origin.endsWith('.vercel.app') || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
    } else {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-access-pin');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 1. Verificación de Seguridad por PIN (si APP_PIN está definido en Vercel)
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

            // Mitigación contra ataques de denegación de servicio (DDoS) por carga masiva
            if (sessions.length > 100) {
                return res.status(400).json({ error: 'La lista no puede exceder 100 sesiones' });
            }

            await saveSessions(sessions);
            return res.status(200).json({
                status: 'ok',
                message: 'Sesiones guardadas de forma segura en Supabase / Backend',
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
    if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) return 'Supabase PostgreSQL (Cloud)';
    if (process.env.UPSTASH_REDIS_REST_URL) return 'Upstash Redis (Serverless)';
    if (process.env.FIREBASE_DB_URL) return 'Firebase Realtime DB (Server-side)';
    return 'Almacenamiento Local / Memoria Servidor';
}

/**
 * Conversión y sanitización estricta de modelos: camelCase (Frontend) <-> snake_case (Supabase Postgres)
 */
function toSupabaseRow(s) {
    const rawId = String(s.id || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
    const id = rawId || ('s-' + Date.now() + '-' + Math.floor(Math.random() * 1000));
    
    // Validar formato fecha YYYY-MM-DD
    const rawFecha = String(s.fecha || '').trim();
    const fecha = /^\d{4}-\d{2}-\d{2}$/.test(rawFecha) ? rawFecha : new Date().toISOString().split('T')[0];
    
    // Validar modalidad fija
    const modalidad = (s.modalidad === 'Presencial') ? 'Presencial' : 'Teletrabajo';
    
    // Validar estado fijo
    const estado = (s.estado === 'Cumplido') ? 'Cumplido' : 'Planificado';
    
    // Validar rango entero de horas (1 a 24)
    const horas = Math.min(24, Math.max(1, Math.round(parseInt(s.horas, 10) || 1)));
    
    // Sanitizar y truncar observaciones (máximo 500 caracteres, sin bytes de control)
    const observaciones = String(s.observaciones || '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '').trim().slice(0, 500);
    
    const dia = String(s.dia || '').replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '').trim().slice(0, 20);
    const hora_inicio = String(s.horaInicio || '16:20').trim().slice(0, 8);
    const hora_fin = String(s.horaFin || '17:20').trim().slice(0, 8);

    return {
        id,
        fecha,
        dia: dia || 'Lunes',
        hora_inicio,
        hora_fin,
        horas,
        modalidad,
        estado,
        observaciones
    };
}

function fromSupabaseRow(r) {
    return {
        id: r.id,
        fecha: r.fecha,
        dia: r.dia,
        horaInicio: r.hora_inicio || r.horaInicio,
        horaFin: r.hora_fin || r.horaFin,
        horas: Math.max(1, Math.round(parseInt(r.horas, 10) || 1)),
        modalidad: r.modalidad,
        estado: r.estado,
        observaciones: r.observaciones || ''
    };
}

async function getSessions() {
    // 1. SUPABASE POSTGRESQL (Opción Principal)
    if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
        try {
            const baseUrl = process.env.SUPABASE_URL.trim().replace(/\/+$/, '');
            const table = process.env.SUPABASE_TABLE || 'compensatorios_sessions';
            const endpoint = `${baseUrl}/rest/v1/${table}?select=*&order=fecha.asc,hora_inicio.asc`;

            const r = await fetch(endpoint, {
                headers: {
                    'apikey': process.env.SUPABASE_KEY,
                    'Authorization': `Bearer ${process.env.SUPABASE_KEY}`
                }
            });

            if (r.ok) {
                const rows = await r.json();
                if (Array.isArray(rows) && rows.length > 0) {
                    return rows.map(fromSupabaseRow);
                }
            } else {
                console.warn('Supabase GET status no exitoso:', r.status);
            }
        } catch (supaErr) {
            console.error('Error conectando a Supabase:', supaErr);
        }
    }

    // 2. UPSTASH REDIS (Fallback)
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        try {
            const url = `${process.env.UPSTASH_REDIS_REST_URL}/get/anderson_compensatorios_sessions`;
            const r = await fetch(url, {
                headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` }
            });
            const json = await r.json();
            if (json && json.result) {
                const parsed = typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch (e) {}
    }

    // 3. FIREBASE REALTIME DB (Fallback en servidor)
    if (process.env.FIREBASE_DB_URL) {
        try {
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
        } catch (e) {}
    }

    // 4. ARCHIVO LOCAL (Para desarrollo local con Node.js)
    try {
        if (fs.existsSync(LOCAL_DATA_FILE)) {
            const raw = fs.readFileSync(LOCAL_DATA_FILE, 'utf-8');
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {}

    // 5. MEMORIA VOLÁTIL
    if (memorySessions && Array.isArray(memorySessions) && memorySessions.length > 0) {
        return memorySessions;
    }

    // Si aún no hay nada guardado, retornar los datos base iniciales del Excel
    return INITIAL_FALLBACK_DATA;
}

async function saveSessions(sessions) {
    memorySessions = sessions;

    // 1. SUPABASE POSTGRESQL (Opción Principal)
    if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
        const baseUrl = process.env.SUPABASE_URL.trim().replace(/\/+$/, '');
        const table = process.env.SUPABASE_TABLE || 'compensatorios_sessions';
        const rows = sessions.map(toSupabaseRow);

        // A. Limpiar registros previos para mantener sincronía exacta (eliminaciones, etc.)
        await fetch(`${baseUrl}/rest/v1/${table}?id=neq.__dummy__`, {
            method: 'DELETE',
            headers: {
                'apikey': process.env.SUPABASE_KEY,
                'Authorization': `Bearer ${process.env.SUPABASE_KEY}`
            }
        });

        // B. Insertar la lista actualizada de sesiones
        const insertRes = await fetch(`${baseUrl}/rest/v1/${table}`, {
            method: 'POST',
            headers: {
                'apikey': process.env.SUPABASE_KEY,
                'Authorization': `Bearer ${process.env.SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(rows)
        });

        if (!insertRes.ok) {
            const errText = await insertRes.text();
            throw new Error(`Error guardando en Supabase (${insertRes.status}): ${errText}`);
        }
        return;
    }

    // 2. UPSTASH REDIS (Fallback)
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

    // 3. FIREBASE REALTIME DB (Fallback)
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

    // 4. ARCHIVO LOCAL
    try {
        const dir = path.dirname(LOCAL_DATA_FILE);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(LOCAL_DATA_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
    } catch (e) {}
}
