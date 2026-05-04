/* SixBox — Hero variations
   Three hero approaches built around an in-page rацион constructor.
*/
const { useState: useStateH, useMemo: useMemoH } = React;

const PLAN_PRESETS = [
  { id: "loss", label: "Похудение", kcal: 1300, protein: 110, fat: 45, carbs: 110, color: "var(--lime-300)" },
  { id: "balance", label: "Баланс", kcal: 1850, protein: 130, fat: 65, carbs: 180, color: "var(--orange-500)" },
  { id: "gain", label: "Набор массы", kcal: 2500, protein: 170, fat: 85, carbs: 270, color: "#7fb87f" },
];

const DURATIONS = [
  { id: "1d", label: "1 день", sub: "пробный", multi: 1, badge: "−10%" },
  { id: "1w", label: "1 неделя", sub: "7 дней", multi: 7 },
  { id: "2w", label: "2 недели", sub: "14 дней", multi: 14, badge: "хит" },
  { id: "1m", label: "1 месяц", sub: "28 дней", multi: 28, badge: "−20%" },
];

const PRICE_PER_DAY = { loss: 850, balance: 980, gain: 1180 };

function useRationState() {
  const [plan, setPlan] = useStateH("balance");
  const [duration, setDuration] = useStateH("1w");
  const [delivery, setDelivery] = useStateH("morning");
  const [meals, setMeals] = useStateH(5);

  const total = useMemoH(() => {
    const p = PRICE_PER_DAY[plan];
    const d = DURATIONS.find(x => x.id === duration).multi;
    let discount = 0;
    if (duration === "1m") discount = 0.20;
    else if (duration === "2w") discount = 0.10;
    else if (duration === "1d") discount = 0.10;
    const sub = p * d;
    return { sub, discount, total: Math.round(sub * (1 - discount)) };
  }, [plan, duration]);

  return { plan, setPlan, duration, setDuration, delivery, setDelivery, meals, setMeals, total };
}

function fmtSom(n) {
  return n.toLocaleString("ru-RU") + " сом";
}

