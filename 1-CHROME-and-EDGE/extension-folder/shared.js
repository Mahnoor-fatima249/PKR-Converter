// Firefox exposes promise-based APIs on `browser`; point `chrome` at it so one code base runs in both.
try { if (typeof browser !== "undefined" && browser.runtime && browser.runtime.id) globalThis.chrome = browser; } catch (e) {}
// Shared by popup, dashboard and background worker. No DOM access at load time.
// [name, flag file in flags/]  (flags are bundled SVGs: Windows does not draw flag emoji)
const CURRENCIES = {
  PKR: ["Pakistani Rupee", "pk"], USD: ["US Dollar", "us"], EUR: ["Euro", "eu"],
  GBP: ["British Pound", "gb"], AED: ["UAE Dirham", "ae"], SAR: ["Saudi Riyal", "sa"],
  QAR: ["Qatari Riyal", "qa"], KWD: ["Kuwaiti Dinar", "kw"], CNY: ["Chinese Yuan", "cn"],
  INR: ["Indian Rupee", "in"], CAD: ["Canadian Dollar", "ca"], AUD: ["Australian Dollar", "au"],
  JPY: ["Japanese Yen", "jp"], TRY: ["Turkish Lira", "tr"], MYR: ["Malaysian Ringgit", "my"]
};
// Approximate per 1 USD. Only used when nothing live or saved exists. Edit now and then.
const BUILTIN_RATES = {
  USD: 1, PKR: 280, EUR: 0.92, GBP: 0.79, AED: 3.6725, SAR: 3.75, QAR: 3.64, KWD: 0.307,
  CNY: 7.2, INR: 83.5, CAD: 1.37, AUD: 1.52, JPY: 150, TRY: 34, MYR: 4.5
};
const API_URL = "https://open.er-api.com/v6/latest/USD";   // free, no key
const SILVER_URL = "https://api.gold-api.com/price/XAG";
const GOLD_URL = "https://api.gold-api.com/price/XAU";      // free, no key (USD per troy ounce)
const DEFAULT_SETTINGS = { lang: "en", theme: "auto", lakh: false, adj: 0, palette: "green", custom: "#0F7B5C", badge: "USD", daily: false, myRate: 0 };

