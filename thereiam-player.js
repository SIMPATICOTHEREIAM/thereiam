/**
 * THEREIAM — Persistent Audio Player  v3
 * ─────────────────────────────────────────────────────
 * Cream / "In Plain Sight" theme
 * Hidden by default — only appears when a track is played
 * Queue ▲ expands player into a right-anchored tall rectangle
 * Shuffle mode randomises next-track selection
 *
 * Tracks are pulled live from THEREIAM_CONTENT.music
 * (which includes any admin overrides saved in localStorage).
 * thereiam-content.js MUST be loaded before this file.
 *
 * Pages only need: <div id="tr-player"></div>
 * ─────────────────────────────────────────────────────
 */

// ── Track list: live from content system ──────────────
let TR_TRACKS = [];

const TR_KEY_IDX = 'tr_idx';
const TR_KEY_POS = 'tr_pos';

let trAudio        = null;
let trIdx          = 0;
let trShuffled     = false;
let trSaveInterval = null;

// ── Player HTML ────────────────────────────────────────
function trBuildHTML() {
  return `
    <!-- Expand-mode header (hidden in bar mode) -->
    <div id="tr-expand-header">
      <span class="tr-expand-label">In Plain Sight</span>
      <button class="tr-btn tr-collapse-btn" onclick="trCollapsePlayer()" title="Back to bar">▼</button>
    </div>

    <!-- Left: vinyl disc + track info -->
    <div class="tr-left">
      <div class="tr-vinyl" id="tr-vinyl">
        <img src="THEREIAM LOGOS/THEREIAM LOGO2.png" alt="" class="tr-vinyl-img" />
      </div>
      <div class="tr-info">
        <div class="tr-track-name" id="tr-name">—</div>
        <div class="tr-track-artist" id="tr-artist">—</div>
      </div>
    </div>

    <!-- Center: controls + progress -->
    <div class="tr-center">
      <div class="tr-controls">
        <button class="tr-btn tr-shuffle" id="tr-shuffle" onclick="trShuffleToggle()" title="Shuffle">⇄</button>
        <button class="tr-btn" onclick="trPrev()" title="Previous">⏮</button>
        <button class="tr-btn tr-play" id="tr-play" onclick="trToggle()" title="Play / Pause">▶</button>
        <button class="tr-btn" onclick="trNext(false)" title="Next">⏭</button>
      </div>
      <div class="tr-progress-row">
        <span class="tr-time" id="tr-time">0:00</span>
        <div class="tr-progress-wrap" onclick="trSeek(event)" id="tr-bar">
          <div class="tr-progress-track">
            <div class="tr-progress-fill" id="tr-fill"></div>
          </div>
        </div>
        <span class="tr-time tr-dur" id="tr-dur">—</span>
      </div>
    </div>

    <!-- Right: brand label + queue arrow + close -->
    <div class="tr-right">
      <span class="tr-brand-label">In Plain Sight</span>
      <button class="tr-btn tr-queue-btn" id="tr-queue-toggle" onclick="trToggleQueue()" title="Expand queue">▲</button>
      <button class="tr-btn tr-close-btn" onclick="trHide()" title="Hide player">✕</button>
    </div>

    <!-- Queue panel -->
    <div id="tr-queue-panel"></div>
  `;
}

// ── Init ───────────────────────────────────────────────
function trInit() {
  // Pull live tracks from content system (includes localStorage admin overrides)
  if (typeof THEREIAM_CONTENT !== 'undefined' && Array.isArray(THEREIAM_CONTENT.music)) {
    TR_TRACKS = THEREIAM_CONTENT.music;
  }

  const bar = document.getElementById('tr-player');
  if (!bar) return;

  if (TR_TRACKS.length === 0) return; // No tracks — leave div empty

  // Inject HTML; player starts hidden until user presses play
  bar.innerHTML = trBuildHTML();
  bar.classList.add('tr-hidden');

  // Restore saved track index
  trIdx = parseInt(localStorage.getItem(TR_KEY_IDX) || '0');
  if (isNaN(trIdx) || trIdx >= TR_TRACKS.length) trIdx = 0;

  // Create audio element
  trAudio        = new Audio();
  trAudio.preload = 'metadata';
  trAudio.volume  = 0.85;

  trSetSrc(trIdx);

  trAudio.addEventListener('loadedmetadata', () => {
    const savedPos = parseFloat(localStorage.getItem(TR_KEY_POS) || '0');
    if (savedPos > 0 && savedPos < trAudio.duration - 1) {
      trAudio.currentTime = savedPos;
    }
    const durEl = document.getElementById('tr-dur');
    if (durEl) durEl.textContent = trFmt(trAudio.duration);
    // ⚠ Do NOT auto-play — player is hidden, user must press play first
  });

  trAudio.addEventListener('timeupdate', trUpdateProgress);
  trAudio.addEventListener('ended',      () => trNext(true));
  trAudio.addEventListener('play',       () => { trSetPlayUI(true);  trSpinVinyl(true);  });
  trAudio.addEventListener('pause',      () => { trSetPlayUI(false); trSpinVinyl(false); });

  trSaveInterval = setInterval(() => {
    if (trAudio && !trAudio.paused) {
      localStorage.setItem(TR_KEY_POS, trAudio.currentTime);
    }
  }, 2000);

  window.addEventListener('beforeunload', trSave);
  window.addEventListener('pagehide',     trSave);

  trUpdateNameplate();
  trBuildQueue();
  trBuildSoundSection();
}

