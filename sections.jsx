/* SixBox — page sections */
const { useState: useStateS, useMemo: useMemoS } = React;

// ---------- How it works ----------
function HowItWorks() {
  const steps = [
    { n: "01", t: "Выбираете план", d: "Похудение, поддержание или набор массы. Срок — от одного дня до месяца.", icon: Icons.scale },
    { n: "02", t: "Шеф готовит свежее", d: "Каждое утро на кухне SixBox. Без сахара, усилителей вкуса и заморозок.", icon: Icons.chef },
    { n: "03", t: "Привозим в боксе", d: "Утром на день или вечером на следующий — на ваш выбор. По всему Бишкеку.", icon: Icons.truck },
    { n: "04", t: "Открываете и едите", d: "В офисе, на тренировке, дома. 5 приёмов пищи — на день вперёд расписаны.", icon: Icons.heart },
  ];
  return (
    <section className="section" style={{ background: "var(--paper)" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 56, gap: 40 }}>
          <SectionHeader
            eyebrow="Как это работает"
            title="Четыре шага между вами и здоровой едой"
            sub="Никаких походов в магазин, чисток сковородок и подсчёта калорий в три часа ночи."
          />
          <button className="btn btn-ghost" style={{ padding: "14px 22px" }}>
            Подробнее о процессе
            {Icons.arrow}
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {steps.map((s, i) => (
            <div key={s.n} className="card" style={{ padding: 28, position: "relative" }}>
              <div style={{
                position: "absolute", top: 24, right: 24,
                fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 700,
                color: "var(--line)",
              }}>{s.n}</div>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: i === 1 ? "var(--orange-500)" : i === 3 ? "var(--lime-300)" : "var(--green-700)",
                color: i === 1 ? "#1a0a00" : i === 3 ? "var(--green-900)" : "#fff",
                display: "grid", placeItems: "center", marginBottom: 24,
              }}>{s.icon}</div>
              <div className="h-title" style={{ fontSize: 22 }}>{s.t}</div>
              <p style={{ marginTop: 12, color: "var(--muted)", fontSize: 14, lineHeight: 1.55 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Plans ----------
function Plans() {
  const plans = [
    {
      id: "loss",
      title: "Похудение",
      kcal: "1200–1500",
      from: 850,
      desc: "Дефицит калорий, белок 30%. Лёгкие супы, рыба, зелень. Уходит вес — остаётся настроение.",
      bullets: ["5 приёмов пищи", "Высокий белок", "Минимум углеводов вечером"],
      color: "var(--lime-300)",
      tag: "−5 кг за месяц",
      bg: "#0c3a18",
    },
    {
      id: "balance",
      title: "Поддержание",
      kcal: "1700–2000",
      from: 980,
      desc: "Сбалансированный рацион для тех, кто в форме и хочет в ней остаться. Без срывов и качелей.",
      bullets: ["5 приёмов пищи", "Все группы продуктов", "Десерты на стевии"],
      color: "var(--orange-500)",
      tag: "Самый популярный",
      bg: "var(--green-700)",
      featured: true,
    },
    {
      id: "gain",
      title: "Набор массы",
      kcal: "2200–2800",
      from: 1180,
      desc: "Под силовые тренировки. Сложные углеводы, говядина, индейка, орехи и нут.",
      bullets: ["6 приёмов пищи", "Белок 2 г / кг", "Углеводы вокруг тренировки"],
      color: "#7fb87f",
      tag: "+2 кг мышц / мес",
      bg: "#0c3a18",
    },
  ];
  return (
    <section className="section" id="plans" style={{ background: "var(--green-900)", color: "#fff" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 60, alignItems: "end", marginBottom: 64 }}>
          <SectionHeader
            light
            eyebrow="Планы питания"
            title="Под вашу цель — конкретный план"
            sub="Не диеты, а образ жизни. Меняем рацион плавно, без срывов и стрессов."
          />
          <div style={{ display: "flex", gap: 12 }}>
            <div className="chip">Без глютена — по запросу</div>
            <div className="chip">Вегетарианский</div>
            <div className="chip">Кето</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {plans.map(p => (
            <div key={p.id} style={{
              background: p.bg,
              border: p.featured ? `1.5px solid ${p.color}` : "1px solid rgba(255,255,255,.08)",
              borderRadius: 28,
              padding: 28,
              position: "relative",
              transform: p.featured ? "translateY(-12px)" : "none",
              boxShadow: p.featured ? "0 30px 80px -30px rgba(255,138,31,.4)" : "none",
            }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "6px 12px", borderRadius: 999,
                background: `color-mix(in oklab, ${p.color} 22%, transparent)`,
                color: p.color,
                fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
              }}>
                {p.tag}
              </div>
              <div className="h-display" style={{ fontSize: 44, marginTop: 18 }}>{p.title}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: p.color }}>{p.kcal}</div>
                <div style={{ fontSize: 13, opacity: 0.6 }}>ккал/день</div>
              </div>
              <p style={{ marginTop: 18, color: "rgba(255,255,255,.7)", fontSize: 14, lineHeight: 1.55 }}>{p.desc}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 0", display: "flex", flexDirection: "column", gap: 10 }}>
                {p.bullets.map(b => (
                  <li key={b} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
                    <span style={{
                      width: 20, height: 20, borderRadius: 10,
                      background: `color-mix(in oklab, ${p.color} 20%, transparent)`,
                      color: p.color,
                      display: "grid", placeItems: "center",
                    }}>{Icons.check}</span>
                    {b}
                  </li>
                ))}
              </ul>
              <div style={{
                marginTop: 28, paddingTop: 20,
                borderTop: "1px dashed rgba(255,255,255,.12)",
                display: "flex", alignItems: "end", justifyContent: "space-between",
              }}>
                <div>
                  <div style={{ fontSize: 11, opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.14em" }}>от</div>
                  <div className="h-display" style={{ fontSize: 36, color: p.color }}>{p.from}</div>
                  <div style={{ fontSize: 12, opacity: 0.6 }}>сом / день</div>
                </div>
                <button className={p.featured ? "btn btn-primary" : "btn btn-ghost-light"} style={{ padding: "12px 18px" }}>
                  Выбрать
                  {Icons.arrow}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Menu of the week ----------
const MENU = [
  { day: "Пн", date: "4 мая", meals: [
    { type: "Завтрак", title: "Овсянка с ягодами", kind: "oats", kcal: 320 },
    { type: "Обед", title: "Курица терияки с диким рисом", kind: "chicken-rice", kcal: 480 },
    { type: "Ужин", title: "Лосось су‑вид и киноа", kind: "salmon-greens", kcal: 420 },
  ]},
  { day: "Вт", date: "5 мая", meals: [
    { type: "Завтрак", title: "Сырники с творогом 5%", kind: "dessert", kcal: 290 },
    { type: "Обед", title: "Боул с тофу и киноа", kind: "tofu-quinoa", kcal: 460 },
    { type: "Ужин", title: "Говядина с овощами гриль", kind: "beef-bowl", kcal: 510 },
  ]},
  { day: "Ср", date: "6 мая", meals: [
    { type: "Завтрак", title: "Гранола с йогуртом", kind: "oats", kcal: 310 },
    { type: "Обед", title: "Индейка с булгуром", kind: "chicken-rice", kcal: 490 },
    { type: "Ужин", title: "Зелёный салат с креветкой", kind: "salad", kcal: 380 },
  ]},
];

function MenuWeek() {
  const [day, setDay] = useStateS(0);
  const today = MENU[day];
  return (
    <section className="section" id="menu" style={{ background: "var(--cream)" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 36, gap: 40 }}>
          <SectionHeader
            eyebrow="Меню недели"
            title="Каждый день — новые блюда"
            sub="Меню обновляется еженедельно. КБЖУ и состав указаны для каждого блюда."
          />
          <button className="btn btn-dark" style={{ padding: "14px 22px" }}>
            Все блюда меню
            {Icons.arrow}
          </button>
        </div>

        {/* Day picker */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, overflowX: "auto", paddingBottom: 4 }}>
          {MENU.concat([
            { day: "Чт", date: "7 мая" }, { day: "Пт", date: "8 мая" },
            { day: "Сб", date: "9 мая" }, { day: "Вс", date: "10 мая" },
          ]).map((d, i) => {
            const active = i === day;
            const disabled = i >= 3;
            return (
              <button key={i} disabled={disabled} onClick={() => setDay(i)} style={{
                padding: "12px 18px",
                borderRadius: 14,
                background: active ? "var(--ink)" : "#fff",
                color: active ? "#fff" : disabled ? "rgba(0,0,0,.3)" : "var(--ink)",
                border: active ? "none" : "1px solid var(--line)",
                display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2,
                minWidth: 88,
                opacity: disabled ? 0.5 : 1,
              }}>
                <div style={{ fontSize: 11, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.1em" }}>{d.day}</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{d.date}</div>
              </button>
            );
          })}
        </div>

        {/* Menu cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {today.meals.map((m, i) => (
            <div key={i} className="card" style={{ overflow: "hidden" }}>
              <div style={{ background: "#0a0e08", padding: 20 }}>
                <FoodContainer kind={m.kind} label={`#${i + 1} · ${m.type.toLowerCase()}`} />
              </div>
              <div style={{ padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="tag tag-outline">{m.type}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: "var(--orange-600)" }}>
                    {Icons.flame} {m.kcal}
                  </span>
                </div>
                <div className="h-title" style={{ fontSize: 22, marginTop: 14, lineHeight: 1.1 }}>{m.title}</div>
                <div className="macro-bar" style={{ marginTop: 18 }}>
                  <div><div className="v">38g</div><div className="l">белки</div></div>
                  <div><div className="v">14g</div><div className="l">жиры</div></div>
                  <div><div className="v">42g</div><div className="l">углев.</div></div>
                  <div><div className="v">320g</div><div className="l">вес</div></div>
                </div>
                <div style={{ marginTop: 18, fontSize: 12, color: "var(--muted)" }}>
                  Куриное филе, бурый рис, кунжут, имбирь, соевый соус low‑sodium.
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Calculator ----------
function Calculator() {
  const [sex, setSex] = useStateS("f");
  const [age, setAge] = useStateS(28);
  const [height, setHeight] = useStateS(168);
  const [weight, setWeight] = useStateS(64);
  const [activity, setActivity] = useStateS("medium");
  const [goal, setGoal] = useStateS("balance");

  const result = useMemoS(() => {
    // Mifflin-St Jeor
    const bmr = sex === "m"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;
    const mult = { low: 1.2, medium: 1.55, high: 1.75 }[activity];
    let kcal = bmr * mult;
    if (goal === "loss") kcal *= 0.82;
    if (goal === "gain") kcal *= 1.15;
    const protein = Math.round((kcal * 0.3) / 4);
    const fat = Math.round((kcal * 0.28) / 9);
    const carbs = Math.round((kcal * 0.42) / 4);
    return { kcal: Math.round(kcal / 10) * 10, protein, fat, carbs };
  }, [sex, age, height, weight, activity, goal]);

  return (
    <section className="section" id="calc" style={{ background: "var(--paper)" }}>
      <div className="container">
        <SectionHeader
          eyebrow="Калькулятор"
          title="Сколько калорий нужно именно вам?"
          sub="Считаем по формуле Миффлина‑Сан‑Жеора. Затем подбираем подходящий план SixBox."
        />
        <div style={{ marginTop: 56, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
          {/* Inputs */}
          <div className="card" style={{ padding: 36 }}>
            <Field label="Пол">
              <Segmented value={sex} onChange={setSex} options={[{ id: "f", l: "Женский" }, { id: "m", l: "Мужской" }]} />
            </Field>
            <Field label="Возраст" suffix={`${age} лет`}>
              <Slider min={18} max={70} value={age} onChange={setAge} />
            </Field>
            <Field label="Рост" suffix={`${height} см`}>
              <Slider min={140} max={210} value={height} onChange={setHeight} />
            </Field>
            <Field label="Вес" suffix={`${weight} кг`}>
              <Slider min={40} max={150} value={weight} onChange={setWeight} />
            </Field>
            <Field label="Активность">
              <Segmented value={activity} onChange={setActivity} options={[
                { id: "low", l: "Низкая" }, { id: "medium", l: "Средняя" }, { id: "high", l: "Высокая" },
              ]} />
            </Field>
            <Field label="Цель">
              <Segmented value={goal} onChange={setGoal} options={[
                { id: "loss", l: "Похудеть" }, { id: "balance", l: "Поддерживать" }, { id: "gain", l: "Набрать" },
              ]} />
            </Field>
          </div>
          {/* Result */}
          <div style={{ background: "var(--green-900)", color: "#fff", borderRadius: 28, padding: 36, position: "relative", overflow: "hidden" }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(circle at 80% 20%, rgba(255,138,31,.2), transparent 60%)",
              pointerEvents: "none",
            }} />
            <div className="h-eyebrow" style={{ color: "var(--lime-300)" }}>Ваша норма</div>
            <div className="h-display" style={{ fontSize: 96, color: "var(--lime-300)", marginTop: 14 }}>{result.kcal}</div>
            <div style={{ fontSize: 14, opacity: 0.7 }}>ккал в день, чтобы {goal === "loss" ? "снижать вес" : goal === "gain" ? "набирать массу" : "оставаться в форме"}</div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 32 }}>
              {[
                { l: "Белки", v: result.protein, c: "var(--lime-300)" },
                { l: "Жиры", v: result.fat, c: "var(--orange-500)" },
                { l: "Углеводы", v: result.carbs, c: "#7fb87f" },
              ].map(m => (
                <div key={m.l} style={{ background: "rgba(255,255,255,.05)", borderRadius: 16, padding: 18 }}>
                  <div style={{ fontSize: 12, opacity: 0.6 }}>{m.l}</div>
                  <div className="h-display" style={{ fontSize: 32, color: m.c, marginTop: 4 }}>{m.v}<span style={{ fontSize: 14, opacity: 0.6, marginLeft: 4 }}>г</span></div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 32, padding: 20, borderRadius: 18,
              background: "rgba(179,240,106,.1)",
              border: "1px solid rgba(179,240,106,.2)",
              display: "flex", gap: 14, alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <div style={{ fontSize: 13, opacity: 0.7 }}>Подходящий план</div>
                <div className="h-title" style={{ fontSize: 22, marginTop: 4, color: "var(--lime-300)" }}>
                  {goal === "loss" ? "Похудение" : goal === "gain" ? "Набор массы" : "Поддержание"}
                </div>
              </div>
              <button className="btn btn-primary" style={{ padding: "14px 18px" }}>
                Заказать план
                {Icons.arrow}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, suffix, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-2)" }}>{label}</div>
        {suffix && <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--green-700)" }}>{suffix}</div>}
      </div>
      {children}
    </div>
  );
}
function Segmented({ value, onChange, options }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${options.length}, 1fr)`, gap: 4, padding: 4, borderRadius: 12, background: "rgba(10,18,8,.05)" }}>
      {options.map(o => {
        const active = o.id === value;
        return (
          <button key={o.id} onClick={() => onChange(o.id)} style={{
            padding: "10px 12px", borderRadius: 9, fontSize: 13, fontWeight: 600,
            background: active ? "#fff" : "transparent",
            color: active ? "var(--ink)" : "var(--muted)",
            boxShadow: active ? "0 2px 6px rgba(0,0,0,.06)" : "none",
          }}>{o.l}</button>
        );
      })}
    </div>
  );
}
function Slider({ min, max, value, onChange }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ position: "relative", height: 32, display: "flex", alignItems: "center" }}>
      <div style={{ position: "absolute", left: 0, right: 0, height: 4, borderRadius: 2, background: "rgba(10,18,8,.08)" }} />
      <div style={{ position: "absolute", left: 0, width: `${pct}%`, height: 4, borderRadius: 2, background: "var(--green-600)" }} />
      <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))}
        style={{
          position: "absolute", inset: 0, width: "100%", height: 32, opacity: 0, cursor: "pointer",
        }} />
      <div style={{
        position: "absolute", left: `calc(${pct}% - 12px)`,
        width: 24, height: 24, borderRadius: 12, background: "#fff",
        border: "2px solid var(--green-600)", boxShadow: "0 2px 8px rgba(0,0,0,.1)",
      }} />
    </div>
  );
}

// ---------- Fridge of Trust ----------
function Fridge() {
  return (
    <section className="section" id="fridge" style={{ background: "var(--orange-500)", color: "#1a0a00", overflow: "hidden", position: "relative" }}>
      <div className="container" style={{ position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <div className="h-eyebrow" style={{ color: "rgba(26,10,0,.7)" }}>наша фишка</div>
            <h2 className="h-display" style={{ fontSize: "clamp(48px, 6vw, 88px)", margin: "16px 0 0" }}>
              Холодильник<br/>доверия
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.55, marginTop: 22, maxWidth: 480 }}>
              13 умных холодильников по всему Бишкеку с полезными обедами, перекусами и десертами. Без касс — просто берёте бокс и оплачиваете в приложении.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginTop: 32 }}>
              {[
                { t: "13 точек", d: "ОЦ Avangard, ТРЦ Asia Mall, Ololo, Bishkek Park, ВЭФ…" },
                { t: "24/7", d: "Работают круглосуточно — забыли поужинать, не страшно" },
                { t: "Свежесть", d: "Каждый день перезагружается утром, срок 1 день" },
                { t: "Оплата", d: "QR в приложении или картой — 30 секунд" },
              ].map(x => (
                <div key={x.t} style={{ background: "rgba(26,10,0,.08)", borderRadius: 16, padding: 18 }}>
                  <div className="h-title" style={{ fontSize: 18 }}>{x.t}</div>
                  <div style={{ fontSize: 13, marginTop: 6, opacity: 0.7 }}>{x.d}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
              <button className="btn btn-dark" style={{ padding: "16px 24px" }}>
                Карта холодильников
                {Icons.arrow}
              </button>
              <button className="btn" style={{ padding: "16px 24px", background: "rgba(26,10,0,.1)", color: "#1a0a00" }}>
                Скачать приложение
              </button>
            </div>
          </div>

          {/* Illustrated fridge */}
          <FridgeIllustration />
        </div>
      </div>
    </section>
  );
}

function FridgeIllustration() {
  return (
    <div style={{ position: "relative", display: "grid", placeItems: "center" }}>
      <div style={{
        width: 360, height: 520, position: "relative",
        background: "linear-gradient(180deg, #ffb46d 0%, #f47216 100%)",
        borderRadius: 32,
        boxShadow: "0 40px 60px -20px rgba(0,0,0,.3), inset 0 -12px 24px rgba(0,0,0,.1)",
        padding: 24,
      }}>
        <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 700, color: "#1a0a00", letterSpacing: "0.12em" }}>SIX BOX</div>
        {/* shelves */}
        <div style={{ position: "absolute", inset: 36, background: "rgba(26,10,0,.08)", borderRadius: 18, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{
              flex: 1, background: "rgba(255,255,255,.4)", borderRadius: 8,
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, padding: 6,
            }}>
              {[0,1,2].map(j => (
                <div key={j} style={{
                  background: ["#0a0e08", "#15a83a", "#0c3a18"][((i+j)%3)],
                  borderRadius: 4,
                  position: "relative",
                }}>
                  <div style={{ position: "absolute", inset: 4, background: "rgba(255,255,255,.1)", borderRadius: 2 }} />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", right: 30, top: "40%", width: 6, height: 60, background: "rgba(26,10,0,.6)", borderRadius: 3 }} />
      </div>
      {/* Floating box */}
      <div style={{
        position: "absolute", bottom: -20, left: -20,
        background: "var(--ink)", borderRadius: 16, padding: 16,
        transform: "rotate(-6deg)",
        boxShadow: "0 20px 40px -10px rgba(0,0,0,.3)",
      }}>
        <FoodContainer kind="salad" />
      </div>
      <div style={{
        position: "absolute", top: 0, right: -10,
        background: "var(--lime-300)", color: "var(--green-900)",
        padding: "10px 16px", borderRadius: 999,
        fontSize: 13, fontWeight: 700,
        transform: "rotate(8deg)",
        boxShadow: "0 8px 20px rgba(0,0,0,.15)",
      }}>13 точек в Бишкеке</div>
    </div>
  );
}

// ---------- Results / Testimonials ----------
function Results() {
  const stories = [
    { name: "Айгуль", age: 32, lost: "−12 кг за 4 месяца", quote: "Перестала готовить вечером — теперь это время с детьми. И минус 12 кг за 4 месяца, без срывов.", plan: "Похудение, 4 мес." },
    { name: "Эрлан", age: 28, lost: "+6 кг мышц", quote: "Тренер расписал калораж, SixBox привозит ровно то, что нужно. Силовые выросли, перестал считать в приложениях.", plan: "Набор массы, 6 мес." },
    { name: "Бегайым", age: 41, lost: "−8 кг и кожа", quote: "Удивил эффект на коже и волосах. Это не диета, это просто сбалансированно.", plan: "Поддержание, 1 год" },
  ];
  return (
    <section className="section" style={{ background: "var(--green-900)", color: "#fff" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 40, marginBottom: 56 }}>
          <SectionHeader
            light
            eyebrow="Результаты"
            title="Реальные клиенты, реальные цифры"
            sub="Не «модели до и после», а наши клиенты, которые согласились поделиться своей историей."
          />
          <div style={{ display: "flex", gap: 28 }}>
            <Stat v="12 000+" l="клиентов" />
            <Stat v="9 лет" l="на рынке" />
            <Stat v="4.9★" l="средний рейтинг" />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {stories.map((s, i) => (
            <div key={s.name} style={{
              background: i === 1 ? "var(--orange-500)" : "rgba(255,255,255,.04)",
              color: i === 1 ? "#1a0a00" : "#fff",
              border: i === 1 ? "none" : "1px solid rgba(255,255,255,.08)",
              borderRadius: 24, padding: 28,
              display: "flex", flexDirection: "column",
            }}>
              {/* Person photo placeholder */}
              <div style={{
                width: "100%", aspectRatio: "4/3", borderRadius: 16,
                background: `linear-gradient(135deg, ${["#3d5a2c","#7a3a1a","#2c3a26"][i]}, ${["#0c1a08","#1a0a00","#0c1a08"][i]})`,
                position: "relative", overflow: "hidden",
              }}>
                {/* Silhouette */}
                <div style={{
                  position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
                  width: "60%", height: "85%",
                  background: `linear-gradient(180deg, ${["#5a8a3a","#c75a2a","#5a4a3a"][i]} 0%, transparent 60%)`,
                  borderRadius: "50% 50% 0 0",
                  filter: "blur(2px)",
                }} />
                <div style={{
                  position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
                  width: "30%", aspectRatio: 1, borderRadius: "50%",
                  background: ["#a0c47a","#e8a97a","#c9a67a"][i],
                  filter: "blur(1px)",
                }} />
                {/* "Photo" tag */}
                <div style={{ position: "absolute", top: 12, left: 12, fontSize: 11, color: "rgba(255,255,255,.7)", fontFamily: "var(--font-mono)" }}>SIX_BOX_2026.jpg</div>
              </div>
              <div className="h-display" style={{ fontSize: 28, marginTop: 18 }}>{s.lost}</div>
              <p style={{ marginTop: 14, fontSize: 15, lineHeight: 1.55, opacity: 0.9, flex: 1 }}>«{s.quote}»</p>
              <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: `1px ${i === 1 ? "solid rgba(0,0,0,.15)" : "dashed rgba(255,255,255,.15)"}` }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{s.name}, {s.age}</div>
                  <div style={{ fontSize: 12, opacity: 0.6 }}>{s.plan}</div>
                </div>
                <div style={{ display: "flex", gap: 1, color: "var(--orange-500)" }}>
                  {Array(5).fill(0).map((_, k) => <span key={k} style={{ color: i === 1 ? "#1a0a00" : "var(--orange-500)" }}>{Icons.star}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ v, l }) {
  return (
    <div>
      <div className="h-display" style={{ fontSize: 36, color: "var(--lime-300)" }}>{v}</div>
      <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>{l}</div>
    </div>
  );
}

// ---------- About / Team ----------
function Team() {
  return (
    <section className="section" id="team" style={{ background: "var(--cream)" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}>
          <div>
            <SectionHeader
              eyebrow="О нас"
              title="Кухня, которая работает на ваше здоровье"
              sub="Команда SixBox — это шеф‑повара из топ‑отелей Бишкека и Алматы, диетолог‑нутрициолог и логисты, которые знают город до подъезда."
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 36 }}>
              {[
                { v: "300 м²", l: "наша кухня" },
                { v: "HACCP", l: "сертификация" },
                { v: "−2°C", l: "холодная цепь" },
              ].map(s => (
                <div key={s.l} className="card" style={{ padding: 18 }}>
                  <div className="h-display" style={{ fontSize: 28 }}>{s.v}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Team grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { name: "Тимур Орунбаев", role: "Шеф‑повар", since: "с 2017", c: "#3d5a2c" },
              { name: "Айдай Касымова", role: "Диетолог", since: "PhD nutrition", c: "#7a3a1a" },
              { name: "Чынгыз Алиев", role: "Управляющий кухней", since: "ex‑Hyatt", c: "#1a3a2a" },
              { name: "Бермет Сатарова", role: "Менеджер заботы", since: "5 лет в команде", c: "#5a3a1a" },
            ].map((p, i) => (
              <div key={p.name} style={{
                background: p.c, color: "#fff", borderRadius: 22, padding: 20,
                aspectRatio: "1", display: "flex", flexDirection: "column", justifyContent: "space-between",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: "20%", right: "-10%", width: "70%", aspectRatio: 1,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, color-mix(in oklab, ${p.c} 60%, white), ${p.c})`,
                  filter: "blur(1px)",
                }} />
                <div style={{ fontSize: 11, opacity: 0.7, position: "relative" }}>{p.since}</div>
                <div style={{ position: "relative" }}>
                  <div className="h-title" style={{ fontSize: 18 }}>{p.name}</div>
                  <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>{p.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- FAQ ----------
function FAQ() {
  const [open, setOpen] = useStateS(0);
  const items = [
    { q: "Можно ли заказать только на один день?", a: "Да, есть пробный день за 765 сом со скидкой 10%. Это полноценные 5 приёмов пищи на ваш выбранный план." },
    { q: "Как происходит доставка?", a: "Привозим утром (06:00–09:00) свежий бокс на день — или вечером (19:00–22:00) на следующий день. Курьер не звонит, оставляет у двери, пишет в WhatsApp." },
    { q: "Что если у меня аллергия или непереносимость?", a: "Мы заменяем продукты в рамках КБЖУ. Аллергены отмечаем в карточке каждого блюда. При сложных диетах — индивидуальный план с диетологом." },
    { q: "Можно ли пропустить день или поставить на паузу?", a: "Да, в личном кабинете. Пропущенные дни добавляются к концу подписки или возвращаются на баланс." },
    { q: "Как оплачивается заказ?", a: "Картой онлайн, через Optima/MBank, либо переводом по реквизитам. Для подписок 1+ месяцев — рассрочка 0% от партнёрских банков." },
    { q: "Куда вы доставляете в Бишкеке?", a: "По всему городу в пределах объездной. За пределами — стоимость рассчитывается отдельно." },
  ];
  return (
    <section className="section" id="faq" style={{ background: "var(--paper)" }}>
      <div className="container-tight">
        <SectionHeader
          eyebrow="FAQ"
          title="Вопросы, которые задают чаще всего"
          align="center"
        />
        <div style={{ marginTop: 56, display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((it, i) => (
            <button key={i} onClick={() => setOpen(open === i ? -1 : i)} style={{
              textAlign: "left", padding: "24px 28px",
              background: "#fff", borderRadius: 18,
              border: "1px solid var(--line)",
              display: "flex", flexDirection: "column", gap: 8,
              transition: "background .2s",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                <div className="h-title" style={{ fontSize: 19 }}>{it.q}</div>
                <div style={{
                  width: 32, height: 32, borderRadius: 16,
                  background: open === i ? "var(--ink)" : "rgba(10,18,8,.05)",
                  color: open === i ? "#fff" : "var(--ink)",
                  display: "grid", placeItems: "center", flexShrink: 0,
                  transform: open === i ? "rotate(45deg)" : "none",
                  transition: "transform .2s, background .2s",
                }}>{Icons.plus}</div>
              </div>
              {open === i && (
                <div style={{ fontSize: 15, lineHeight: 1.55, color: "var(--muted)", paddingRight: 48 }}>{it.a}</div>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- CTA / Form ----------
function Contact() {
  return (
    <section className="section" style={{ background: "var(--green-700)", color: "#fff", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(50% 60% at 80% 0%, rgba(255,138,31,.3), transparent 60%)`,
      }} />
      <div className="container" style={{ position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div className="h-eyebrow" style={{ color: "var(--lime-300)" }}>Заявка</div>
            <h2 className="h-display" style={{ fontSize: "clamp(48px, 6vw, 88px)", margin: "16px 0 0" }}>
              Начните<br/>с одного дня.<br/>
              <em style={{ fontStyle: "italic", color: "var(--orange-500)", fontWeight: 500 }}>Без подписки.</em>
            </h2>
            <p style={{ fontSize: 18, opacity: 0.85, marginTop: 22, maxWidth: 460, lineHeight: 1.55 }}>
              Оставьте номер — менеджер позвонит за 15 минут, поможет с планом и оформит первый бокс.
            </p>
            <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { i: Icons.phone, t: "+996 555 612 612", s: "Каждый день, 8:00 — 22:00" },
                { i: Icons.whats, t: "WhatsApp", s: "Отвечаем за 5 минут" },
                { i: Icons.pin, t: "Бишкек, ул. Ибраимова 115", s: "Кухня и пункт самовывоза" },
              ].map(c => (
                <div key={c.t} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,.08)", display: "grid", placeItems: "center" }}>{c.i}</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{c.t}</div>
                    <div style={{ fontSize: 13, opacity: 0.6 }}>{c.s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 36, color: "var(--ink)" }}>
            <div className="h-title" style={{ fontSize: 26 }}>Оставить заявку</div>
            <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 6 }}>Это ни к чему не обязывает.</div>
            <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 14 }}>
              <Input label="Как вас зовут?" placeholder="Айгуль" />
              <Input label="Телефон" placeholder="+996 ___ ___ ___" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Select label="План" value="Поддержание" />
                <Select label="Срок" value="1 неделя" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Доставка</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <button className="btn btn-ghost" style={{ padding: "12px", justifyContent: "center", border: "1.5px solid var(--green-600)", color: "var(--green-700)", fontWeight: 600 }}>☀ Утром</button>
                  <button className="btn btn-ghost" style={{ padding: "12px", justifyContent: "center" }}>☾ Вечером</button>
                </div>
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: "100%", padding: "18px", justifyContent: "center", marginTop: 24 }}>
              Записаться на пробный день · от 765 сом
              {Icons.arrow}
            </button>
            <div style={{ fontSize: 11, color: "var(--muted)", textAlign: "center", marginTop: 12 }}>
              Нажимая, вы соглашаетесь с условиями обработки данных
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Input({ label, placeholder }) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{label}</div>
      <input placeholder={placeholder} style={{
        width: "100%", padding: "14px 16px", borderRadius: 12,
        border: "1.5px solid var(--line)", fontSize: 15,
        fontFamily: "inherit", outline: "none", background: "var(--paper)",
      }} />
    </div>
  );
}
function Select({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{label}</div>
      <div style={{
        padding: "14px 16px", borderRadius: 12,
        border: "1.5px solid var(--line)", fontSize: 15,
        background: "var(--paper)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span>{value}</span>
        {Icons.arrowDown}
      </div>
    </div>
  );
}

Object.assign(window, { HowItWorks, Plans, MenuWeek, Calculator, Fridge, Results, Team, FAQ, Contact });
