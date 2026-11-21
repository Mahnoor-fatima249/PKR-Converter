# Privacy answers and permission explanations (copy and paste)

## Single purpose (Chrome asks for this)

Convert Pakistani rupee (PKR) amounts using live or saved exchange rates, and track those rates with charts, alerts and related calculators.

## Why each permission is needed (one line each)

| Permission | Explanation to paste |
|---|---|
| storage | Saves the user's settings, favourite pairs, alerts, recent conversions and the last saved exchange rates on their own device. |
| alarms | Runs a rate refresh and alert check every 30 minutes, and the optional daily summary at 9:00 am. |
| notifications | Shows a notification when a user-set rate alert is reached, for the optional daily summary, and for the right-click conversion result. |
| contextMenus | Adds a "Convert selected price to PKR" item to the right-click menu. |
| Host: open.er-api.com | Downloads current exchange rates. |
| Host: cdn.jsdelivr.net and *.currency-api.pages.dev | Downloads past daily exchange rates so the trend chart is filled in from the first day. |
| Host: api.gold-api.com | Downloads the international gold and silver price used by the gold and zakat tools. |

## Remote code

No. All the code is inside the extension package. The extension only downloads data (numbers), never scripts.

## Data usage form (Chrome "Privacy practices" tab)

The extension does **not** collect user data: everything the user types or saves stays in the browser, and nothing is sent to the developer. So you can leave every data-type box unticked, then tick the three confirmations:
- I do not sell or transfer user data to third parties outside of the approved use cases
- I do not use or transfer user data for purposes unrelated to the item's single purpose
- I do not use or transfer user data to determine creditworthiness or for lending purposes

Please re-read the form when you fill it in, since Google changes the wording from time to time.

Privacy policy URL: the address where you host `privacy-policy.html` (see `03-publish-steps.md`).

## Firefox (addons.mozilla.org) answers

- Data collection: none (already declared in the Firefox package as `"required": ["none"]`)
- Does the add-on use minified, bundled or generated code? **No.** The files are plain JavaScript, so no source-code upload is needed.
- Notes for the reviewer (paste): "Plain JavaScript, no build step. Dynamic text is escaped with esc() and inserted through one helper, setHTML(), in shared.js. Data read from storage or from a backup file is validated by the sanitize functions in shared.js. Network requests only fetch JSON numbers from the hosts listed in the manifest."

## Edge Add-ons answers

Use the same text as Chrome. For "notes for certification" you can paste: "No account or login is needed. Open the toolbar icon to convert. The dashboard opens from the Dashboard button."
