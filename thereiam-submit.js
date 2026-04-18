/* ══════════════════════════════════════════════════════════════
   THEREIAM — Submission System
   Injects the "Submit Your Work" modal into any page.
   Submissions are stored in localStorage key: tr_submissions
══════════════════════════════════════════════════════════════ */

(function () {
  /* ── inject CSS ── */
  const style = document.createElement('style');
  style.textContent = `
    /* Submit modal overlay */
    #submit-modal {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.88);
      z-index: 7000;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    #submit-modal.open { display: flex; }

    .sm-box {
      background: #09080d;
      border: 1px solid rgba(237,233,223,0.09);
      width: 100%;
      max-width: 480px;
      max-height: 90vh;
      overflow-y: auto;
      padding: 44px 36px 36px;
      position: relative;
      scrollbar-width: thin;
      scrollbar-color: rgba(237,233,223,0.08) transparent;
    }

    .sm-close {
      position: absolute;
      top: 16px; right: 20px;
      background: none;
      border: none;
      color: rgba(237,233,223,0.25);
      font-size: 18px;
      cursor: pointer;
      line-height: 1;
      transition: color 0.2s;
    }
    .sm-close:hover { color: rgba(237,233,223,0.7); }

    .sm-title {
      font-family: 'Space Mono', monospace;
      font-size: 8px;
      letter-spacing: 0.55em;
      text-transform: uppercase;
      color: rgba(237,233,223,0.2);
      margin-bottom: 28px;
    }

    .sm-heading {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: clamp(20px, 4vw, 28px);
      font-style: italic;
      color: #ede9df;
      line-height: 1.3;
      margin-bottom: 32px;
    }

    /* step indicator */
    .sm-steps {
      display: flex;
      gap: 6px;
      margin-bottom: 32px;
    }
    .sm-step-dot {
      width: 24px; height: 2px;
      background: rgba(237,233,223,0.1);
      transition: background 0.3s;
    }
    .sm-step-dot.active { background: #c4962a; }

    /* form fields */
    .sm-field { margin-bottom: 20px; }

    .sm-label {
      display: block;
      font-family: 'Space Mono', monospace;
      font-size: 8px;
      letter-spacing: 0.4em;
      text-transform: uppercase;
      color: rgba(237,233,223,0.32);
      margin-bottom: 8px;
    }

    .sm-input, .sm-select, .sm-textarea {
      width: 100%;
      background: rgba(237,233,223,0.03);
      border: 1px solid rgba(237,233,223,0.08);
      color: #ede9df;
      font-family: 'DM Sans', 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 300;
      padding: 12px 14px;
      outline: none;
      transition: border-color 0.2s;
    }
    .sm-input:focus, .sm-select:focus, .sm-textarea:focus {
      border-color: rgba(196,150,42,0.45);
    }

    .sm-select option { background: #09080d; }

    .sm-textarea { resize: vertical; min-height: 80px; }

    /* anon toggle */
    .sm-anon {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      margin-top: -8px;
    }
    .sm-anon input { accent-color: #c4962a; cursor: pointer; }
    .sm-anon span {
      font-family: 'Space Mono', monospace;
      font-size: 9px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: rgba(237,233,223,0.3);
    }

    /* file upload zone */
    .sm-upload-zone {
      border: 1px dashed rgba(237,233,223,0.1);
      padding: 24px;
      text-align: center;
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
      margin-bottom: 8px;
      position: relative;
    }
    .sm-upload-zone:hover {
      border-color: rgba(196,150,42,0.3);
      background: rgba(196,150,42,0.03);
    }
    .sm-upload-zone input[type="file"] {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
      width: 100%;
      height: 100%;
    }
    .sm-upload-icon {
      font-size: 22px;
      margin-bottom: 8px;
      opacity: 0.3;
    }
    .sm-upload-label {
      font-family: 'Space Mono', monospace;
      font-size: 8px;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: rgba(237,233,223,0.25);
    }
    .sm-file-list {
      font-family: 'Space Mono', monospace;
      font-size: 9px;
      color: rgba(196,150,42,0.7);
      letter-spacing: 0.1em;
      min-height: 16px;
    }

    /* buttons */
    .sm-btn-row {
      display: flex;
      gap: 12px;
      margin-top: 28px;
    }

    .sm-btn {
      flex: 1;
      padding: 13px;
      font-family: 'Space Mono', monospace;
      font-size: 9px;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid rgba(237,233,223,0.12);
      background: none;
      color: rgba(237,233,223,0.4);
    }
    .sm-btn:hover { color: #ede9df; border-color: rgba(237,233,223,0.35); }

    .sm-btn.primary {
      background: #c4962a;
      border-color: #c4962a;
      color: #07060a;
      font-weight: 700;
    }
    .sm-btn.primary:hover { background: #d4a634; border-color: #d4a634; }

    /* success state */
    .sm-success {
      text-align: center;
      padding: 20px 0;
    }
    .sm-success-icon {
      font-size: 36px;
      margin-bottom: 20px;
      opacity: 0.6;
    }
    .sm-success-msg {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 22px;
      font-style: italic;
      color: #ede9df;
      margin-bottom: 10px;
    }
    .sm-success-sub {
      font-family: 'Space Mono', monospace;
      font-size: 8px;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: rgba(237,233,223,0.22);
    }

    .sm-err {
      font-family: 'Space Mono', monospace;
      font-size: 8px;
      color: #b54a3a;
      letter-spacing: 0.2em;
      margin-top: 8px;
      min-height: 14px;
    }
  `;
  document.head.appendChild(style);

  /* ── inject modal HTML ── */
  const modal = document.createElement('div');
  modal.id = 'submit-modal';
  modal.innerHTML = `
    <div class="sm-box">
      <button class="sm-close" onclick="trCloseSubmit()">✕</button>

      <!-- STEP 1: identity -->
      <div id="sm-step-1">
        <div class="sm-title">Submit Your Work</div>
        <h2 class="sm-heading">Who's sharing<br/>with us?</h2>
        <div class="sm-steps">
          <div class="sm-step-dot active"></div>
          <div class="sm-step-dot"></div>
          <div class="sm-step-dot"></div>
        </div>

        <div class="sm-field">
          <label class="sm-label">Your name</label>
          <input class="sm-input" id="sm-name" type="text" placeholder="First name, handle, anything" autocomplete="off" />
        </div>

        <label class="sm-anon">
          <input type="checkbox" id="sm-anon-check" onchange="trAnonToggle()" />
          <span>Stay anonymous</span>
        </label>

        <div class="sm-field" style="margin-top:20px;">
          <label class="sm-label">Email <span style="opacity:0.5">(so we can reach you)</span></label>
          <input class="sm-input" id="sm-email" type="email" placeholder="your@email.com" autocomplete="off" />
        </div>

        <div class="sm-err" id="sm-err-1"></div>
        <div class="sm-btn-row">
          <button class="sm-btn" onclick="trCloseSubmit()">Cancel</button>
          <button class="sm-btn primary" onclick="trStep1Next()">Next →</button>
        </div>
      </div>

      <!-- STEP 2: category + note -->
      <div id="sm-step-2" style="display:none;">
        <div class="sm-title">Submit Your Work</div>
        <h2 class="sm-heading">What are you<br/>bringing?</h2>
        <div class="sm-steps">
          <div class="sm-step-dot"></div>
          <div class="sm-step-dot active"></div>
          <div class="sm-step-dot"></div>
        </div>

        <div class="sm-field">
          <label class="sm-label">Category</label>
          <select class="sm-select" id="sm-category">
            <option value="">— select one —</option>
            <option value="Poetry">Poetry</option>
            <option value="Spoken Word">Spoken Word</option>
            <option value="Photography">Photography</option>
            <option value="Music">Music</option>
            <option value="Sighting">THEREIAM</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div class="sm-field">
          <label class="sm-label">Note / description <span style="opacity:0.5">(optional)</span></label>
          <textarea class="sm-textarea" id="sm-note" placeholder="Tell us about it..."></textarea>
        </div>

        <div class="sm-err" id="sm-err-2"></div>
        <div class="sm-btn-row">
          <button class="sm-btn" onclick="trStepBack(1)">← Back</button>
          <button class="sm-btn primary" onclick="trStep2Next()">Next →</button>
        </div>
      </div>

      <!-- STEP 3: file upload -->
      <div id="sm-step-3" style="display:none;">
        <div class="sm-title">Submit Your Work</div>
        <h2 class="sm-heading">Drop your<br/>files here.</h2>
        <div class="sm-steps">
          <div class="sm-step-dot"></div>
          <div class="sm-step-dot"></div>
          <div class="sm-step-dot active"></div>
        </div>

        <div class="sm-field">
          <div class="sm-upload-zone" id="sm-drop-zone">
            <input type="file" id="sm-files" multiple
              accept="image/*,audio/*,video/*,.pdf,.txt,.doc,.docx"
              onchange="trFilesChosen(this)" />
            <div class="sm-upload-icon">⬆</div>
            <div class="sm-upload-label">Click or drag files<br/>Photos · Audio · Video · Docs</div>
          </div>
          <div class="sm-file-list" id="sm-file-list"></div>
        </div>

        <div class="sm-err" id="sm-err-3"></div>
        <div class="sm-btn-row">
          <button class="sm-btn" onclick="trStepBack(2)">← Back</button>
          <button class="sm-btn primary" onclick="trSubmit()">Submit →</button>
        </div>
      </div>

      <!-- SUCCESS -->
      <div id="sm-success" style="display:none;">
        <div class="sm-success">
          <div class="sm-success-icon">◎</div>
          <div class="sm-success-msg">We see you.</div>
          <div class="sm-success-sub">Submission received</div>
        </div>
        <div class="sm-btn-row" style="margin-top:36px;">
          <button class="sm-btn primary" onclick="trCloseSubmit()">Close</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  /* ── close on backdrop click ── */
  modal.addEventListener('click', function (e) {
    if (e.target === modal) trCloseSubmit();
  });

  /* ── submission state ── */
  window._smFiles = [];

})();

/* ── public API ── */
function trOpenSubmit() {
  // reset
  document.getElementById('sm-step-1').style.display = 'block';
  document.getElementById('sm-step-2').style.display = 'none';
  document.getElementById('sm-step-3').style.display = 'none';
  document.getElementById('sm-success').style.display = 'none';
  document.getElementById('sm-name').value    = '';
  document.getElementById('sm-email').value   = '';
  document.getElementById('sm-note').value    = '';
  document.getElementById('sm-category').value = '';
  document.getElementById('sm-anon-check').checked = false;
  document.getElementById('sm-name').disabled = false;
  document.getElementById('sm-file-list').textContent = '';
  document.getElementById('sm-err-1').textContent = '';
  document.getElementById('sm-err-2').textContent = '';
  document.getElementById('sm-err-3').textContent = '';
  window._smFiles = [];

  const m = document.getElementById('submit-modal');
  m.classList.add('open');
  setTimeout(() => document.getElementById('sm-name').focus(), 60);
}

function trCloseSubmit() {
  document.getElementById('submit-modal').classList.remove('open');
}

function trAnonToggle() {
  const checked = document.getElementById('sm-anon-check').checked;
  const nameEl  = document.getElementById('sm-name');
  if (checked) {
    nameEl.value    = 'Anonymous';
    nameEl.disabled = true;
  } else {
    nameEl.value    = '';
    nameEl.disabled = false;
    nameEl.focus();
  }
}

function trStep1Next() {
  const name  = document.getElementById('sm-name').value.trim();
  const email = document.getElementById('sm-email').value.trim();
  const err   = document.getElementById('sm-err-1');
  if (!name)  { err.textContent = 'add a name or go anonymous'; return; }
  if (!email) { err.textContent = 'email is required so we can reach you'; return; }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { err.textContent = 'valid email please'; return; }
  err.textContent = '';
  document.getElementById('sm-step-1').style.display = 'none';
  document.getElementById('sm-step-2').style.display = 'block';
}

function trStep2Next() {
  const cat = document.getElementById('sm-category').value;
  const err = document.getElementById('sm-err-2');
  if (!cat) { err.textContent = 'choose a category'; return; }
  err.textContent = '';
  document.getElementById('sm-step-2').style.display = 'none';
  document.getElementById('sm-step-3').style.display = 'block';
}

function trStepBack(to) {
  [1,2,3].forEach(n => document.getElementById('sm-step-'+n).style.display = 'none');
  document.getElementById('sm-step-'+to).style.display = 'block';
}

function trFilesChosen(input) {
  window._smFiles = Array.from(input.files);
  const list = document.getElementById('sm-file-list');
  if (window._smFiles.length === 0) {
    list.textContent = '';
    return;
  }
  list.textContent = window._smFiles.map(f => `↳ ${f.name} (${(f.size/1024).toFixed(0)}kb)`).join('  ·  ');
}

function trSubmit() {
  const err = document.getElementById('sm-err-3');

  const name     = document.getElementById('sm-name').value.trim();
  const email    = document.getElementById('sm-email').value.trim();
  const category = document.getElementById('sm-category').value;
  const note     = document.getElementById('sm-note').value.trim();
  const files    = window._smFiles || [];

  // read files as base64 (images only — audio/video stored as metadata)
  const MAX_B64 = 4 * 1024 * 1024; // 4MB per file max for b64 storage

  const filePromises = files.map(f => new Promise(resolve => {
    const isImage = f.type.startsWith('image/');
    if (isImage && f.size <= MAX_B64) {
      const reader = new FileReader();
      reader.onload = e => resolve({ name: f.name, type: f.type, size: f.size, data: e.target.result });
      reader.readAsDataURL(f);
    } else {
      resolve({ name: f.name, type: f.type, size: f.size, data: null });
    }
  }));

  Promise.all(filePromises).then(fileData => {
    const submission = {
      id:        Date.now(),
      name,
      email,
      category,
      note,
      timestamp: new Date().toISOString(),
      files:     fileData
    };

    const existing = JSON.parse(localStorage.getItem('tr_submissions') || '[]');
    existing.unshift(submission);
    try {
      localStorage.setItem('tr_submissions', JSON.stringify(existing));
    } catch(e) {
      // if storage is full (large images), strip data and retry
      submission.files = fileData.map(f => ({ name: f.name, type: f.type, size: f.size, data: null }));
      existing[0] = submission;
      localStorage.setItem('tr_submissions', JSON.stringify(existing));
    }

    // show success
    [1,2,3].forEach(n => document.getElementById('sm-step-'+n).style.display = 'none');
    document.getElementById('sm-success').style.display = 'block';
  }).catch(() => {
    err.textContent = 'something went wrong — try again';
  });
}
