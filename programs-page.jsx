/* SixBox — Programs page (public) + Admin page (CRUD) — backed by Firestore */
const { useState: useStateProg, useEffect: useEffectProg } = React;

const ADMIN_PASSWORD = "sixbox2026"; // ⚠ замени в коде или вынеси в Firebase Auth для прода

const fmtSomProg = (n) => Number(n).toLocaleString("ru-RU").replace(/,/g, " ");

// ============================================================
// PROGRAM CARD
// ============================================================
function ProgramCard({ p, accent }) {
  const color = p.color || accent || "var(--lime-300)";
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

        <div style={{ borderTop: "1px dashed rgba(255,255,255,.12)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          {(p.prices || []).map((row, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{row.label}</div>
                {row.discount > 0 && (
                  <div style={{ fontSize: 12, color, marginTop: 2 }}>со скидкой {row.discount}%</div>
                )}
              </div>
              <div className="h-display" style={{ fontSize: 20, whiteSpace: "nowrap" }}>
                {fmtSomProg(row.price)} <span style={{ fontSize: 12, opacity: 0.55, marginLeft: 2 }}>сом</span>
              </div>
            </div>
          ))}
        </div>

        <button
          className="btn btn-primary"
          style={{ marginTop: "auto", width: "100%", justifyContent: "center", padding: 14 }}
          onClick={() => window.go?.("constructor")}
        >
          Заказать {p.name} {Icons.arrow}
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

