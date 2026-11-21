const $ = (id) => document.getElementById(id);
let S, R, H = {}, favs = [], hist = [], timer, popDays = 7;
const t = (k, v) => tr(S.lang, k, v);

function showStatus() {
  const el = $("status");
  el.dataset.state = R.source;
  el.textContent = t(R.source);
  $("updated").textContent = R.source === "live" ? t("updatedAgo", { t: ago(R.updatedAt, S.lang) })
    : R.source === "saved" ? t("offlineFrom", { t: ago(R.updatedAt, S.lang) }) : t("approx");
}

function pairKey() { return `${$("from").value}>${$("to").value}`; }

function renderFavs() {
  const box = $("favs");
  setHTML(box, favs.length ? favs.map((k) => `<button class="chip" data-k="${esc(k)}">${esc(k.replace(">", " → "))}</button>`).join("") : `<span class="small">${t("noFavs")}</span>`);
  const saved = favs.includes(pairKey());
  setHTML($("favBtn"), `<svg class="i${saved ? " fill" : ""}" aria-hidden="true"><use href="#i-star"/></svg><span>${t(saved ? "pairSaved" : "savePair")}</span>`);
}

function renderHist() {
  setHTML($("hist"), hist.length
    ? hist.map((h, i) => `<li><span>${fmtNum(h.amount)} ${esc(h.from)} → ${fmtNum(h.out)} ${esc(h.to)}</span><button data-i="${i}">${t("copy")}</button></li>`).join("")
    : `<li class="small">${t("noHistory")}</li>`);
}

