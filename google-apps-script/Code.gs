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
// Batas server: maksimal RATE_LIMIT masukan per jendela RATE_WINDOW_SEC (semua pengirim),
// dan sheet berhenti menerima setelah MAX_ROWS baris.
var RATE_LIMIT = 20;
var RATE_WINDOW_SEC = 600;
var MAX_ROWS = 5000;

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
      if (rateLimited_()) return json_({ ok: false, error: 'Try again later' });
      var sheet = sheet_();
      if (sheet.getLastRow() > MAX_ROWS) return json_({ ok: false, error: 'Try again later' });
      sheet.appendRow([new Date(), name, rating, message]);
    } finally {
      lock.releaseLock();
    }

    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'Failed to save' });
  }
}

/**
 * Hitung masukan per jendela waktu tetap. Panggil di dalam lock agar
 * baca-tambah-tulis hitungan bersifat atomik.
 */
function rateLimited_() {
  var cache = CacheService.getScriptCache();
  var key = 'rate_' + Math.floor(Date.now() / (RATE_WINDOW_SEC * 1000));
  var count = Number(cache.get(key) || 0);
  if (count >= RATE_LIMIT) return true;
  // TTL sedikit lebih lama dari jendela agar kunci tidak hilang sebelum jendela berakhir.
  cache.put(key, String(count + 1), RATE_WINDOW_SEC + 100);
  return false;
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
