/* SixBox — additional pages: Menu, Constructor, Cart, Account (full), Plan detail, Contacts */
const { useState: useStateP, useMemo: useMemoP } = React;

// ============================================================
// MENU PAGE — full week menu with filters
// ============================================================
function MenuPage() {
  const [filter, setFilter] = useStateP("all");
  const [day, setDay] = useStateP(0);

  const days = [
    { id: 0, label: "Пн", date: "4 мая" },
    { id: 1, label: "Вт", date: "5 мая" },
    { id: 2, label: "Ср", date: "6 мая" },
    { id: 3, label: "Чт", date: "7 мая" },
    { id: 4, label: "Пт", date: "8 мая" },
    { id: 5, label: "Сб", date: "9 мая" },
    { id: 6, label: "Вс", date: "10 мая" },
  ];

  const allMeals = [
    { type: "Завтрак", title: "Овсянка с ягодами и миндалём", kcal: 320, p: 12, f: 8, c: 52, kind: "oats", tag: "loss" },
    { type: "Завтрак", title: "Сырники с творогом 5%", kcal: 290, p: 22, f: 6, c: 38, kind: "dessert", tag: "balance" },
    { type: "Завтрак", title: "Гранола с йогуртом и манго", kcal: 380, p: 14, f: 10, c: 60, kind: "oats", tag: "gain" },
    { type: "Перекус", title: "Протеиновый смузи манго‑шпинат", kcal: 220, p: 24, f: 4, c: 24, kind: "smoothie", tag: "balance" },
    { type: "Перекус", title: "Хумус с овощным пико", kcal: 180, p: 8, f: 9, c: 18, kind: "salad", tag: "loss" },
    { type: "Обед", title: "Курица терияки с диким рисом", kcal: 480, p: 38, f: 14, c: 42, kind: "chicken-rice", tag: "balance" },
    { type: "Обед", title: "Боул с тофу, киноа и эдамаме", kcal: 460, p: 28, f: 16, c: 48, kind: "tofu-quinoa", tag: "loss" },
    { type: "Обед", title: "Говядина с булгуром и овощами гриль", kcal: 580, p: 42, f: 22, c: 50, kind: "beef-bowl", tag: "gain" },
    { type: "Ужин", title: "Лосось су‑вид с киноа", kcal: 420, p: 36, f: 18, c: 28, kind: "salmon-greens", tag: "balance" },
    { type: "Ужин", title: "Зелёный салат с креветкой", kcal: 380, p: 30, f: 14, c: 22, kind: "salad", tag: "loss" },
    { type: "Ужин", title: "Индейка с бататом и брокколи", kcal: 540, p: 40, f: 16, c: 56, kind: "chicken-rice", tag: "gain" },
    { type: "Десерт", title: "Чиа‑пудинг с кокосом", kcal: 180, p: 6, f: 8, c: 22, kind: "dessert", tag: "balance" },
  ];

  const filtered = filter === "all" ? allMeals : allMeals.filter(m => m.tag === filter);

  return (
    <>
      <Header active="menu" />
      <section style={{ background: "var(--cream)", padding: "56px 0 40px" }}>
        <div className="container">
          <div className="h-eyebrow" style={{ color: "var(--green-700)" }}>Меню</div>
          <h1 className="h-display" style={{ fontSize: "clamp(48px, 6vw, 88px)", margin: "12px 0 0", maxWidth: "16ch" }}>
            Меню недели<br/>
            <em style={{ fontStyle: "italic", color: "var(--orange-600)", fontWeight: 500 }}>4 — 10 мая</em>
          </h1>
          <p style={{ marginTop: 18, fontSize: 18, color: "var(--muted)", maxWidth: 560, lineHeight: 1.55 }}>
            Шеф обновляет меню каждый понедельник. КБЖУ и аллергены — в карточке каждого блюда.
          </p>

          {/* Day picker */}
          <div style={{ marginTop: 32, display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
            {days.map(d => {
              const active = d.id === day;
              return (
                <button key={d.id} onClick={() => setDay(d.id)} style={{
                  padding: "12px 18px",
                  borderRadius: 14,
                  background: active ? "var(--ink)" : "#fff",
                  color: active ? "#fff" : "var(--ink)",
                  border: active ? "none" : "1px solid var(--line)",
                  display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2,
                  minWidth: 92,
                }}>
                  <div style={{ fontSize: 11, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.1em" }}>{d.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{d.date}</div>
                </button>
              );
            })}
          </div>

          {/* Filters */}
          <div style={{ marginTop: 24, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "var(--muted)", marginRight: 8 }}>Под план:</span>
            {[
              { id: "all", l: "Все блюда" },
              { id: "loss", l: "Похудение", c: "var(--lime-300)" },
              { id: "balance", l: "Баланс", c: "var(--orange-500)" },
              { id: "gain", l: "Набор массы", c: "#7fb87f" },
            ].map(f => {
              const active = filter === f.id;
              return (
                <button key={f.id} onClick={() => setFilter(f.id)} style={{
                  padding: "8px 14px",
                  borderRadius: 999,
                  fontSize: 13, fontWeight: 600,
                  background: active ? "var(--ink)" : "#fff",
                  color: active ? "#fff" : "var(--ink)",
                  border: "1px solid " + (active ? "var(--ink)" : "var(--line)"),
                  display: "inline-flex", alignItems: "center", gap: 6,
                }}>
                  {f.c && <span style={{ width: 8, height: 8, borderRadius: 4, background: f.c }} />}
                  {f.l}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section style={{ padding: "40px 0 120px", background: "var(--paper)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {filtered.map((m, i) => (
              <div key={i} className="card" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ background: "#0a0e08", padding: 18 }}>
                  <FoodContainer kind={m.kind} label={`#${i + 1}`} />
                </div>
                <div style={{ padding: 22, flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="tag tag-outline">{m.type}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: "var(--orange-600)" }}>
                      {Icons.flame} {m.kcal}
                    </span>
                  </div>
                  <div className="h-title" style={{ fontSize: 19, marginTop: 12, lineHeight: 1.15, flex: 1 }}>{m.title}</div>
                  <div className="macro-bar" style={{ marginTop: 14 }}>
                    <div><div className="v">{m.p}g</div><div className="l">белки</div></div>
                    <div><div className="v">{m.f}g</div><div className="l">жиры</div></div>
                    <div><div className="v">{m.c}g</div><div className="l">углев.</div></div>
                    <div><div className="v">320g</div><div className="l">вес</div></div>
                  </div>
                </div>
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
// CONSTRUCTOR PAGE — full-page рацион builder
// ============================================================
function ConstructorPage() {
  const r = useRationState();
  const preset = PLAN_PRESETS.find(p => p.id === r.plan);

  return (
    <>
      <Header light active="constructor" />
      <section style={{ background: "var(--green-900)", color: "#fff", padding: "56px 0 32px" }}>
        <div className="container">
          <div className="h-eyebrow" style={{ color: "var(--lime-300)" }}>Конструктор рациона</div>
          <h1 className="h-display" style={{ fontSize: "clamp(48px, 6vw, 88px)", margin: "12px 0 0", maxWidth: "16ch" }}>
            Соберите свой<br/>
            <em style={{ fontStyle: "italic", color: "var(--orange-500)", fontWeight: 500 }}>идеальный день</em>
          </h1>
          <p style={{ marginTop: 18, fontSize: 18, opacity: 0.7, maxWidth: 560, lineHeight: 1.55 }}>
            Четыре простых шага — и мы знаем, что приготовить и привезти.
          </p>
        </div>
      </section>

      <section style={{ background: "var(--paper)", padding: "60px 0 100px" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32 }}>
            {/* Left — steps */}
            <div className="card" style={{ padding: 36 }}>
              {/* Step 1 — plan */}
              <BigStep n="01" title="Выберите цель">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 14 }}>
                  {PLAN_PRESETS.map(p => {
                    const active = p.id === r.plan;
                    return (
                      <button key={p.id} onClick={() => r.setPlan(p.id)} style={{
                        padding: "20px 16px",
                        borderRadius: 18,
                        border: active ? "2px solid var(--green-600)" : "1.5px solid var(--line)",
                        background: active ? "rgba(28,194,74,.05)" : "#fff",
                        textAlign: "left",
                        color: "var(--ink)",
                      }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{p.label}</div>
                        <div className="h-display" style={{ fontSize: 32, marginTop: 8, color: active ? "var(--green-700)" : "var(--ink)" }}>{p.kcal}</div>
                        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>ккал/день</div>
                      </button>
                    );
                  })}
                </div>
              </BigStep>

              {/* Step 2 — duration */}
              <BigStep n="02" title="Срок подписки">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 14 }}>
                  {DURATIONS.map(d => {
                    const active = d.id === r.duration;
                    return (
                      <button key={d.id} onClick={() => r.setDuration(d.id)} style={{
                        padding: "18px 12px",
                        borderRadius: 14,
                        border: active ? "2px solid var(--orange-500)" : "1.5px solid var(--line)",
                        background: active ? "rgba(255,138,31,.06)" : "#fff",
                        position: "relative",
                        color: "var(--ink)",
                        textAlign: "left",
                      }}>
                        {d.badge && (
                          <div style={{
                            position: "absolute", top: -8, right: 8,
                            background: d.badge.includes("%") ? "var(--lime-300)" : "var(--orange-500)",
                            color: "var(--green-900)",
                            fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 999,
                            textTransform: "uppercase", letterSpacing: "0.06em",
                          }}>{d.badge}</div>
                        )}
                        <div style={{ fontSize: 15, fontWeight: 600 }}>{d.label}</div>
                        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{d.sub}</div>
                      </button>
                    );
                  })}
                </div>
              </BigStep>

              {/* Step 3 — meals */}
              <BigStep n="03" title="Сколько приёмов пищи">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 14 }}>
                  {[3, 4, 5, 6].map(c => {
                    const active = r.meals === c;
                    return (
                      <button key={c} onClick={() => r.setMeals(c)} style={{
                        padding: "16px 12px",
                        borderRadius: 14,
                        border: active ? "2px solid var(--green-600)" : "1.5px solid var(--line)",
                        background: active ? "rgba(28,194,74,.05)" : "#fff",
                        color: "var(--ink)",
                      }}>
                        <div className="h-display" style={{ fontSize: 28 }}>{c}</div>
                        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>приёмов</div>
                      </button>
                    );
                  })}
                </div>
              </BigStep>

              {/* Step 4 — delivery */}
              <BigStep n="04" title="Когда привозить">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
                  {[
                    { id: "morning", label: "Утром", sub: "06:00 — 09:00 · еда на сегодня", icon: "☀" },
                    { id: "evening", label: "Вечером", sub: "19:00 — 22:00 · еда на завтра", icon: "☾" },
                  ].map(d => {
                    const active = r.delivery === d.id;
                    return (
                      <button key={d.id} onClick={() => r.setDelivery(d.id)} style={{
                        padding: "20px 18px",
                        borderRadius: 14,
                        border: active ? "2px solid var(--lime-300)" : "1.5px solid var(--line)",
                        background: active ? "rgba(179,240,106,.08)" : "#fff",
                        display: "flex", alignItems: "center", gap: 14,
                        textAlign: "left",
                        color: "var(--ink)",
                      }}>
                        <div style={{ fontSize: 28 }}>{d.icon}</div>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 600 }}>{d.label}</div>
                          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{d.sub}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </BigStep>

              <BigStep n="05" title="Особые предпочтения" last>
                <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                  {["Без рыбы", "Без говядины", "Вегетарианский", "Без глютена", "Без лактозы", "Без орехов"].map(t => (
                    <button key={t} className="btn btn-ghost" style={{ padding: "10px 16px", fontSize: 13 }}>{t}</button>
                  ))}
                </div>
              </BigStep>
            </div>

            {/* Right — sticky summary */}
            <div style={{ position: "sticky", top: 100, alignSelf: "start" }}>
              <div style={{ background: "var(--green-900)", color: "#fff", borderRadius: 28, padding: 32, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 0%, rgba(255,138,31,.2), transparent 60%)" }} />
                <div style={{ position: "relative" }}>
                  <div className="h-eyebrow" style={{ color: "var(--lime-300)" }}>Ваш рацион</div>
                  <div className="h-title" style={{ fontSize: 26, marginTop: 8 }}>{preset.label}</div>
                  <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <SumStat l="Калорий" v={preset.kcal} c="var(--lime-300)" />
                    <SumStat l="Белок" v={`${preset.protein}г`} c="#fff" />
                    <SumStat l="Жиры" v={`${preset.fat}г`} c="#fff" />
                    <SumStat l="Углеводы" v={`${preset.carbs}г`} c="#fff" />
                  </div>

                  <div style={{ marginTop: 24, padding: 16, borderRadius: 14, background: "rgba(255,255,255,.05)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
                      <span style={{ opacity: 0.7 }}>Срок</span>
                      <span style={{ fontWeight: 600 }}>{DURATIONS.find(d => d.id === r.duration).label}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
                      <span style={{ opacity: 0.7 }}>Приёмов в день</span>
                      <span style={{ fontWeight: 600 }}>{r.meals}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <span style={{ opacity: 0.7 }}>Доставка</span>
                      <span style={{ fontWeight: 600 }}>{r.delivery === "morning" ? "Утром" : "Вечером"}</span>
                    </div>
                  </div>

                  <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px dashed rgba(255,255,255,.15)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ opacity: 0.7, fontSize: 13 }}>Итого</span>
                      <div style={{ textAlign: "right" }}>
                        {r.total.discount > 0 && (
                          <div style={{ fontSize: 12, textDecoration: "line-through", opacity: 0.5 }}>{fmtSom(r.total.sub)}</div>
                        )}
                        <div className="h-display" style={{ fontSize: 36, color: "var(--lime-300)" }}>{fmtSom(r.total.total)}</div>
                      </div>
                    </div>
                  </div>

                  <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: 18, marginTop: 20 }}>
                    Перейти к оплате
                    {Icons.arrow}
                  </button>
                  <button className="btn btn-ghost-light" style={{ width: "100%", justifyContent: "center", padding: 14, marginTop: 8 }}>
                    Сохранить и заказать позже
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

function BigStep({ n, title, children, last }) {
  return (
    <div style={{ paddingBottom: last ? 0 : 28, marginBottom: last ? 0 : 28, borderBottom: last ? "none" : "1px solid var(--line)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div className="h-display" style={{ fontSize: 22, color: "var(--orange-500)" }}>{n}</div>
        <div className="h-title" style={{ fontSize: 22 }}>{title}</div>
      </div>
      {children}
    </div>
  );
}
function SumStat({ l, v, c }) {
  return (
    <div style={{ background: "rgba(255,255,255,.05)", padding: 14, borderRadius: 12 }}>
      <div style={{ fontSize: 11, opacity: 0.6 }}>{l}</div>
      <div className="h-display" style={{ fontSize: 24, marginTop: 4, color: c }}>{v}</div>
    </div>
  );
}

// ============================================================
// CART PAGE
// ============================================================
function CartPage() {
  return (
    <>
      <Header active="cart" />
      <AuthGate
        title="Корзина"
        sub="Войдите по номеру, чтобы оформить заказ — мы запомним адрес доставки и настройки."
      >
        <CartPageInner />
      </AuthGate>
      <Footer />
    </>
  );
}

function CartPageInner() {
  const { user, profile, loading } = useUserProfile();
  const items = profile?.cart || [];
  const subtotal = items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.qty) || 1), 0);
  const fmt = (n) => Number(n).toLocaleString("ru-RU").replace(/,/g, " ");

  const removeItem = async (id) => {
    try { await window.UsersApi.removeFromCart(user.uid, id); }
    catch (e) { window.alert("Ошибка: " + e.message); }
  };

  const clearAll = async () => {
    if (!window.confirm("Очистить корзину?")) return;
    try { await window.UsersApi.clearCart(user.uid); }
    catch (e) { window.alert("Ошибка: " + e.message); }
  };

  if (loading) {
    return (
      <section style={{ background: "var(--paper)", padding: "60px 0", textAlign: "center", color: "var(--muted)" }}>Загружаем корзину…</section>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <section style={{ background: "var(--paper)", padding: "40px 0 80px" }}>
        <div className="container">
          <div style={{ fontSize: 13, color: "var(--muted)" }}><span style={{ color: "var(--ink)", fontWeight: 600 }}>Корзина</span> · Оплата · Готово</div>
          <h1 className="h-display" style={{ fontSize: "clamp(36px, 5vw, 56px)", marginTop: 14 }}>Корзина пуста</h1>

          <div className="card" style={{ marginTop: 32, padding: 40, textAlign: "center", background: "var(--cream)" }}>
            <div style={{
              width: 72, height: 72, borderRadius: 36,
              background: "var(--green-700)", color: "#fff",
              display: "grid", placeItems: "center", margin: "0 auto 20px",
            }}>{Icons.bag}</div>
            <div className="h-title" style={{ fontSize: 22 }}>Тут пока ничего нет</div>
            <p style={{ marginTop: 12, color: "var(--muted)", fontSize: 14, lineHeight: 1.55, maxWidth: 460, margin: "12px auto 0" }}>
              Выберите готовую программу или соберите свой рацион в конструкторе — мы рассчитаем КБЖУ и привезём боксы по графику.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
              <button className="btn btn-primary" onClick={() => window.go?.("programs")}>Смотреть программы {Icons.arrow}</button>
              <button className="btn btn-ghost" onClick={() => window.go?.("constructor")}>Собрать рацион</button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Has items
  return (
    <section style={{ background: "var(--paper)", padding: "40px 0 80px" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 20, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 13, color: "var(--muted)" }}><span style={{ color: "var(--ink)", fontWeight: 600 }}>Корзина</span> · Оплата · Готово</div>
            <h1 className="h-display" style={{ fontSize: "clamp(36px, 5vw, 56px)", marginTop: 14 }}>Ваш заказ</h1>
            <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 6 }}>{items.length} {items.length === 1 ? "позиция" : "позиций"}</div>
          </div>
          <button className="btn btn-ghost" onClick={clearAll} style={{ padding: "10px 16px" }}>Очистить корзину</button>
        </div>

        <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {items.map(it => (
              <div key={it._id} className="card" style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="h-eyebrow" style={{ color: "var(--green-700)" }}>{it.kind || "Позиция"}</div>
                  <div className="h-title" style={{ fontSize: 20, marginTop: 6 }}>{it.title || it.name || "Без названия"}</div>
                  {it.subtitle && <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{it.subtitle}</div>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div className="h-display" style={{ fontSize: 22, whiteSpace: "nowrap" }}>{fmt(it.price)} <span style={{ fontSize: 12, color: "var(--muted)" }}>сом</span></div>
                  <button onClick={() => removeItem(it._id)} aria-label="Удалить" style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(10,18,8,.06)", color: "#c33", display: "grid", placeItems: "center" }}>{Icons.close}</button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="card" style={{ position: "sticky", top: 100, alignSelf: "start" }}>
            <div style={{ padding: 24, borderBottom: "1px solid var(--line)" }}>
              <div className="h-title" style={{ fontSize: 20 }}>Итого</div>
            </div>
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
              <SummaryRow l={`Подытог · ${items.length} поз.`} v={`${fmt(subtotal)} сом`} />
              <SummaryRow l="Доставка" v="Бесплатно" />
              <div style={{ borderTop: "1px dashed var(--line)", paddingTop: 14, marginTop: 4 }}>
                <SummaryRow l="К оплате" v={`${fmt(subtotal)} сом`} big />
              </div>
              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: 16, marginTop: 8 }} onClick={() => window.go?.("checkout")}>
                Перейти к оплате
                {Icons.arrow}
              </button>
              <div style={{ fontSize: 11, color: "var(--muted)", textAlign: "center" }}>
                Защищённая оплата · 256‑bit SSL
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// CONTACTS PAGE
// ============================================================
function ContactsPage() {
  return (
    <>
      <Header active="contacts" />
      <section style={{ background: "var(--cream)", padding: "56px 0 32px" }}>
        <div className="container">
          <div className="h-eyebrow" style={{ color: "var(--green-700)" }}>Контакты</div>
          <h1 className="h-display" style={{ fontSize: "clamp(48px, 6vw, 80px)", margin: "12px 0 0" }}>Мы рядом</h1>
          <p style={{ marginTop: 18, fontSize: 18, color: "var(--muted)", maxWidth: 560, lineHeight: 1.55 }}>
            Кухня и пункт самовывоза в центре Бишкека. Доставка по всему городу, в пределах объездной — бесплатно.
          </p>
        </div>
      </section>
      <Contact />
      <Footer />
    </>
  );
}

Object.assign(window, { MenuPage, ConstructorPage, CartPage, ContactsPage, BigStep, SumStat });
