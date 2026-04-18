/* ══════════════════════════════════════════════════════════════
   THEREIAM — Media Database
   Uses IndexedDB so uploaded audio/video/files have no size cap.
   Loaded on every page before thereiam-player.js.

   API:
     TRDB.put(name, file)          → Promise — stores the file
     TRDB.getBlobUrl(name)         → Promise<string|null> — temp playback URL
     TRDB.getDataUrl(name)         → Promise<string|null> — base64 data URL
     TRDB.list()                   → Promise<Array<{name,type,size}>>
     TRDB.has(name)                → Promise<boolean>
     TRDB.delete(name)             → Promise
     TRDB.clear()                  → Promise
══════════════════════════════════════════════════════════════ */

const TRDB = (function () {
  const DB_NAME  = 'thereiam_media';
  const DB_VER   = 1;
  const STORE    = 'files';
  let   _db      = null;

  /* open / upgrade */
  function open() {
    return new Promise((resolve, reject) => {
      if (_db) { resolve(_db); return; }
      const req = indexedDB.open(DB_NAME, DB_VER);
      req.onupgradeneeded = function (e) {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: 'name' });
        }
      };
      req.onsuccess = function (e) { _db = e.target.result; resolve(_db); };
      req.onerror   = function (e) { reject(e.target.error); };
    });
  }

  /* store a File or Blob under a given name */
  async function put(name, file) {
    const db  = await open();
    const buf = await file.arrayBuffer();
    return new Promise((resolve, reject) => {
      const tx  = db.transaction(STORE, 'readwrite');
      const req = tx.objectStore(STORE).put({
        name: name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        data: buf,
        stored: Date.now()
      });
      tx.oncomplete = resolve;
      tx.onerror    = function (e) { reject(e.target.error); };
    });
  }

  /* get a raw record */
  async function _get(name) {
    const db = await open();
    return new Promise((resolve) => {
      const tx  = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(name);
      req.onsuccess = function (e) { resolve(e.target.result || null); };
      req.onerror   = function ()  { resolve(null); };
    });
  }

  /* returns a temporary object URL for playback (revoked on next call for same name) */
  const _blobCache = {};
  async function getBlobUrl(name) {
    const rec = await _get(name);
    if (!rec) return null;
    if (_blobCache[name]) URL.revokeObjectURL(_blobCache[name]);
    const blob = new Blob([rec.data], { type: rec.type });
    const url  = URL.createObjectURL(blob);
    _blobCache[name] = url;
    return url;
  }

  /* returns a base64 data URL (useful for images) */
  async function getDataUrl(name) {
    const rec = await _get(name);
    if (!rec) return null;
    return new Promise((resolve) => {
      const blob   = new Blob([rec.data], { type: rec.type });
      const reader = new FileReader();
      reader.onload = function (e) { resolve(e.target.result); };
      reader.readAsDataURL(blob);
    });
  }

  /* list all stored files (metadata only — no data) */
  async function list() {
    const db = await open();
    return new Promise((resolve) => {
      const tx    = db.transaction(STORE, 'readonly');
      const req   = tx.objectStore(STORE).getAll();
      req.onsuccess = function (e) {
        resolve(e.target.result.map(function (r) {
          return { name: r.name, type: r.type, size: r.size, stored: r.stored };
        }));
      };
      req.onerror = function () { resolve([]); };
    });
  }

  /* check existence */
  async function has(name) {
    const rec = await _get(name);
    return rec !== null;
  }

  /* delete one file */
  async function del(name) {
    const db = await open();
    if (_blobCache[name]) { URL.revokeObjectURL(_blobCache[name]); delete _blobCache[name]; }
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(name);
      tx.oncomplete = resolve;
      tx.onerror    = function (e) { reject(e.target.error); };
    });
  }

  /* clear everything */
  async function clear() {
    const db = await open();
    Object.keys(_blobCache).forEach(function (k) { URL.revokeObjectURL(_blobCache[k]); });
    Object.keys(_blobCache).forEach(function (k) { delete _blobCache[k]; });
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).clear();
      tx.oncomplete = resolve;
      tx.onerror    = function (e) { reject(e.target.error); };
    });
  }

  return { put, getBlobUrl, getDataUrl, list, has, delete: del, clear };
})();
