/* SixBox — secondary info pages: Blog, About, Kitchen, Careers, Partners, Delivery, Allergens, Legal */

// ---------- Shared building blocks ----------
function PageHero({ eyebrow, title, sub, accent = "var(--green-700)", bg = "var(--cream)", color = "var(--ink)" }) {
  return (
    <section style={{ background: bg, color, padding: "96px 0 56px" }}>
      <div className="container">
        <div className="h-eyebrow" style={{ color: accent }}>{eyebrow}</div>
        <h1 className="h-display" style={{ fontSize: "clamp(48px, 6vw, 88px)", margin: "12px 0 0", maxWidth: "16ch" }}>{title}</h1>
        {sub && (
          <p style={{ marginTop: 22, fontSize: 18, color: bg === "var(--cream)" || bg === "var(--paper)" ? "var(--muted)" : "rgba(255,255,255,.75)", maxWidth: 620, lineHeight: 1.55 }}>{sub}</p>
        )}
      </div>
    </section>
  );
}

function CallToAction({ title, sub, btn = "Оформить подписку", to = "constructor" }) {
  return (
    <section style={{ background: "var(--green-700)", color: "#fff", padding: "72px 0" }}>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 40, flexWrap: "wrap" }}>
        <div>
          <h2 className="h-display" style={{ fontSize: "clamp(32px, 4vw, 56px)", margin: 0 }}>{title}</h2>
          {sub && <p style={{ marginTop: 14, fontSize: 16, opacity: 0.8, maxWidth: 520, lineHeight: 1.5 }}>{sub}</p>}
        </div>
        <button className="btn btn-primary" style={{ padding: "18px 28px" }} onClick={() => window.go?.(to)}>
          {btn}
          {Icons.arrow}
        </button>
      </div>
    </section>
  );
}