const DICT = {
  en: {
    appName: "PKR Converter", amount: "Amount", from: "From", to: "To", swap: "Swap currencies",
    copy: "Copy", copied: "Copied", refresh: "Refresh rates", updating: "Updating…",
    live: "Live rates", saved: "Saved rates", builtin: "Built-in rates",
    updatedAgo: "Updated {t}", offlineFrom: "Offline · saved {t}", approx: "Estimated rates · connect for live data",
    enterAmount: "Enter an amount", favourites: "Favourite pairs", savePair: "Save pair", pairSaved: "Saved",
    noFavs: "No saved pairs yet.", history: "Recent conversions",
    noHistory: "No conversions yet.", clear: "Clear", openDash: "Dashboard",
    justNow: "just now", minAgo: "{n} min ago", hrAgo: "{n} hr ago", dayAgo: "{n} day(s) ago",
    lakh: "Lakh", crore: "Crore",
    currency: "Currency", zGoldHint: "The gold price is taken from the Gold card.", toolsEveryday: "Conversion tools", toolsFaith: "Gold, zakat and Hajj planning",
    notesTitle: "How these numbers are worked out",
    note1: "Gold and silver: the international price per ounce divided by 31.1035 gives the price per gram. One tola is 11.6638 g.",
    note2: "Nisab is 87.48 g of gold (7.5 tola) or 612.36 g of silver (52.5 tola). Zakat is 2.5% of your wealth above it.",
    note3: "Everything converts at the rates shown at the top, including your open-market adjustment if you set one.",
    tabFaq: "FAQ", faqTitle: "Frequently asked questions",
    faqQ1: "Where do the rates come from?",
    faqA1: "From the free open.er-api.com service, which updates about once a day. These are market (interbank) rates, not what a shop or bank will actually hand you.",
    faqQ2: "Why does my money changer give a different number?",
    faqA2: "Shops and banks add their own margin, and open-market rates in Pakistan often drift away from the official ones. Add an open-market adjustment in Settings, or type your changer’s rate under Tools to see exactly how far apart you are.",
    faqQ3: "Does it work without internet?",
    faqA3: "Yes. It shows the last rates it saved, and if there are none yet it falls back to rough built-in numbers. The small dot at the top tells you which one you are looking at: green is live, amber is saved, red is rough.",
    faqQ4: "How do rate alerts work?",
    faqA4: "Chrome checks the rate every 30 minutes in the background and sends a notification when your target is reached. Chrome has to be running, and you need to be online for the check to happen.",
    faqQ5: "Why is the chart empty or short at first?",
    faqA5: "The extension saves one rate a day, and when you are online it also tries to load the past 30 days from a free history source. If that source is down, the chart simply fills in day by day.",
    faqQ6: "What does “Favourable rate” mean?",
    faqA6: "It compares today’s rate with the average of the last 30 days. If today is higher, you get more rupees per dollar than usual. It only looks backwards and cannot predict what comes next.",
    faqQ7: "Is my data private?",
    faqA7: "Your settings, alerts and history stay in your own browser. There is no account and no tracking. The extension only talks to the rate services, to the gold price service when you use that tool, and the About page loads one photo from Mahnoor’s portfolio site. If you press the Google account save button, your settings go to your own Chrome sync.",
    faqQ8: "How accurate are the gold and zakat tools?",
    faqA8: "They use international gold and silver prices, so a local jeweller’s rate will differ. Treat the zakat result as a starting point, and ask a scholar about your own situation.",
    faqQ9: "Can I convert a price on a web page?",
    faqA9: "Yes. Select the price, right-click and choose “Convert to PKR”. Something like $50 or Rs 2,000 works best. You can also press Alt+C to open the converter.",
    tabAbout: "About", aSummary: "Summary", aExperience: "Experience", aEducation: "Education", aRecognition: "Recognition", aWork: "Selected work", aExtension: "About this extension", aboutHeading: "About the developer", aStatProjects: "Projects", aStatIntern: "Internships", aStatHec: "HEC score",
    aHighlights: "Along the way", aSkills: "Technical skills", aConnect: "Connect",
    aCredit: "Rates come from the free open.er-api.com. They are a guide, not a bank quote, and open-market rates can differ.",
    badgeLabel: "Toolbar badge (rate shown on the icon)", badgeOff: "Off", dailyLabel: "Daily rate summary at 9:00 am",
    dailyTitle: "Today’s PKR rates",
    vGood: "Favourable rate", vAvg: "Near the average", vLow: "Below the average", vsAvg: "against the {n}-day average",
    vNeed: "Needs a few more saved days.", vNote: "Based on past rates. Not a forecast.",
    multiTitle: "One amount, all currencies",
    calcTitle: "Quick calculator", calcHint: "Example: 50 usd + 20 eur in pkr", calcErr: "Could not read that. Try: 50 usd + 20 eur in pkr",
    zakatTitle: "Zakat calculator", zakatNote: "Zakat is 2.5% of savings held for a full year above the nisab. For your own situation, ask a scholar.",
    zCash: "Cash and bank (PKR)", zForeign: "Foreign savings", zGold: "Gold you own (grams, 24K equivalent)", zSilver: "Silver you own (grams)",
    zBiz: "Business stock and money owed to you (PKR)", zDebt: "Debts you owe (PKR)", zStd: "Nisab standard",
    zSilverStd: "Silver (52.5 tola)", zGoldStd: "Gold (7.5 tola)", silverUsd: "Silver price (USD per ounce)",
    zWealth: "Total wealth", zNisab: "Nisab", zDue: "Zakat due", zBelow: "Below the nisab, no zakat due.",
    zNeedPrice: "Enter the gold and silver prices needed for this calculation.",
    myRateTitle: "Compare with my money changer", myRateLabel: "My rate (PKR per USD)",
    myRateOut: "International {intl} · yours {mine} · difference {diff} ({pct}%)",
    riseBy: "rises by (%)", fallBy: "falls by (%)", riseText: "rises by", fallText: "falls by", basedOn: "from {base}",
    shareBtn: "WhatsApp",
    dataTitle: "Backup and export", exportRates: "Export rate history (CSV)", exportConv: "Export conversions (CSV)",
    backupBtn: "Download backup", restoreBtn: "Restore backup", syncPush: "Save to my Google account",
    syncPull: "Load from my Google account", done: "Done", failed: "Failed",
    customColour: "Custom colour (pick a darker shade)",
    trendUp: "Rising", trendDown: "Falling", trendFlat: "Steady", over: "over {n} day(s)", avg: "Avg",
    trendNeed: "The trend shows once a few days of rates are saved.", chartLoading: "Loading past rates…",
    palette: "Colour theme", pal_green: "Pakistan green", pal_ocean: "Ocean blue", pal_purple: "Royal purple",
    pal_sunset: "Sunset orange", pal_rose: "Rose", pal_slate: "Charcoal",
    tabOverview: "Overview", tabAlerts: "Alerts", tabTools: "Tools", tabSettings: "Settings",
    boardTitle: "Rates in PKR", boardSub: "Value of one unit in PKR, and change since the last saved day",
    chartTitle: "Rate chart", d7: "7 days", d30: "30 days", d90: "90 days",
    chartEmpty: "Not enough history yet. The chart fills in as daily rates are saved.",
    noPrev: "new", high: "High", low: "Low",
    alertsTitle: "Rate alerts", alertsHint: "Chrome checks every 30 minutes, even with this tab closed.",
    alertWhen: "Tell me when", above: "goes above", below: "goes below", target: "Target rate",
    addAlert: "Add alert", noAlerts: "No alerts yet.", nowRate: "now", del: "Delete",
    active: "Active", paused: "Paused", alertTitle: "Rate alert",
    alertMsg: "1 {from} = {rate} {to}. Your target was {target}.",
    remitTitle: "Send money home", sendAmount: "You send", fixedFee: "Fixed fee", feePct: "Fee (%)",
    recipientGets: "Recipient gets", effRate: "Your effective rate",
    goldTitle: "Gold in PKR", goldUsd: "Gold price (USD per ounce)", fetchGold: "Fetch price",
    perGram: "Per gram", perTola: "Per tola",
    goldNote: "International spot price. Local jeweller rates differ.",
    goldFail: "Could not fetch the gold price. Enter it by hand.",
    hajjTitle: "Hajj / Umrah budget", hajjNote: "Example values. Replace them with your own.",
    flight: "Flights (PKR)", nights: "Hotel nights", hotelNight: "Hotel per night (SAR)", days: "Days",
    foodDay: "Food per day (SAR)", transport: "Transport (SAR)", other: "Other (SAR)",
    totalSar: "Total in SAR", totalPkr: "Total in PKR",
    language: "Language", theme: "Theme", themeAuto: "Match system", themeLight: "Light", themeDark: "Dark",
    lakhFmt: "Show big amounts in Lakh / Crore", adjLabel: "Open-market adjustment (PKR per USD)",
    adjHint: "Added to the USD/PKR rate. Use it when your money changer's rate differs from the international rate.",
    shortcut: "Keyboard shortcut: Alt+C opens the converter. Change it at chrome://extensions/shortcuts.",
    ctxFail: "Could not find a price in “{s}”. Try selecting something like $50 or Rs 2,000.",
    ctxOk: "{amount} {cur} = {out} {to}"
  },
  ur: {
    appName: "پی کے آر کنورٹر", amount: "رقم", from: "کس سے", to: "کس میں", swap: "کرنسی بدلیں",
    copy: "کاپی", copied: "کاپی ہو گیا", refresh: "ریٹ اپڈیٹ کریں", updating: "اپڈیٹ ہو رہا ہے…",
    live: "لائیو ریٹ", saved: "محفوظ ریٹ", builtin: "اندازاً ریٹ",
    updatedAgo: "اپڈیٹ: {t}", offlineFrom: "آف لائن · محفوظ: {t}", approx: "اندازاً · اپڈیٹ کے لیے انٹرنیٹ جوڑیں",
    enterAmount: "رقم لکھیں", favourites: "پسندیدہ جوڑیاں", savePair: "جوڑی محفوظ کریں", pairSaved: "محفوظ",
    noFavs: "ابھی کوئی جوڑی محفوظ نہیں۔", history: "حالیہ تبدیلیاں",
    noHistory: "ابھی کچھ نہیں۔ رقم تبدیل کریں، یہاں نظر آئے گی۔", clear: "صاف کریں", openDash: "ڈیش بورڈ",
    justNow: "ابھی ابھی", minAgo: "{n} منٹ پہلے", hrAgo: "{n} گھنٹے پہلے", dayAgo: "{n} دن پہلے",
    lakh: "لاکھ", crore: "کروڑ",
    currency: "کرنسی", zGoldHint: "سونے کی قیمت اوپر والے سونے کے کارڈ سے لی جاتی ہے۔", toolsEveryday: "روزمرہ رقم", toolsFaith: "سونا، زکوٰۃ اور حج",
    notesTitle: "یہ اعداد کیسے نکلتے ہیں",
    note1: "سونا اور چاندی: بین الاقوامی قیمت فی اونس کو 31.1035 سے تقسیم کریں تو فی گرام قیمت ملتی ہے۔ ایک تولہ 11.6638 گرام کا ہوتا ہے۔",
    note2: "نصاب 87.48 گرام سونا (ساڑھے 7 تولہ) یا 612.36 گرام چاندی (ساڑھے 52 تولہ) ہے۔ زکوٰۃ اس سے اوپر کے مال کا 2.5% ہوتی ہے۔",
    note3: "ہر حساب اوپر دکھائے گئے ریٹ پر ہوتا ہے، اور اگر آپ نے اوپن مارکیٹ ایڈجسٹمنٹ لگائی ہو تو وہ بھی شامل ہوتی ہے۔",
    tabFaq: "سوالات", faqTitle: "لوگ اکثر یہ پوچھتے ہیں",
    faqQ1: "ریٹ کہاں سے آتے ہیں؟",
    faqA1: "مفت سروس open.er-api.com سے، جو اپنے ریٹ تقریباً دن میں ایک بار اپڈیٹ کرتی ہے۔ یہ مارکیٹ (انٹربینک) ریٹ ہیں، وہ نہیں جو دکان یا بینک آپ کو دیتا ہے۔",
    faqQ2: "میرا منی چینجر الگ ریٹ کیوں دیتا ہے؟",
    faqA2: "دکان اور بینک اپنا مارجن لگاتے ہیں، اور پاکستان میں اوپن مارکیٹ کا ریٹ اکثر سرکاری ریٹ سے الگ چلتا ہے۔ سیٹنگز میں اوپن مارکیٹ ایڈجسٹمنٹ لگائیں، یا ٹولز میں اپنے منی چینجر کا ریٹ لکھ کر فرق دیکھ لیں۔",
    faqQ3: "کیا انٹرنیٹ کے بغیر چلتا ہے؟",
    faqA3: "جی ہاں۔ آخری محفوظ ریٹ دکھاتا ہے، اور اگر کچھ محفوظ نہ ہو تو اندازاً بلٹ اِن اعداد استعمال کرتا ہے۔ اوپر چھوٹا نقطہ بتاتا ہے: ہرا لائیو، پیلا محفوظ، لال اندازاً۔",
    faqQ4: "ریٹ الرٹ کیسے کام کرتے ہیں؟",
    faqA4: "کروم ہر 30 منٹ بعد پس منظر میں ریٹ چیک کرتا ہے اور ہدف پورا ہونے پر اطلاع بھیجتا ہے۔ کروم چل رہا ہو اور انٹرنیٹ ہو تو ہی چیک ہوتا ہے۔",
    faqQ5: "چارٹ شروع میں خالی یا چھوٹا کیوں ہے؟",
    faqA5: "ایکسٹینشن روزانہ ایک ریٹ محفوظ کرتی ہے، اور انٹرنیٹ ہو تو پچھلے 30 دن کا ریٹ ایک مفت ہسٹری سروس سے لوڈ کرنے کی کوشش بھی کرتی ہے۔ وہ سروس نہ چلے تو چارٹ دن بہ دن بھرتا جاتا ہے۔",
    faqQ6: "“بھیجنے کے لیے اچھا دن” کا کیا مطلب ہے؟",
    faqA6: "یہ آج کے ریٹ کو پچھلے 30 دن کی اوسط سے ملاتا ہے۔ آج زیادہ ہو تو ایک ڈالر پر معمول سے زیادہ روپے ملتے ہیں۔ یہ صرف پیچھے دیکھتا ہے، آگے کا اندازہ نہیں لگا سکتا۔",
    faqQ7: "کیا میرا ڈیٹا محفوظ ہے؟",
    faqA7: "آپ کی سیٹنگز، الرٹس اور ہسٹری آپ کے اپنے براؤزر میں رہتی ہیں۔ نہ اکاؤنٹ ہے، نہ ٹریکنگ۔ ایکسٹینشن صرف ریٹ کی سروسز سے بات کرتی ہے، سونے کا ٹول استعمال کریں تو سونے کی قیمت کی سروس سے، اور تعارف کا صفحہ مہنور کے پورٹ فولیو سے ایک تصویر لوڈ کرتا ہے۔ گوگل اکاؤنٹ والا بٹن دبائیں تو سیٹنگز آپ کے اپنے کروم سنک میں جاتی ہیں۔",
    faqQ8: "سونے اور زکوٰۃ کے ٹول کتنے درست ہیں؟",
    faqA8: "یہ بین الاقوامی سونے اور چاندی کی قیمت استعمال کرتے ہیں، اس لیے مقامی جیولر کا ریٹ مختلف ہوگا۔ زکوٰۃ کے نتیجے کو شروعات سمجھیں، اور اپنی صورتحال کے لیے کسی عالم سے پوچھ لیں۔",
    faqQ9: "کیا ویب پیج پر لکھی قیمت کنورٹ ہو سکتی ہے؟",
    faqA9: "جی ہاں۔ قیمت منتخب کریں، رائٹ کلک کریں اور “Convert to PKR” چنیں۔ $50 یا Rs 2,000 جیسی قیمت سب سے بہتر چلتی ہے۔ کنورٹر کھولنے کے لیے Alt+C بھی دبا سکتے ہیں۔",
    tabAbout: "تعارف", aSummary: "خلاصہ", aExperience: "تجربہ", aEducation: "تعلیم", aRecognition: "اعزازات", aWork: "منتخب کام", aExtension: "اس ایکسٹینشن کے بارے میں", aboutHeading: "ڈویلپر کے بارے میں", aStatProjects: "پراجیکٹس", aStatIntern: "انٹرن شپس", aStatHec: "ایچ ای سی اسکور",
    aHighlights: "اب تک کا سفر", aSkills: "اہم مہارتیں", aConnect: "مجھے آن لائن یہاں ملیں",
    aCredit: "ایکسچینج ریٹ مفت سروس open.er-api.com سے آتے ہیں۔ یہ صرف معلومات کے لیے ہیں اور بینک یا اوپن مارکیٹ کے ریٹ سے مختلف ہو سکتے ہیں۔",
    badgeLabel: "ٹول بار بیج (آئیکن پر ریٹ)", badgeOff: "بند", dailyLabel: "روزانہ صبح 9 بجے ریٹ کا خلاصہ",
    dailyTitle: "آج کے پی کے آر ریٹ",
    vGood: "بھیجنے کے لیے اچھا دن", vAvg: "عام سا دن", vLow: "بہترین دن نہیں", vsAvg: "{n} دن کی اوسط کے مقابلے میں",
    vNeed: "چند دن کے محفوظ ریٹ درکار ہیں۔", vNote: "یہ ماضی کی جھلک ہے، پیش گوئی نہیں۔",
    multiTitle: "ایک رقم، تمام کرنسیاں",
    calcTitle: "فوری کیلکولیٹر", calcHint: "مثال: 50 usd + 20 eur in pkr", calcErr: "سمجھ نہیں آیا۔ یوں لکھیں: 50 usd + 20 eur in pkr",
    zakatTitle: "زکوٰۃ کیلکولیٹر", zakatNote: "زکوٰۃ نصاب سے اوپر، سال بھر رکھی بچت کا 2.5% ہوتی ہے۔ اپنی صورتحال کے لیے عالم سے پوچھ لیں۔",
    zCash: "نقد اور بینک (PKR)", zForeign: "بیرونی کرنسی کی بچت", zGold: "آپ کا سونا (گرام، 24K کے برابر)", zSilver: "آپ کی چاندی (گرام)",
    zBiz: "کاروباری مال اور وصول طلب رقم (PKR)", zDebt: "آپ کے ذمے قرض (PKR)", zStd: "نصاب کا معیار",
    zSilverStd: "چاندی (ساڑھے 52 تولہ)", zGoldStd: "سونا (ساڑھے 7 تولہ)", silverUsd: "چاندی کی قیمت (ڈالر فی اونس)",
    zWealth: "کل مال", zNisab: "نصاب", zDue: "واجب زکوٰۃ", zBelow: "نصاب سے کم ہے، زکوٰۃ واجب نہیں۔",
    zNeedPrice: "اس حساب کے لیے سونے اور چاندی کی قیمت لکھیں۔",
    myRateTitle: "اپنے منی چینجر سے موازنہ", myRateLabel: "میرا ریٹ (PKR فی ڈالر)",
    myRateOut: "بین الاقوامی {intl} · آپ کا {mine} · فرق {diff} ({pct}%)",
    riseBy: "اتنے فیصد بڑھے (%)", fallBy: "اتنے فیصد گھٹے (%)", riseText: "بڑھے", fallText: "گھٹے", basedOn: "{base} سے",
    shareBtn: "واٹس ایپ",
    dataTitle: "بیک اپ اور ایکسپورٹ", exportRates: "ریٹ ہسٹری ایکسپورٹ (CSV)", exportConv: "تبدیلیاں ایکسپورٹ (CSV)",
    backupBtn: "بیک اپ ڈاؤن لوڈ", restoreBtn: "بیک اپ بحال کریں", syncPush: "میرے گوگل اکاؤنٹ میں محفوظ کریں",
    syncPull: "میرے گوگل اکاؤنٹ سے لوڈ کریں", done: "ہو گیا", failed: "ناکام",
    customColour: "اپنا رنگ (گہرا رنگ چنیں)",
    trendUp: "بڑھ رہا ہے", trendDown: "کم ہو رہا ہے", trendFlat: "مستحکم", over: "{n} دن میں", avg: "اوسط",
    trendNeed: "چند دن کے ریٹ محفوظ ہونے پر رجحان نظر آئے گا۔", chartLoading: "پچھلے ریٹ لوڈ ہو رہے ہیں…",
    palette: "رنگوں کی تھیم", pal_green: "پاکستانی سبز", pal_ocean: "سمندری نیلا", pal_purple: "شاہی جامنی",
    pal_sunset: "غروبِ آفتاب", pal_rose: "گلابی", pal_slate: "چارکول",
    tabOverview: "جائزہ", tabAlerts: "الرٹس", tabTools: "ٹولز", tabSettings: "سیٹنگز",
    boardTitle: "پی کے آر میں ریٹ", boardSub: "ہر کرنسی کی ایک اکائی، آخری محفوظ دن سے تبدیلی",
    chartTitle: "ریٹ چارٹ", d7: "7 دن", d30: "30 دن", d90: "90 دن",
    chartEmpty: "ایکسٹینشن روزانہ ایک ریٹ محفوظ کرتی ہے، اسی سے چارٹ بنتا ہے۔ چند دن بعد دوبارہ دیکھیں۔",
    noPrev: "نیا", high: "سب سے زیادہ", low: "سب سے کم",
    alertsTitle: "ریٹ الرٹ", alertsHint: "کروم ہر 30 منٹ بعد ریٹ چیک کرتا ہے، چاہے یہ ٹیب بند ہو۔",
    alertWhen: "مجھے بتائیں جب", above: "سے اوپر جائے", below: "سے نیچے جائے", target: "مطلوبہ ریٹ",
    addAlert: "الرٹ لگائیں", noAlerts: "ابھی کوئی الرٹ نہیں۔", nowRate: "اب", del: "ہٹائیں",
    active: "فعال", paused: "رکا ہوا", alertTitle: "ریٹ الرٹ",
    alertMsg: "1 {from} = {rate} {to}۔ آپ کا ہدف {target} تھا۔",
    remitTitle: "پیسے گھر بھیجیں", sendAmount: "آپ بھیجتے ہیں", fixedFee: "مقررہ فیس", feePct: "فیس (%)",
    recipientGets: "وصول کرنے والے کو ملے گا", effRate: "آپ کا اصل ریٹ",
    goldTitle: "سونا پاکستانی روپے میں", goldUsd: "سونے کی قیمت (ڈالر فی اونس)", fetchGold: "قیمت حاصل کریں",
    perGram: "فی گرام", perTola: "فی تولہ",
    goldNote: "یہ بین الاقوامی قیمت پر مبنی ہے۔ مقامی جیولرز کا ریٹ مختلف ہوتا ہے۔",
    goldFail: "سونے کی قیمت حاصل نہیں ہو سکی۔ خود لکھ دیں۔",
    hajjTitle: "حج / عمرہ بجٹ", hajjNote: "یہ صرف مثال کے اعداد ہیں۔ اپنے اعداد لکھیں۔",
    flight: "ہوائی ٹکٹ (PKR)", nights: "ہوٹل کی راتیں", hotelNight: "ہوٹل فی رات (SAR)", days: "دن",
    foodDay: "کھانا فی دن (SAR)", transport: "ٹرانسپورٹ (SAR)", other: "دیگر (SAR)",
    totalSar: "کل رقم سعودی ریال میں", totalPkr: "کل رقم پاکستانی روپے میں",
    language: "زبان", theme: "تھیم", themeAuto: "سسٹم کے مطابق", themeLight: "روشن", themeDark: "گہرا",
    lakhFmt: "بڑی رقم لاکھ / کروڑ میں دکھائیں", adjLabel: "اوپن مارکیٹ ایڈجسٹمنٹ (PKR فی ڈالر)",
    adjHint: "یہ ڈالر/روپے کے ریٹ میں جمع ہوتی ہے۔ جب منی چینجر کا ریٹ بین الاقوامی ریٹ سے مختلف ہو تو استعمال کریں۔",
    shortcut: "کی بورڈ شارٹ کٹ: Alt+C سے کنورٹر کھلتا ہے۔ تبدیلی کے لیے chrome://extensions/shortcuts۔",
    ctxFail: "“{s}” میں قیمت نہیں ملی۔ $50 یا Rs 2,000 جیسا کچھ منتخب کریں۔",
    ctxOk: "{amount} {cur} = {out} {to}"
  }
};

