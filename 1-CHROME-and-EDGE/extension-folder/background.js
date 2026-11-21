if (typeof importScripts === "function") importScripts("shared.js"); // Chrome service worker; Firefox loads shared.js via manifest

function notify(title, message) {
  chrome.notifications.create({ type: "basic", iconUrl: "icons/icon128.png", title, message });
}

async function checkAlerts(rates) {
  const { alerts } = await store.get("alerts");
  if (!alerts || !alerts.length) return;
  const s = await getSettings();
  let changed = false;
  for (const a of alerts) {
    if (!a.active) continue;
    const r = rates[a.to] / rates[a.from];
    let thr = a.target, hit;
    if (a.cond === "above") hit = r >= thr;
    else if (a.cond === "below") hit = r <= thr;
    else if (a.cond === "rise") { thr = a.base * (1 + a.target / 100); hit = r >= thr; }
    else { thr = a.base * (1 - a.target / 100); hit = r <= thr; }
    if (hit && !a.fired) {
      notify(tr(s.lang, "alertTitle"), tr(s.lang, "alertMsg", { from: a.from, to: a.to, rate: fmtNum(r), target: fmtNum(thr) }));
      a.fired = true; changed = true;
    } else if (!hit && a.fired) { a.fired = false; changed = true; }
  }
  if (changed) await store.set({ alerts });
}

async function refreshAndCheck() {
  try {
    const { rates } = await fetchRates();
    const s = await getSettings();
    await checkAlerts(applyAdj(rates, s.adj));
  } catch (e) { /* offline: try again next time */ }
}

// Rate on the toolbar icon
async function updateBadge() {
  const s = await getSettings();
  if (!s.badge || s.badge === "off") {
    chrome.action.setBadgeText({ text: "" });
    chrome.action.setTitle({ title: "PKR Converter" });
    return;
  }
  const { rates } = await loadRates();
  const r = rates.PKR / rates[s.badge];
  if (!isFinite(r)) return;
  const text = r >= 100 ? String(Math.round(r)) : r >= 10 ? r.toFixed(1) : r.toFixed(2);
  chrome.action.setBadgeText({ text });
  chrome.action.setBadgeBackgroundColor({ color: s.palette === "custom" && s.custom ? s.custom : (PALETTE_COLORS[s.palette] || PALETTE_COLORS.green) });
  chrome.action.setTitle({ title: `1 ${s.badge} = ${fmtNum(r)} PKR` });
}

// Daily summary at 9:00 am (local time)
async function setupDaily() {
  const s = await getSettings();
  if (!s.daily) { chrome.alarms.clear("daily"); return; }
  const d = new Date(); d.setHours(9, 0, 0, 0);
  if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 1);
  chrome.alarms.create("daily", { when: d.getTime(), periodInMinutes: 1440 });
}
async function sendDaily() {
  await refreshAndCheck();
  const s = await getSettings();
  const { rates } = await loadRates();
  notify(tr(s.lang, "dailyTitle"), ["USD", "SAR", "AED", "GBP", "EUR"].map((c) => `${c} ${fmtNum(rates.PKR / rates[c])}`).join(" · "));
}

function boot() {
  chrome.alarms.create("refresh", { periodInMinutes: 30 });
  setupDaily(); updateBadge();
  refreshAndCheck().then(() => backfillHistory(30)).catch(() => {});
}
chrome.runtime.onInstalled.addListener(async () => {
  try { await chrome.contextMenus.removeAll(); } catch (e) {}
  chrome.contextMenus.create({ id: "convert-selection", title: "Convert “%s” to PKR", contexts: ["selection"] });
  boot();
});
chrome.runtime.onStartup.addListener(boot);
chrome.alarms.onAlarm.addListener((a) => {
  if (a.name === "refresh") refreshAndCheck();
  if (a.name === "daily") sendDaily();
});
chrome.storage.onChanged.addListener((ch, area) => {
  if (area !== "local") return;
  if (ch.settings || ch.cache) updateBadge();
  if (ch.settings) setupDaily();
});

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId !== "convert-selection") return;
  const s = await getSettings();
  const p = parsePrice(info.selectionText);
  if (!p) { notify("PKR Converter", tr(s.lang, "ctxFail", { s: (info.selectionText || "").slice(0, 40) })); return; }
  const { rates } = await loadRates();
  const to = p.cur === "PKR" ? "USD" : "PKR";
  const out = p.amount * rates[to] / rates[p.cur];
  notify("PKR Converter", tr(s.lang, "ctxOk", { amount: fmtNum(p.amount), cur: p.cur, out: fmtMoney(out, s), to }));
});
