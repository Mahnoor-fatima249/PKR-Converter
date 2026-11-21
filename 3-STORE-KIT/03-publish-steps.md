# How to publish (step by step)

You have two packages:
- `pkr-converter-chrome-edge.zip` is for **Chrome and Edge** (both use the same file).
- `pkr-converter-firefox.zip` is for **Firefox**.

## Step 0: put the privacy policy online (all stores ask for a link)

Easiest, using your portfolio on Vercel:
1. Open your portfolio's code (the GitHub repo).
2. Copy `privacy-policy.html` into the folder that is served as the site root. In a Vite, React or Next.js project this is the `public` folder. In a plain HTML project it is the main folder.
3. Commit and push. Vercel redeploys by itself.
4. Your link will be `https://portfolio-pi-green-77.vercel.app/privacy-policy.html`. Open it in a browser to check that it loads.

If that is awkward, use GitHub Pages: make a new public repo, upload the file as `index.html`, then Settings > Pages > deploy from the main branch.

## Step 1: Microsoft Edge Add-ons (free)

1. Go to the Microsoft Partner Center, sign in and register as an individual developer for the Edge program.
2. Create a new extension and upload `pkr-converter-chrome-edge.zip`.
3. Availability: public, all markets.
4. Properties: category Productivity, privacy policy link from Step 0, website link.
5. Store listing: paste the text from `01-store-listing.md`, upload `store-logo-300.png`, the five screenshots and the small tile.
6. Submit. Reviews usually take a few days.

## Step 2: Firefox Add-ons (free)

1. Go to addons.mozilla.org, open the Developer Hub and sign in with a Firefox account.
2. Submit a New Add-on, choose **On this site** (listed publicly).
3. Upload `pkr-converter-firefox.zip` and wait for the automatic checks.
4. When asked whether you use build tools or minified code, answer **No**.
5. Fill in the summary, description, category (Other or Tools), privacy policy link and screenshots from the kit. Paste the reviewer notes from `02-privacy-and-permissions.md`.
6. Submit.

## Step 3: Chrome Web Store (one-time $5)

1. Open the Chrome Web Store Developer Dashboard with your Google account and pay the one-time registration fee. You need a card that is allowed for international online payments. If it is declined, ask your bank to switch on international payments for it.
2. Add a new item and upload `pkr-converter-chrome-edge.zip`.
3. Store listing tab: paste the description, pick the category, upload `store-icon-128.png`, the five screenshots and the small promo tile.
4. Privacy tab: paste the single purpose, the permission explanations and the answers from `02-privacy-and-permissions.md`, and add the policy link.
5. Distribution tab: public, all regions, free.
6. Submit for review.

## Before you click submit

- Install the zip once in a fresh browser profile and click through everything (popup, dashboard, an alert, the right-click menu).
- Rate sources: the past-rates service and the gold/silver service are free community services that I could not test from here. Check that the 30/90-day chart and the gold card fill in. If one does not, tell me and I will swap it.
- Make sure the store text never promises exact or "official" rates.

## Common reasons for rejection, and how this kit avoids them

- Missing or unreachable privacy policy: Step 0.
- Permissions that are not explained: the table in `02-privacy-and-permissions.md`.
- Description that does not match what the extension does: the text in `01-store-listing.md` was written from the real features.
- Remote code: the extension only downloads numbers.

## Updating later

Raise `version` in `manifest.json` (for example 3.2.1), zip it again and upload it as a new version in each store. The reviews for updates are usually quicker.