function trSave() {
  if (!trAudio) return;
  localStorage.setItem(TR_KEY_IDX, trIdx);
  localStorage.setItem(TR_KEY_POS, trAudio.currentTime);
}

function trSetSrc(idx) {
  const track = TR_TRACKS[idx];
  if (!track) return;
  if (typeof TRDB !== 'undefined') {
    TRDB.getBlobUrl(track.file).then(url => {
      trAudio.src = url || track.file;
      trAudio.load();
    });
  } else {
    trAudio.src = track.file;
    trAudio.load();
  }
}

// ── Reveal / Hide ──────────────────────────────────────
function trReveal() {
  const bar = document.getElementById('tr-player');
  if (bar) {
    bar.classList.remove('tr-hidden');
    document.body.classList.add('tr-page');
  }
}

function trHide() {
  if (trAudio && !trAudio.paused) trAudio.pause();
  const bar   = document.getElementById('tr-player');
  const panel = document.getElementById('tr-queue-panel');
  const btn   = document.getElementById('tr-queue-toggle');
  if (bar) {
    bar.classList.add('tr-hidden');
    bar.classList.remove('tr-expanded');
  }
  if (panel) panel.classList.remove('open');
  if (btn)   btn.classList.remove('active');
}

// ── Vinyl spin ─────────────────────────────────────────
function trSpinVinyl(playing) {
  const vinyl = document.getElementById('tr-vinyl');
  if (vinyl) vinyl.classList.toggle('spinning', playing);
}

// ── Playback controls ──────────────────────────────────
function trToggle() {
  if (!trAudio) return;
  if (trAudio.paused) {
    trReveal(); // show bar when user hits play
    trAudio.play().catch(() => {});
  } else {
    trAudio.pause();
  }
}

function trNext(auto) {
  if (!trAudio) return;
  const wasPlaying = !trAudio.paused || auto;

  // Shuffle: pick random track that isn't the current one
  if (trShuffled && TR_TRACKS.length > 1) {
    let next;
    do { next = Math.floor(Math.random() * TR_TRACKS.length); } while (next === trIdx);
    trIdx = next;
  } else {
    trIdx = (trIdx + 1) % TR_TRACKS.length;
  }

  localStorage.setItem(TR_KEY_IDX, trIdx);
  localStorage.setItem(TR_KEY_POS, 0);
  trSetSrc(trIdx);
  trUpdateNameplate();
  trBuildQueue();
  trSyncSoundTab();

  if (wasPlaying) {
    trAudio.addEventListener('canplay', function once() {
      trAudio.removeEventListener('canplay', once);
      trAudio.play().catch(() => {});
    });
  }
}

function trPrev() {
  if (!trAudio) return;
  const wasPlaying = !trAudio.paused;
  if (trAudio.currentTime > 3) { trAudio.currentTime = 0; return; }

  trIdx = (trIdx - 1 + TR_TRACKS.length) % TR_TRACKS.length;
  localStorage.setItem(TR_KEY_IDX, trIdx);
  localStorage.setItem(TR_KEY_POS, 0);
  trSetSrc(trIdx);
  trUpdateNameplate();
  trBuildQueue();
  trSyncSoundTab();

  if (wasPlaying) {
    trAudio.addEventListener('canplay', function once() {
      trAudio.removeEventListener('canplay', once);
      trAudio.play().catch(() => {});
    });
  }
}

function trJump(idx) {
  if (!trAudio) return;
  trReveal(); // show player when user picks a track
  trIdx = idx;
  localStorage.setItem(TR_KEY_IDX, trIdx);
  localStorage.setItem(TR_KEY_POS, 0);
  trSetSrc(trIdx);
  trUpdateNameplate();
  trBuildQueue();
  trSyncSoundTab();
  trAudio.addEventListener('canplay', function once() {
    trAudio.removeEventListener('canplay', once);
    trAudio.play().catch(() => {});
  });
}

function trSeek(e) {
  if (!trAudio || !trAudio.duration) return;
  const bar  = document.getElementById('tr-bar');
  const rect = bar.getBoundingClientRect();
  const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  trAudio.currentTime = pct * trAudio.duration;
}