// ============================================================
// ADMIN PAGE
// ============================================================
function AdminPage() {
  const [authed, setAuthed] = useStateProg(() => sessionStorage.getItem("sixbox_admin") === "1");
  const [pwd, setPwd] = useStateProg("");
  const [pwdErr, setPwdErr] = useStateProg("");

  if (!authed) {
    return (
      <>
        <Header active="admin" />
        <section style={{ background: "var(--cream)", minHeight: "calc(100vh - 76px)", display: "grid", placeItems: "center", padding: "40px 16px" }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (pwd === ADMIN_PASSWORD) {
                sessionStorage.setItem("sixbox_admin", "1");
                setAuthed(true);
              } else {
                setPwdErr("Неверный пароль");
              }
            }}
            className="card"
            style={{ padding: 32, width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div className="h-eyebrow" style={{ color: "var(--green-700)" }}>Админка</div>
            <div className="h-title" style={{ fontSize: 26 }}>Вход</div>
            <input
              type="password"
              autoFocus
              placeholder="Пароль"
              value={pwd}
              onChange={(e) => { setPwd(e.target.value); setPwdErr(""); }}
              style={{ padding: "14px 16px", borderRadius: 12, border: "1px solid var(--line)", fontSize: 15, fontFamily: "inherit" }}
            />
            {pwdErr && <div style={{ color: "#c33", fontSize: 13 }}>{pwdErr}</div>}
            <button type="submit" className="btn btn-primary" style={{ justifyContent: "center", padding: 14 }}>Войти {Icons.arrow}</button>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              Подсказка для прототипа: пароль — <code>sixbox2026</code>. Поменяй его в файле <code>programs-page.jsx</code>.
            </div>
          </form>
        </section>
      </>
    );
  }

  return <AdminDashboard onLogout={() => { sessionStorage.removeItem("sixbox_admin"); setAuthed(false); }} />;
}

function AdminDashboard({ onLogout }) {
  const [items, setItems] = useStateProg([]);
  const [loading, setLoading] = useStateProg(true);
  const [error, setError] = useStateProg(null);
  const [editing, setEditing] = useStateProg(null); // null | "new" | program object
  const [busy, setBusy] = useStateProg(false);

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

  const seed = async () => {
    if (!window.confirm("Засеять " + window.DEFAULT_PROGRAMS.length + " дефолтных программ? Это перезапишет существующие с теми же id.")) return;
    setBusy(true);
    try {
      await window.ProgramsApi.seed(window.DEFAULT_PROGRAMS);
    } catch (e) {
      window.alert("Ошибка: " + e.message);
    }
    setBusy(false);
  };

  const clearAll = async () => {
    if (!window.confirm("Удалить ВСЕ программы из БД? Это необратимо.")) return;
    setBusy(true);
    try {
      await window.ProgramsApi.clear();
    } catch (e) {
      window.alert("Ошибка: " + e.message);
    }
    setBusy(false);
  };

  const remove = async (id, name) => {
    if (!window.confirm(`Удалить программу "${name}"?`)) return;
    try {
      await window.ProgramsApi.remove(id);
    } catch (e) {
      window.alert("Ошибка: " + e.message);
    }
  };

  return (
    <>
      <Header active="admin" />
      <section style={{ background: "var(--paper)", padding: "40px 0 80px", minHeight: "calc(100vh - 76px)" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 20, marginBottom: 32, flexWrap: "wrap" }}>
            <div>
              <div className="h-eyebrow" style={{ color: "var(--green-700)" }}>Админка</div>
              <h1 className="h-display" style={{ fontSize: "clamp(36px, 4.5vw, 56px)", marginTop: 10 }}>Программы питания</h1>
              <div style={{ marginTop: 10, color: "var(--muted)", fontSize: 14 }}>Всего: {items.length}</div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn btn-ghost" onClick={onLogout}>Выйти</button>
              <button className="btn btn-ghost" onClick={clearAll} disabled={busy}>Очистить всё</button>
              <button className="btn btn-dark" onClick={seed} disabled={busy}>Засеять дефолт</button>
              <button className="btn btn-primary" onClick={() => setEditing("new")}>+ Добавить программу</button>
            </div>
          </div>

          {loading && <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>Загружаем…</div>}
          {error && (
            <div className="card" style={{ padding: 24, background: "#fff5f5", borderColor: "#ffd0d0", color: "#a00", marginBottom: 24 }}>
              <div className="h-title" style={{ fontSize: 18 }}>Ошибка Firebase</div>
              <p style={{ marginTop: 8, fontSize: 14 }}>{error}</p>
              <p style={{ marginTop: 8, fontSize: 13, color: "var(--muted)" }}>
                Открой консоль Firebase → Firestore Database → Rules и разреши read/write для коллекции <code>programs</code>.
              </p>
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="card" style={{ padding: 40, textAlign: "center" }}>
              <div className="h-title" style={{ fontSize: 22 }}>Пусто</div>
              <p style={{ marginTop: 12, color: "var(--muted)" }}>Нажми «Засеять дефолт», чтобы загрузить 9 программ из дизайна.</p>
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <div className="card" style={{ overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 720 }}>
                <thead>
                  <tr style={{ background: "var(--cream)", textAlign: "left" }}>
                    <th style={thStyle}>#</th>
                    <th style={thStyle}>Название</th>
                    <th style={thStyle}>Ккал</th>
                    <th style={thStyle}>Приёмов</th>
                    <th style={thStyle}>Цены (1 / нед / 24 / 30)</th>
                    <th style={thStyle}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(p => (
                    <tr key={p.id} style={{ borderTop: "1px solid var(--line)" }}>
                      <td style={tdStyle}>{p.order}</td>
                      <td style={tdStyle}>
                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: "var(--muted)" }}>{p.id}</div>
                      </td>
                      <td style={tdStyle}>{p.kcalLabel || p.kcal}</td>
                      <td style={tdStyle}>{p.mealsCount}</td>
                      <td style={{ ...tdStyle, fontFamily: "var(--font-mono)", fontSize: 12 }}>
                        {(p.prices || []).map(x => fmtSomProg(x.price)).join(" / ")}
                      </td>
                      <td style={{ ...tdStyle, textAlign: "right", whiteSpace: "nowrap" }}>
                        <button className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: 13 }} onClick={() => setEditing(p)}>Редактировать</button>
                        <button className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: 13, marginLeft: 6, color: "#c33" }} onClick={() => remove(p.id, p.name)}>Удалить</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {editing && (
        <ProgramEditor
          initial={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => setEditing(null)}
        />
      )}
      <Footer />
    </>
  );
}