function tr(lang, key, vars) {
  let s = (DICT[lang] && DICT[lang][key]) || DICT.en[key] || key;
  if (vars) for (const k in vars) s = s.split("{" + k + "}").join(vars[k]);
  return s;
}

const store = {
  get: (keys) => chrome.storage.local.get(keys),
  set: (obj) => chrome.storage.local.set(obj)
};

async function getSettings() {
  const { settings } = await store.get("settings");
  return { ...DEFAULT_SETTINGS, ...(settings || {}) };
}
async function saveSettings(patch) {
  const s = { ...(await getSettings()), ...patch };
  await store.set({ settings: s });
  return s;
}

// Open-market adjustment: added to PKR per USD.
function applyAdj(rates, adj) {
  const r = { ...rates };
  r.PKR = rates.PKR + (Number(adj) || 0);
  return r;
}

async function loadRates() {
  const { cache } = await store.get("cache");
  const s = await getSettings();
  let raw = BUILTIN_RATES, source = "builtin", updatedAt = null;
  if (cache && cache.rates) { raw = { ...BUILTIN_RATES, ...cache.rates }; source = "saved"; updatedAt = cache.updatedAt; }
  return { rates: applyAdj(raw, s.adj), raw, source, updatedAt };
}

function dayKey(ts) { return new Date(ts).toISOString().slice(0, 10); }

