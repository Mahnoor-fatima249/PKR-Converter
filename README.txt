# PKR Currency Converter
### Complete Browser Extension Package — v1.0.0

**A smarter way to track the Pakistani Rupee.**

PKR Currency Converter is a feature-rich browser extension designed to make currency conversion and financial tracking easier. Convert Pakistani Rupees into major world currencies, monitor exchange-rate trends, track gold and silver prices, and stay informed with customizable rate alerts — all from your browser.

---

## Features

### Currency Conversion
- Convert PKR into major international currencies.
- View exchange rates with an easy-to-use interface.
- Quickly switch between supported currencies.
- Display country flags for better visual identification.

### Exchange Rate Charts
- Track historical exchange-rate movements.
- View interactive 30-day rate charts.
- Understand currency trends through visual data.

### Gold & Silver Tracking
- Monitor gold prices.
- Track silver prices.
- Keep an eye on precious metal market movements.

### Smart Rate Alerts
- Set custom exchange-rate targets.
- Receive notifications when supported rate conditions are met.
- Stay informed without constantly checking the extension.

### Remittance Tools
- Access useful currency and remittance tools.
- Make international money calculations easier.
- Compare currency values before sending money.

### Offline Support
- Access previously saved exchange rates.
- Continue using supported features without an active internet connection.
- Automatically refresh data when connectivity returns, where supported.

### Accessibility
- Supports reduced-motion preferences.
- Clean and readable interface.
- Designed for a comfortable browsing experience.

---

## Browser Compatibility

| Browser | Support |
|---|---|
| Google Chrome | Supported |
| Microsoft Edge | Supported |
| Mozilla Firefox | Supported |

---

## Package Contents

The complete package includes browser-specific extension builds and everything needed for testing and store submission.

```
PKR-Currency-Converter/
│
├── 1-CHROME-and-EDGE/
│   ├── pkr-converter-chrome-edge.zip
│   └── extension-folder/
│       ├── manifest.json
│       ├── popup.html
│       ├── popup.js
│       ├── background.js
│       ├── dashboard.html
│       ├── dashboard.js
│       ├── shared.js
│       ├── style.css
│       ├── icons/
│       ├── fonts/
│       └── flags/
│
├── 2-FIREFOX/
│   ├── pkr-converter-firefox.zip
│   └── extension-folder/
│       └── Firefox extension files
│
├── 3-STORE-KIT/
│   ├── 01-store-listing.md
│   ├── 02-privacy-and-permissions.md
│   ├── 03-publish-steps.md
│   ├── privacy-policy.html
│   ├── promo-small-440x280.png
│   ├── store-icon-128.png
│   ├── store-logo-300.png
│   └── screenshots/
│       ├── 1-overview.png
│       ├── 2-popup.png
│       ├── 3-tools.png
│       ├── 4-alerts.png
│       └── 5-urdu-dark.png
│
└── README.md
```

---

## Installation

### Google Chrome

1. Download and extract the project package.
2. Open `chrome://extensions` in Chrome.
3. Enable Developer mode.
4. Click Load unpacked.
5. Select the `1-CHROME-and-EDGE/extension-folder` directory.
6. The extension will appear in your browser.

### Microsoft Edge

1. Open `edge://extensions`.
2. Enable Developer mode.
3. Click Load unpacked.
4. Select the `1-CHROME-and-EDGE/extension-folder` directory.

### Mozilla Firefox

1. Open `about:debugging#/runtime/this-firefox`.
2. Click Load Temporary Add-on.
3. Select the Firefox extension's `manifest.json` file.
4. The extension will be loaded temporarily for testing.

**Note:** Temporary Firefox add-ons are removed when Firefox restarts. Permanent distribution requires the appropriate Mozilla Add-ons signing process.

---

## Browser Store Publishing

The package includes a dedicated store kit to help prepare the extension for public distribution.

| Platform | Submission |
|---|---|
| Chrome Web Store | One-time developer registration fee (currently $5 USD) |
| Microsoft Edge Add-ons | Free submission |
| Firefox Add-ons | Free submission |

### Publishing Checklist

- [ ] Review the extension functionality.
- [ ] Test the extension in supported browsers.
- [ ] Verify permissions and privacy disclosures.
- [ ] Publish the privacy policy online.
- [ ] Prepare store descriptions and screenshots.
- [ ] Upload the appropriate ZIP package.
- [ ] Complete store review requirements.

Refer to `3-STORE-KIT/03-publish-steps.md` for detailed instructions.

---

## Privacy & Permissions

Privacy and transparency are important.

The extension's permission requirements and their purposes are documented in:

`3-STORE-KIT/02-privacy-and-permissions.md`

### Privacy Policy

The privacy policy is provided at:

`3-STORE-KIT/privacy-policy.html`

**Important:** Host the privacy policy at a publicly accessible HTTPS URL before submitting the extension to browser stores.

Review the policy against the actual extension behavior and data practices before publication.

---

## Screenshots & Promotional Assets

The store kit includes five promotional screenshots:

| Screenshot | Description |
|---|---|
| 1-overview.png | Main dashboard overview |
| 2-popup.png | Quick currency converter |
| 3-tools.png | Currency and precious metal tools |
| 4-alerts.png | Rate alerts and notifications |
| 5-urdu-dark.png | Urdu interface and dark mode |

Recommended screenshot dimensions: **1280 × 800 pixels**.

Additional promotional assets include:
- 440 × 280 promotional tile.
- 128 × 128 store icon.
- 300px Edge store logo.

---

## Development & Customization

To modify the extension:

1. Open the appropriate browser extension folder.
2. Edit the required HTML, CSS or JavaScript files.
3. Test your changes using the browser's developer mode.
4. Check browser console errors.
5. Update the extension version in `manifest.json`.

Example:

```json
{
  "version": "1.0.1"
}
```

Follow semantic versioning when releasing updates:

- `1.0.1` — Bug fixes.
- `1.1.0` — New features.
- `2.0.0` — Major changes.

---

## Version History

### v1.0.0 — Initial Release

- PKR currency conversion.
- Historical exchange-rate charts.
- Gold and silver price tracking.
- Customizable rate alerts.
- Remittance tools.
- Offline saved-rate support.
- Country flag integration.
- Accessibility and reduced-motion support.
- Chrome, Edge and Firefox packages.

---

## Licenses & Credits

This project includes third-party resources:

- **Flag Icons:** flag-icons project — MIT License.
- **DM Sans:** SIL Open Font License.
- **Fraunces:** SIL Open Font License.

Third-party assets remain subject to their respective licenses.

### Project Ownership

**Extension Code:** Proprietary  
**Author:** Mahnoor Fatima

All rights to the original extension code are reserved by the author, except for third-party components distributed under their respective licenses.

---

## Support & Contact

For bug reports, feature requests, improvements or customization:

- Review the extension files.
- Check the store documentation.
- Update the relevant source files.
- Increase the version number before releasing an update.

---

## About This Project

PKR Currency Converter aims to make currency information more accessible and convenient for people who work with Pakistani Rupees and international currencies.

Whether you're tracking exchange rates, checking precious metal prices or calculating international transfers, this extension brings useful financial tools directly into your browser.

**Made with love for the PKR community.**

© 2026 Mahnoor Fatima. All rights reserved.