// ---------- Variation A: Dark hero with constructor card ----------
function HeroDark({ tweaks }) {
  const r = useRationState();
  const preset = PLAN_PRESETS.find(p => p.id === r.plan);

  return (
    <section style={{
      background: "var(--green-900)",
      color: "#fff",
      position: "relative",
      overflow: "hidden",
      paddingBottom: 100,
    }}>
      {/* Texture */}
      <div style={{
        position: "absolute", inset: 0,
        background: `
          radial-gradient(60% 50% at 88% 20%, rgba(255,138,31,.18), transparent 60%),
          radial-gradient(50% 60% at 10% 80%, rgba(28,194,74,.18), transparent 60%)
        `,
        pointerEvents: "none",
      }} />
      <Header light active="home" />
      <div className="container" style={{ position: "relative", paddingTop: 80, paddingBottom: 40 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "rgba(179,240,106,.12)",
              border: "1px solid rgba(179,240,106,.3)",
              color: "var(--lime-300)",
              padding: "8px 14px", borderRadius: 999,
              fontSize: 13, fontWeight: 500,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: "var(--lime-300)", boxShadow: "0 0 12px var(--lime-300)" }} />
              Доставка по Бишкеку каждое утро
            </div>
            <h1 className="h-display" style={{
              fontSize: `clamp(56px, ${7 * (tweaks?.headingScale ?? 1)}vw, ${112 * (tweaks?.headingScale ?? 1)}px)`,
              margin: "28px 0 0",
              lineHeight: 0.92,
            }}>
              Питайтесь<br/>
              правильно, <span style={{ color: "var(--orange-500)", fontStyle: "italic", fontWeight: 500 }}>не отвлекаясь</span><br/>
              на готовку.
            </h1>
            <p style={{
              fontSize: 18, lineHeight: 1.55, marginTop: 28,
              color: "rgba(255,255,255,.72)", maxWidth: 480,
            }}>
              Готовое сбалансированное меню под ваши цели. Шеф‑повара рассчитывают КБЖУ, мы привозим свежие боксы утром или вечером — каждый день.
            </p>
            <div style={{ display: "flex", gap: 14, marginTop: 36, flexWrap: "wrap" }}>
              <button className="btn btn-primary" style={{ padding: "18px 28px", fontSize: 16 }}>
                Собрать рацион — пробный день за 765 сом
                {Icons.arrow}
              </button>
              <button className="btn btn-ghost-light" style={{ padding: "18px 28px", fontSize: 16 }}>
                Посмотреть меню недели
              </button>
            </div>
            <div style={{ display: "flex", gap: 36, marginTop: 56, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,.1)" }}>
              {[
                { v: "9 лет", l: "на рынке Бишкека" },
                { v: "12 000+", l: "довольных клиентов" },
                { v: "4.9 ★", l: "по 2GIS и 2 GIS" },
              ].map(s => (
                <div key={s.l}>
                  <div className="h-display" style={{ fontSize: 32, color: "var(--lime-300)" }}>{s.v}</div>
                  <div style={{ fontSize: 13, opacity: 0.6, marginTop: 6 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Constructor card */}
          <RationConstructor r={r} preset={preset} variant="dark" tweaks={tweaks} />
        </div>
      </div>
      {/* Marquee */}
      <div style={{ position: "relative", marginTop: 40, paddingTop: 32, paddingBottom: 8, borderTop: "1px solid rgba(255,255,255,.08)" }}>
        <div className="marquee">
          <div className="marquee-track" style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, color: "rgba(255,255,255,.6)" }}>
            {Array(2).fill(0).map((_, k) => (
              <React.Fragment key={k}>
                <span>СВЕЖАЯ КУХНЯ</span>
                <span style={{ color: "var(--orange-500)" }}>★</span>
                <span>ШЕФ‑ПОВАРА ИЗ ОТЕЛЕЙ 5★</span>
                <span style={{ color: "var(--lime-300)" }}>★</span>
                <span>ДОСТАВКА УТРОМ И ВЕЧЕРОМ</span>
                <span style={{ color: "var(--orange-500)" }}>★</span>
                <span>КБЖУ ПОД ВАШУ ЦЕЛЬ</span>
                <span style={{ color: "var(--lime-300)" }}>★</span>
                <span>БЕЗ САХАРА И УСИЛИТЕЛЕЙ</span>
                <span style={{ color: "var(--orange-500)" }}>★</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Constructor card (used in heroes) ----------
function RationConstructor({ r, preset, variant = "dark", tweaks }) {
  const radius = (tweaks?.cardRadius ?? 22);
  const isDark = variant === "dark";
  const bg = isDark ? "rgba(255,255,255,.04)" : "#fff";
  const border = isDark ? "1px solid rgba(255,255,255,.08)" : "1px solid var(--line)";
  const subText = isDark ? "rgba(255,255,255,.6)" : "var(--muted)";
  const innerCardBg = isDark ? "rgba(255,255,255,.04)" : "rgba(10,18,8,.04)";

  return (
    <div style={{
      background: bg,
      borderRadius: radius + 6,
      border,
      padding: 28,
      boxShadow: isDark ? "0 30px 80px -30px rgba(0,0,0,.6)" : "var(--shadow-pop)",
      backdropFilter: isDark ? "blur(20px)" : "none",
      color: isDark ? "#fff" : "var(--ink)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <div className="h-eyebrow" style={{ color: isDark ? "var(--lime-300)" : "var(--green-700)", fontSize: 11 }}>Конструктор рациона</div>
          <div className="h-title" style={{ fontSize: 22, marginTop: 6 }}>Соберите свой день</div>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          background: isDark ? "rgba(255,138,31,.15)" : "rgba(255,138,31,.1)",
          color: "var(--orange-500)",
          padding: "6px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600,
        }}>
          {Icons.flame}
          {preset.kcal} ккал
        </div>
      </div>

      {/* Step 1 — plan */}
      <div style={{ marginBottom: 18 }}>
        <Step n={1} title="Цель и калории" subText={subText} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 10 }}>
          {PLAN_PRESETS.map(p => {
            const active = p.id === r.plan;
            return (
              <button key={p.id} onClick={() => r.setPlan(p.id)} style={{
                padding: "14px 10px",
                borderRadius: radius - 4,
                border: active ? `1.5px solid ${p.color}` : (isDark ? "1px solid rgba(255,255,255,.08)" : "1px solid var(--line)"),
                background: active ? (isDark ? "rgba(179,240,106,.08)" : "rgba(21,168,58,.06)") : innerCardBg,
                textAlign: "left",
                color: "inherit",
              }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{p.label}</div>
                <div className="h-display" style={{ fontSize: 22, marginTop: 6, color: active ? p.color : "inherit" }}>{p.kcal}</div>
                <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>ккал/день</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2 — duration */}
      <div style={{ marginBottom: 18 }}>
        <Step n={2} title="Срок" subText={subText} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 10 }}>
          {DURATIONS.map(d => {
            const active = d.id === r.duration;
            return (
              <button key={d.id} onClick={() => r.setDuration(d.id)} style={{
                padding: "12px 8px",
                borderRadius: radius - 6,
                border: active ? "1.5px solid var(--orange-500)" : (isDark ? "1px solid rgba(255,255,255,.08)" : "1px solid var(--line)"),
                background: active ? "rgba(255,138,31,.12)" : innerCardBg,
                position: "relative",
                color: "inherit",
              }}>
                {d.badge && (
                  <div style={{
                    position: "absolute", top: -8, right: 6,
                    background: d.badge.includes("%") ? "var(--lime-300)" : "var(--orange-500)",
                    color: "var(--green-900)",
                    fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 999,
                    textTransform: "uppercase", letterSpacing: "0.05em",
                  }}>{d.badge}</div>
                )}
                <div style={{ fontSize: 13, fontWeight: 600 }}>{d.label}</div>
                <div style={{ fontSize: 11, opacity: 0.55, marginTop: 2 }}>{d.sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3 — delivery */}
      <div style={{ marginBottom: 22 }}>
        <Step n={3} title="Доставка" subText={subText} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
          {[
            { id: "morning", label: "Утром", sub: "06:00–09:00", icon: "☀" },
            { id: "evening", label: "Вечером", sub: "19:00–22:00", icon: "☾" },
          ].map(d => {
            const active = r.delivery === d.id;
            return (
              <button key={d.id} onClick={() => r.setDelivery(d.id)} style={{
                padding: "14px 14px",
                borderRadius: radius - 6,
                border: active ? "1.5px solid var(--lime-300)" : (isDark ? "1px solid rgba(255,255,255,.08)" : "1px solid var(--line)"),
                background: active ? (isDark ? "rgba(179,240,106,.08)" : "rgba(21,168,58,.06)") : innerCardBg,
                display: "flex", alignItems: "center", gap: 12,
                textAlign: "left",
                color: "inherit",
              }}>
                <div style={{ fontSize: 22 }}>{d.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{d.label}</div>
                  <div style={{ fontSize: 11, opacity: 0.6 }}>{d.sub}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Total */}
      <div style={{
        background: isDark ? "rgba(0,0,0,.25)" : "var(--green-900)",
        color: "#fff",
        borderRadius: radius - 2,
        padding: 18,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 12,
      }}>
        <div>
          <div style={{ fontSize: 11, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.14em" }}>Итого</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 4 }}>
            <div className="h-display" style={{ fontSize: 32, color: "var(--lime-300)" }}>{fmtSom(r.total.total)}</div>
            {r.total.discount > 0 && (
              <div style={{ fontSize: 13, textDecoration: "line-through", opacity: 0.5 }}>{fmtSom(r.total.sub)}</div>
            )}
          </div>
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>
            {DURATIONS.find(d => d.id === r.duration).multi} дн. · {preset.kcal} ккал/день · 5 приёмов пищи
          </div>
        </div>
        <button className="btn btn-primary" style={{ padding: "14px 20px" }}>
          Оформить
          {Icons.arrow}
        </button>
      </div>
    </div>
  );
}

function Step({ n, title, subText }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 22, height: 22, borderRadius: 6,
        background: "var(--orange-500)",
        color: "var(--ink)",
        fontSize: 12, fontWeight: 700,
        display: "grid", placeItems: "center",
      }}>{n}</div>
      <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
    </div>
  );
}

// ---------- Variation B: Editorial split — left photo, right constructor on cream ----------
function HeroEditorial({ tweaks }) {
  const r = useRationState();
  const preset = PLAN_PRESETS.find(p => p.id === r.plan);

  return (
    <section style={{ background: "var(--cream)", position: "relative", overflow: "hidden" }}>
      <Header active="home" />
      <div className="container" style={{ paddingTop: 56, paddingBottom: 80 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 56 }}>
          {/* Left: hero text + photo collage */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "var(--green-900)", color: "var(--lime-300)",
              padding: "10px 16px", borderRadius: 999,
              fontSize: 13, fontWeight: 500,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: "var(--lime-300)", boxShadow: "0 0 12px var(--lime-300)" }} />
              SixBox · perfect meals · since 2017
            </div>
            <h1 className="h-display" style={{
              fontSize: `clamp(54px, ${6.5 * (tweaks?.headingScale ?? 1)}vw, ${104 * (tweaks?.headingScale ?? 1)}px)`,
              margin: "24px 0 0", lineHeight: 0.92,
            }}>
              Здоровое питание<br/>
              <em style={{ fontStyle: "italic", fontWeight: 500, color: "var(--green-700)" }}>без</em> готовки.<br/>
              <span style={{ color: "var(--orange-600)" }}>Каждый</span> день.
            </h1>
            <p style={{ fontSize: 18, color: "var(--muted)", marginTop: 24, maxWidth: 480, lineHeight: 1.55 }}>
              Шеф‑повара SixBox считают за вас калории, белки, жиры и углеводы. Привозим свежий рацион утром или вечером — по всему Бишкеку.
            </p>

            {/* Photo collage */}
            <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
              <div style={{ borderRadius: 24, overflow: "hidden", background: "#0a0e08", padding: 16, position: "relative" }}>
                <FoodContainer kind="chicken-rice" label="450 ккал · 38p / 14f / 42c" />
                <div style={{ position: "absolute", left: 28, bottom: 28, color: "#fff" }}>
                  <div style={{ fontSize: 11, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.14em" }}>обед · вторник</div>
                  <div className="h-title" style={{ fontSize: 18, marginTop: 4 }}>Курица терияки<br/>с диким рисом</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ flex: 1, borderRadius: 18, overflow: "hidden", background: "var(--green-700)", padding: 14, color: "#fff" }}>
                  <FoodPlate kind="salad" size="100%" />
                </div>
                <div style={{
                  flex: 0.7, borderRadius: 18,
                  background: "var(--orange-500)",
                  padding: 16, color: "#1a0a00",
                  display: "flex", flexDirection: "column", justifyContent: "space-between",
                }}>
                  <div className="h-eyebrow" style={{ fontSize: 10 }}>Сегодня свежее</div>
                  <div className="h-title" style={{ fontSize: 18, lineHeight: 1.05, marginTop: 8 }}>Лосось<br/>су‑вид</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: constructor */}
          <div style={{ position: "sticky", top: 100, alignSelf: "start" }}>
            <RationConstructor r={r} preset={preset} variant="light" tweaks={tweaks} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Variation C: Bold full-bleed — magazine-cover style with overlapping constructor ----------
function HeroBold({ tweaks }) {
  const r = useRationState();
  const preset = PLAN_PRESETS.find(p => p.id === r.plan);

  return (
    <section style={{ background: "var(--green-600)", color: "#fff", position: "relative", overflow: "hidden" }}>
      <Header light active="home" />
      <div className="container" style={{ position: "relative", paddingTop: 32, paddingBottom: 0 }}>
        {/* Top row — split title */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 24, paddingTop: 32 }}>
          <div className="h-display" style={{ fontSize: `clamp(72px, ${10 * (tweaks?.headingScale ?? 1)}vw, ${180 * (tweaks?.headingScale ?? 1)}px)`, lineHeight: 0.85 }}>
            Ешь<br/>как<br/><em style={{ fontStyle: "italic", color: "var(--lime-300)", fontWeight: 500 }}>надо.</em>
          </div>
          {/* Center — orange marker box like the screenshots */}
          <div style={{
            background: "var(--orange-500)",
            color: "#1a0a00",
            padding: "14px 22px",
            borderRadius: 999,
            fontFamily: "var(--font-display)",
            fontSize: 22, fontWeight: 700,
            transform: "rotate(-4deg)",
            whiteSpace: "nowrap",
          }}>
            SIX BOX
          </div>
          <div style={{ alignSelf: "end" }}>
            <p style={{ fontSize: 18, lineHeight: 1.5, opacity: 0.92, maxWidth: 360, marginLeft: "auto", textAlign: "right" }}>
              Готовим, считаем КБЖУ, привозим в боксе утром или вечером. Вам остаётся открыть и съесть.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: "flex-end" }}>
              <button className="btn btn-lime" style={{ padding: "14px 22px" }}>
                Хочу такое
                {Icons.arrow}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom row — big plate + overlapping constructor */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 0, marginTop: 56, alignItems: "end" }}>
          <div style={{ position: "relative", paddingBottom: 0 }}>
            <div style={{ width: "115%", marginLeft: "-15%" }}>
              <FoodPlate kind="chicken-rice" />
            </div>
            <div style={{
              position: "absolute", left: "10%", top: "10%",
              background: "var(--ink)", color: "#fff",
              padding: "10px 16px", borderRadius: 999,
              fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600,
              transform: "rotate(-6deg)",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              {Icons.flame} 1850 ккал · 5 боксов
            </div>
            <div style={{
              position: "absolute", right: "8%", bottom: "12%",
              background: "var(--lime-300)", color: "var(--green-900)",
              padding: "8px 14px", borderRadius: 999,
              fontSize: 12, fontWeight: 700,
              transform: "rotate(4deg)",
            }}>
              + витамины и микроэлементы
            </div>
          </div>
          <div style={{ paddingBottom: 60 }}>
            <RationConstructor r={r} preset={preset} variant="dark" tweaks={tweaks} />
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { HeroDark, HeroEditorial, HeroBold, RationConstructor, useRationState, PLAN_PRESETS, DURATIONS, PRICE_PER_DAY, fmtSom });
