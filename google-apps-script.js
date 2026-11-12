/**
 * GOOGLE APPS SCRIPT - CONECTOR DE BASE DE DATOS GRATUITA CON GOOGLE SHEETS
 * =========================================================================
 * Si deseas que tus sesiones se guarden automáticamente en una hoja de cálculo
 * de Google Drive, sigue estos pasos:
 * 
 * 1. Ve a https://sheets.new y crea una nueva hoja llamada "Control Compensatorios".
 * 2. En el menú superior, haz clic en "Extensiones" -> "Apps Script".
 * 3. Borra todo el código que aparezca y pega este código completo.
 * 4. Haz clic en "Implementar" (botón azul arriba a la derecha) -> "Nueva implementación".
 * 5. En tipo selecciona "Aplicación web".
 *    - Descripción: API Compensatorios
 *    - Ejecutar como: "Yo" (tu cuenta)
 *    - Quién tiene acceso: "Cualquier persona" (Anyone)
 * 6. Haz clic en "Implementar" y copia la URL que termina en "/exec".
 * 7. Pega esa URL en tu aplicativo web (en config.js o en la ventana de sincronización).
 */

function doGet(e) {
  try {
    const sheet = getOrCreateSheet();
    const data = sheet.getDataRange().getValues();
    
    // Si la hoja está vacía o solo tiene encabezados
    if (data.length <= 1) {
      return buildJsonResponse({ status: 'ok', sessions: [] });
    }
    
    // Asumimos que guardamos el JSON en la celda A2 o fila por fila
    const firstCell = sheet.getRange("A2").getValue();
    let sessions = [];
    
    if (typeof firstCell === 'string' && firstCell.trim().startsWith('[')) {
      sessions = JSON.parse(firstCell);
    } else {
      // Reconstruir desde filas tabulares si existen
      const headers = data[0];
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!row[0]) continue;
        sessions.push({
          id: String(row[0]),
          fecha: String(row[1]),
          dia: String(row[2]),
          horaInicio: String(row[3]),
          horaFin: String(row[4]),
          horas: Number(row[5]) || 1,
          modalidad: String(row[6]),
          estado: String(row[7]),
          observaciones: String(row[8] || '')
        });
      }
    }
    
    return buildJsonResponse({ status: 'ok', sessions: sessions, updatedAt: new Date().toISOString() });
  } catch (err) {
    return buildJsonResponse({ status: 'error', message: err.toString() });
  }
}

function doPost(e) {
  try {
    let payload = {};
    if (e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    }
    
    const sessions = payload.sessions || [];
    const sheet = getOrCreateSheet();
    
    // Guardamos la representación completa en A2 para rapidez y fidelidad
    sheet.getRange("A1").setValue("JSON_PAYLOAD");
    sheet.getRange("B1").setValue("ULTIMA_ACTUALIZACION");
    sheet.getRange("A2").setValue(JSON.stringify(sessions));
    sheet.getRange("B2").setValue(new Date().toLocaleString());
    
    // También actualizamos una tabla visual en la pestaña "VistaTabular" para verla fácil
    actualizarVistaTabular(sessions);
    
    return buildJsonResponse({ status: 'ok', count: sessions.length, timestamp: new Date().toISOString() });
  } catch (err) {
    return buildJsonResponse({ status: 'error', message: err.toString() });
  }
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("DB_Compensatorios");
  if (!sheet) {
    sheet = ss.insertSheet("DB_Compensatorios");
  }
  return sheet;
}

function actualizarVistaTabular(sessions) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("Sesiones");
    if (!sheet) {
      sheet = ss.insertSheet("Sesiones", 0);
    }
    sheet.clear();
    
    const headers = ["ID", "Fecha", "Día", "Hora Inicio", "Hora Fin", "Horas", "Modalidad", "Estado", "Observaciones"];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#EFECE5");
    
    if (sessions.length > 0) {
      const rows = sessions.map(s => [
        s.id || '',
        s.fecha || '',
        s.dia || '',
        s.horaInicio || '',
        s.horaFin || '',
        s.horas || 1,
        s.modalidad || '',
        s.estado || '',
        s.observaciones || ''
      ]);
      sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
    }
    sheet.autoResizeColumns(1, headers.length);
  } catch (e) {
    // No romper si la vista tabular falla
  }
}

function buildJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
