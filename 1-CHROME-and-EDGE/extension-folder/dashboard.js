const $ = (id) => document.getElementById(id);
let S, R, H = {}, favs = [], alerts = [], gold = null, silver = null, hajj = null;
const view = { from: "USD", to: "PKR", days: 30 };
const HAJJ_DEFAULT = { flight: 450000, days: 14, nights: 14, hotel: 300, food: 100, trans: 800, other: 1000 };
const HAJJ_KEYS = { flight: "h_flight", days: "h_days", nights: "h_nights", hotel: "h_hotel", food: "h_food", trans: "h_trans", other: "h_other" };
const t = (k, v) => tr(S.lang, k, v);
const num = (id) => parseFloat($(id).value);

function renderStatus() {
  const el = $("status"); el.dataset.state = R.source; el.textContent = t(R.source);
}

function prevRates() {
  const today = dayKey(Date.now());
  const keys = Object.keys(H).sort().filter((k) => k < today);
  return keys.length ? applyAdj(H[keys[keys.length - 1]], S.adj) : null;
}

function renderBoard() {
  const prev = prevRates();
  setHTML($("board"), Object.keys(CURRENCIES).filter((c) => c !== "PKR").map((c, i) => {
    const cur = R.rates.PKR / R.rates[c];
    let chg = `<span class="small">${t("noPrev")}</span>`;
    if (prev && prev[c]) {
      const p = prev.PKR / prev[c], pct = (cur - p) / p * 100;
      if (Math.abs(pct) < 0.005) chg = `<span class="small">0.00%</span>`;
      else chg = `<span class="${pct > 0 ? "up" : "down"}">${pct > 0 ? "▲" : "▼"} ${Math.abs(pct).toFixed(2)}%</span>`;
    }
    return `<tr data-c="${c}" style="--i:${i}"><td>${flagImg(c)}${c}</td><td class="small">${CURRENCIES[c][0]}</td><td class="num">${fmtNum(cur)}</td><td class="num">${chg}</td></tr>`;
  }).join(""));
  const tb = $("board");
  if (!tb.dataset.done) { tb.dataset.done = "1"; tb.classList.add("enter"); setTimeout(() => tb.classList.remove("enter"), 1800); }
}

function renderFavRow() {
  setHTML($("favRow"), favs.map((k) => `<button class="chip" data-k="${esc(k)}">${esc(k.replace(">", " → "))}</button>`).join(""));
}

function renderChart() {
  const vd = sendVerdict(H, view.from, view.to, S.adj), ve = $("verdict");
  ve.className = "verdict" + (vd && view.to === "PKR" ? (vd.dir === "good" ? " up" : vd.dir === "low" ? " down" : "") : "");
  ve.textContent = verdictText(vd, S, view.to === "PKR");
  const pts = seriesFor(H, view.from, view.to, view.days, S.adj);
  const svg = $("chart"), note = $("chartNote"), row = $("trendRow");
  document.querySelectorAll("[data-days]").forEach((b) => b.classList.toggle("on", +b.dataset.days === view.days));
  if (pts.length < 2) { setHTML(svg, ""); setHTML(row, ""); note.textContent = t("chartEmpty"); return; }
  note.textContent = "";
  const vals = pts.map((p) => p.v), hi = Math.max(...vals), lo = Math.min(...vals), avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  const tre = trendOf(pts), last = pts[pts.length - 1];
  const span = Math.max(1, Math.round((new Date(last.k) - new Date(pts[0].k)) / 864e5));
  const arrow = tre.dir === "up" ? "▲" : tre.dir === "down" ? "▼" : "▬";
  const label = t(tre.dir === "up" ? "trendUp" : tre.dir === "down" ? "trendDown" : "trendFlat");
  setHTML(row, `<span class="badge ${tre.dir}">${arrow} ${label}${tre.dir === "flat" ? "" : " " + Math.abs(tre.pct).toFixed(2) + "%"}</span>` +
    `<span class="small">${t("over", { n: span })} · ${t("avg")} ${fmtNum(avg)} · ${t("high")} ${fmtNum(hi)} · ${t("low")} ${fmtNum(lo)}</span>`);
  const W = 600, Ht = 220, pl = 10, pr = 10, pt = 14, pb = 28;
  let min = lo, max = hi;
  if (min === max) { min -= 1; max += 1; }
  const pad = (max - min) * 0.1; min -= pad; max += pad;
  const x = (i) => pl + i * (W - pl - pr) / (pts.length - 1);
  const y = (v) => pt + (max - v) * (Ht - pt - pb) / (max - min);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(pts.length - 1).toFixed(1)},${Ht - pb} L${pl},${Ht - pb} Z`;
  const dots = pts.map((p, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(p.v).toFixed(1)}" r="7" fill="transparent"><title>${esc(p.k)}: ${fmtNum(p.v)}</title></circle>`).join("");
  setHTML(svg, `<g class="reveal"><path d="${area}" fill="var(--accent)" opacity=".16"/>` +
    `<line x1="${pl}" x2="${W - pr}" y1="${y(avg).toFixed(1)}" y2="${y(avg).toFixed(1)}" stroke="var(--muted)" stroke-dasharray="4 4" opacity=".6"/>` +
    `<path d="${line}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round"/>` +
    `<circle cx="${x(pts.length - 1)}" cy="${y(last.v)}" r="4.5" fill="var(--accent)" class="dotp"/>${dots}</g>` +
    `<g fill="var(--muted)" font-size="12"><text x="${pl}" y="${Ht - 8}">${esc(pts[0].k)}</text>` +
    `<text x="${W - pr}" y="${Ht - 8}" text-anchor="end">${esc(last.k)} · ${fmtNum(last.v)}</text></g>`);
}

