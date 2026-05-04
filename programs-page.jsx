/* SixBox — Programs page (public) + Admin page (CRUD) — backed by Firestore */
const { useState: useStateProg, useEffect: useEffectProg } = React;

const ADMIN_PASSWORD = "sixbox2026"; // ⚠ замени в коде или вынеси в Firebase Auth для прода

const fmtSomProg = (n) => Number(n).toLocaleString("ru-RU").replace(/,/g, " ");

// ============================================================
// PROGRAM CARD
// ============================================================
function ProgramCard({ p, accent }) {
  const color = p.color || accent || "var(--lime-300)";
  const [picked, setPicked] = useStateProg(null); // chosen price row index
  const [adding, setAdding] = useStateProg(false);
  const user = (typeof useAuthUser === "function") ? useAuthUser() : null;

  const orderProgram = async () => {
    const row = (p.prices || [])[picked ?? 0];
    if (!row) { window.alert("Нет доступной цены"); return; }
    if (!user) {
      window.openAuth?.();
      return;
    }
    setAdding(true);
    try {
      await window.UsersApi.addToCart(user.uid, {
        kind: "Программа",
        title: `${p.name} · ${row.label}`,
        subtitle: `${p.kcalLabel || p.kcal + " ккал"} · ${row.days} дн.${row.discount ? ` · скидка ${row.discount}%` : ""}`,
        programId: p.id,
        days: row.days,
        price: row.price,
        qty: 1,
      });
      window.go?.("cart");
    } catch (e) {
      window.alert("Не удалось добавить: " + e.message);
    }
    setAdding(false);
  };
  return (
    <article style={{
      background: "var(--green-900)",
      color: "#fff",
      borderRadius: 28,
      border: "1px solid rgba(255,255,255,.06)",
      padding: 32,
      display: "flex",
      flexDirection: "column",
      gap: 20,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(60% 50% at 80% 0%, ${color === "var(--orange-500)" || color === "var(--orange-400)" ? "rgba(255,138,31,.15)" : "rgba(28,194,74,.12)"}, transparent 60%)`,
        pointerEvents: "none",
      }} />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 20, flex: 1 }}>
        <div className="h-eyebrow" style={{ color, opacity: 0.9 }}>{p.tagline || "Программа"}</div>

        <h3 style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "clamp(28px, 3.6vw, 42px)",
          margin: 0,
          letterSpacing: "0.02em",
          color: "transparent",
          WebkitTextStroke: `1.5px ${color}`,
          lineHeight: 1,
          wordBreak: "break-word",
        }}>{p.name}</h3>

        <div style={{ color, fontSize: 18, fontWeight: 600, fontFamily: "var(--font-display)" }}>
          {p.kcalLabel || `${p.kcal} ккал в день`}
        </div>

        {p.mealsLabel && (
          <div style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.45, fontWeight: 500 }}>
            {p.mealsLabel}
          </div>
        )}

        <div style={{ borderTop: "1px dashed rgba(255,255,255,.12)", paddingTop: 16 }}>
          <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.18em", opacity: 0.55, marginBottom: 12 }}>В меню обычно входит:</div>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
            {(p.meals || []).map((m, i) => (
              <li key={i} style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.5, display: "flex", gap: 8 }}>
                <span style={{ color, marginTop: 6, width: 4, height: 4, borderRadius: 2, background: color, flexShrink: 0, display: "inline-block" }} />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ borderTop: "1px dashed rgba(255,255,255,.12)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          {(p.prices || []).map((row, i) => {
            const active = (picked ?? 0) === i;
            return (
              <button
                key={row.label + i}
                onClick={() => setPicked(i)}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16,
                  padding: "10px 12px", borderRadius: 12,
                  background: active ? "rgba(255,255,255,.06)" : "transparent",
                  border: active ? `1px solid ${color}` : "1px solid transparent",
                  color: "inherit", textAlign: "left", fontFamily: "inherit", cursor: "pointer",
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{row.label}</div>
                  {row.discount > 0 && (
                    <div style={{ fontSize: 12, color, marginTop: 2 }}>со скидкой {row.discount}%</div>
                  )}
                </div>
                <div className="h-display" style={{ fontSize: 20, whiteSpace: "nowrap" }}>
                  {fmtSomProg(row.price)} <span style={{ fontSize: 12, opacity: 0.55, marginLeft: 2 }}>сом</span>
                </div>
              </button>
            );
          })}
        </div>

        <button
          className="btn btn-primary"
          style={{ marginTop: "auto", width: "100%", justifyContent: "center", padding: 14 }}
          onClick={orderProgram}
          disabled={adding}
        >
          {adding ? "Добавляем…" : `Заказать ${p.name}`} {Icons.arrow}
        </button>
      </div>
    </article>
  );
}

// ============================================================
// PROGRAMS PAGE (public)
// ============================================================
function ProgramsPage() {
  const [items, setItems] = useStateProg([]);
  const [loading, setLoading] = useStateProg(true);
  const [error, setError] = useStateProg(null);

  useEffectProg(() => {
    if (!window.ProgramsApi) {
      setError("Firebase не подключен");
      setLoading(false);
      return;
    }
    const unsub = window.ProgramsApi.watch((data, err) => {
      if (err) {
        setError(err.message || String(err));
        setLoading(false);
        return;
      }
      setItems(data || []);
      setLoading(false);
    });
    return () => unsub && unsub();
  }, []);

  return (
    <>
      <PageHero
        active="programs"
        eyebrow="Программы"
        title="9 готовых рационов под вашу цель"
        sub="Выберите план — мы подбираем меню, считаем КБЖУ и привозим каждый день. Скидки от 10% при подписке от 6 дней."
        bg="var(--green-900)"
        color="#fff"
        accent="var(--lime-300)"
      />

      <section className="section" style={{ background: "var(--paper)" }}>
        <div className="container">
          {loading && (
            <div style={{ textAlign: "center", padding: 60, color: "var(--muted)" }}>Загружаем программы…</div>
          )}
          {error && (
            <div className="card" style={{ padding: 28, background: "#fff5f5", borderColor: "#ffd0d0", color: "#a00" }}>
              <div className="h-title" style={{ fontSize: 18 }}>Не удалось загрузить программы</div>
              <p style={{ marginTop: 10, fontSize: 14 }}>{error}</p>
              <p style={{ marginTop: 8, fontSize: 13, color: "var(--muted)" }}>
                Скорее всего, не настроены правила Firestore. Открой консоль Firebase → Firestore Database → Rules и разреши чтение коллекции <code>programs</code>.
              </p>
            </div>
          )}
          {!loading && !error && items.length === 0 && (
            <div className="card" style={{ padding: 40, textAlign: "center" }}>
              <div className="h-title" style={{ fontSize: 22 }}>Программ пока нет</div>
              <p style={{ marginTop: 12, color: "var(--muted)" }}>Зайди в админку и нажми «Засеять дефолтные программы».</p>
              <button className="btn btn-dark" style={{ marginTop: 20 }} onClick={() => window.go?.("admin")}>Открыть админку {Icons.arrow}</button>
            </div>
          )}
          {!loading && !error && items.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {items.map(p => <ProgramCard key={p.id} p={p} />)}
            </div>
          )}
        </div>
      </section>

      <CallToAction title="Не уверены, какая программа подойдёт?" sub="Расскажите цель — диетолог подберёт план и КБЖУ под вас. Бесплатно." btn="Связаться" to="contacts" />
      <Footer />
    </>
  );
}

Object.assign(window, { ProgramsPage, ProgramCard });