// Fetches live rates, saves cache and today's history entry. Throws if offline/failed.
async function fetchRates() {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 7000);
  try {
    const res = await fetch(API_URL, { signal: ctrl.signal });
    const data = await res.json();
    if (data.result !== "success" || !data.rates || !data.rates.PKR) throw new Error("bad data");
    const rates = {};
    for (const c of Object.keys(CURRENCIES)) if (data.rates[c]) rates[c] = data.rates[c];
    const now = Date.now();
    await store.set({ cache: { rates, updatedAt: now } });
    const { history } = await store.get("history");
    const h = history || {};
    h[dayKey(now)] = rates;
    const keys = Object.keys(h).sort();
    while (keys.length > 400) delete h[keys.shift()];
    await store.set({ history: h });
    return { rates, updatedAt: now };
  } finally { clearTimeout(timer); }
}

async function fetchGold() {
  const res = await fetch(GOLD_URL);
  const d = await res.json();
  const p = Number(d.price);
  if (!isFinite(p) || p <= 0) throw new Error("bad gold data");
  await store.set({ gold: { usdPerOz: p, updatedAt: Date.now(), manual: false } });
  return p;
}

function fmtNum(n) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: n < 1 ? 6 : 2 }).format(n);
}
function fmt0(n) { return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n); }
function fmtMoney(n, s) {
  let out = fmtNum(n);
  if (s && s.lakh && n >= 1e5) {
    out += n >= 1e7 ? ` (${(n / 1e7).toFixed(2)} ${tr(s.lang, "crore")})` : ` (${(n / 1e5).toFixed(2)} ${tr(s.lang, "lakh")})`;
  }
  return out;
}
function ago(ts, lang) {
  const m = Math.round((Date.now() - ts) / 60000);
  if (m < 1) return tr(lang, "justNow");
  if (m < 60) return tr(lang, "minAgo", { n: m });
  const h = Math.round(m / 60);
  if (h < 24) return tr(lang, "hrAgo", { n: h });
  return tr(lang, "dayAgo", { n: Math.round(h / 24) });
}