function renderAlerts() {
  setHTML($("aList"), alerts.length ? alerts.map((a) => {
    const now = R.rates[a.to] / R.rates[a.from];
    const pct = a.cond === "rise" || a.cond === "fall";
    const desc = pct
      ? `1 ${esc(a.from)} → ${esc(a.to)} ${t(a.cond === "rise" ? "riseText" : "fallText")} <b>${a.target}%</b> (${t("basedOn", { base: fmtNum(a.base) })})`
      : `1 ${esc(a.from)} ${t(a.cond)} <b>${fmtNum(a.target)}</b> ${esc(a.to)}`;
    return `<li class="${a.active ? "" : "paused"}"><span>${desc}<br><span class="small">${t("nowRate")}: ${fmtNum(now)}</span></span>` +
      `<span class="row"><button class="btn ghost" data-act="toggle" data-id="${esc(a.id)}">${a.active ? t("active") : t("paused")}</button>` +
      `<button class="btn ghost" data-act="del" data-id="${esc(a.id)}">${t("del")}</button></span></li>`;
  }).join("") : `<li class="small">${t("noAlerts")}</li>`);
}

function calcRemit() {
  const amt = num("rAmt"), fixed = num("rFixed") || 0, pct = num("rPct") || 0, cur = $("rCur").value;
  if (!isFinite(amt) || amt <= 0) { $("rOut").textContent = "—"; $("rEff").textContent = ""; return; }
  const net = Math.max(0, amt - fixed - amt * pct / 100);
  const get = net * R.rates.PKR / R.rates[cur];
  $("rOut").textContent = `${fmtMoney(get, S)} PKR`;
  $("rEff").textContent = `${t("effRate")}: 1 ${cur} = ${fmtNum(get / amt)} PKR`;
}

function calcGold() {
  const usd = num("gUsd");
  if (!isFinite(usd) || usd <= 0) { setHTML($("gTable"), ""); return; }
  const g24 = usd / 31.1035 * R.rates.PKR / R.rates.USD;
  setHTML($("gTable"), [24, 22, 21, 18].map((k) => {
    const g = g24 * k / 24;
    return `<tr><td>${k}K</td><td class="num">${fmt0(g)}</td><td class="num">${fmt0(g * 11.6638)}</td></tr>`;
  }).join(""));
}

function calcHajj() {
  const v = {}; for (const k in HAJJ_KEYS) v[k] = parseFloat($(HAJJ_KEYS[k]).value) || 0;
  hajj = v; store.set({ hajj });
  const sar = v.nights * v.hotel + v.days * v.food + v.trans + v.other;
  $("hSar").textContent = `${fmt0(sar)} SAR`;
  $("hPkr").textContent = `${fmtMoney(sar * R.rates.PKR / R.rates.SAR + v.flight, S)} PKR`;
}

// Sliding underline under the active tab
function moveInk() {
  const on = document.querySelector("nav.tabs button.on"), ink = document.querySelector(".ink");
  if (!on || !ink) return;
  ink.style.width = on.offsetWidth + "px";
  ink.style.transform = `translateX(${on.offsetLeft}px)`;
}

function renderFaq() {
  setHTML($("faqList"), [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) =>
    `<details><summary>${t("faqQ" + i)}</summary><p>${t("faqA" + i)}</p></details>`).join(""));
}

