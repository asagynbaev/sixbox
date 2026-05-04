/* SixBox — Mobile + Subpages (cart, account, checkout) */
const { useState: useStateM } = React;

// ---------- Mobile home (hero + key sections, in iPhone frame) ----------
function MobileHome({ tweaks }) {
  const r = useRationState();
  const preset = PLAN_PRESETS.find(p => p.id === r.plan);
  return (
    <div style={{ background: "var(--green-900)", color: "#fff", minHeight: "100%", overflow: "auto" }}>
      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", paddingTop: 56 }}>
        <Logo light size={0.85} />
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(255,255,255,.08)", display: "grid", placeItems: "center" }}>
            {Icons.user}
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: "var(--orange-500)", color: "#1a0a00", display: "grid", placeItems: "center", position: "relative" }}>
            {Icons.bag}
            <div style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, borderRadius: 9, background: "var(--lime-300)", color: "var(--green-900)", fontSize: 10, fontWeight: 700, display: "grid", placeItems: "center" }}>3</div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ padding: "20px 20px 32px" }}>
        <div className="chip" style={{ fontSize: 11 }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: "var(--lime-300)" }} /> Доставка по Бишкеку
        </div>
        <h1 className="h-display" style={{ fontSize: 48, marginTop: 16, lineHeight: 0.92 }}>
          Питайтесь<br/>
          <em style={{ fontStyle: "italic", color: "var(--orange-500)", fontWeight: 500 }}>правильно,</em><br/>
          не отвлекаясь.
        </h1>
        <p style={{ fontSize: 15, opacity: 0.7, marginTop: 14, lineHeight: 1.5 }}>
          Свежий рацион в боксе — утром или вечером.
        </p>
        <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {PLAN_PRESETS.map(p => {
            const active = p.id === r.plan;
            return (
              <button key={p.id} onClick={() => r.setPlan(p.id)} style={{
                padding: "12px 8px", borderRadius: 14,
                background: active ? "rgba(179,240,106,.1)" : "rgba(255,255,255,.04)",
                border: active ? `1.5px solid ${p.color}` : "1px solid rgba(255,255,255,.08)",
                textAlign: "left", color: "#fff",
              }}>
                <div style={{ fontSize: 11, opacity: 0.7 }}>{p.label}</div>
                <div className="h-display" style={{ fontSize: 18, marginTop: 4, color: active ? p.color : "#fff" }}>{p.kcal}</div>
                <div style={{ fontSize: 9, opacity: 0.5, marginTop: 2 }}>ккал</div>
              </button>
            );
          })}
        </div>

        <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 16, padding: "16px" }}>
          Собрать рацион — от 765 сом
          {Icons.arrow}
        </button>

        {/* Featured plate */}
        <div style={{
          marginTop: 24, background: "rgba(255,255,255,.04)",
          borderRadius: 20, padding: 18, border: "1px solid rgba(255,255,255,.08)",
        }}>
          <FoodContainer kind="chicken-rice" label="обед · вторник" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
            <div>
              <div style={{ fontSize: 11, opacity: 0.6 }}>Сегодня в меню</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>Курица терияки с диким рисом</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, opacity: 0.6 }}>ккал</div>
              <div className="h-display" style={{ fontSize: 22, color: "var(--orange-500)" }}>480</div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works compact */}
      <div style={{ background: "var(--paper)", color: "var(--ink)", padding: "32px 20px", borderRadius: "32px 32px 0 0" }}>
        <div className="h-eyebrow" style={{ color: "var(--green-700)" }}>Как это работает</div>
        <h2 className="h-display" style={{ fontSize: 32, marginTop: 10 }}>Четыре шага</h2>
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { n: "01", t: "Выбираете план", d: "Похудение, баланс или набор." },
            { n: "02", t: "Шеф готовит свежее", d: "Каждое утро на нашей кухне." },
            { n: "03", t: "Привозим в боксе", d: "Утром или вечером — на ваш выбор." },
            { n: "04", t: "Открываете и едите", d: "5 приёмов пищи на день." },
          ].map(s => (
            <div key={s.n} style={{ display: "flex", gap: 14, padding: 16, background: "#fff", borderRadius: 16, border: "1px solid var(--line)" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "var(--green-600)" }}>{s.n}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{s.t}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{s.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div style={{ background: "var(--paper)", color: "var(--ink)", padding: "20px 20px 32px" }}>
        <div className="h-eyebrow" style={{ color: "var(--green-700)" }}>Планы</div>
        <h2 className="h-display" style={{ fontSize: 32, marginTop: 10 }}>Под вашу цель</h2>
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { t: "Похудение", k: "1200–1500 ккал", p: 850, c: "var(--lime-300)", bg: "var(--green-900)" },
            { t: "Поддержание", k: "1700–2000 ккал", p: 980, c: "var(--orange-500)", bg: "var(--green-700)", hot: true },
            { t: "Набор массы", k: "2200–2800 ккал", p: 1180, c: "#7fb87f", bg: "var(--green-900)" },
          ].map(p => (
            <div key={p.t} style={{ background: p.bg, color: "#fff", padding: 18, borderRadius: 18, display: "flex", justifyContent: "space-between", alignItems: "center", border: p.hot ? `1.5px solid ${p.c}` : "none" }}>
              <div>
                {p.hot && <div className="tag tag-orange" style={{ marginBottom: 6 }}>хит</div>}
                <div className="h-title" style={{ fontSize: 20 }}>{p.t}</div>
                <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>{p.k}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, opacity: 0.5 }}>от</div>
                <div className="h-display" style={{ fontSize: 24, color: p.c }}>{p.p}</div>
                <div style={{ fontSize: 10, opacity: 0.6 }}>сом/день</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{ height: 80 }} />
      <div style={{
        position: "sticky", bottom: 0, left: 0, right: 0,
        background: "rgba(7,38,15,.95)", backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,.08)",
        padding: "12px 20px 28px",
        display: "grid", gridTemplateColumns: "repeat(5, 1fr)",
        marginTop: -80,
      }}>
        {[
          { i: Icons.heart, l: "Главная", a: true },
          { i: Icons.bag, l: "Меню" },
          { i: Icons.scale, l: "Калькулятор" },
          { i: Icons.fridge, l: "Холодильник" },
          { i: Icons.user, l: "Кабинет" },
        ].map((n, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: n.a ? "var(--lime-300)" : "rgba(255,255,255,.5)" }}>
            {n.i}
            <div style={{ fontSize: 9, fontWeight: 600 }}>{n.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Mobile cart screen ----------
function MobileCart() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100%", overflow: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", paddingTop: 56 }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(10,18,8,.05)", display: "grid", placeItems: "center" }}>
          {Icons.arrow && <span style={{ transform: "rotate(180deg)", display: "inline-flex" }}>{Icons.arrow}</span>}
        </div>
        <div className="h-title" style={{ fontSize: 18 }}>Ваш заказ</div>
        <div style={{ width: 38 }} />
      </div>

      <div style={{ padding: "8px 20px 20px" }}>
        <div style={{ background: "var(--green-900)", color: "#fff", padding: 18, borderRadius: 20 }}>
          <div className="h-eyebrow" style={{ color: "var(--lime-300)", fontSize: 10 }}>Подписка</div>
          <div className="h-title" style={{ fontSize: 22, marginTop: 6 }}>Поддержание · 1 неделя</div>
          <div className="macro-bar" style={{ marginTop: 14, gridTemplateColumns: "repeat(4,1fr)" }}>
            <div style={{ background: "rgba(255,255,255,.06)" }}>
              <div className="v" style={{ color: "var(--lime-300)", fontSize: 16 }}>1850</div>
              <div className="l" style={{ color: "rgba(255,255,255,.5)" }}>ккал</div>
            </div>
            <div style={{ background: "rgba(255,255,255,.06)" }}>
              <div className="v" style={{ color: "#fff", fontSize: 16 }}>5</div>
              <div className="l" style={{ color: "rgba(255,255,255,.5)" }}>боксов</div>
            </div>
            <div style={{ background: "rgba(255,255,255,.06)" }}>
              <div className="v" style={{ color: "#fff", fontSize: 16 }}>7</div>
              <div className="l" style={{ color: "rgba(255,255,255,.5)" }}>дней</div>
            </div>
            <div style={{ background: "rgba(255,255,255,.06)" }}>
              <div className="v" style={{ color: "var(--orange-500)", fontSize: 16 }}>☀</div>
              <div className="l" style={{ color: "rgba(255,255,255,.5)" }}>утром</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16, fontSize: 13, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Рацион понедельника</div>
        {[
          { t: "Овсянка с ягодами", k: "Завтрак · 320 ккал", kind: "oats" },
          { t: "Курица терияки", k: "Обед · 480 ккал", kind: "chicken-rice" },
          { t: "Лосось су‑вид", k: "Ужин · 420 ккал", kind: "salmon-greens" },
        ].map((m, i) => (
          <div key={i} className="card" style={{ marginTop: 10, padding: 12, display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
              <FoodContainer kind={m.kind} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{m.t}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{m.k}</div>
            </div>
            <div style={{ width: 28, height: 28, borderRadius: 14, background: "rgba(10,18,8,.05)", display: "grid", placeItems: "center" }}>
              {Icons.check}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "12px 20px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        <SummaryRow l="Тариф" v="6 860 сом" />
        <SummaryRow l="Доставка" v="Бесплатно" />
        <SummaryRow l="Промокод START10" v="−686 сом" accent />
        <div style={{ borderTop: "1px dashed var(--line)", paddingTop: 12, marginTop: 4 }}>
          <SummaryRow l="Итого" v="6 174 сом" big />
        </div>
      </div>

      <div style={{ position: "sticky", bottom: 0, padding: "16px 20px 28px", background: "rgba(250,247,240,.92)", backdropFilter: "blur(14px)", borderTop: "1px solid var(--line)", marginTop: 20 }}>
        <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "18px" }}>
          К оплате · 6 174 сом
          {Icons.arrow}
        </button>
      </div>
    </div>
  );
}
function SummaryRow({ l, v, accent, big }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ fontSize: big ? 16 : 14, color: big ? "var(--ink)" : "var(--muted)", fontWeight: big ? 600 : 400 }}>{l}</div>
      <div style={{ fontSize: big ? 22 : 14, fontWeight: 600, fontFamily: big ? "var(--font-display)" : "inherit", color: accent ? "var(--green-600)" : "var(--ink)" }}>{v}</div>
    </div>
  );
}