// "$50", "Rs 2,000", "AED 300", "1,200 SAR" -> {amount, cur}
function parsePrice(text) {
  const t = String(text || "").replace(/,/g, "").trim();
  const m = t.match(/(\d+(?:\.\d+)?)/);
  if (!m) return null;
  const amount = parseFloat(m[1]);
  let cur = null;
  const code = t.toUpperCase().match(/\b([A-Z]{3})\b/);
  if (code && CURRENCIES[code[1]]) cur = code[1];
  if (!cur) {
    const syms = [["Rs", "PKR"], ["₨", "PKR"], ["$", "USD"], ["€", "EUR"], ["£", "GBP"], ["₹", "INR"], ["¥", "JPY"]];
    for (const [sym, c] of syms) if (t.includes(sym)) { cur = c; break; }
  }
  return cur ? { amount, cur } : null;
}

// ----- Page helpers (only called from popup/dashboard) -----
function applyTheme(s) {
  const r = document.documentElement;
  r.dataset.theme = s.theme; r.dataset.palette = s.palette || "green";
  if (s.palette === "custom" && s.custom) r.style.setProperty("--p", s.custom);
  else r.style.removeProperty("--p");
}
function applyI18n(s) {
  const root = document.documentElement;
  root.lang = s.lang;
  root.dir = s.lang === "ur" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = tr(s.lang, el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-title]").forEach((el) => { el.title = tr(s.lang, el.dataset.i18nTitle); el.setAttribute("aria-label", el.title); });
}
const flagSrc = (c) => `flags/${CURRENCIES[c] ? CURRENCIES[c][1] : "pk"}.svg`;
const flagImg = (c) => `<img class="flag" src="${flagSrc(c)}" alt="" width="18" height="18">`;