function renderAll() {
  requestAnimationFrame(moveInk);
  applyTheme(S); applyI18n(S);
  renderStatus(); renderSwatches($("sPal"), S, pickPal, true); renderBoard(); renderFavRow(); renderChart(); renderAlerts(); renderFaq(); fillBadge(); calcRemit(); calcGold(); calcHajj(); renderMulti(); calcQuick(); calcZakat(); calcMy();
}

async function reload() {
  const d = await store.get(["history"]);
  H = sanitizeHistory(d.history); R = await loadRates();
}

async function live() {
  const btn = $("refresh"); btn.disabled = true; btn.textContent = t("updating");
  try { await fetchRates(); await reload(); R.source = "live"; } catch (e) {}
  btn.disabled = false; btn.textContent = t("refresh");
  renderAll();
}

const filled = new Set();
async function ensureHistory(days) {
  if (filled.has(days) || !navigator.onLine) return;
  filled.add(days);
  $("chartNote").textContent = t("chartLoading");
  let n = 0;
  try { n = await backfillHistory(days); } catch (e) {}
  if (n) { const src = R.source; await reload(); R.source = src; renderBoard(); }
  renderChart();
}
async function pickPal(p, color) { S = await saveSettings({ palette: p, custom: color || S.custom }); renderAll(); }

async function loadGold() {
  try { await fetchGold(); } catch (e) { if (!gold) $("gMsg").textContent = t("goldFail"); return; }
  gold = (await store.get("gold")).gold; $("gUsd").value = gold.usdPerOz.toFixed(2); $("gMsg").textContent = ""; calcGold();
}

function fillBadge() {
  setHTML($("sBadge"), `<option value="off">${t("badgeOff")}</option>` +
    Object.keys(CURRENCIES).filter((c) => c !== "PKR").map((c) => `<option value="${c}">${c}</option>`).join(""));
  $("sBadge").value = S.badge || "off";
}

function renderMulti() {
  const amt = num("mAmt"), from = $("mCur").value;
  if (!isFinite(amt) || amt < 0) { setHTML($("mTable"), ""); return; }
  setHTML($("mTable"), Object.keys(CURRENCIES).filter((c) => c !== from).map((c) =>
    `<tr><td>${flagImg(c)}${c}</td><td class="small">${CURRENCIES[c][0]}</td><td class="num">${fmtMoney(amt * R.rates[c] / R.rates[from], S)}</td></tr>`).join(""));
}

function calcQuick() {
  const txt = $("cInput").value.trim(), el = $("cOut");
  if (!txt) { el.textContent = "—"; return; }
  const r = parseCalc(txt, R.rates);
  el.textContent = r ? `${fmtMoney(r.total, S)} ${r.target}` : t("calcErr");
}

function calcMy() {
  const mine = parseFloat($("myRate").value), el = $("myOut");
  if (!isFinite(mine) || mine <= 0) { el.textContent = "—"; return; }
  const intl = R.raw.PKR / R.raw.USD, diff = mine - intl, pct = diff / intl * 100;
  el.textContent = t("myRateOut", { intl: fmtNum(intl), mine: fmtNum(mine), diff: (diff > 0 ? "+" : "") + fmtNum(diff), pct: (pct > 0 ? "+" : "") + pct.toFixed(2) });
}

function calcZakat() {
  const v = (id) => parseFloat($(id).value) || 0, pkr = R.rates.PKR / R.rates.USD;
  const gUsd = num("gUsd"), sUsd = num("zSilverUsd");
  const gG = gUsd > 0 ? gUsd / 31.1035 * pkr : null, sG = sUsd > 0 ? sUsd / 31.1035 * pkr : null;
  const std = $("zStd").value, per = std === "gold" ? gG : sG, grams = std === "gold" ? 87.48 : 612.36;
  const out = $("zOut");
  if (!per || (v("zGold") > 0 && !gG) || (v("zSilver") > 0 && !sG)) { setHTML(out, `<div class="small">${t("zNeedPrice")}</div>`); return; }
  const foreign = v("zFor") * R.rates.PKR / R.rates[$("zForCur").value];
  const wealth = v("zCash") + foreign + v("zGold") * (gG || 0) + v("zSilver") * (sG || 0) + v("zBiz") - v("zDebt");
  const nisab = grams * per, due = wealth >= nisab;
  setHTML(out, `<div class="small">${t("zWealth")}</div><b>${fmtMoney(Math.max(0, wealth), S)} PKR</b>` +
    `<div class="small" style="margin-top:6px">${t("zNisab")}</div><b>${fmtMoney(nisab, S)} PKR</b>` +
    `<div class="small" style="margin-top:6px">${t("zDue")}</div><b>${due ? fmtMoney(wealth * 0.025, S) + " PKR" : t("zBelow")}</b>`);
}

