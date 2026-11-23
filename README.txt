PKR Currency Converter - Complete Package (v1.0.0)
================================================

A browser extension for converting Pakistani Rupee (PKR) with rate charts,
alerts, gold/silver tracking, and remittance tools.

---
**Features**
-----------

• Convert PKR to major currencies with real-time rates
• 30-day rate charts for visual tracking
• Gold and silver price tracking
• Rate alerts and notifications
• Remittance tool support
• Offline functionality with saved rates
• Reduce motion support for accessibility
• Country flags display for visual context

---
**Installation**
----------------

1. **Chrome/Edge:** Open `chrome://extensions`, enable Developer mode,
   click "Load unpacked," and select the `1-CHROME-and-EDGE/extension-folder`.

2. **Firefox:** Open `about:addons`, enable Developer mode,
   click "Load Temporary Add-in," and select `2-FIREFOX/extension-folder`.

---
**Directory Structure**
----------------------

```
1-CHROME-and-EDGE/
├── pkr-converter-chrome-edge.zip   ← Upload to Chrome Web Store
│   └── (extension folder contents)
├── extension-folder/               ← For editing and testing
│   ├── manifest.json
│   ├── popup.html
│   ├── background.js
│   ├── dashboard.html
│   ├── style.css
│   ├── shared.js
│   ├── popup.js
│   ├── dashboard.js
│   ├── icons/
│   │   ├── icon16.png
│   │   ├── icon48.png
│   │   └── icon128.png
│   ├── fonts/                      ← DM Sans, Fraunces (SIL OFL)
│   │   ├── dm-sans.woff2
│   │   └── fraunces.woff2
│   ├── flags/                      ← Country flags (flag-icons project, MIT)
│   │   ├── us.svg, tr.svg, sa.svg, qa.svg, pk.svg, my.svg, kw.jp, eu, gb, cn, ae, ae, ca, au
│   └── ...

2-FIREFOX/
├── pkr-converter-firefox.zip       ← Upload to addons.mozilla.org
├── extension-folder/               ← Has its own manifest.json

3-STORE-KIT/
├── 01-store-listing.md             ← Name, descriptions, category, search terms
├── 02-privacy-and-permissions.md   ← Permission explanations, reviewer notes
├── 03-publish-steps.md             ← Step-by-step publish instructions
├── privacy-policy.html             ← Must be online first
├── promo-small-440x280.png         ← Small promo tile
├── store-icon-128.png              ← Store icon
├── store-logo-300.png              ← Logo for Edge
└── screenshots/                    ← 5 screenshots (1280x800)
    ├── 1-overview.png
    ├── 2-popup.png
    ├── 3-tools.png
    ├── 4-alerts.png
    └── 5-urdu-dark.png
```

---
**Screenshots**
--------------

Include screenshots from the `3-STORE-KIT/screenshots/` folder when
submitting to stores. Recommended sizes: 1280x800.

Screenshots available:
• `1-overview.png` – Main overview
• `2-popup.png` – Popup window
• `3-tools.png` – Tools page
• `4-alerts.png` – Alerts/notifications
• `5-urdu-dark.png` – Dark mode/Urdu interface

---
**Store Submission**
--------------------

1. **Edge Add-ons:** Free submission
2. **Firefox Add-ons:** Free submission
3. **Chrome Web Store:** One-time $5 fee

Follow `3-STORE-KIT/03-publish-steps.md` for detailed steps.

---
**Privacy Policy**
------------------

The `privacy-policy.html` must be published online first. All stores
require the link before reviewing the extension.

---
**Version History**
------------------

• **v1.0.0** – Initial release
  • PKR conversion with rate charts
  • Gold/silver tracking
  • Rate alerts
  • Remittance tools

---
**Licensing**
------------

• Flag icons: MIT licence (flag-icons project)
• Fonts: SIL Open Font License (DM Sans, Fraunces)
• Extension code: Proprietary – Mahnoor Fatima

---
**Contact**
----------

For support or changes, edit the extension files in `extension-folder`
and increase the version in `manifest.json` (e.g., 1.0.1 → 1.0.2).

---
*PKR Currency Converter - Complete Package v1.0.0*