// Fills a currency <select> and shows the country flag beside it (a native <option> cannot hold an image).
function fillSelect(sel, value) {
  sel.replaceChildren();
  for (const [code, [name]] of Object.entries(CURRENCIES)) {
    const o = document.createElement("option");
    o.value = code; o.textContent = code; o.title = name;
    sel.appendChild(o);
  }
  if (!sel.parentElement.classList.contains("cur")) {
    const wrap = document.createElement("span");
    wrap.className = "cur";
    sel.parentNode.insertBefore(wrap, sel);
    wrap.appendChild(sel);
    const img = document.createElement("img");
    img.className = "flag"; img.alt = ""; img.width = 18; img.height = 18;
    wrap.insertBefore(img, sel);
    const desc = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value");
    Object.defineProperty(sel, "value", {   // keeps the flag right when code sets .value
      configurable: true,
      get() { return desc.get.call(this); },
      set(v) { desc.set.call(this, v); img.src = flagSrc(this.value); }
    });
    sel.addEventListener("change", () => { img.src = flagSrc(sel.value); });
  }
  sel.value = value;
}

// ----- Palettes (colours must match style.css) -----
const PALETTES = ["green", "ocean", "purple", "sunset", "rose", "slate"];
const PALETTE_COLORS = { green: "#0F7B5C", ocean: "#1D4ED8", purple: "#6D28D9", sunset: "#C2410C", rose: "#BE123C", slate: "#334155" };
function renderSwatches(box, s, onPick, large) {
  let html = PALETTES.map((p) => {
    const name = tr(s.lang, "pal_" + p);
    return `<button type="button" class="sw${p === s.palette ? " on" : ""}${large ? " lg" : ""}" data-p="${p}" style="background:${PALETTE_COLORS[p]}" title="${name}" aria-label="${name}"></button>`;
  }).join("");
  if (large) { // the native colour picker closes the small popup, so it lives on the dashboard only
    const name = tr(s.lang, "customColour");
    html += `<input type="color" class="sw-color lg${s.palette === "custom" ? " on" : ""}" value="${s.custom || "#0F7B5C"}" title="${name}" aria-label="${name}">`;
  }
  setHTML(box, html);
  box.onclick = (e) => { const p = e.target.dataset.p; if (p) onPick(p); };
  const ci = box.querySelector(".sw-color");
  if (ci) ci.onchange = () => onPick("custom", ci.value);
}

