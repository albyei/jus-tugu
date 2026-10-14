/**
 * Penerima form "Kritik dan Saran" Jus Tugu.
 * Menyimpan setiap masukan ke sheet bernama "Masukan"
 * dengan kolom: Waktu, Nama, Rating, Pesan.
 *
 * Deploy: Deploy → New deployment → Web app
 *   Execute as: Me
 *   Who has access: Anyone
 * Salin URL Web App ke src/data/site.ts → appsScriptUrl.
 */

var SHEET_NAME = 'Masukan';
var HEADERS = ['Waktu', 'Nama', 'Rating', 'Pesan'];
var MAX_NAME = 100;
var MAX_MESSAGE = 1000;

function doPost(e) {
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    // Honeypot terisi → kemungkinan bot. Balas ok agar bot tidak mencoba lagi.
    if (data.website) return json_({ ok: true });

    var message = clean_(data.message, MAX_MESSAGE);
    if (!message) return json_({ ok: false, error: 'Pesan kosong' });

    var name = clean_(data.name, MAX_NAME);
    var rating = Math.round(Number(data.rating));
    rating = rating >= 1 && rating <= 5 ? rating : '';

    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      sheet_().appendRow([new Date(), name, rating, message]);
    } finally {
      lock.releaseLock();
    }

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/** Untuk cek cepat di browser bahwa Web App aktif. */
function doGet() {
  return json_({ ok: true, service: 'Jus Tugu – Masukan' });
}

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** Rapikan teks, potong yang terlalu panjang, dan cegah formula injection. */
function clean_(value, max) {
  var text = String(value == null ? '' : value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .trim()
    .slice(0, max);
  if (/^[=+\-@\t\r]/.test(text)) text = "'" + text;
  return text;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
