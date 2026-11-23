PKR Currency Converter - Complete Package (v1.0.0)
=================================================

This is the complete PKR Currency Converter extension package version 1.0.0,
ready for upload to browser extension stores.

**Contents:**

**1-CHROME-and-EDGE/**
• `pkr-converter-chrome-edge.zip` ← Upload to Chrome Web Store
  AND Microsoft Edge Add-ons
• `extension-folder/` – The unzipped extension (for testing and editing)

**2-FIREFOX/**
• `pkr-converter-firefox.zip` ← Upload to addons.mozilla.org
• `extension-folder/` – The unzipped extension

**3-STORE-KIT/**
• `01-store-listing.md` – Name, descriptions (English + Urdu), category,
  search terms
• `02-privacy-and-permissions.md` – Why each permission is needed,
  privacy form answers, reviewer notes
• `03-publish-steps.md` – Step-by-step publishing instructions for Edge,
  Firefox and Chrome
• `privacy-policy.html` – Must be put online first (all stores require
  the link)
• `screenshots/` – 5 screenshots (1280x800)
• `promo-small-440x280.png` – Small promo tile
• `store-icon-128.png` – Store icon
• `store-logo-300.png` – Logo for Edge

**Order of Work:**

1. **Publish the privacy policy:** Put `privacy-policy.html` online and
   note its link (see 3-STORE-KIT/03-publish-steps.md, Step 0).

2. **Test the Chrome/Edge extension:** Open `chrome://extensions`,
   enable Developer mode, click "Load unpacked," and select
   `1-CHROME-and-EDGE/extension-folder`. Open the toolbar icon and
   test the Dashboard button.

3. **Publish to stores (in order):**
   • Edge Add-ons (free)
   • Firefox Add-ons (free)
   • Chrome Web Store (one-time US$5 fee)
   Follow the steps in 3-STORE-KIT/03-publish-steps.md.

**Important Notes:**

• **Upload .zip files as-is:** Do not manually re-zip the folders. The
  stores require `manifest.json` at the top level of the zip, and these
  zips are already built correctly.

• **Developer attribution:** The About tab (dashboard) lists the developers:
  Mahnoor Fatima (Founder & Developer) and Lokesh (Co-Developer).
  To change a name or role, edit `dashboard.html` (search for "dev-grid").

• **Store account publisher:** Whatever account owns the store listing
  is shown as the publisher. With two developers, decide whose account
  to use (Mahnoor's or Lokesh's) and keep the login credentials with
  that person.

• **Privacy policy:** Names both developers and provides a contact route.
  Modify the "Contact" line in `privacy-policy.html` if you prefer a
  shared email address.

• **Country flags:** Bundled as image files in the "flags" folder, so
  they display on Windows too. These come from the open-source
  "flag-icons" project (MIT licence).

• **Fonts:** DM Sans and Fraunces are bundled (SIL Open Font License).

• **Accessibility:** The design uses blur, soft glow, and small animations.
  These switch off automatically for users who have "reduce motion" enabled
  in their system settings.

• **Data services:** Two free data services are included:
  • Past rates: cdn.jsdelivr.net / currency-api.pages.dev
  • Gold/silver: api.gold-api.com
  These may not work from the build location. After installation, verify
  that the 30-day chart and Gold card fill in. The rest of the extension
  still works (it falls back to saved or built-in rates).

• **Screenshots:** Use sample numbers. They can be retaken later with
  real numbers.

**To Make Future Changes:**

1. Edit the files in `extension-folder`
2. Increase the "version" in `manifest.json` (e.g., from 1.0.0 to 1.0.1)
3. Zip the **contents** of the folder (not the folder itself)
4. Upload as a new version in each store
5. For Firefox, use `2-FIREFOX/extension-folder` (it has its own
   `manifest.json`)

---
*PKR Currency Converter - Complete Package v1.0.0*