// ----- Trend helpers -----
function seriesFor(H, from, to, days, adj) {
  const cutoff = Date.now() - days * 864e5, pts = [];
  for (const k of Object.keys(H).sort()) {
    if (new Date(k).getTime() < cutoff) continue;
    const r = applyAdj(H[k], adj);
    if (r[from] && r[to]) pts.push({ k, v: r[to] / r[from] });
  }
  return pts;
}
function trendOf(pts) {
  if (pts.length < 2) return null;
  const a = pts[0].v, b = pts[pts.length - 1].v, pct = (b - a) / a * 100;
  return { pct, dir: Math.abs(pct) < 0.1 ? "flat" : pct > 0 ? "up" : "down" };
}

// ----- Past rates (so the chart works from day one) -----
// Free community API with per-date snapshots (lowercase currency codes). Failed days are skipped.
async function fetchDay(date) {
  const urls = [
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/v1/currencies/usd.json`,
    `https://${date}.currency-api.pages.dev/v1/currencies/usd.json`
  ];
  for (const u of urls) {
    try {
      const res = await fetch(u);
      if (!res.ok) continue;
      const d = await res.json();
      if (!d.usd || !d.usd.pkr) continue;
      const rates = { USD: 1 };
      for (const c of Object.keys(CURRENCIES)) if (d.usd[c.toLowerCase()]) rates[c] = d.usd[c.toLowerCase()];
      return rates;
    } catch (e) { /* try next */ }
  }
  return null;
}
async function backfillHistory(days) {
  const { history } = await store.get("history");
  const have = history || {}, missing = [];
  for (let i = 1; i <= days; i++) { const k = dayKey(Date.now() - i * 864e5); if (!have[k]) missing.push(k); }
  const found = {};
  for (let i = 0; i < missing.length; i += 6) {
    const batch = missing.slice(i, i + 6);
    const res = await Promise.all(batch.map(fetchDay));
    res.forEach((r, j) => { if (r) found[batch[j]] = r; });
  }
  const added = Object.keys(found).length;
  if (added) {
    const fresh = (await store.get("history")).history || {};
    for (const k in found) if (!fresh[k]) fresh[k] = found[k];
    const keys = Object.keys(fresh).sort();
    while (keys.length > 400) delete fresh[keys.shift()];
    await store.set({ history: fresh });
  }
  return added;
}

// ----- "Is today a good day to send?" -----
function sendVerdict(H, from, to, adj) {
  const pts = seriesFor(H, from, to, 30, adj);
  if (pts.length < 5) return null;
  const cur = pts[pts.length - 1].v, prev = pts.slice(0, -1);
  const avg = prev.reduce((a, p) => a + p.v, 0) / prev.length, pct = (cur - avg) / avg * 100;
  return { pct, avg, cur, n: prev.length, dir: Math.abs(pct) < 0.3 ? "avg" : pct > 0 ? "good" : "low" };
}
function verdictText(v, s, toPKR) {
  if (!v) return tr(s.lang, "vNeed");
  const base = `${v.pct > 0 ? "+" : ""}${v.pct.toFixed(2)}% ${tr(s.lang, "vsAvg", { n: v.n })}`;
  if (!toPKR) return base;
  return `${tr(s.lang, v.dir === "good" ? "vGood" : v.dir === "low" ? "vLow" : "vAvg")} · ${base}`;
}