// ---------- Account dashboard (desktop) ----------
function AccountDashboard() {
  return (
    <AuthGate
      title="Личный кабинет"
      sub="Войдите по номеру телефона, чтобы видеть свой план, доставки и историю заказов."
    >
      <AccountDashboardInner />
    </AuthGate>
  );
}

function greetingByHour() {
  const h = new Date().getHours();
  if (h < 6) return "Доброй ночи";
  if (h < 12) return "Доброе утро";
  if (h < 18) return "Добрый день";
  return "Добрый вечер";
}

function AccountDashboardInner() {
  const { user, profile, loading } = useUserProfile();
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [busy, setBusy] = useState(false);

  React.useEffect(() => {
    setNameDraft(profile?.name || "");
  }, [profile?.name]);

  const phoneShort = user?.phoneNumber
    ? user.phoneNumber.replace(/^\+996/, "+996 ").replace(/(\d{3})(\d{3})$/, "$1 $2")
    : "";
  const displayName = profile?.name?.trim() || "Гость";
  const sub = profile?.subscription;

  const saveName = async () => {
    setBusy(true);
    try {
      await window.UsersApi.update(user.uid, { name: nameDraft.trim() });
      setEditingName(false);
    } catch (e) {
      window.alert("Не удалось сохранить: " + e.message);
    }
    setBusy(false);
  };

  return (
    <div style={{ background: "var(--paper)", minHeight: 800 }}>
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 32, gap: 20, flexWrap: "wrap" }}>
          <div style={{ minWidth: 0 }}>
            <div className="h-eyebrow" style={{ color: "var(--green-700)" }}>Личный кабинет</div>
            <h1 className="h-display" style={{ fontSize: "clamp(34px, 5vw, 56px)", marginTop: 10 }}>
              {greetingByHour()}, {editingName ? (
                <input
                  autoFocus
                  value={nameDraft}
                  onChange={e => setNameDraft(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") saveName();
                    else if (e.key === "Escape") { setEditingName(false); setNameDraft(profile?.name || ""); }
                  }}
                  placeholder="Имя"
                  style={{
                    border: "2px solid var(--green-600)", borderRadius: 12, padding: "4px 10px",
                    fontFamily: "inherit", fontSize: "inherit", fontWeight: "inherit", color: "inherit",
                    background: "#fff", maxWidth: 280, outline: "none",
                  }}
                />
              ) : (
                <span onClick={() => setEditingName(true)} style={{ cursor: "pointer", borderBottom: "2px dashed var(--line)" }} title="Нажмите, чтобы изменить имя">{displayName}</span>
              )}
            </h1>
            <div style={{ fontSize: 15, color: "var(--muted)", marginTop: 8 }}>
              {phoneShort}
              {sub ? ` · ${sub.programName || sub.programId} · день ${sub.currentDay}/${sub.totalDays}` : " · подписка не активна"}
              {loading && " · загружаем…"}
            </div>
            {editingName && (
              <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                <button className="btn btn-primary" style={{ padding: "8px 14px", fontSize: 13 }} onClick={saveName} disabled={busy}>{busy ? "Сохраняем…" : "Сохранить"}</button>
                <button className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: 13 }} onClick={() => { setEditingName(false); setNameDraft(profile?.name || ""); }}>Отмена</button>
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {sub ? (
              <>
                <button className="btn btn-ghost">Пауза подписки</button>
                <button className="btn btn-dark" onClick={() => window.go?.("constructor")}>Изменить план {Icons.arrow}</button>
              </>
            ) : (
              <button className="btn btn-primary" onClick={() => window.go?.("programs")}>Выбрать программу {Icons.arrow}</button>
            )}
          </div>
        </div>

        {!sub && (
          <div className="card" style={{ padding: 32, textAlign: "center", marginBottom: 20, background: "var(--cream)" }}>
            <div className="h-title" style={{ fontSize: 22 }}>Подписка ещё не оформлена</div>
            <p style={{ marginTop: 12, color: "var(--muted)", maxWidth: 480, margin: "12px auto 0", fontSize: 14, lineHeight: 1.55 }}>
              Выберите программу питания — мы рассчитаем КБЖУ под вашу цель и привезём бокс утром или вечером следующего дня.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
              <button className="btn btn-primary" onClick={() => window.go?.("programs")}>Все программы {Icons.arrow}</button>
              <button className="btn btn-ghost" onClick={() => window.go?.("constructor")}>Собрать рацион</button>
            </div>
          </div>
        )}

        {sub && (<div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
          {/* Today's plan */}
          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div>
                <div className="h-title" style={{ fontSize: 24 }}>Сегодня · понедельник</div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>Курьер: Бакыт · доставит до 08:30</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 999, background: "rgba(28,194,74,.1)", color: "var(--green-700)", fontSize: 12, fontWeight: 600 }}>
                <span style={{ width: 8, height: 8, borderRadius: 4, background: "var(--green-600)", boxShadow: "0 0 8px var(--green-600)" }} />
                В пути
              </div>
            </div>

            {/* Map placeholder */}
            <div style={{
              height: 180, borderRadius: 16,
              background: `
                linear-gradient(135deg, #e8f0d9, #c8e09a),
                repeating-linear-gradient(45deg, transparent 0 20px, rgba(0,0,0,.04) 20px 21px)
              `,
              backgroundBlendMode: "multiply",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg, transparent 0 40px, rgba(255,255,255,.4) 40px 41px), repeating-linear-gradient(0deg, transparent 0 40px, rgba(255,255,255,.4) 40px 41px)" }} />
              {/* Route */}
              <svg viewBox="0 0 600 180" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                <path d="M40 140 Q 200 140 300 80 T 560 40" stroke="var(--orange-500)" strokeWidth="4" fill="none" strokeDasharray="0,0" strokeLinecap="round" />
              </svg>
              <div style={{ position: "absolute", left: 30, bottom: 130, width: 18, height: 18, borderRadius: 9, background: "var(--orange-500)", border: "3px solid #fff", boxShadow: "0 4px 12px rgba(0,0,0,.2)" }} />
              <div style={{ position: "absolute", right: 30, top: 30, padding: "8px 12px", background: "var(--ink)", color: "#fff", borderRadius: 10, fontSize: 12, fontWeight: 600 }}>📍 Ваш адрес</div>
            </div>

            <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
              {["Завтрак","Перекус","Обед","Перекус","Ужин"].map((m, i) => (
                <div key={i} style={{ background: "rgba(10,18,8,.04)", borderRadius: 14, padding: 12, textAlign: "center" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "#0a0e08", margin: "0 auto", overflow: "hidden" }}>
                    <FoodContainer kind={["oats","dessert","chicken-rice","salad","salmon-greens"][i]} />
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 8 }}>{m}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{[320,180,480,150,420][i]} ккал</div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card-dark" style={{ padding: 24, background: "var(--green-700)" }}>
              <div className="h-eyebrow" style={{ color: "var(--lime-300)", fontSize: 10 }}>прогресс плана</div>
              <div className="h-display" style={{ fontSize: 56, color: "var(--lime-300)", marginTop: 8 }}>−3.2 кг</div>
              <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>с момента старта 12 дней назад</div>
              <div style={{ marginTop: 16, height: 8, borderRadius: 4, background: "rgba(255,255,255,.1)", overflow: "hidden" }}>
                <div style={{ width: "43%", height: "100%", background: "var(--lime-300)" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginTop: 8, opacity: 0.6 }}>
                <span>День 12 / 28</span>
                <span>цель: −7 кг</span>
              </div>
            </div>
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>Следующая доставка</div>
              <div className="h-title" style={{ fontSize: 18, marginTop: 6 }}>Завтра, 06:30 — 08:30</div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>Меню вторника · посмотреть</div>
            </div>
            <div className="card" style={{ padding: 20, background: "var(--orange-500)", color: "#1a0a00" }}>
              <div style={{ fontSize: 13 }}>Бонусный счёт</div>
              <div className="h-display" style={{ fontSize: 32, marginTop: 4 }}>1 240 сом</div>
              <div style={{ fontSize: 12, marginTop: 4, opacity: 0.7 }}>списать на следующий заказ</div>
            </div>
          </div>
        </div>)}

        {/* Quick links visible to everyone */}
        <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          <button onClick={() => window.go?.("cart")} style={{ ...quickTileStyle, background: "var(--cream)" }}>
            {Icons.bag}
            <div style={{ flex: 1, textAlign: "left", marginLeft: 12 }}>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>Корзина</div>
              <div className="h-title" style={{ fontSize: 18, marginTop: 2 }}>{profile?.cart?.length || 0} {(profile?.cart?.length || 0) === 1 ? "товар" : "товаров"}</div>
            </div>
            {Icons.arrow}
          </button>
          <button onClick={() => window.go?.("contacts")} style={{ ...quickTileStyle, background: "var(--cream)" }}>
            {Icons.phone}
            <div style={{ flex: 1, textAlign: "left", marginLeft: 12 }}>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>Поддержка</div>
              <div className="h-title" style={{ fontSize: 18, marginTop: 2 }}>Связаться</div>
            </div>
            {Icons.arrow}
          </button>
          <button onClick={async () => { if (window.confirm("Выйти из аккаунта?")) { await window.AuthApi.signOut(); window.go?.("home"); } }} style={{ ...quickTileStyle, background: "var(--cream)" }}>
            {Icons.user}
            <div style={{ flex: 1, textAlign: "left", marginLeft: 12 }}>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>Сессия</div>
              <div className="h-title" style={{ fontSize: 18, marginTop: 2, color: "#c33" }}>Выйти</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

