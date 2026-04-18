# THEREIAM — Session Notes
*Last updated: April 2026*

---

## Where We Are

The site is fully built as a local HTML/CSS/JS prototype. All files live in one folder on your computer. No server needed — open any `.html` file directly in your browser.

**Next major step: Deploy to the internet.**
Plan: bake real content into `thereiam-content.js`, push to GitHub, deploy free on Vercel.

---

## File Map

| File | What it does |
|---|---|
| `landing-preview.html` | Main landing page (the "In Plain Sight" experience) |
| `page-hoodies.html` | Pilot Collection — scroll-snap hoodie showcase |
| `page-brand.html` | Brand identity editorial scroll |
| `page-archive.html` | The Archive — poetry, spoken word, photography, sounds, sightings |
| `page-mystery.html` | Origins page — starfield, 6-act scroll-snap story |
| `admin.html` | Local CMS — password protected, all content managed here |
| `thereiam-content.js` | Master content config — all hoodies, music, archive, sightings |
| `thereiam-player.js` | Audio player — hidden by default, cream theme, expands to right-side panel |
| `thereiam-player.css` | Player styles — cream/editorial, animated vinyl, queue expand |
| `thereiam-media-db.js` | IndexedDB wrapper — stores audio files locally (no size limit) |
| `thereiam-submit.js` | "Submit Your Work" modal — 3-step, injects into every page |
| `thereiam-ui.css` | Global polish — page fade-in, gear spin, scroll bars, button states |

---

## Admin System

- **Password:** Default is `THEREIAM` — changeable in Settings tab
- **Rate limiting:** 5 wrong attempts = 5-minute lockout with countdown
- **Session:** Stays unlocked for browser session, Lock button re-locks it
- **Back to site:** Click the THEREIAM logo in topbar — saves changes and returns

### Admin Panels
`Pages` | `Hoodies` | `Brand Page` | `Music` | `Media Library` | `Archive` | `Sightings` | `Submissions` | `Email List` | `Settings` | `File Guide`

---

## Content System Flow

```
Admin edits DATA
  → saveAll() writes to localStorage (tr_content_overrides)
    → thereiam-content.js loads on each page, merges overrides
      → all content goes live immediately on page reload
```

Audio stored in IndexedDB via `thereiam-media-db.js` (no 5MB cap). Images stored as base64 dataURLs in localStorage.

---

## Music Player

- **Hidden by default** — only appears when a track is clicked
- Click any track in the Sound section → cream bar slides up from bottom
- **▲ button** (top right of bar) → expands into tall right-side rectangle with full queue
- **▼** in expanded header → collapses back to bar
- **⇄ shuffle** — randomises next track
- **✕** — hides the player entirely
- Vinyl smiley spins while playing

---

## Submissions

- "Submit Your Work" button on every page opens a 3-step modal
- Step 1: Name or Anonymous + email
- Step 2: Category (Poetry, Spoken Word, Photography, Music, THEREIAM) + note
- Step 3: File upload (images shown, audio/video as metadata)
- Stored in `localStorage.tr_submissions`
- Reviewed in admin → Submissions panel (Delete button per card)
- Emails visible in admin → Email List panel (individual ✕ to remove)

---

## Things Still To Do / Ideas

### Launch prep (priority)
1. **Bake content into thereiam-content.js** — replace placeholder poems/sightings with real ones
2. **GitHub repo** — push all files
3. **Vercel deploy** — connect repo, free hosting, custom domain ready
4. **Get real domain** — thereiam.com or thereiam.co (check availability)

### Business
- LLC / EIN registration still pending (sole prop for now)
- Instagram: @__thereiam — link on hoodies page already wired

### Features still planned (for app phase)
- Special code login for the app experience
- QR code IDs for exclusive events
- Real-time "THEREIAM in the wild" sightings feed (camera-only, no camera roll)
- Community feed / resell marketplace
- Event listings (parties, listening events, fashion walks) — members only

### Polish ideas noted
- Smoother page transitions between all pages
- The admin Pages panel iframe previews could be higher fidelity

---

## Key Design Decisions

- **Cream theme** (`#f5f2eb`) for light/editorial pages (landing, archive, brand)
- **Void dark** (`#07060a`) for immersive pages (hoodies, origins/mystery)
- **Ember gold** (`#c4962a`) as the accent — used sparingly
- **Northpoint** font for the THEREIAM wordmark
- **Playfair Display** italic for editorial body text
- **Space Mono** for all labels, metadata, UI text
- Grain texture animation on all pages (subtle, 2.8% opacity)
- No cart, no checkout — DM on Instagram to buy (Pilot Collection Vol. 1)

---

## Sightings Terminology
"THEREIAM in the Wild" has been changed to just **"THEREIAM"** everywhere — submission modal, admin panel, archive page label.

---

*Everything in the folder is current. Safe to close.*
