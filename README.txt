PKR CURRENCY CONVERTER  -  COMPLETE PACKAGE  (version 1.0.0)
==============================================================

(Roman Urdu: is folder mein poori extension, Firefox wala version aur store par
 daalne ka saara saman maujood hai. Neeche likha hai kaun si file kahan upload
 karni hai.)

WHAT IS IN HERE
---------------
1-CHROME-and-EDGE/
    pkr-converter-chrome-edge.zip   <-- UPLOAD THIS to Chrome Web Store AND Microsoft Edge Add-ons
    extension-folder/               the same extension, unzipped (for testing and for editing)

2-FIREFOX/
    pkr-converter-firefox.zip       <-- UPLOAD THIS to addons.mozilla.org
    extension-folder/               the same extension, unzipped

3-STORE-KIT/
    01-store-listing.md             name, descriptions (English + Urdu), category, search terms
    02-privacy-and-permissions.md   why each permission is needed, privacy form answers, reviewer notes
    03-publish-steps.md             step-by-step for Edge, Firefox and Chrome
    privacy-policy.html             must be put online first (all stores ask for the link)
    screenshots/                    5 screenshots, 1280x800
    promo-small-440x280.png         small promo tile
    store-icon-128.png              store icon
    store-logo-300.png              logo for Edge

ORDER OF WORK
-------------
1. Put privacy-policy.html online and note its link (see 3-STORE-KIT/03-publish-steps.md, Step 0).
2. Test once: Chrome > chrome://extensions > turn on Developer mode > Load unpacked > choose
   1-CHROME-and-EDGE/extension-folder. Open the toolbar icon and the Dashboard button.
3. Edge Add-ons (free), then Firefox Add-ons (free), then Chrome Web Store (one-time US$5).
   Follow 3-STORE-KIT/03-publish-steps.md.

IMPORTANT
---------
* Upload the .zip files exactly as they are. Do not zip the folder again by hand: the stores need
  manifest.json at the top level of the zip, and these zips are already built that way.
* The store account owner becomes the publisher shown on the listing. Use Mahnoor's own account
  (or one she creates), so the extension stays hers.
* The About tab (developer profile) and the privacy policy carry Mahnoor Fatima's name and portfolio
  link on purpose. The profile text comes from her portfolio.
* Country flags are bundled as image files (folder "flags"), so they show on Windows too.
  They come from the open-source "flag-icons" project (MIT licence). Fonts (DM Sans, Fraunces) are
  bundled too (SIL Open Font License).
* The design uses blur, soft glow and small animations. They switch off automatically for people
  who have "reduce motion" turned on in their system.
* Two free data services (past rates: cdn.jsdelivr.net / currency-api.pages.dev, and gold/silver:
  api.gold-api.com) could not be tested from where the package was built. After installing, check that
  the 30-day chart and the Gold card fill in. If one does not, the rest of the extension still works
  (it falls back to saved or built-in rates).
* Screenshots use sample numbers. They can be retaken later with real ones.

TO CHANGE THINGS LATER
----------------------
Edit the files in extension-folder, raise "version" in manifest.json (for example 3.5.1), zip the
CONTENTS of the folder (not the folder itself) and upload it as a new version in each store.
For Firefox use 2-FIREFOX/extension-folder (it has its own manifest.json).
