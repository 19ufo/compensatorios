/**
 * SERVIDOR LOCAL Y STANDALONE (Node.js nativo sin librerías externas)
 * ===================================================================
 * Ejecuta: node server.js
 * Abre en tu navegador: http://localhost:3000
 *
 * Ofrece la web y la API segura /api/sessions guardando en data/sessions.json
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const sessionsHandler = require('./api/sessions');

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    // 1. Enrutar hacia la API segura
    if (pathname === '/api/sessions' || pathname === '/api/sessions.js') {
        // Envolver req/res para compatibilidad con serverless handlers
        req.query = Object.fromEntries(parsedUrl.searchParams);
        res.status = function(code) {
            this.statusCode = code;
            return this;
        };
        res.json = function(data) {
            this.setHeader('Content-Type', 'application/json; charset=utf-8');
            this.end(JSON.stringify(data));
            return this;
        };

        // Parsear body si viene POST/PUT
        if (req.method === 'POST' || req.method === 'PUT') {
            let bodyData = '';
            req.on('data', chunk => { bodyData += chunk; });
            req.on('end', async () => {
                req.body = bodyData;
                await sessionsHandler(req, res);
            });
            return;
        } else {
            await sessionsHandler(req, res);
            return;
        }
    }

    // 2. Servir archivos estáticos del frontend
    let filePath = pathname === '/' ? path.join(__dirname, 'index.html') : path.join(__dirname, pathname);
    
    // Evitar directory traversal
    if (!filePath.startsWith(__dirname)) {
        res.statusCode = 403;
        res.end('Acceso denegado');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Fallback a index.html para SPA
            filePath = path.join(__dirname, 'index.html');
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        fs.readFile(filePath, (readErr, content) => {
            if (readErr) {
                res.statusCode = 500;
                res.end('Error al leer archivo');
                return;
            }
            res.writeHead(200, {
                'Content-Type': contentType,
                'Cache-Control': 'no-cache'
            });
            res.end(content);
        });
    });
});

server.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`🔒 API Segura activa en http://localhost:${PORT}/api/sessions`);
    console.log(`💾 Los datos se guardan en data/sessions.json`);
    console.log(`==================================================\n`);
});