const quickTileStyle = {
  display: "flex", alignItems: "center", gap: 4,
  padding: 20, borderRadius: 18,
  border: "1px solid var(--line)", background: "#fff",
  cursor: "pointer", color: "inherit",
  fontFamily: "inherit", textAlign: "left",
};

// ---------- Checkout ----------
function Checkout() {
  return (
    <div style={{ background: "var(--paper)", minHeight: 800 }}>
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div style={{ fontSize: 13, color: "var(--muted)" }}>Корзина · <span style={{ color: "var(--ink)", fontWeight: 600 }}>Оплата</span> · Готово</div>
        <h1 className="h-display" style={{ fontSize: 56, marginTop: 14 }}>Оплата заказа</h1>

        <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
          <div className="card" style={{ padding: 32 }}>
            <SectionStep n="1" title="Адрес доставки">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Input label="Город" placeholder="Бишкек" />
                <Input label="Район" placeholder="Свердловский" />
                <Input label="Улица и дом" placeholder="ул. Ибраимова, 115" />
                <Input label="Кв./офис" placeholder="42" />
              </div>
              <div style={{ marginTop: 14 }}>
                <Input label="Комментарий курьеру" placeholder="Звонок в домофон не работает" />
              </div>
            </SectionStep>

            <SectionStep n="2" title="Когда привозить">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <button className="btn btn-ghost" style={{ padding: "16px", justifyContent: "flex-start", border: "1.5px solid var(--green-600)", color: "var(--green-700)" }}>
                  ☀ <div style={{ textAlign: "left" }}><div style={{ fontWeight: 600 }}>Утром</div><div style={{ fontSize: 11, opacity: 0.7 }}>06:00 — 09:00</div></div>
                </button>
                <button className="btn btn-ghost" style={{ padding: "16px", justifyContent: "flex-start" }}>
                  ☾ <div style={{ textAlign: "left" }}><div style={{ fontWeight: 600 }}>Вечером</div><div style={{ fontSize: 11, opacity: 0.7 }}>19:00 — 22:00</div></div>
                </button>
              </div>
            </SectionStep>

            <SectionStep n="3" title="Способ оплаты">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {[
                  { t: "Карта", s: "Visa, Mastercard, Элкарт", a: true },
                  { t: "MBank", s: "перевод по QR" },
                  { t: "Optima", s: "перевод по QR" },
                ].map((p, i) => (
                  <button key={i} className="btn btn-ghost" style={{
                    padding: 16, flexDirection: "column", alignItems: "flex-start", gap: 4,
                    border: p.a ? "1.5px solid var(--green-600)" : undefined,
                    color: p.a ? "var(--green-700)" : "var(--ink)",
                    background: p.a ? "rgba(28,194,74,.04)" : "transparent",
                  }}>
                    <div style={{ fontWeight: 600 }}>{p.t}</div>
                    <div style={{ fontSize: 11, opacity: 0.7 }}>{p.s}</div>
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 14, padding: 14, borderRadius: 12, background: "rgba(255,138,31,.08)", border: "1px dashed rgba(255,138,31,.3)", fontSize: 13, color: "var(--orange-600)" }}>
                Доступна рассрочка 0% от MBank на подписки от 1 месяца
              </div>
            </SectionStep>
          </div>

          {/* Order summary */}
          <div style={{ position: "sticky", top: 100, alignSelf: "start" }} className="card">
            <div style={{ padding: 24, borderBottom: "1px solid var(--line)" }}>
              <div className="h-title" style={{ fontSize: 20 }}>Ваш заказ</div>
            </div>
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              <SummaryRow l="План Поддержание" v="1 неделя" />
              <SummaryRow l="Калории" v="1850 ккал/день" />
              <SummaryRow l="Боксов в день" v="5 приёмов" />
              <SummaryRow l="Доставка" v="Утром, 7 дней" />
              <div style={{ borderTop: "1px dashed var(--line)", marginTop: 4, paddingTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                <SummaryRow l="Тариф" v="6 860 сом" />
                <SummaryRow l="Доставка" v="Бесплатно" />
                <SummaryRow l="Промокод START10" v="−686 сом" accent />
              </div>
              <div style={{ borderTop: "1px solid var(--line)", marginTop: 4, paddingTop: 14 }}>
                <SummaryRow l="К оплате" v="6 174 сом" big />
              </div>
            </div>
            <div style={{ padding: 24, paddingTop: 0 }}>
              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: 18 }}>
                Оплатить 6 174 сом
                {Icons.arrow}
              </button>
              <div style={{ fontSize: 11, color: "var(--muted)", textAlign: "center", marginTop: 10 }}>
                Защищённая оплата · 256‑bit SSL
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function SectionStep({ n, title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--ink)", color: "#fff", display: "grid", placeItems: "center", fontSize: 13, fontWeight: 700 }}>{n}</div>
        <div className="h-title" style={{ fontSize: 22 }}>{title}</div>
      </div>
      {children}
    </div>
  );
}

Object.assign(window, { MobileHome, MobileCart, AccountDashboard, Checkout, SummaryRow });
