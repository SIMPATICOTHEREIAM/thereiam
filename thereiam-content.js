/**
 * THEREIAM — Content Configuration
 * ─────────────────────────────────────────────────────
 * This is the ONE file you edit to update site content.
 * Change text, image paths, music, and poems here.
 * The admin panel (admin.html) edits this automatically.
 * ─────────────────────────────────────────────────────
 */

const THEREIAM_CONTENT = {

  // ─── HOODIES ──────────────────────────────────────────
  // Each piece: name, colorway, material, details, and 3 image paths
  hoodies: [
    {
      id:        "001",
      name:      "Plain Sight",
      colorway:  "Black / White",
      graphic:   "Wordmark + Smiley",
      fit:       "XL Baggy · Heavy Fleece",
      images: [
        "Hoodie Mockups/hoodie-001IMG_1395.jpg",
        "Hoodie Mockups/hoodie-001IMG_1396.jpg",
        "Hoodie Mockups/hoodie-001IMG_1400.jpg",
      ]
    },
    {
      id:        "002",
      name:      "The Ghost",
      colorway:  "Charcoal / Charcoal",
      graphic:   "Tonal — invisible branding",
      fit:       "XL Baggy · Heavy Fleece",
      images: [
        "Hoodie Mockups/hoodie-002IMG_1401.jpg",
        "Hoodie Mockups/hoodie-002IMG_1402.jpg",
        "Hoodie Mockups/hoodie-002IMG_1403.jpg",
      ]
    },
    {
      id:        "003",
      name:      "The Relic",
      colorway:  "Army Olive",
      graphic:   "Distressed skull graphic",
      fit:       "Skull chain drawstring",
      images: [
        "Hoodie Mockups/hoodie-003IMG_1397.jpg",
        "Hoodie Mockups/hoodie-003IMG_1398.jpg",
        "Hoodie Mockups/hoodie-003IMG_1399.jpg",
      ]
    },
    {
      id:        "004",
      name:      "Ember",
      colorway:  "Black / Orange",
      graphic:   "Wordmark + Smiley",
      fit:       "XL Baggy · Heavy Fleece",
      images: [
        "Hoodie Mockups/hoodie-004IMG_1404.jpg",
        "Hoodie Mockups/hoodie-004IMG_1405.jpg",
        "Hoodie Mockups/hoodie-004IMG_1406.jpg",
      ]
    },
  ],

  // ─── MUSIC ────────────────────────────────────────────
  // Add your tracks here. Put mp3/m4a files in the Music/ folder.
  // dur = display duration, use "—" if unknown
  music: [
    // { title: "Track Name", artist: "ete", file: "Music/filename.mp3", dur: "3:42" },
  ],

  // ─── ARCHIVE — Poems & Spoken Word ───────────────────
  archive: [
    {
      id:       "a1",
      type:     "Spoken Word",
      title:    "I looked for myself in the faces of strangers",
      author:   "Anonymous",
      date:     "March 2026",
      excerpt:  "and found I was already there.\n\nIn the hands that built what I touch.\nIn the voice that said what I felt.\n\nI have been everywhere.\nI just didn't know to look.",
    },
    {
      id:       "a2",
      type:     "Poetry",
      title:    "The city keeps moving",
      author:   "M. Stevens",
      date:     "January 2026",
      excerpt:  "and I keep being still\nand somehow\n\nwe meet\nin the middle of everything\nlike we planned it.",
    },
    {
      id:       "a3",
      type:     "Spoken Word",
      title:    "Every room I walk into",
      author:   "D. Okafor",
      date:     "February 2026",
      excerpt:  "I've already left something behind.\n\nA word someone will repeat\nwithout knowing where it came from.\n\nThat's not loss.\nThat's how you stay everywhere.",
    },
  ],

  // ─── SIGHTINGS ────────────────────────────────────────
  // Graffiti/logo sightings in the wild
  sightings: [
    { id: "s1", city: "Atlanta, GA",    date: "April 2026",    type: "wordmark" },
    { id: "s2", city: "Brooklyn, NY",   date: "March 2026",    type: "stacked" },
    { id: "s3", city: "Chicago, IL",    date: "February 2026", type: "smiley" },
  ],

  // ─── BRAND PAGE PHOTOS ───────────────────────────────
  // Photos flow top-to-bottom on the Brand page.
  // Add or remove paths here — the layout auto-adjusts.
  // Put photos in: Hoodie Mockups/ or Brand Photos/
  brandPhotos: [
    "Hoodie Mockups/hoodie-001IMG_1395.jpg",
    "Hoodie Mockups/hoodie-002IMG_1401.jpg",
    "Hoodie Mockups/hoodie-003IMG_1397.jpg",
    "Hoodie Mockups/hoodie-004IMG_1404.jpg",
    "Hoodie Mockups/hoodie-001IMG_1396.jpg",
    "Hoodie Mockups/hoodie-004IMG_1405.jpg",
    "Hoodie Mockups/hoodie-002IMG_1402.jpg",
    "Hoodie Mockups/hoodie-001IMG_1400.jpg",
    "Hoodie Mockups/hoodie-003IMG_1398.jpg",
    "Hoodie Mockups/hoodie-002IMG_1403.jpg",
    "Hoodie Mockups/hoodie-003IMG_1399.jpg",
    "Hoodie Mockups/hoodie-004IMG_1406.jpg",
    "Hoodie Mockups/hoodie-001IMG_1395.jpg",
    "Hoodie Mockups/hoodie-004IMG_1405.jpg",
  ],

  // ─── BRAND ────────────────────────────────────────────
  instagram: "@__thereiam",
  instagramUrl: "https://instagram.com/__thereiam",

};

// ─────────────────────────────────────────────────────
// Merge with any admin overrides saved in localStorage
// (admin.html writes overrides here automatically)
// ─────────────────────────────────────────────────────
(function () {
  try {
    const saved = localStorage.getItem('tr_content_overrides');
    if (saved) {
      const overrides = JSON.parse(saved);
      // Deep merge overrides into THEREIAM_CONTENT
      if (overrides.hoodies)     THEREIAM_CONTENT.hoodies     = overrides.hoodies;
      if (overrides.music)       THEREIAM_CONTENT.music       = overrides.music;
      if (overrides.archive)     THEREIAM_CONTENT.archive     = overrides.archive;
      if (overrides.sightings)   THEREIAM_CONTENT.sightings   = overrides.sightings;
      if (overrides.brandPhotos) THEREIAM_CONTENT.brandPhotos = overrides.brandPhotos;
    }
  } catch(e) {}
})();
