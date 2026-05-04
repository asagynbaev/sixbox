/* SixBox — Firebase init + Programs CRUD helpers + default seed data
   Loaded as a regular script (not text/babel) so initialization runs first. */

const firebaseConfig = {
  apiKey: "AIzaSyBMxckONVayBt0LEsxXLpxqbHg2ZK9QVYE",
  authDomain: "mymall-d8071.firebaseapp.com",
  projectId: "mymall-d8071",
  storageBucket: "mymall-d8071.firebasestorage.app",
  messagingSenderId: "627861735930",
  appId: "1:627861735930:web:99f6f535757e8a3915bc43",
  measurementId: "G-EVJ0V9FE28",
};

if (typeof firebase !== "undefined" && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = (typeof firebase !== "undefined") ? firebase.firestore() : null;
const auth = (typeof firebase !== "undefined" && firebase.auth) ? firebase.auth() : null;
if (auth) {
  // Persist user across reloads
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(() => {});
}

// ---------- Phone Auth helpers ----------
const AuthApi = {
  // Subscribe to user changes. Returns unsubscribe.
  onChange(cb) {
    if (!auth) { cb(null); return () => {}; }
    return auth.onAuthStateChanged(cb);
  },
  current() {
    return auth ? auth.currentUser : null;
  },
  // Build/refresh invisible reCAPTCHA tied to a DOM element.
  // Pass an element id (string) or DOM node.
  ensureRecaptcha(containerIdOrEl) {
    if (!auth) throw new Error("Firebase Auth не инициализирован");
    // Tear down previous verifier if any
    if (window._recaptcha) {
      try { window._recaptcha.clear(); } catch (e) { /* ignore */ }
      window._recaptcha = null;
    }
    // Resolve container, then wipe its children so reCAPTCHA can render fresh
    const el = typeof containerIdOrEl === "string"
      ? document.getElementById(containerIdOrEl)
      : containerIdOrEl;
    if (el?.innerHTML) el.innerHTML = "";
    if (!el) throw new Error("Контейнер reCAPTCHA не найден");

    window._recaptcha = new firebase.auth.RecaptchaVerifier(el, {
      size: "invisible",
      callback: () => {},
      "expired-callback": () => {
        try { window._recaptcha && window._recaptcha.clear(); } catch (e) { /* ignore */ }
        window._recaptcha = null;
      },
    });
    return window._recaptcha;
  },
  // Send SMS. phone must be E.164 like "+996555612612".
  async sendCode(phoneE164, recaptchaVerifier) {
    if (!auth) throw new Error("Firebase Auth не инициализирован");
    if (!recaptchaVerifier) throw new Error("reCAPTCHA не инициализирован");
    const result = await auth.signInWithPhoneNumber(phoneE164, recaptchaVerifier);
    window._confirmationResult = result;
    return result;
  },
  async confirmCode(code) {
    if (!window._confirmationResult) throw new Error("Сначала отправьте SMS-код");
    const cred = await window._confirmationResult.confirm(code);
    return cred.user;
  },
  async signOut() {
    if (!auth) return;
    await auth.signOut();
    window._confirmationResult = null;
  },
};

// ---------- CRUD helpers (programs) ----------
const ProgramsApi = {
  async list() {
    if (!db) return [];
    const snap = await db.collection("programs").orderBy("order", "asc").get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },
  watch(cb) {
    if (!db) return () => {};
    return db.collection("programs").orderBy("order", "asc").onSnapshot(snap => {
      cb(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, err => {
      console.error("[ProgramsApi.watch]", err);
      cb(null, err);
    });
  },
  async create(data) {
    if (!db) throw new Error("Firebase не инициализирован");
    return db.collection("programs").add({
      ...data,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  },
  async update(id, data) {
    if (!db) throw new Error("Firebase не инициализирован");
    return db.collection("programs").doc(id).set(data, { merge: true });
  },
  async remove(id) {
    if (!db) throw new Error("Firebase не инициализирован");
    return db.collection("programs").doc(id).delete();
  },
  async seed(programs) {
    if (!db) throw new Error("Firebase не инициализирован");
    const batch = db.batch();
    programs.forEach(p => {
      const ref = db.collection("programs").doc(p.id);
      batch.set(ref, { ...p });
    });
    return batch.commit();
  },
  async clear() {
    if (!db) throw new Error("Firebase не инициализирован");
    const snap = await db.collection("programs").get();
    const batch = db.batch();
    snap.docs.forEach(d => batch.delete(d.ref));
    return batch.commit();
  },
};

// ---------- Default programs (seeded from screenshots) ----------
const DEFAULT_PROGRAMS = [
  {
    id: "business-lunch",
    name: "BUSINESS LUNCH",
    tagline: "Обеды на работу",
    kcal: 640,
    kcalLabel: "630–650 ккал",
    mealsCount: 3,
    mealsLabel: "3 приёма в течение дня",
    meals: [
      "Обед 1е (попеременно салаты и супы)",
      "Обед 2е (горячее мясное блюдо из индейки, курицы, говядины или рыбки)",
      "Вечерний перекус (салатики)",
    ],
    prices: [
      { label: "на 1 день",         days: 1,  price: 950,    discount: 0  },
      { label: "на неделю (6 дней)", days: 6,  price: 5130,   discount: 10 },
      { label: "на месяц (24 дня)",  days: 24, price: 20000,  discount: 12 },
      { label: "на месяц (30 дней)", days: 30, price: 25080,  discount: 12 },
    ],
    color: "var(--lime-300)",
    order: 1,
  },
  {
    id: "business-lunch-x2",
    name: "BUSINESS LUNCH X2",
    tagline: "Усиленные обеды",
    kcal: 875,
    kcalLabel: "850–900 ккал",
    mealsCount: 3,
    mealsLabel: "Двойная порция мяса",
    meals: [
      "Обед 1е (супы)",
      "Обед 2е (горячее мясное блюдо из индейки, курицы, говядины или рыбки)",
      "Ужин (горячее мясное блюдо)",
    ],
    prices: [
      { label: "на 1 день",         days: 1,  price: 1050,   discount: 0  },
      { label: "на неделю (6 дней)", days: 6,  price: 5670,   discount: 10 },
      { label: "на месяц (24 дня)",  days: 24, price: 22100,  discount: 12 },
      { label: "на месяц (30 дней)", days: 30, price: 27720,  discount: 12 },
    ],
    color: "var(--lime-300)",
    order: 2,
  },
  {
    id: "fit-lite",
    name: "FIT LITE",
    tagline: "Лёгкое похудение",
    kcal: 1000,
    kcalLabel: "1000 ккал в день",
    mealsCount: 5,
    mealsLabel: "5ти разовое дробное питание на весь день",
    meals: [
      "Завтрак (творог, омлет, каши на молоке)",
      "Обед 1е (супы)",
      "Обед 2е (горячее мясное блюдо из индейки, курицы, говядины или рыбки)",
      "Вечерний перекус (салатики)",
      "Ужин (горячее мясное блюдо)",
    ],
    prices: [
      { label: "на 1 день",         days: 1,  price: 1330,   discount: 0  },
      { label: "на неделю (6 дней)", days: 6,  price: 7200,   discount: 10 },
      { label: "на месяц (24 дня)",  days: 24, price: 28000,  discount: 12 },
      { label: "на месяц (30 дней)", days: 30, price: 35100,  discount: 12 },
    ],
    color: "var(--green-500)",
    order: 3,
  },
  {
    id: "fit",
    name: "FIT",
    tagline: "Активное похудение",
    kcal: 1200,
    kcalLabel: "1200 ккал в день",
    mealsCount: 6,
    mealsLabel: "6ти разовое дробное питание на весь день",
    meals: [
      "Завтрак (творог, омлет, каши на молоке)",
      "Утренний перекус (пп выпечка и 2 дня фрукты)",
      "Обед 1е (супы)",
      "Обед 2е (горячее мясное блюдо из индейки, курицы, говядины или рыбки)",
      "Вечерний перекус (салатики)",
      "Ужин (горячее мясное блюдо)",
    ],
    prices: [
      { label: "на 1 день",         days: 1,  price: 1380,   discount: 0  },
      { label: "на неделю (6 дней)", days: 6,  price: 7450,   discount: 10 },
      { label: "на месяц (24 дня)",  days: 24, price: 29150,  discount: 12 },
      { label: "на месяц (30 дней)", days: 30, price: 36400,  discount: 12 },
    ],
    color: "var(--green-500)",
    order: 4,
  },
  {
    id: "balance-lite",
    name: "BALANCE LITE",
    tagline: "Лёгкое поддержание",
    kcal: 1500,
    kcalLabel: "1500 ккал в день",
    mealsCount: 6,
    mealsLabel: "6ти разовое дробное питание на весь день",
    meals: [
      "Завтрак (творог, омлет, каши на молоке)",
      "Утренний перекус (пп выпечка)",
      "Обед 1е (супы)",
      "Обед 2е (горячее мясное блюдо из индейки, курицы, говядины или рыбки)",
      "Вечерний перекус (салатики)",
      "Ужин (горячее мясное блюдо)",
    ],
    prices: [
      { label: "на 1 день",         days: 1,  price: 1480,   discount: 0  },
      { label: "на неделю (6 дней)", days: 6,  price: 8000,   discount: 10 },
      { label: "на месяц (24 дня)",  days: 24, price: 31200,  discount: 12 },
      { label: "на месяц (30 дней)", days: 30, price: 39000,  discount: 12 },
    ],
    color: "var(--green-400)",
    order: 5,
  },
  {
    id: "balance",
    name: "BALANCE",
    tagline: "Сбалансированное поддержание",
    kcal: 1800,
    kcalLabel: "1800 ккал в день",
    mealsCount: 6,
    mealsLabel: "6ти разовое дробное питание на весь день",
    meals: [
      "Завтрак (творог, омлет, каши на молоке)",
      "Утренний перекус (пп выпечка)",
      "Обед 1е (супы)",
      "Обед 2е (горячее мясное блюдо из индейки, курицы, говядины или рыбки)",
      "Вечерний перекус (салатики)",
      "Ужин (горячее мясное блюдо)",
    ],
    prices: [
      { label: "на 1 день",         days: 1,  price: 1580,   discount: 0  },
      { label: "на неделю (6 дней)", days: 6,  price: 8500,   discount: 10 },
      { label: "на месяц (24 дня)",  days: 24, price: 33400,  discount: 12 },
      { label: "на месяц (30 дней)", days: 30, price: 41700,  discount: 12 },
    ],
    color: "var(--green-400)",
    order: 6,
  },
  {
    id: "power",
    name: "POWER",
    tagline: "Набор массы",
    kcal: 2500,
    kcalLabel: "2500 ккал в день",
    mealsCount: 7,
    mealsLabel: "7ми разовое дробное питание на весь день",
    meals: [
      "Завтрак (творог, омлет, каши на молоке)",
      "Утренний перекус (пп выпечка)",
      "Обед 1е (супы)",
      "Обед 2е (горячее мясное блюдо из индейки, курицы, говядины или рыбки)",
      "Вечерний перекус (салатики)",
      "Полдник (горячее мясное блюдо из индейки, курицы и говядины)",
      "Ужин (горячее мясное блюдо)",
    ],
    prices: [
      { label: "на 1 день",         days: 1,  price: 1680,   discount: 0  },
      { label: "на неделю (6 дней)", days: 6,  price: 9000,   discount: 10 },
      { label: "на месяц (24 дня)",  days: 24, price: 35500,  discount: 12 },
      { label: "на месяц (30 дней)", days: 30, price: 44300,  discount: 12 },
    ],
    color: "var(--orange-500)",
    order: 7,
  },
  {
    id: "power-x2",
    name: "POWER X2",
    tagline: "Силовой набор массы",
    kcal: 3000,
    kcalLabel: "3000 ккал в день",
    mealsCount: 8,
    mealsLabel: "8ми разовое дробное питание на весь день",
    meals: [
      "Завтрак (творог, омлет, каши на молоке)",
      "Утренний перекус (пп выпечка)",
      "Ланч (свежие фрукты)",
      "Обед 1е (супы)",
      "Обед 2е (горячее мясное блюдо из индейки, курицы, говядины или рыбки)",
      "Вечерний перекус (салатики)",
      "Полдник (горячее мясное блюдо)",
      "Ужин (горячее мясное блюдо)",
    ],
    prices: [
      { label: "на 1 день",         days: 1,  price: 1880,   discount: 0  },
      { label: "на неделю (6 дней)", days: 6,  price: 10100,  discount: 10 },
      { label: "на месяц (24 дня)",  days: 24, price: 39700,  discount: 12 },
      { label: "на месяц (30 дней)", days: 30, price: 49600,  discount: 12 },
    ],
    color: "var(--orange-500)",
    order: 8,
  },
  {
    id: "home-food",
    name: "ДОМАШНЯЯ ЕДА",
    tagline: "Простое домашнее меню",
    kcal: 2000,
    kcalLabel: "2000 ккал в день",
    mealsCount: 4,
    mealsLabel: "4 приёма как у мамы дома",
    meals: [
      "Завтрак — омлеты, запеканки, каши",
      "Ланч — разнообразные десерты",
      "Обед — горячее мясное блюдо из индейки, куриной грудки, говядины, рыбки",
      "Ужин — горячее мясное блюдо из индейки, куриной грудки, говядины, рыбки",
    ],
    prices: [
      { label: "на 1 день",         days: 1,  price: 1480,   discount: 0  },
      { label: "на неделю (6 дней)", days: 6,  price: 8000,   discount: 10 },
      { label: "на месяц (24 дня)",  days: 24, price: 31200,  discount: 12 },
    ],
    color: "var(--orange-400)",
    order: 9,
  },
];

window.firebaseDb = db;
window.firebaseAuth = auth;
window.ProgramsApi = ProgramsApi;
window.AuthApi = AuthApi;
window.DEFAULT_PROGRAMS = DEFAULT_PROGRAMS;