async function loadSilver() {
  try { await fetchSilver(); } catch (e) { return; }
  silver = (await store.get("silver")).silver; $("zSilverUsd").value = silver.usdPerOz.toFixed(2); calcZakat();
}

function download(name, text, type) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1500);
}
const msg = (k) => { $("dMsg").textContent = t(k); };

async function init() {
  S = await getSettings();
  const d = await store.get(["favs", "alerts", "gold", "silver", "hajj"]);
  favs = sanitizeFavs(d.favs); alerts = sanitizeAlerts(d.alerts); gold = d.gold || null; silver = d.silver || null; hajj = d.hajj ? sanitizeHajj(d.hajj) : HAJJ_DEFAULT;
  await reload();
  ["cFrom", "cTo", "aFrom", "aTo", "rCur"].forEach((id) => fillSelect($(id), "USD"));
  $("cTo").value = "PKR"; $("aTo").value = "PKR"; $("rCur").value = "SAR";
  for (const k in HAJJ_KEYS) $(HAJJ_KEYS[k]).value = hajj[k];
  if (gold) $("gUsd").value = Number(gold.usdPerOz).toFixed(2);
  $("sLang").value = S.lang; $("sTheme").value = S.theme; $("sLakh").checked = S.lakh; $("sAdj").value = S.adj; $("sDaily").checked = !!S.daily; $("myRate").value = S.myRate || "";
  fillSelect($("mCur"), "USD"); fillSelect($("zForCur"), "USD");
  if (silver) $("zSilverUsd").value = Number(silver.usdPerOz).toFixed(2);
  renderAll();
  moveInk(); document.fonts && document.fonts.ready.then(moveInk); window.addEventListener("resize", moveInk);

  // FAQ answers open and close smoothly
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  $("faqList").addEventListener("click", (e) => {
    const sum = e.target.closest("summary"); if (!sum || calm) return;
    e.preventDefault();
    const det = sum.parentElement, body = det.querySelector("p"), ease = "cubic-bezier(.2,.7,.2,1)";
    if (!det.open) {
      det.open = true;
      const hgt = body.offsetHeight;
      body.animate([{ height: "0px", opacity: 0, marginBottom: "0px" }, { height: hgt + "px", opacity: 1, marginBottom: "18px" }], { duration: 280, easing: ease });
    } else {
      const hgt = body.offsetHeight;
      body.animate([{ height: hgt + "px", opacity: 1, marginBottom: "18px" }, { height: "0px", opacity: 0, marginBottom: "0px" }], { duration: 220, easing: "ease-in" }).onfinish = () => { det.open = false; };
    }
  });

  document.querySelector("nav.tabs").onclick = (e) => {
    const tab = e.target.dataset.tab; if (!tab) return;
    document.querySelectorAll("nav.tabs button").forEach((b) => b.classList.toggle("on", b === e.target));
    document.querySelectorAll(".tab").forEach((s) => s.classList.toggle("on", s.id === "tab-" + tab));
    moveInk();
  };
  const setView = () => { view.from = $("cFrom").value; view.to = $("cTo").value; renderChart(); };
  $("cFrom").onchange = setView; $("cTo").onchange = setView;
  document.querySelectorAll("[data-days]").forEach((b) => (b.onclick = () => { view.days = +b.dataset.days; renderChart(); ensureHistory(view.days); }));
  $("board").onclick = (e) => { const tr_ = e.target.closest("tr[data-c]"); if (!tr_) return; $("cFrom").value = tr_.dataset.c; $("cTo").value = "PKR"; setView(); };
  $("favRow").onclick = (e) => { const k = e.target.dataset.k; if (!k) return; const [f, to] = k.split(">"); $("cFrom").value = f; $("cTo").value = to; setView(); };
  $("refresh").onclick = live;

  const hint = () => { const f = $("aFrom").value, to = $("aTo").value, c = $("aCond").value; $("aTarget").placeholder = (c === "rise" || c === "fall") ? "2" : fmtNum(R.rates[to] / R.rates[f]); };
  $("aFrom").onchange = hint; $("aTo").onchange = hint; $("aCond").onchange = hint; hint();
  $("aAdd").onclick = async () => {
    const target = num("aTarget"), from = $("aFrom").value, to = $("aTo").value;
    if (!isFinite(target) || target <= 0 || from === to) return;
    alerts.push({ id: Date.now(), from, to, cond: $("aCond").value, target, base: R.rates[to] / R.rates[from], active: true, fired: false });
    await store.set({ alerts }); $("aTarget").value = ""; renderAlerts();
  };
  $("aList").onclick = async (e) => {
    const id = +e.target.dataset.id, act = e.target.dataset.act; if (!act) return;
    if (act === "del") alerts = alerts.filter((a) => a.id !== id);
    else alerts = alerts.map((a) => (a.id === id ? { ...a, active: !a.active, fired: false } : a));
    await store.set({ alerts }); renderAlerts();
  };

  ["rAmt", "rCur", "rFixed", "rPct"].forEach((id) => { $(id).oninput = calcRemit; $(id).onchange = calcRemit; });
  Object.values(HAJJ_KEYS).forEach((id) => ($(id).oninput = calcHajj));
  $("gUsd").oninput = async () => { const v = num("gUsd"); if (isFinite(v) && v > 0) await store.set({ gold: { usdPerOz: v, updatedAt: Date.now(), manual: true } }); calcGold(); };
  $("gBtn").onclick = loadGold;

  const saveS = async () => {
    S = await saveSettings({ lang: $("sLang").value, theme: $("sTheme").value, lakh: $("sLakh").checked, adj: parseFloat($("sAdj").value) || 0, badge: $("sBadge").value, daily: $("sDaily").checked });
    const src = R.source; await reload(); R.source = src; renderAll(); hint();
  };
  ["sLang", "sTheme", "sLakh", "sAdj", "sBadge", "sDaily"].forEach((id) => ($(id).onchange = saveS));

    ["mAmt", "mCur"].forEach((id) => { $(id).oninput = renderMulti; $(id).onchange = renderMulti; });
  $("cInput").oninput = calcQuick;
  ["zCash", "zBiz", "zFor", "zForCur", "zGold", "zSilver", "zDebt", "zStd", "zSilverUsd"].forEach((id) => { $(id).oninput = calcZakat; $(id).onchange = calcZakat; });
  $("gUsd").addEventListener("input", calcZakat);
  $("zSBtn").onclick = loadSilver;
  $("myRate").oninput = async () => { calcMy(); S = await saveSettings({ myRate: parseFloat($("myRate").value) || 0 }); };

  $("dExpR").onclick = () => {
    const codes = Object.keys(CURRENCIES), rows = [["date (rates per 1 USD)", ...codes].join(",")];
    for (const k of Object.keys(H).sort()) rows.push([k, ...codes.map((c) => (H[k][c] != null ? H[k][c] : ""))].join(","));
    download("pkr-rates-per-usd.csv", rows.join("\n"), "text/csv");
  };
  $("dExpC").onclick = async () => {
    const { convHistory } = await store.get("convHistory");
    const rows = ["amount,from,to,result", ...(convHistory || []).map((h) => [h.amount, h.from, h.to, h.out].join(","))];
    download("pkr-conversions.csv", rows.join("\n"), "text/csv");
  };
  $("dBackup").onclick = async () => download("pkr-converter-backup.json", JSON.stringify(await store.get(null)), "application/json");
  $("dRestore").onclick = () => $("dFile").click();
  $("dFile").onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try {
      const obj = JSON.parse(await f.text());
      if (!obj || typeof obj !== "object" || Array.isArray(obj)) throw new Error("bad file");
      await store.set(sanitizeBackup(obj)); msg("done"); setTimeout(() => location.reload(), 700);
    } catch (err) { msg("failed"); }
  };
  $("dPush").onclick = async () => {
    try { await chrome.storage.sync.set({ backup: await store.get(["settings", "favs", "alerts", "hajj", "prefs"]) }); msg("done"); } catch (err) { msg("failed"); }
  };
  $("dPull").onclick = async () => {
    try {
      const { backup } = await chrome.storage.sync.get("backup");
      if (!backup) throw new Error("empty");
      await store.set(sanitizeBackup(backup)); msg("done"); setTimeout(() => location.reload(), 700);
    } catch (err) { msg("failed"); }
  };

  try { $("ver").textContent = "v" + chrome.runtime.getManifest().version; } catch (e) {}
  const img = $("aImg");
  img.onload = () => { img.hidden = false; $("aIni").hidden = true; };
  if (navigator.onLine) img.src = "https://portfolio-pi-green-77.vercel.app/profile.jpeg";
  if (navigator.onLine) { live().then(() => ensureHistory(view.days)); loadGold(); loadSilver(); }
  window.addEventListener("online", live);
}
init();
