/**
 * THEREIAM — Cloud Sync
 * Reads content from Firebase Realtime Database so admin changes
 * made on any device show up for every visitor worldwide.
 *
 * ── SETUP (one time) ────────────────────────────────────────────
 * 1. Go to https://console.firebase.google.com
 * 2. Create a project (name it "thereiam" or anything you like)
 * 3. Click "Realtime Database" → Create Database → Start in TEST mode
 * 4. Copy your database URL (looks like: https://thereiam-xxxxx-default-rtdb.firebaseio.com)
 * 5. Paste it below replacing the placeholder
 * ────────────────────────────────────────────────────────────────
 */

const THEREIAM_DB = 'https://thereiam-d3127-default-rtdb.firebaseio.com';

// ── Write helper (used by admin.html) ──────────────────────────
window.THEREIAM_CLOUD = {
  write: function(data) {
    if (THEREIAM_DB.includes('REPLACE-WITH')) return Promise.resolve();
    return fetch(THEREIAM_DB + '/content.json', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json());
  },

  read: function() {
    if (THEREIAM_DB.includes('REPLACE-WITH')) return Promise.resolve(null);
    return fetch(THEREIAM_DB + '/content.json')
      .then(r => r.json())
      .catch(() => null);
  }
};

// ── On every page load: fetch cloud content, patch THEREIAM_CONTENT ──
(function () {
  if (THEREIAM_DB.includes('REPLACE-WITH')) return;

  THEREIAM_CLOUD.read().then(function (data) {
    if (data && typeof THEREIAM_CONTENT !== 'undefined') {
      ['music', 'hoodies', 'archive', 'sightings', 'brandPhotos'].forEach(function (key) {
        if (data[key] != null) THEREIAM_CONTENT[key] = data[key];
      });
    }
    // Signal pages to re-render with fresh data
    document.dispatchEvent(new Event('thereiam:cloud-ready'));
  }).catch(function () {
    document.dispatchEvent(new Event('thereiam:cloud-ready'));
  });
})();