// ── Shuffle toggle ─────────────────────────────────────
function trShuffleToggle() {
  trShuffled = !trShuffled;
  const btn = document.getElementById('tr-shuffle');
  if (btn) btn.classList.toggle('active', trShuffled);
}

// ── Queue: expand / collapse ───────────────────────────
function trToggleQueue() {
  const bar   = document.getElementById('tr-player');
  const panel = document.getElementById('tr-queue-panel');
  const btn   = document.getElementById('tr-queue-toggle');
  if (!bar || !panel) return;

  const expanding = !bar.classList.contains('tr-expanded');
  bar.classList.toggle('tr-expanded', expanding);
  panel.classList.toggle('open', expanding);
  if (btn) btn.classList.toggle('active', expanding);
}

function trCollapsePlayer() {
  const bar   = document.getElementById('tr-player');
  const panel = document.getElementById('tr-queue-panel');
  const btn   = document.getElementById('tr-queue-toggle');
  if (bar)   bar.classList.remove('tr-expanded');
  if (panel) panel.classList.remove('open');
  if (btn)   btn.classList.remove('active');
}

// ── UI updates ─────────────────────────────────────────
function trSetPlayUI(playing) {
  const btn = document.getElementById('tr-play');
  if (btn) {
    btn.innerHTML = playing ? '⏸' : '▶';
    btn.classList.toggle('playing', playing);
  }
  trSyncSoundTab();
}

function trUpdateProgress() {
  if (!trAudio || !trAudio.duration) return;
  const fill = document.getElementById('tr-fill');
  const time = document.getElementById('tr-time');
  const pct  = (trAudio.currentTime / trAudio.duration) * 100;
  if (fill) fill.style.width = pct + '%';
  if (time) time.textContent = trFmt(trAudio.currentTime);
}

function trUpdateNameplate() {
  const t      = TR_TRACKS[trIdx] || { title: '—', artist: '—', dur: '—' };
  const nameEl = document.getElementById('tr-name');
  const artEl  = document.getElementById('tr-artist');
  const durEl  = document.getElementById('tr-dur');
  if (nameEl) nameEl.textContent = t.title;
  if (artEl)  artEl.textContent  = t.artist;
  if (durEl)  durEl.textContent  = t.dur || '—';
}

function trFmt(s) {
  if (!s || isNaN(s)) return '0:00';
  const m   = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return m + ':' + (sec < 10 ? '0' + sec : sec);
}

function trBuildQueue() {
  const panel = document.getElementById('tr-queue-panel');
  if (!panel) return;
  panel.innerHTML =
    '<div class="tr-q-header">Up Next &nbsp;·&nbsp; ' + TR_TRACKS.length + ' tracks</div>' +
    TR_TRACKS.map((t, i) =>
      `<div class="tr-q-item${i === trIdx ? ' active' : ''}" onclick="trJump(${i})">
        <span class="tr-q-num">${String(i + 1).padStart(2, '0')}</span>
        <span class="tr-q-title">${t.title}</span>
        <span class="tr-q-meta">${t.artist} · ${t.dur}</span>
      </div>`
    ).join('');
}

// ── Sound tab sync (landing page) ──────────────────────
function trSyncSoundTab() {
  const list = document.getElementById('sound-tracklist');
  if (!list) return;
  list.querySelectorAll('.sound-track').forEach((el, i) => {
    el.classList.toggle('playing', i === trIdx && trAudio && !trAudio.paused);
    const playIcon = el.querySelector('.st-play');
    if (playIcon) playIcon.textContent = (i === trIdx && trAudio && !trAudio.paused) ? '▶' : '○';
  });
}

function trBuildSoundSection() {
  const list    = document.getElementById('sound-tracklist');
  const counter = document.getElementById('tr-sound-count');
  if (!list) return;
  if (counter) counter.textContent = TR_TRACKS.length + ' tracks';

  if (TR_TRACKS.length === 0) {
    list.innerHTML = `<p style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:var(--ink-dim);padding:24px 0;">Music coming soon.</p>`;
    return;
  }

  list.innerHTML = TR_TRACKS.map((t, i) =>
    `<div class="sound-track${i === trIdx ? ' playing' : ''}" onclick="trJump(${i})">
      <span class="st-num">${String(i + 1).padStart(2, '0')}</span>
      <span class="st-play">${i === trIdx && trAudio && !trAudio.paused ? '▶' : '○'}</span>
      <span class="st-title">${t.title}</span>
      <span class="st-artist">${t.artist}</span>
      <span class="st-dur">${t.dur}</span>
    </div>`
  ).join('');
}

// ── Boot ───────────────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', trInit);
} else {
  trInit();
}