// ============================================================
// BLOG PAGE
// ============================================================
function BlogPage() {
  const posts = [
    { tag: "Питание", title: "5 мифов о белке, в которые до сих пор верят", date: "2 мая 2026", read: "6 мин", excerpt: "Сколько белка реально нужно в день, можно ли его «передозировать» и почему растительный — не хуже." },
    { tag: "Готовка", title: "Зачем мы готовим су‑вид и что это даёт", date: "28 апреля 2026", read: "4 мин", excerpt: "Низкая температура, вакуум и точное время — почему такая курица сочнее, а лосось не сухой." },
    { tag: "Клиенты", title: "История Айгуль: −12 кг за 4 месяца на «Поддержании»", date: "21 апреля 2026", read: "7 мин", excerpt: "Без жёстких диет и срывов. Что меняли, что добавляли, и почему вес не вернулся." },
    { tag: "Кухня", title: "Один день на кухне SixBox: от 5 утра до отгрузки", date: "14 апреля 2026", read: "5 мин", excerpt: "Закупка, контроль качества, готовка, упаковка, передача курьерам — всё за 6 часов." },
    { tag: "Питание", title: "Холодильник доверия: как мы его придумали", date: "5 апреля 2026", read: "3 мин", excerpt: "Идея пришла из спортзала. Теперь автономные холодильники стоят в 8 точках Бишкека." },
    { tag: "Клиенты", title: "Корпоративный SixBox: как мы кормим офисы", date: "30 марта 2026", read: "5 мин", excerpt: "Меню, скидки от 15 человек, настройка под пищевые ограничения сотрудников." },
  ];
  const colors = ["var(--lime-300)", "var(--orange-500)", "#7fb87f", "var(--lime-300)", "var(--orange-500)", "#7fb87f"];
  return (
    <>
      <PageHero
        eyebrow="Блог"
        title="Истории еды, привычек и людей"
        sub="Что мы готовим, как, для кого. Простыми словами — и без занудства про БЖУ."
      />
      <section className="section" style={{ background: "var(--paper)", paddingTop: 32 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {posts.map((p, i) => (
              <article key={p.title} className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{
                  width: "100%", aspectRatio: "16/10", borderRadius: 14, position: "relative", overflow: "hidden",
                  background: `linear-gradient(135deg, ${colors[i]} 0%, var(--green-900) 120%)`,
                }}>
                  <div style={{ position: "absolute", top: 14, left: 14, fontSize: 11, fontFamily: "var(--font-mono)", color: "rgba(255,255,255,.7)" }}>SIX_BOX_BLOG_{(i + 1).toString().padStart(2, "0")}</div>
                </div>
                <div className="chip" style={{ alignSelf: "flex-start" }}>{p.tag}</div>
                <h3 className="h-title" style={{ fontSize: 22, margin: 0 }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.55, margin: 0 }}>{p.excerpt}</p>
                <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px dashed var(--line)", display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)" }}>
                  <span>{p.date}</span>
                  <span>{p.read} чтения</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CallToAction title="Хотите, чтобы такие истории были у вас?" sub="Начните с пробного дня — 765 сом за 5 приёмов пищи на любой план." btn="Попробовать день" to="constructor" />
      <Footer />
    </>
  );
}

// ============================================================
// ABOUT PAGE
// ============================================================
function AboutPage() {
  const values = [
    { t: "Честные продукты", d: "Закупаемся у проверенных фермеров Чуйской долины. Сертификаты — на каждую партию." },
    { t: "Без сахара и усилителей", d: "Никакого глутамата, фруктозного сиропа и трансжиров. Натуральные специи — основа вкуса." },
    { t: "Шеф, а не конвейер", d: "Каждое блюдо проходит через руки шефа. Никаких автоматических линий заморозки." },
    { t: "Прозрачность", d: "КБЖУ, аллергены, состав — на упаковке. Кухню можно посетить по записи." },
  ];
  const milestones = [
    { y: "2017", t: "Старт в одной кухне", d: "Шеф Эльдар и его жена Айдай готовят 30 боксов в день для друзей из спортзала." },
    { y: "2019", t: "Первая своя кухня", d: "Открыли цех на 200 м² на Ибраимова. Команда выросла до 12 человек." },
    { y: "2022", t: "Холодильник доверия", d: "Запустили первые 3 точки самовывоза с автономными холодильниками." },
    { y: "2025", t: "12 000 клиентов", d: "Кормим Бишкек ежедневно. Открыли направления B2B и корпоративные ужины." },
  ];
  return (
    <>
      <PageHero
        eyebrow="О нас"
        title="9 лет готовим то, что едим сами"
        sub="SixBox — это не стартап и не маркетинговая обёртка. Это кухня, диетолог и логистика, выросшие из домашней привычки готовить впрок."
        bg="var(--green-900)"
        color="#fff"
        accent="var(--lime-300)"
      />
      <section className="section" style={{ background: "var(--paper)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
            <div>
              <SectionHeader eyebrow="Наша миссия" title="Сделать здоровое питание стандартом, а не подвигом" sub="Большинство людей хотят есть хорошо, но не хотят посвящать этому 2 часа в день. Мы убираем эти 2 часа." />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {values.map(v => (
                <div key={v.t} className="card" style={{ padding: 22 }}>
                  <div className="h-title" style={{ fontSize: 18 }}>{v.t}</div>
                  <p style={{ marginTop: 10, fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>{v.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="container">
          <SectionHeader eyebrow="Хронология" title="Как мы росли" />
          <div style={{ marginTop: 48, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {milestones.map(m => (
              <div key={m.y} style={{ borderTop: "2px solid var(--green-700)", paddingTop: 18 }}>
                <div className="h-display" style={{ fontSize: 36, color: "var(--green-700)" }}>{m.y}</div>
                <div className="h-title" style={{ fontSize: 18, marginTop: 10 }}>{m.t}</div>
                <p style={{ marginTop: 10, fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{m.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Team />
      <CallToAction title="Готовы попробовать?" btn="Собрать рацион" to="constructor" />
      <Footer />
    </>
  );
}

// ============================================================
// KITCHEN PAGE
// ============================================================
function KitchenPage() {
  const stats = [
    { v: "200 м²", l: "цех на Ибраимова" },
    { v: "5:00", l: "начинаем готовить" },
    { v: "9:00", l: "первая отгрузка" },
    { v: "0", l: "заморозок и полуфабрикатов" },
  ];
  const equipment = [
    { t: "Конвекционные печи Rational", d: "Точная температура и пар — мясо, рыба, овощи готовятся равномерно." },
    { t: "Су‑вид станции", d: "Низкая температура, вакуум, точное время. Лосось 52° / 18 мин — идеально." },
    { t: "Шоковая заморозка", d: "Используем только для соусов‑заготовок. Готовые блюда никогда не замораживаем." },
    { t: "Лаборатория КБЖУ", d: "Каждое блюдо взвешивается, состав фиксируется. Нутрициолог проверяет КБЖУ." },
  ];
  return (
    <>
      <PageHero eyebrow="Кухня" title="Где готовится ваш рацион" sub="Цех на 200 м² в центре Бишкека. Открыт для посещения по записи: можно увидеть процесс от сырья до упаковки." accent="var(--orange-600)" />
      <section className="section" style={{ background: "var(--paper)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 56 }}>
            {stats.map(s => (
              <div key={s.l} className="card" style={{ padding: 24, textAlign: "center" }}>
                <div className="h-display" style={{ fontSize: 44, color: "var(--green-700)" }}>{s.v}</div>
                <div style={{ marginTop: 8, fontSize: 13, color: "var(--muted)" }}>{s.l}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {equipment.map(e => (
              <div key={e.t} className="card" style={{ padding: 28 }}>
                <div className="h-title" style={{ fontSize: 22 }}>{e.t}</div>
                <p style={{ marginTop: 12, fontSize: 14, color: "var(--muted)", lineHeight: 1.55 }}>{e.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section" style={{ background: "var(--green-900)", color: "#fff" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div>
              <SectionHeader light eyebrow="Гигиена и контроль" title="Каждый день — чек‑лист на 38 пунктов" sub="ХАССП‑протоколы, ежедневная проверка температур, журнал поставок. Раз в квартал — внешний аудит." />
            </div>
            <div className="card" style={{ padding: 32, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", color: "#fff" }}>
              <div className="h-eyebrow" style={{ color: "var(--lime-300)" }}>Хотите посмотреть?</div>
              <div className="h-title" style={{ fontSize: 26, marginTop: 12 }}>Экскурсия по кухне</div>
              <p style={{ marginTop: 12, fontSize: 14, opacity: 0.8, lineHeight: 1.55 }}>Каждую субботу в 11:00 проводим открытые экскурсии. Бесплатно, нужна запись — мест ограничено.</p>
              <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => window.go?.("contacts")}>Записаться {Icons.arrow}</button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

// ============================================================
// CAREERS PAGE
// ============================================================
function CareersPage() {
  const jobs = [
    { t: "Повар горячего цеха", type: "Полная занятость", loc: "Кухня, Ибраимова 115", salary: "от 45 000 сом" },
    { t: "Помощник повара (холодный цех)", type: "Полная / сменный график", loc: "Кухня, Ибраимова 115", salary: "от 32 000 сом" },
    { t: "Курьер на личном авто", type: "Утренние / вечерние смены", loc: "Бишкек", salary: "от 38 000 сом + ГСМ" },
    { t: "Менеджер B2B продаж", type: "Полная занятость", loc: "Офис, удалённо частично", salary: "от 55 000 + %" },
    { t: "SMM‑специалист", type: "Полная / гибрид", loc: "Офис, Бишкек", salary: "от 42 000 сом" },
  ];
  const perks = [
    { t: "Питание SixBox", d: "Полный план любой подписки — для сотрудника бесплатно." },
    { t: "Гибкий график", d: "Большинство ролей — с возможностью выбрать утренние или вечерние смены." },
    { t: "Обучение", d: "Курсы у шефа, диетолога и приглашённых специалистов — за счёт компании." },
    { t: "Рост", d: "Помощник → повар → шеф‑смены. Курьер → старший курьер → логист. Реальные кейсы." },
  ];
  return (
    <>
      <PageHero eyebrow="Карьера" title="Команда из 38 человек, которая растёт" sub="Готовим вакансии для тех, кто хочет работать честно: с реальной зарплатой, чёткими задачами и видимым результатом." accent="var(--orange-600)" />
      <section className="section" style={{ background: "var(--paper)" }}>
        <div className="container">
          <SectionHeader eyebrow="Открытые вакансии" title="Сейчас ищем" />
          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 12 }}>
            {jobs.map(j => (
              <div key={j.t} className="card" style={{ padding: 24, display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 20, alignItems: "center" }}>
                <div className="h-title" style={{ fontSize: 18 }}>{j.t}</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>{j.type}</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>{j.loc}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--green-700)" }}>{j.salary}</div>
                <button className="btn btn-dark" style={{ padding: "10px 18px", fontSize: 13 }}>Откликнуться</button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section" style={{ background: "var(--green-900)", color: "#fff" }}>
        <div className="container">
          <SectionHeader light eyebrow="Что предлагаем" title="Условия, которые работают" />
          <div style={{ marginTop: 48, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {perks.map(p => (
              <div key={p.t} style={{ padding: 24, borderRadius: 18, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)" }}>
                <div className="h-title" style={{ fontSize: 20 }}>{p.t}</div>
                <p style={{ marginTop: 12, fontSize: 13, opacity: 0.75, lineHeight: 1.5 }}>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

// ============================================================
// PARTNERS PAGE
// ============================================================
function PartnersPage() {
  const offers = [
    { t: "Корпоративные обеды", d: "От 15 человек — скидка 15%. От 50 — индивидуальное меню и логистика." },
    { t: "Фитнес‑клубы и студии", d: "Совместные программы «питание + тренировки». Брендирование боксов." },
    { t: "Отели и хостелы", d: "Здоровые завтраки и обеды для гостей. Утренняя доставка по графику." },
    { t: "Мероприятия", d: "Кейтеринг полезной едой для конференций, тренингов, ретритов." },
  ];
  const logos = ["FitZone", "Yoga Lab", "Sport Time", "Hyatt", "Bishkek Park", "Grand Hotel", "ProTrainer", "Студия SOS"];
  return (
    <>
      <PageHero eyebrow="Партнёрам" title="SixBox для бизнеса" sub="Кормим офисы, фитнес‑клубы, отели и мероприятия. Предсказуемое меню, гибкий объём, отчётность по КБЖУ." bg="var(--green-700)" color="#fff" accent="var(--lime-300)" />
      <section className="section" style={{ background: "var(--paper)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {offers.map((o, i) => (
              <div key={o.t} className="card" style={{ padding: 32, position: "relative" }}>
                <div style={{ position: "absolute", top: 24, right: 24, width: 36, height: 36, borderRadius: 12, background: i % 2 === 0 ? "var(--green-700)" : "var(--orange-500)", color: "#fff", display: "grid", placeItems: "center" }}>{Icons.bag}</div>
                <div className="h-title" style={{ fontSize: 24, paddingRight: 56 }}>{o.t}</div>
                <p style={{ marginTop: 14, fontSize: 14, color: "var(--muted)", lineHeight: 1.55 }}>{o.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="container">
          <SectionHeader eyebrow="Кто с нами работает" title="60+ компаний из Бишкека" />
          <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {logos.map(l => (
              <div key={l} style={{ padding: "32px 16px", borderRadius: 14, background: "#fff", textAlign: "center", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 18, color: "var(--green-900)", border: "1px solid var(--line)" }}>{l}</div>
            ))}
          </div>
        </div>
      </section>
      <CallToAction title="Готовы обсудить?" sub="Оставьте заявку — менеджер свяжется в течение часа в рабочее время." btn="Связаться" to="contacts" />
      <Footer />
    </>
  );
}

// ============================================================
// DELIVERY PAGE
// ============================================================
function DeliveryPage() {
  const slots = [
    { t: "Утром", w: "06:00 — 09:00", d: "Привозим бокс на день. Курьер не звонит, оставляет у двери, пишет в WhatsApp." },
    { t: "Вечером", w: "19:00 — 22:00", d: "Привозим бокс на следующий день. Удобно, если уходите рано или живёте на работе." },
  ];
  const zones = [
    { t: "Внутри объездной", p: "Бесплатно", d: "Все районы Бишкека в пределах объездной дороги." },
    { t: "За объездной (до 10 км)", p: "200 сом", d: "Кок‑Жар, Маевка, Ак‑Орго, Военно‑Антоновка." },
    { t: "Дальше (по запросу)", p: "от 400 сом", d: "Кант, Беловодское, Ивановка — рассчитываем индивидуально." },
  ];
  return (
    <>
      <PageHero eyebrow="Доставка" title="Привозим, когда удобно вам" sub="Два слота, бесплатно по городу, бесконтактно. Курьер всегда на связи в WhatsApp." accent="var(--orange-600)" />
      <section className="section" style={{ background: "var(--paper)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 56 }}>
            {slots.map((s, i) => (
              <div key={s.t} className="card" style={{ padding: 32, background: i === 0 ? "var(--lime-200)" : "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: i === 0 ? "var(--green-700)" : "var(--orange-500)", color: "#fff", display: "grid", placeItems: "center" }}>{Icons.clock}</div>
                  <div>
                    <div className="h-title" style={{ fontSize: 24 }}>{s.t}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{s.w}</div>
                  </div>
                </div>
                <p style={{ marginTop: 18, fontSize: 14, lineHeight: 1.55 }}>{s.d}</p>
              </div>
            ))}
          </div>
          <SectionHeader eyebrow="Зоны и стоимость" title="По городу — бесплатно" />
          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 12 }}>
            {zones.map(z => (
              <div key={z.t} className="card" style={{ padding: 24, display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: 24, alignItems: "center" }}>
                <div className="h-title" style={{ fontSize: 20 }}>{z.t}</div>
                <div style={{ fontSize: 14, color: "var(--muted)" }}>{z.d}</div>
                <div className="h-display" style={{ fontSize: 24, color: "var(--green-700)" }}>{z.p}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section" style={{ background: "var(--green-900)", color: "#fff" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <SectionHeader light eyebrow="Безопасность" title="Холодовая цепь от кухни до двери" sub="Изотермические сумки, контроль температуры в авто, опломбированные боксы. От печки до квартиры — не больше 2 часов." />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { t: "+4°C", d: "температура в сумке" },
                { t: "2 ч", d: "макс. до клиента" },
                { t: "100%", d: "опломбированные боксы" },
                { t: "WhatsApp", d: "связь с курьером" },
              ].map(b => (
                <div key={b.t} style={{ padding: 22, borderRadius: 16, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)" }}>
                  <div className="h-display" style={{ fontSize: 32, color: "var(--lime-300)" }}>{b.t}</div>
                  <div style={{ marginTop: 8, fontSize: 13, opacity: 0.7 }}>{b.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

// ============================================================
// ALLERGENS PAGE
// ============================================================
function AllergensPage() {
  const allergens = [
    { i: "🥛", t: "Молочные продукты", d: "Творог, йогурт, сыры. Заменяем на растительные альтернативы." },
    { i: "🌾", t: "Глютен", d: "Пшеница, ячмень, рожь. Есть полностью безглютеновое меню." },
    { i: "🥚", t: "Яйца", d: "В сырниках, омлетах, выпечке. Заменяем на тофу‑скрэмбл." },
    { i: "🐟", t: "Рыба и морепродукты", d: "Лосось, креветки. Заменяем на курицу, индейку или растительный белок." },
    { i: "🥜", t: "Орехи и арахис", d: "В гранолах, десертах, соусах. Полностью убираем по запросу." },
    { i: "🌶️", t: "Острое", d: "Перцы чили, паприка. Готовим в нейтральной версии." },
    { i: "🍯", t: "Мёд", d: "В соусах и десертах. Заменяем на стевию или агаву." },
    { i: "🫘", t: "Бобовые", d: "Нут, фасоль, эдамаме. Заменяем на крупы." },
  ];
  const diets = ["Без глютена", "Вегетарианский", "Веганский", "Без лактозы", "Кето", "Низкоуглеводный", "Халяль"];
  return (
    <>
      <PageHero eyebrow="Аллергены" title="Указываем всё. Заменяем — что можем" sub="На каждой карточке блюда отмечены 14 основных аллергенов. При сложной диете — индивидуальный план с диетологом." accent="var(--orange-600)" />
      <section className="section" style={{ background: "var(--paper)" }}>
        <div className="container">
          <SectionHeader eyebrow="Чем мы готовы заменить" title="Основные группы" />
          <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {allergens.map(a => (
              <div key={a.t} className="card" style={{ padding: 22 }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{a.i}</div>
                <div className="h-title" style={{ fontSize: 17 }}>{a.t}</div>
                <p style={{ marginTop: 8, fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{a.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <SectionHeader eyebrow="Готовые диеты" title="Можно выбрать в конструкторе" sub="Все варианты сохраняют КБЖУ под ваш план — баланс не страдает." />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {diets.map(d => (
                <div key={d} style={{
                  padding: "12px 20px", borderRadius: 999,
                  background: "var(--green-700)", color: "#fff",
                  fontSize: 14, fontWeight: 600,
                }}>{d}</div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section" style={{ background: "var(--green-900)", color: "#fff" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <div className="h-eyebrow" style={{ color: "var(--lime-300)" }}>Особый случай?</div>
          <h2 className="h-display" style={{ fontSize: "clamp(36px, 4.5vw, 64px)", margin: "12px auto 0", maxWidth: "16ch" }}>Сделаем индивидуальный план</h2>
          <p style={{ marginTop: 18, fontSize: 16, opacity: 0.75, maxWidth: 540, marginInline: "auto", lineHeight: 1.55 }}>Целиакия, тяжёлая аллергия, диабет, ППБ — наш диетолог соберёт меню под медицинские показания. Бесплатная консультация.</p>
          <button className="btn btn-primary" style={{ marginTop: 28, padding: "16px 28px" }} onClick={() => window.go?.("contacts")}>Записаться к диетологу {Icons.arrow}</button>
        </div>
      </section>
      <Footer />
    </>
  );
}

// ============================================================
// LEGAL PAGE (privacy / offer)
// ============================================================
function LegalPage({ kind }) {
  const isPrivacy = kind === "privacy";
  const sections = isPrivacy ? [
    { t: "1. Что мы собираем", body: "Имя, телефон, адрес доставки, email. Данные о заказах и предпочтениях. Файлы cookie для удобства сайта." },
    { t: "2. Зачем", body: "Чтобы доставить заказ, связаться по нему, рекомендовать подходящие планы и улучшать сервис. Никакой передачи третьим лицам в маркетинговых целях." },
    { t: "3. Хранение", body: "Данные хранятся на серверах в Кыргызстане. Срок хранения — до отзыва согласия или 3 года после последнего заказа." },
    { t: "4. Ваши права", body: "Запросить, изменить или удалить свои данные можно в любой момент: privacy@sixbox.kg или в личном кабинете." },
    { t: "5. Изменения политики", body: "О существенных изменениях уведомим по email. Актуальная версия всегда здесь, на этой странице." },
  ] : [
    { t: "1. Стороны", body: "ОсОО «SixBox» (далее — Исполнитель) и физическое лицо, оформившее заказ через сайт sixbox.kg (далее — Заказчик)." },
    { t: "2. Предмет", body: "Исполнитель готовит и доставляет рацион питания согласно выбранному Заказчиком плану. Состав и КБЖУ указаны в карточках блюд." },
    { t: "3. Стоимость и оплата", body: "Стоимость указана на сайте на момент оформления. Оплата — банковской картой, через Optima/MBank или переводом по реквизитам." },
    { t: "4. Доставка", body: "Бесплатно в пределах объездной Бишкека. За пределами — по тарифам, указанным на странице «Доставка»." },
    { t: "5. Возврат и пауза", body: "Можно поставить подписку на паузу или перенести дни в личном кабинете. Возврат денежных средств — в течение 14 дней с момента оплаты, если услуга не оказана." },
    { t: "6. Ответственность", body: "Исполнитель отвечает за качество и состав блюд. Заказчик обязан сообщить об аллергиях и пищевых ограничениях при оформлении." },
  ];
  return (
    <>
      <PageHero
        eyebrow="Документы"
        title={isPrivacy ? "Политика конфиденциальности" : "Договор оферты"}
        sub={isPrivacy ? "Как мы работаем с вашими персональными данными — коротко и по‑человечески." : "Условия использования сервиса SixBox."}
      />
      <section className="section" style={{ background: "var(--paper)" }}>
        <div className="container container-tight" style={{ maxWidth: 760 }}>
          <div style={{ fontSize: 13, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>Редакция от 1 января 2026</div>
          <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 28 }}>
            {sections.map(s => (
              <div key={s.t}>
                <h3 className="h-title" style={{ fontSize: 22, margin: 0 }}>{s.t}</h3>
                <p style={{ marginTop: 12, fontSize: 15, color: "var(--ink-2)", lineHeight: 1.65 }}>{s.body}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 48, padding: 24, borderRadius: 18, background: "var(--cream)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div>
              <div className="h-title" style={{ fontSize: 18 }}>Есть вопросы?</div>
              <div style={{ marginTop: 6, fontSize: 14, color: "var(--muted)" }}>Напишите нам: legal@sixbox.kg</div>
            </div>
            <button className="btn btn-dark" onClick={() => window.go?.("contacts")}>Контакты</button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

Object.assign(window, {
  PageHero, CallToAction,
  BlogPage, AboutPage, KitchenPage, CareersPage, PartnersPage, DeliveryPage, AllergensPage, LegalPage,
});
