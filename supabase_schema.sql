-- =========================================================================
-- ESQUEMA SQL PARA SUPABASE — CONTROL DE COMPENSATORIOS ANDERSON CT
-- =========================================================================
-- Instrucciones:
-- 1. En tu proyecto de Supabase (https://supabase.com), ve al menú izquierdo "SQL Editor".
-- 2. Haz clic en "New query", pega este código completo y haz clic en "Run" (botón verde).
-- =========================================================================

-- 1. Crear la tabla de sesiones
CREATE TABLE IF NOT EXISTS compensatorios_sessions (
    id TEXT PRIMARY KEY,
    fecha TEXT NOT NULL,
    dia TEXT NOT NULL,
    hora_inicio TEXT NOT NULL,
    hora_fin TEXT NOT NULL,
    horas INTEGER NOT NULL DEFAULT 1,
    modalidad TEXT NOT NULL,
    estado TEXT NOT NULL,
    observaciones TEXT DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Habilitar la seguridad por filas (Row Level Security - RLS)
ALTER TABLE compensatorios_sessions ENABLE ROW LEVEL SECURITY;

-- 3. Crear política para permitir lectura y escritura segura desde el backend de Vercel
CREATE POLICY "Permitir acceso completo a la API de compensatorios"
ON compensatorios_sessions
FOR ALL
USING (true)
WITH CHECK (true);

-- 4. Opcional: Insertar los registros iniciales base del Excel de Anderson CT
INSERT INTO compensatorios_sessions (id, fecha, dia, hora_inicio, hora_fin, horas, modalidad, estado, observaciones)
VALUES
    ('base-1', '2026-10-20', 'Martes', '16:20', '18:20', 2, 'Teletrabajo', 'Cumplido', 'Terminar correo Diana funcionario workstation. Actualizar datos Incidentes Tecnológicos para TCT'),
    ('base-2', '2026-10-28', 'Miércoles', '16:20', '17:20', 1, 'Teletrabajo', 'Cumplido', 'Revisar contenido y detalles de la capacitación del jueves'),
    ('base-3', '2026-10-31', 'Sábado', '09:00', '12:00', 3, 'Presencial', 'Cumplido', 'Analizar proyecto PQRSD para volverlo código modular'),
    ('base-4', '2026-11-10', 'Martes', '06:30', '07:30', 1, 'Teletrabajo', 'Cumplido', 'Revisión correcciones proyecto denuncias'),
    ('base-5', '2026-11-12', 'Jueves', '06:30', '07:30', 1, 'Teletrabajo', 'Planificado', 'Planificado matutino antes de jornada')
ON CONFLICT (id) DO NOTHING;
