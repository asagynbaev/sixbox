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

// ---------- Users / profile / cart ----------
// users/{uid} = { phone, name, createdAt, updatedAt, cart: [], subscription: null }
const UsersApi = {
  ref(uid) { return db && uid ? db.collection("users").doc(uid) : null; },

  async ensure(user) {
    // Create profile doc if missing. Called right after sign-in.
    if (!user || !db) return null;
    const r = this.ref(user.uid);
    const snap = await r.get();
    if (!snap.exists) {
      await r.set({
        phone: user.phoneNumber || null,
        name: "",
        cart: [],
        subscription: null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      const fresh = await r.get();
      return { id: fresh.id, ...fresh.data() };
    }
    return { id: snap.id, ...snap.data() };
  },

  watch(uid, cb) {
    if (!db || !uid) { cb(null); return () => {}; }
    return this.ref(uid).onSnapshot(snap => {
      cb(snap.exists ? { id: snap.id, ...snap.data() } : null);
    }, err => {
      console.error("[UsersApi.watch]", err);
      cb(null, err);
    });
  },

  async update(uid, patch) {
    if (!db || !uid) throw new Error("Нет uid");
    return this.ref(uid).set({
      ...patch,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  },

  async addToCart(uid, item) {
    if (!db || !uid) throw new Error("Нет uid");
    // Use set+merge so it works even if the user doc doesn't exist yet.
    return this.ref(uid).set({
      cart: firebase.firestore.FieldValue.arrayUnion({
        ...item,
        _id: item._id || (Date.now() + "_" + Math.random().toString(36).slice(2, 7)),
      }),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  },

  async removeFromCart(uid, itemId) {
    if (!db || !uid) throw new Error("Нет uid");
    const snap = await this.ref(uid).get();
    const cart = snap.data()?.cart || [];
    return this.ref(uid).set({
      cart: cart.filter(i => i._id !== itemId),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  },

  async clearCart(uid) {
    if (!db || !uid) throw new Error("Нет uid");
    return this.ref(uid).set({
      cart: [],
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  },
};

// ---------- Generic CRUD factory ----------
function makeApi(collectionName, orderField = "order") {
  return {
    collection: collectionName,
    async list() {
      if (!db) return [];
      const snap = await db.collection(collectionName).orderBy(orderField, "asc").get();
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },
    watch(cb) {
      if (!db) return () => {};
      return db.collection(collectionName).orderBy(orderField, "asc").onSnapshot(snap => {
        cb(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }, err => {
        console.error(`[${collectionName}.watch]`, err);
        cb(null, err);
      });
    },
    async create(data) {
      if (!db) throw new Error("Firebase не инициализирован");
      return db.collection(collectionName).add({
        ...data,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    },
    async update(id, data) {
      if (!db) throw new Error("Firebase не инициализирован");
      return db.collection(collectionName).doc(id).set(data, { merge: true });
    },
    async remove(id) {
      if (!db) throw new Error("Firebase не инициализирован");
      return db.collection(collectionName).doc(id).delete();
    },
    async seed(items) {
      if (!db) throw new Error("Firebase не инициализирован");
      const batch = db.batch();
      items.forEach(item => {
        const id = item.id || db.collection(collectionName).doc().id;
        const ref = db.collection(collectionName).doc(id);
        batch.set(ref, { ...item });
      });
      return batch.commit();
    },
    async clear() {
      if (!db) throw new Error("Firebase не инициализирован");
      const snap = await db.collection(collectionName).get();
      const batch = db.batch();
      snap.docs.forEach(d => batch.delete(d.ref));
      return batch.commit();
    },
  };
}

const ProgramsApi     = makeApi("programs");
const MealsApi        = makeApi("meals");
const FaqApi          = makeApi("faq");
const TestimonialsApi = makeApi("testimonials");
const PostsApi        = makeApi("posts");

// Settings is a single doc, not a collection
const SettingsApi = {
  ref() { return db ? db.collection("settings").doc("main") : null; },
  async get() {
    if (!db) return null;
    const snap = await this.ref().get();
    return snap.exists ? snap.data() : null;
  },
  watch(cb) {
    if (!db) { cb(null); return () => {}; }
    return this.ref().onSnapshot(snap => {
      cb(snap.exists ? snap.data() : null);
    }, err => {
      console.error("[settings.watch]", err);
      cb(null, err);
    });
  },
  async update(data) {
    if (!db) throw new Error("Firebase не инициализирован");
    return this.ref().set({
      ...data,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  },
  async seed(data) {
    if (!db) throw new Error("Firebase не инициализирован");
    return this.ref().set(data);
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

// ---------- Default meals for /menu page ----------
const DEFAULT_MEALS = [
  { id: "m1",  type: "Завтрак", title: "Овсянка с ягодами и миндалём", kcal: 320, p: 12, f: 8,  c: 52, kind: "oats",          tag: "loss",    order: 1 },
  { id: "m2",  type: "Завтрак", title: "Сырники с творогом 5%",        kcal: 290, p: 22, f: 6,  c: 38, kind: "dessert",       tag: "balance", order: 2 },
  { id: "m3",  type: "Завтрак", title: "Гранола с йогуртом и манго",   kcal: 380, p: 14, f: 10, c: 60, kind: "oats",          tag: "gain",    order: 3 },
  { id: "m4",  type: "Перекус", title: "Протеиновый смузи манго‑шпинат", kcal: 220, p: 24, f: 4,  c: 24, kind: "smoothie",      tag: "balance", order: 4 },
  { id: "m5",  type: "Перекус", title: "Хумус с овощным пико",         kcal: 180, p: 8,  f: 9,  c: 18, kind: "salad",         tag: "loss",    order: 5 },
  { id: "m6",  type: "Обед",    title: "Курица терияки с диким рисом", kcal: 480, p: 38, f: 14, c: 42, kind: "chicken-rice",  tag: "balance", order: 6 },
  { id: "m7",  type: "Обед",    title: "Боул с тофу, киноа и эдамаме", kcal: 460, p: 28, f: 16, c: 48, kind: "tofu-quinoa",   tag: "loss",    order: 7 },
  { id: "m8",  type: "Обед",    title: "Говядина с булгуром и овощами гриль", kcal: 580, p: 42, f: 22, c: 50, kind: "beef-bowl", tag: "gain", order: 8 },
  { id: "m9",  type: "Ужин",    title: "Лосось су‑вид с киноа",        kcal: 420, p: 36, f: 18, c: 28, kind: "salmon-greens", tag: "balance", order: 9 },
  { id: "m10", type: "Ужин",    title: "Зелёный салат с креветкой",    kcal: 380, p: 30, f: 14, c: 22, kind: "salad",         tag: "loss",    order: 10 },
  { id: "m11", type: "Ужин",    title: "Индейка с бататом и брокколи", kcal: 540, p: 40, f: 16, c: 56, kind: "chicken-rice",  tag: "gain",    order: 11 },
  { id: "m12", type: "Десерт",  title: "Чиа‑пудинг с кокосом",         kcal: 180, p: 6,  f: 8,  c: 22, kind: "dessert",       tag: "balance", order: 12 },
];

const DEFAULT_FAQ = [
  { id: "q1", q: "Можно ли заказать только на один день?", a: "Да, есть пробный день за 765 сом со скидкой 10%. Это полноценные 5 приёмов пищи на ваш выбранный план.", order: 1 },
  { id: "q2", q: "Как происходит доставка?", a: "Привозим утром (06:00–09:00) свежий бокс на день — или вечером (19:00–22:00) на следующий день. Курьер не звонит, оставляет у двери, пишет в WhatsApp.", order: 2 },
  { id: "q3", q: "Что если у меня аллергия или непереносимость?", a: "Мы заменяем продукты в рамках КБЖУ. Аллергены отмечаем в карточке каждого блюда. При сложных диетах — индивидуальный план с диетологом.", order: 3 },
  { id: "q4", q: "Можно ли пропустить день или поставить на паузу?", a: "Да, в личном кабинете. Пропущенные дни добавляются к концу подписки или возвращаются на баланс.", order: 4 },
  { id: "q5", q: "Как оплачивается заказ?", a: "Картой онлайн, через Optima/MBank, либо переводом по реквизитам. Для подписок 1+ месяцев — рассрочка 0% от партнёрских банков.", order: 5 },
  { id: "q6", q: "Куда вы доставляете в Бишкеке?", a: "По всему городу в пределах объездной. За пределами — стоимость рассчитывается отдельно.", order: 6 },
];

const DEFAULT_TESTIMONIALS = [
  { id: "t1", name: "Айгуль", age: 32, lost: "−12 кг за 4 месяца", quote: "Перестала готовить вечером — теперь это время с детьми. И минус 12 кг за 4 месяца, без срывов.", plan: "Похудение, 4 мес.", order: 1 },
  { id: "t2", name: "Эрнис",  age: 28, lost: "+6 кг мышц",          quote: "Тренируюсь 5 раз в неделю. С SixBox перестал считать БЖУ и готовить — больше сил на тренировки.", plan: "Набор массы, 6 мес.", order: 2 },
  { id: "t3", name: "Бегайым", age: 41, lost: "−8 кг и кожа",        quote: "Удивил эффект на коже и волосах. Это не диета, это просто сбалансированно.", plan: "Поддержание, 1 год", order: 3 },
];

const DEFAULT_POSTS = [
  { id: "p1", tag: "Питание", title: "5 мифов о белке, в которые до сих пор верят", date: "2 мая 2026", read: "6 мин", excerpt: "Сколько белка реально нужно в день, можно ли его «передозировать» и почему растительный — не хуже.", order: 1 },
  { id: "p2", tag: "Готовка", title: "Зачем мы готовим су‑вид и что это даёт", date: "28 апреля 2026", read: "4 мин", excerpt: "Низкая температура, вакуум и точное время — почему такая курица сочнее, а лосось не сухой.", order: 2 },
  { id: "p3", tag: "Клиенты", title: "История Айгуль: −12 кг за 4 месяца на «Поддержании»", date: "21 апреля 2026", read: "7 мин", excerpt: "Без жёстких диет и срывов. Что меняли, что добавляли, и почему вес не вернулся.", order: 3 },
  { id: "p4", tag: "Кухня",   title: "Один день на кухне SixBox: от 5 утра до отгрузки", date: "14 апреля 2026", read: "5 мин", excerpt: "Закупка, контроль качества, готовка, упаковка, передача курьерам — всё за 6 часов.", order: 4 },
  { id: "p5", tag: "Питание", title: "Холодильник доверия: как мы его придумали", date: "5 апреля 2026", read: "3 мин", excerpt: "Идея пришла из спортзала. Теперь автономные холодильники стоят в 8 точках Бишкека.", order: 5 },
  { id: "p6", tag: "Клиенты", title: "Корпоративный SixBox: как мы кормим офисы", date: "30 марта 2026", read: "5 мин", excerpt: "Меню, скидки от 15 человек, настройка под пищевые ограничения сотрудников.", order: 6 },
];

const DEFAULT_SETTINGS = {
  phone: "+996 555 612 612",
  phoneTel: "+996555612612",
  email: "hello@sixbox.kg",
  address: "Бишкек, ул. Ибраимова 115",
  workingHours: "Каждый день, 8:00 — 22:00",
  instagram: "https://instagram.com/sixbox.kg",
  telegram: "https://t.me/sixbox_kg",
  whatsapp: "https://wa.me/996555612612",
  copyright: "© 2026 SixBox · perfect meals since 2017",
};

window.firebaseDb = db;
window.firebaseAuth = auth;
window.ProgramsApi = ProgramsApi;
window.MealsApi = MealsApi;
window.FaqApi = FaqApi;
window.TestimonialsApi = TestimonialsApi;
window.PostsApi = PostsApi;
window.SettingsApi = SettingsApi;
window.AuthApi = AuthApi;
window.UsersApi = UsersApi;
window.DEFAULT_PROGRAMS = DEFAULT_PROGRAMS;
window.DEFAULT_MEALS = DEFAULT_MEALS;
window.DEFAULT_FAQ = DEFAULT_FAQ;
window.DEFAULT_TESTIMONIALS = DEFAULT_TESTIMONIALS;
window.DEFAULT_POSTS = DEFAULT_POSTS;
window.DEFAULT_SETTINGS = DEFAULT_SETTINGS;
