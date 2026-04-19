/**
 * THEREIAM — Cloud Sync via Firebase Realtime Database
 * Admin changes save here. Every visitor reads from here.
 */

const THEREIAM_DB = 'https://thereiam-d3127-default-rtdb.firebaseio.com';

// ── Keys synced to cloud (no brandPhotos — they're embedded base64, too large) ──
const CLOUD_KEYS = ['music', 'hoodies', 'archive', 'sightings', 'brandPhotos'];

window.THEREIAM_CLOUD = {

  // Write only the keys that make sense to sync (not huge base64 images)
  write: function(data) {
    var payload = {};
    CLOUD_KEYS.forEach(function(k) { if (data[k] != null) payload[k] = data[k]; });

    return fetch(THEREIAM_DB + '/content.json', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(function(r) { return r.json(); })
    .then(function(result) {
      // Firebase returns {"error":"..."} if write was rejected
      if (result && result.error) throw new Error(result.error);
      return result;
    });
  },

  // Read from cloud and patch THEREIAM_CONTENT
  read: function() {
    return fetch(THEREIAM_DB + '/content.json?t=' + Date.now()) // bust cache
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data && data.error) return null; // permission denied etc
        return data;
      })
      .catch(function() { return null; });
  }
};

// ── Auto-read on every page load ──────────────────────────────
(function() {
  THEREIAM_CLOUD.read().then(function(data) {
    if (data && typeof THEREIAM_CONTENT !== 'undefined') {
      CLOUD_KEYS.forEach(function(key) {
        if (data[key] != null) THEREIAM_CONTENT[key] = data[key];
      });
    }
    document.dispatchEvent(new Event('thereiam:cloud-ready'));
  });
})();