const thStyle = { padding: "14px 16px", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)" };
const tdStyle = { padding: "14px 16px", verticalAlign: "top" };

// ============================================================
// PROGRAM EDITOR (modal)
// ============================================================
function ProgramEditor({ initial, onClose, onSaved }) {
  const isNew = !initial;
  const [form, setForm] = useStateProg(() => initial ? {
    id: initial.id,
    name: initial.name || "",
    tagline: initial.tagline || "",
    kcal: initial.kcal || 0,
    kcalLabel: initial.kcalLabel || "",
    mealsCount: initial.mealsCount || 0,
    mealsLabel: initial.mealsLabel || "",
    meals: (initial.meals || []).join("\n"),
    prices: initial.prices || [],
    color: initial.color || "var(--lime-300)",
    order: initial.order || 99,
  } : {
    id: "",
    name: "",
    tagline: "",
    kcal: 0,
    kcalLabel: "",
    mealsCount: 1,
    mealsLabel: "",
    meals: "",
    prices: [
      { label: "на 1 день", days: 1, price: 0, discount: 0 },
      { label: "на неделю (6 дней)", days: 6, price: 0, discount: 10 },
      { label: "на месяц (24 дня)", days: 24, price: 0, discount: 12 },
      { label: "на месяц (30 дней)", days: 30, price: 0, discount: 12 },
    ],
    color: "var(--lime-300)",
    order: 99,
  });
  const [busy, setBusy] = useStateProg(false);

  const updField = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const updPrice = (i, k, v) => setForm(f => ({
    ...f,
    prices: f.prices.map((row, idx) => idx === i ? { ...row, [k]: v } : row),
  }));
  const addPrice = () => setForm(f => ({ ...f, prices: [...f.prices, { label: "", days: 0, price: 0, discount: 0 }] }));
  const delPrice = (i) => setForm(f => ({ ...f, prices: f.prices.filter((_, idx) => idx !== i) }));

  const save = async () => {
    if (!form.name.trim()) { window.alert("Введите название"); return; }
    if (isNew && !form.id.trim()) { window.alert("Введите ID (latin, например fit-lite)"); return; }
    setBusy(true);
    const data = {
      name: form.name.trim(),
      tagline: form.tagline.trim(),
      kcal: Number(form.kcal) || 0,
      kcalLabel: form.kcalLabel.trim(),
      mealsCount: Number(form.mealsCount) || 0,
      mealsLabel: form.mealsLabel.trim(),
      meals: form.meals.split("\n").map(s => s.trim()).filter(Boolean),
      prices: form.prices.map(p => ({
        label: p.label,
        days: Number(p.days) || 0,
        price: Number(p.price) || 0,
        discount: Number(p.discount) || 0,
      })),
      color: form.color,
      order: Number(form.order) || 99,
    };
    try {
      if (isNew) {
        await window.ProgramsApi.update(form.id.trim(), data);
      } else {
        await window.ProgramsApi.update(initial.id, data);
      }
      onSaved();
    } catch (e) {
      window.alert("Ошибка сохранения: " + e.message);
    }
    setBusy(false);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(7, 38, 15, 0.6)",
        display: "grid", placeItems: "center",
        padding: 16, overflow: "auto",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 22,
          maxWidth: 720,
          width: "100%",
          maxHeight: "calc(100vh - 32px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "20px 28px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <div>
            <div className="h-eyebrow" style={{ color: "var(--green-700)" }}>{isNew ? "Новая программа" : "Редактирование"}</div>
            <div className="h-title" style={{ fontSize: 22, marginTop: 6 }}>{form.name || "—"}</div>
          </div>
          <button onClick={onClose} aria-label="Закрыть" style={{ width: 36, height: 36, borderRadius: 10, display: "grid", placeItems: "center" }}>{Icons.close}</button>
        </div>

        <div style={{ padding: 28, overflow: "auto", display: "flex", flexDirection: "column", gap: 18 }}>
          <Field label="ID (latin, ровно один раз при создании)">
            <input value={form.id} onChange={e => updField("id", e.target.value)} disabled={!isNew} placeholder="fit-lite" style={inputStyle} />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 12 }}>
            <Field label="Название"><input value={form.name} onChange={e => updField("name", e.target.value)} placeholder="FIT LITE" style={inputStyle} /></Field>
            <Field label="Подзаголовок"><input value={form.tagline} onChange={e => updField("tagline", e.target.value)} placeholder="Лёгкое похудение" style={inputStyle} /></Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <Field label="Ккал (число)"><input type="number" value={form.kcal} onChange={e => updField("kcal", e.target.value)} style={inputStyle} /></Field>
            <Field label="Подпись ккал"><input value={form.kcalLabel} onChange={e => updField("kcalLabel", e.target.value)} placeholder="1000 ккал в день" style={inputStyle} /></Field>
            <Field label="Приёмов"><input type="number" value={form.mealsCount} onChange={e => updField("mealsCount", e.target.value)} style={inputStyle} /></Field>
          </div>
          <Field label="Подпись приёмов">
            <input value={form.mealsLabel} onChange={e => updField("mealsLabel", e.target.value)} placeholder="5ти разовое дробное питание на весь день" style={inputStyle} />
          </Field>
          <Field label="Состав меню (по строке на каждый приём)">
            <textarea
              value={form.meals}
              onChange={e => updField("meals", e.target.value)}
              rows={6}
              style={{ ...inputStyle, fontFamily: "inherit", lineHeight: 1.5, resize: "vertical" }}
              placeholder={"Завтрак (творог, омлет)\nОбед 1е (супы)\n..."}
            />
          </Field>

          <div>
            <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 10 }}>Цены</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {form.prices.map((row, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 8, alignItems: "center" }}>
                  <input value={row.label} onChange={e => updPrice(i, "label", e.target.value)} placeholder="на неделю" style={inputStyle} />
                  <input type="number" value={row.days} onChange={e => updPrice(i, "days", e.target.value)} placeholder="дней" style={inputStyle} />
                  <input type="number" value={row.price} onChange={e => updPrice(i, "price", e.target.value)} placeholder="сом" style={inputStyle} />
                  <input type="number" value={row.discount} onChange={e => updPrice(i, "discount", e.target.value)} placeholder="скидка %" style={inputStyle} />
                  <button onClick={() => delPrice(i)} aria-label="Удалить строку" style={{ width: 36, height: 36, borderRadius: 10, color: "#c33" }}>{Icons.close}</button>
                </div>
              ))}
            </div>
            <button className="btn btn-ghost" style={{ marginTop: 10, padding: "8px 14px", fontSize: 13 }} onClick={addPrice}>+ Строку цен</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Цвет акцента (CSS)">
              <select value={form.color} onChange={e => updField("color", e.target.value)} style={inputStyle}>
                <option value="var(--lime-300)">Лайм (свежесть)</option>
                <option value="var(--green-500)">Зелёный (баланс)</option>
                <option value="var(--green-400)">Светло-зелёный</option>
                <option value="var(--orange-500)">Оранжевый (энергия)</option>
                <option value="var(--orange-400)">Светло-оранжевый</option>
              </select>
            </Field>
            <Field label="Порядок (меньше = выше)">
              <input type="number" value={form.order} onChange={e => updField("order", e.target.value)} style={inputStyle} />
            </Field>
          </div>
        </div>

        <div style={{ padding: "16px 28px", borderTop: "1px solid var(--line)", background: "var(--cream)", display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button className="btn btn-ghost" onClick={onClose} disabled={busy}>Отмена</button>
          <button className="btn btn-primary" onClick={save} disabled={busy}>{busy ? "Сохраняем…" : "Сохранить"}</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)" }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyle = {
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid var(--line)",
  fontSize: 14,
  fontFamily: "inherit",
  background: "#fff",
  color: "var(--ink)",
  width: "100%",
};

Object.assign(window, { ProgramsPage, AdminPage, ProgramCard });