// ----- Quick calculator: "50 usd + 20 eur in pkr" -----
function parseCalc(text, rates) {
  const parts = String(text).toLowerCase().replace(/,/g, "").split(/\s+(?:in|to|ko)\s+/);
  const target = (parts[1] || "pkr").trim().toUpperCase();
  if (!CURRENCIES[target]) return null;
  const re = /([+-]?)\s*(\d+(?:\.\d+)?)\s*([a-z]{3})/g;
  let total = 0, ok = false, m;
  while ((m = re.exec(parts[0]))) {
    const cur = m[3].toUpperCase();
    if (!CURRENCIES[cur]) return null;
    const v = parseFloat(m[2]) * rates[target] / rates[cur];
    total += m[1] === "-" ? -v : v; ok = true;
  }
  return ok ? { total, target } : null;
}

async function fetchSilver() {
  const res = await fetch(SILVER_URL);
  const d = await res.json();
  const p = Number(d.price);
  if (!isFinite(p) || p <= 0) throw new Error("bad silver data");
  await store.set({ silver: { usdPerOz: p, updatedAt: Date.now() } });
  return p;
}

// ----- Safe rendering helpers -----
function esc(v) {
  return String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
// Parses markup in the context of `el` (so <tr>, <option> and SVG children work). Dynamic values must go through esc().
function setHTML(el, html) {
  const r = document.createRange();
  r.selectNodeContents(el);
  el.replaceChildren(r.createContextualFragment(html));
}

// ----- Validation of anything read back from storage or a backup file -----
const isCode = (c) => typeof c === "string" && Object.prototype.hasOwnProperty.call(CURRENCIES, c);
const numOr = (n, d) => (typeof n === "number" && isFinite(n) ? n : d);
function sanitizeFavs(a) {
  return (Array.isArray(a) ? a : []).filter((k) => typeof k === "string" && /^[A-Z]{3}>[A-Z]{3}$/.test(k) && isCode(k.slice(0, 3)) && isCode(k.slice(4))).slice(0, 6);
}
function sanitizeAlerts(a) {
  return (Array.isArray(a) ? a : [])
    .filter((x) => x && isCode(x.from) && isCode(x.to) && ["above", "below", "rise", "fall"].includes(x.cond) && isFinite(x.target) && x.target > 0 &&
      (x.cond === "above" || x.cond === "below" || numOr(x.base, 0) > 0))
    .slice(0, 50)
    .map((x) => ({ id: numOr(x.id, Date.now()), from: x.from, to: x.to, cond: x.cond, target: Number(x.target), base: numOr(x.base, 0), active: !!x.active, fired: !!x.fired }));
}
function sanitizeConv(a) {
  return (Array.isArray(a) ? a : []).filter((h) => h && isCode(h.from) && isCode(h.to) && isFinite(h.amount) && isFinite(h.out))
    .slice(0, 10).map((h) => ({ amount: Number(h.amount), from: h.from, to: h.to, out: Number(h.out) }));
}
function sanitizeRates(o) {
  const r = {};
  if (o && typeof o === "object") for (const c of Object.keys(CURRENCIES)) { const v = Number(o[c]); if (isFinite(v) && v > 0) r[c] = v; }
  return r;
}
function sanitizeHistory(o) {
  const out = {};
  if (!o || typeof o !== "object") return out;
  for (const k of Object.keys(o)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(k)) continue;
    const r = sanitizeRates(o[k]);
    if (r.PKR) out[k] = r;
  }
  return out;
}
function sanitizeHajj(o) {
  const out = {};
  for (const k of ["flight", "days", "nights", "hotel", "food", "trans", "other"]) out[k] = numOr(o && o[k], 0);
  return out;
}
function sanitizeBackup(o) {
  const out = {};
  if (!o || typeof o !== "object" || Array.isArray(o)) return out;
  if (o.settings && typeof o.settings === "object") {
    const s = o.settings, r = {};
    if (["en", "ur"].includes(s.lang)) r.lang = s.lang;
    if (["auto", "light", "dark"].includes(s.theme)) r.theme = s.theme;
    if (PALETTES.includes(s.palette) || s.palette === "custom") r.palette = s.palette;
    if (typeof s.custom === "string" && /^#[0-9a-fA-F]{6}$/.test(s.custom)) r.custom = s.custom;
    if (s.badge === "off" || (isCode(s.badge) && s.badge !== "PKR")) r.badge = s.badge;
    r.lakh = !!s.lakh; r.daily = !!s.daily; r.adj = numOr(s.adj, 0); r.myRate = numOr(s.myRate, 0);
    out.settings = r;
  }
  if (o.favs) out.favs = sanitizeFavs(o.favs);
  if (o.alerts) out.alerts = sanitizeAlerts(o.alerts);
  if (o.hajj) out.hajj = sanitizeHajj(o.hajj);
  if (o.convHistory) out.convHistory = sanitizeConv(o.convHistory);
  if (o.history) out.history = sanitizeHistory(o.history);
  if (o.prefs && isCode(o.prefs.from) && isCode(o.prefs.to)) out.prefs = { amount: String(parseFloat(o.prefs.amount) || 1000), from: o.prefs.from, to: o.prefs.to };
  for (const k of ["gold", "silver"]) {
    if (o[k] && isFinite(o[k].usdPerOz) && o[k].usdPerOz > 0) out[k] = { usdPerOz: Number(o[k].usdPerOz), updatedAt: numOr(o[k].updatedAt, Date.now()), manual: !!o[k].manual };
  }
  if (o.cache && o.cache.rates) { const r = sanitizeRates(o.cache.rates); if (r.PKR) out.cache = { rates: r, updatedAt: numOr(o.cache.updatedAt, Date.now()) }; }
  return out;
}