let lastTrendKey = "";
function renderTrend() {
  document.querySelectorAll("[data-d]").forEach((b) => b.classList.toggle("on", +b.dataset.d === popDays));
  const key = `${$("from").value}|${$("to").value}|${popDays}|${Object.keys(H).length}|${S.lang}`;
  if (key === lastTrendKey) return;   // typing an amount should not redraw the chart
  lastTrendKey = key;
  const el = $("trend"), sp = $("spark");
  const pts = seriesFor(H, $("from").value, $("to").value, popDays, S.adj);
  const tre = trendOf(pts);
  if (!tre) { el.className = "trend"; el.textContent = t("trendNeed"); setHTML(sp, ""); return; }
  const arrow = tre.dir === "up" ? "▲" : tre.dir === "down" ? "▼" : "▬";
  const label = t(tre.dir === "up" ? "trendUp" : tre.dir === "down" ? "trendDown" : "trendFlat");
  el.className = "trend " + tre.dir;
  el.textContent = `${arrow} ${label}${tre.dir === "flat" ? "" : " " + Math.abs(tre.pct).toFixed(2) + "%"}`;
  const W = 300, Ht = 46, p = 4, vals = pts.map((q) => q.v);
  let min = Math.min(...vals), max = Math.max(...vals);
  if (min === max) { min -= 1; max += 1; }
  const x = (i) => p + i * (W - 2 * p) / (pts.length - 1), y = (v) => p + (max - v) * (Ht - 2 * p) / (max - min);
  const line = pts.map((q, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(q.v).toFixed(1)}`).join(" ");
  setHTML(sp, `<g class="reveal"><path d="${line} L${W - p},${Ht} L${p},${Ht} Z" fill="var(--accent)" opacity=".18"/>` +
    `<path d="${line}" fill="none" stroke="var(--accent)" stroke-width="2" vector-effect="non-scaling-stroke"/></g>`);
}

function renderVerdict() {
  const el = $("verdict"), from = $("from").value, to = $("to").value;
  const v = sendVerdict(H, from, to, S.adj);
  el.className = "verdict" + (v && to === "PKR" ? (v.dir === "good" ? " up" : v.dir === "low" ? " down" : "") : "");
  el.textContent = verdictText(v, S, to === "PKR");
}

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
let curVal = null, raf = 0;
// Smoothly rolls the big number to its new value instead of jumping.
function showResult(out, to) {
  const el = $("result"), final = `${fmtMoney(out, S)} ${to}`;
  cancelAnimationFrame(raf);
  if (reduceMotion || curVal === null || Math.abs(curVal - out) < 1e-9) { el.textContent = final; curVal = out; return; }
  const from = curVal, t0 = performance.now(), dur = 420;
  const step = (now) => {
    const k = Math.min(1, (now - t0) / dur), v = from + (out - from) * (1 - Math.pow(1 - k, 3));
    curVal = v;
    if (k < 1) { el.textContent = `${fmtMoney(v, S)} ${to}`; raf = requestAnimationFrame(step); }
    else { curVal = out; el.textContent = final; }
  };
  raf = requestAnimationFrame(step);
}

function convert() {
  const amount = parseFloat($("amount").value), from = $("from").value, to = $("to").value;
  renderFavs(); renderTrend(); renderVerdict();
  if (!isFinite(amount) || amount < 0) { curVal = null; $("result").textContent = "—"; $("rate").textContent = t("enterAmount"); return; }
  const r = R.rates[to] / R.rates[from], out = amount * r;
  showResult(out, to);
  $("rate").textContent = `1 ${from} = ${fmtNum(r)} ${to}`;
  store.set({ prefs: { amount: $("amount").value, from, to } });
  clearTimeout(timer);
  timer = setTimeout(() => pushHistory({ amount, from, to, out }), 1200);
}

async function pushHistory(h) {
  const top = hist[0];
  if (top && top.amount === h.amount && top.from === h.from && top.to === h.to) return;
  hist.unshift(h); hist = hist.slice(0, 10);
  await store.set({ convHistory: hist });
  renderHist();
}

async function copy(text, btn) {
  const lab = btn.querySelector("span") || btn;
  try { await navigator.clipboard.writeText(text); const old = lab.textContent; lab.textContent = t("copied"); setTimeout(() => (lab.textContent = old), 1200); } catch (e) {}
}

async function loadHistory() { H = sanitizeHistory((await store.get("history")).history); }

async function live() {
  const btn = $("refresh");
  btn.disabled = true; btn.textContent = t("updating"); document.querySelector(".result").classList.add("loading");
  try {
    await fetchRates();
    R = await loadRates(); R.source = "live";
    await loadHistory();
  } catch (e) { /* keep saved or built-in */ }
  btn.disabled = false; btn.textContent = t("refresh"); document.querySelector(".result").classList.remove("loading");
  showStatus(); convert();
  if (navigator.onLine && Object.keys(H).length < 25) {
    try { if (await backfillHistory(30)) { await loadHistory(); renderTrend(); renderVerdict(); } } catch (e) {}
  }
}

function pickPal(p) {
  saveSettings({ palette: p }).then((s) => { S = s; applyTheme(S); renderSwatches($("swatches"), S, pickPal); });
}

async function init() {
  S = await getSettings();
  applyTheme(S); applyI18n(S);
  fillSelect($("from"), "USD"); fillSelect($("to"), "PKR");
  const d = await store.get(["prefs", "favs", "convHistory"]);
  favs = sanitizeFavs(d.favs); hist = sanitizeConv(d.convHistory);
  if (d.prefs) { $("amount").value = d.prefs.amount; $("from").value = d.prefs.from; $("to").value = d.prefs.to; }
  R = await loadRates(); await loadHistory();
  renderSwatches($("swatches"), S, pickPal);
  showStatus(); renderFavs(); renderHist(); convert();

  ["input", "change"].forEach((ev) => { $("amount").addEventListener(ev, convert); $("from").addEventListener(ev, convert); $("to").addEventListener(ev, convert); });
  $("swap").onclick = () => { $("swap").classList.remove("spin"); void $("swap").offsetWidth; $("swap").classList.add("spin"); const f = $("from").value; $("from").value = $("to").value; $("to").value = f; convert(); };
  $("refresh").onclick = live;
  $("dash").onclick = () => chrome.runtime.openOptionsPage();
  document.querySelectorAll("[data-d]").forEach((b) => (b.onclick = () => { popDays = +b.dataset.d; renderTrend(); }));
  $("copyBtn").onclick = (e) => copy(`${$("amount").value} ${$("from").value} = ${$("result").textContent}`, e.currentTarget);
  $("shareBtn").onclick = () => {
    const text = `${$("amount").value} ${$("from").value} = ${$("result").textContent}\n(${$("rate").textContent})`;
    window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank");
  };
  $("favBtn").onclick = async () => {
    const k = pairKey();
    favs = favs.includes(k) ? favs.filter((x) => x !== k) : [...favs, k].slice(-6);
    await store.set({ favs }); renderFavs();
  };
  $("favs").onclick = (e) => {
    const k = e.target.dataset.k; if (!k) return;
    const [f, to] = k.split(">"); $("from").value = f; $("to").value = to; convert();
  };
  $("hist").onclick = (e) => {
    const i = e.target.dataset.i; if (i === undefined) return;
    const h = hist[i]; copy(`${fmtNum(h.amount)} ${h.from} = ${fmtNum(h.out)} ${h.to}`, e.target);
  };
  $("clearHist").onclick = async () => { hist = []; await store.set({ convHistory: [] }); renderHist(); };

  if (navigator.onLine) live();
  window.addEventListener("online", live);
}
init();
