/* SixBox — Admin (tabbed): Programs, Meals, FAQ, Testimonials, Posts, Settings */
const { useState: useStateAd, useEffect: useEffectAd } = React;

const ADMIN_PASSWORD_AD = "sixbox2026"; // ⚠ замени или вынеси в Firebase Auth для прода
const fmtNum = (n) => Number(n).toLocaleString("ru-RU").replace(/,/g, " ");

// ============================================================
// Resource schemas — describe fields per collection.
// type: text | textarea | number | select | color | lines (textarea split by \n) | rows (price-like array)
// ============================================================
const SCHEMAS = {
  programs: {
    label: "Программы",
    seedKey: "DEFAULT_PROGRAMS",
    api: () => window.ProgramsApi,
    columns: [
      { k: "order", w: 60, label: "#" },
      { k: "name", label: "Название", grow: true, sub: (r) => r.id },
      { k: "kcalLabel", label: "Ккал" },
      { k: "mealsCount", label: "Приёмов", w: 100 },
      { k: "_prices", label: "Цены (1/нед/24/30)", render: (r) => (r.prices || []).map(x => fmtNum(x.price)).join(" / ") },
    ],
    fields: [
      { k: "id", label: "ID (только при создании, latin)", type: "text", placeholder: "fit-lite", lockOnEdit: true },
      [
        { k: "name", label: "Название", type: "text" },
        { k: "tagline", label: "Подзаголовок", type: "text" },
      ],
      [
        { k: "kcal", label: "Ккал (число)", type: "number" },
        { k: "kcalLabel", label: "Подпись ккал", type: "text" },
        { k: "mealsCount", label: "Приёмов", type: "number" },
      ],
      { k: "mealsLabel", label: "Подпись приёмов", type: "text" },
      { k: "meals", label: "Состав (по строке)", type: "lines" },
      { k: "prices", label: "Цены", type: "rows", rowFields: [
        { k: "label", placeholder: "на неделю", w: "2fr" },
        { k: "days", placeholder: "дн.", type: "number", w: "1fr" },
        { k: "price", placeholder: "сом", type: "number", w: "1fr" },
        { k: "discount", placeholder: "скидка %", type: "number", w: "1fr" },
      ]},
      [
        { k: "color", label: "Цвет акцента", type: "select", options: [
          { v: "var(--lime-300)", l: "Лайм" },
          { v: "var(--green-500)", l: "Зелёный" },
          { v: "var(--green-400)", l: "Светло-зелёный" },
          { v: "var(--orange-500)", l: "Оранжевый" },
          { v: "var(--orange-400)", l: "Светло-оранжевый" },
        ]},
        { k: "order", label: "Порядок", type: "number" },
      ],
    ],
  },

  meals: {
    label: "Меню",
    seedKey: "DEFAULT_MEALS",
    api: () => window.MealsApi,
    columns: [
      { k: "order", w: 60, label: "#" },
      { k: "type", label: "Тип", w: 110 },
      { k: "title", label: "Блюдо", grow: true },
      { k: "kcal", label: "Ккал", w: 70 },
      { k: "_pfc", label: "Б/Ж/У", render: (r) => `${r.p}/${r.f}/${r.c}`, w: 100 },
      { k: "tag", label: "Цель", w: 100 },
    ],
    fields: [
      [
        { k: "type", label: "Тип приёма", type: "select", options: [
          { v: "Завтрак", l: "Завтрак" },
          { v: "Перекус", l: "Перекус" },
          { v: "Обед", l: "Обед" },
          { v: "Ужин", l: "Ужин" },
          { v: "Десерт", l: "Десерт" },
        ]},
        { k: "tag", label: "Цель", type: "select", options: [
          { v: "loss", l: "Похудение (loss)" },
          { v: "balance", l: "Баланс (balance)" },
          { v: "gain", l: "Набор массы (gain)" },
        ]},
      ],
      { k: "title", label: "Название блюда", type: "text" },
      [
        { k: "kcal", label: "Ккал", type: "number" },
        { k: "p", label: "Белки (г)", type: "number" },
        { k: "f", label: "Жиры (г)", type: "number" },
        { k: "c", label: "Углеводы (г)", type: "number" },
      ],
      [
        { k: "kind", label: "Иконка-блюдо", type: "select", options: [
          { v: "chicken-rice", l: "Курица + рис" },
          { v: "salmon-greens", l: "Лосось + зелень" },
          { v: "tofu-quinoa", l: "Тофу + киноа" },
          { v: "beef-bowl", l: "Боул с говядиной" },
          { v: "salad", l: "Салат" },
          { v: "smoothie", l: "Смузи" },
          { v: "oats", l: "Каша / гранола" },
          { v: "dessert", l: "Десерт" },
        ]},
        { k: "order", label: "Порядок", type: "number" },
      ],
    ],
  },

  faq: {
    label: "FAQ",
    seedKey: "DEFAULT_FAQ",
    api: () => window.FaqApi,
    columns: [
      { k: "order", w: 60, label: "#" },
      { k: "q", label: "Вопрос", grow: true },
    ],
    fields: [
      { k: "q", label: "Вопрос", type: "text" },
      { k: "a", label: "Ответ", type: "textarea" },
      { k: "order", label: "Порядок", type: "number" },
    ],
  },

  testimonials: {
    label: "Отзывы",
    seedKey: "DEFAULT_TESTIMONIALS",
    api: () => window.TestimonialsApi,
    columns: [
      { k: "order", w: 60, label: "#" },
      { k: "name", label: "Имя", w: 140, sub: (r) => `${r.age} лет` },
      { k: "lost", label: "Результат", w: 200 },
      { k: "quote", label: "Цитата", grow: true },
      { k: "plan", label: "План", w: 200 },
    ],
    fields: [
      [
        { k: "name", label: "Имя", type: "text" },
        { k: "age", label: "Возраст", type: "number" },
      ],
      { k: "lost", label: "Результат (например, −12 кг за 4 месяца)", type: "text" },
      { k: "quote", label: "Цитата клиента", type: "textarea" },
      [
        { k: "plan", label: "План (например, Похудение, 4 мес.)", type: "text" },
        { k: "order", label: "Порядок", type: "number" },
      ],
    ],
  },

  posts: {
    label: "Блог",
    seedKey: "DEFAULT_POSTS",
    api: () => window.PostsApi,
    columns: [
      { k: "order", w: 60, label: "#" },
      { k: "tag", label: "Раздел", w: 120 },
      { k: "title", label: "Заголовок", grow: true },
      { k: "date", label: "Дата", w: 140 },
      { k: "read", label: "Время чтения", w: 100 },
    ],
    fields: [
      [
        { k: "tag", label: "Раздел", type: "select", options: [
          { v: "Питание", l: "Питание" },
          { v: "Готовка", l: "Готовка" },
          { v: "Клиенты", l: "Клиенты" },
          { v: "Кухня", l: "Кухня" },
        ]},
        { k: "date", label: "Дата (текстом)", type: "text", placeholder: "2 мая 2026" },
        { k: "read", label: "Время чтения", type: "text", placeholder: "5 мин" },
      ],
      { k: "title", label: "Заголовок статьи", type: "text" },
      { k: "excerpt", label: "Краткий анонс (показывается на карточке)", type: "textarea" },
      { k: "order", label: "Порядок", type: "number" },
    ],
  },
};

// ============================================================
// ADMIN PAGE — entry
// ============================================================
function AdminPage() {
  const [authed, setAuthed] = useStateAd(() => sessionStorage.getItem("sixbox_admin") === "1");
  const [pwd, setPwd] = useStateAd("");
  const [pwdErr, setPwdErr] = useStateAd("");

  if (!authed) {
    return (
      <>
        <Header active="admin" />
        <section style={{ background: "var(--cream)", minHeight: "calc(100vh - 76px)", display: "grid", placeItems: "center", padding: "40px 16px" }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (pwd === ADMIN_PASSWORD_AD) {
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
          </form>
        </section>
        <Footer />
      </>
    );
  }

  return <AdminDashboard onLogout={() => { sessionStorage.removeItem("sixbox_admin"); setAuthed(false); }} />;
}

// ============================================================
// DASHBOARD with TABS
// ============================================================
const TABS = ["orders", "users", "programs", "meals", "faq", "testimonials", "posts", "settings"];
const TAB_LABELS = {
  orders: "Заказы",
  users: "Пользователи",
  settings: "Настройки",
};

function AdminDashboard({ onLogout }) {
  const [tab, setTab] = useStateAd(() => sessionStorage.getItem("sixbox_admin_tab") || "orders");
  const [seeding, setSeeding] = useStateAd(false);

  useEffectAd(() => { sessionStorage.setItem("sixbox_admin_tab", tab); }, [tab]);

  const seedAll = async (force) => {
    const msg = force
      ? "Перезалить ВСЕ дефолтные данные? Записи с теми же id будут перезаписаны (ваши правки могут потеряться)."
      : "Залить дефолт только в пустые коллекции? Существующий контент не тронется.";
    if (!window.confirm(msg)) return;
    setSeeding(true);
    try {
      const r = await window.seedAllIfEmpty({ force: !!force });
      const lines = Object.entries(r.report || {}).map(([k, v]) => `${k}: ${v}`).join("\n");
      window.alert("Готово.\n\n" + lines);
    } catch (e) {
      window.alert("Ошибка: " + e.message);
    }
    setSeeding(false);
  };

  return (
    <>
      <Header active="admin" />
      <section style={{ background: "var(--paper)", padding: "32px 0 80px", minHeight: "calc(100vh - 76px)" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
            <div>
              <div className="h-eyebrow" style={{ color: "var(--green-700)" }}>Админка</div>
              <h1 className="h-display" style={{ fontSize: "clamp(28px, 4vw, 44px)", marginTop: 6 }}>Управление контентом</h1>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn btn-ghost" onClick={() => seedAll(false)} disabled={seeding}>
                {seeding ? "Заливаем…" : "Залить дефолт в пустые"}
              </button>
              <button className="btn btn-ghost" onClick={() => seedAll(true)} disabled={seeding} style={{ color: "#c33" }}>
                Перезалить всё
              </button>
              <button className="btn btn-ghost" onClick={onLogout}>Выйти</button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 6, padding: 6, background: "#fff", borderRadius: 16, border: "1px solid var(--line)", marginBottom: 24, overflowX: "auto" }}>
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "10px 18px", borderRadius: 12, fontSize: 14, fontWeight: 600,
                  background: tab === t ? "var(--green-700)" : "transparent",
                  color: tab === t ? "#fff" : "var(--ink)",
                  whiteSpace: "nowrap", flexShrink: 0,
                }}
              >
                {TAB_LABELS[t] || SCHEMAS[t].label}
              </button>
            ))}
          </div>

          {tab === "settings" && <SettingsEditor />}
          {tab === "orders" && <OrdersPanel />}
          {tab === "users" && <UsersPanel />}
          {!["settings", "orders", "users"].includes(tab) && <ResourceManager schema={SCHEMAS[tab]} resourceKey={tab} />}
        </div>
      </section>
      <Footer />
    </>
  );
}

// ============================================================
// RESOURCE MANAGER — table + add/edit/delete + seed/clear
// ============================================================
function ResourceManager({ schema, resourceKey }) {
  const [items, setItems] = useStateAd([]);
  const [loading, setLoading] = useStateAd(true);
  const [error, setError] = useStateAd(null);
  const [editing, setEditing] = useStateAd(null);
  const [busy, setBusy] = useStateAd(false);
  const api = schema.api();

  useEffectAd(() => {
    setLoading(true);
    setError(null);
    if (!api) { setError("API не доступен"); setLoading(false); return; }
    const unsub = api.watch((data, err) => {
      if (err) { setError(err.message || String(err)); setLoading(false); return; }
      setItems(data || []);
      setLoading(false);
    });
    return () => unsub && unsub();
  }, [resourceKey]);

  const seed = async () => {
    const defaults = window[schema.seedKey] || [];
    if (!window.confirm(`Засеять ${defaults.length} дефолтных записей? Перезапишет существующие с теми же id.`)) return;
    setBusy(true);
    try { await api.seed(defaults); }
    catch (e) { window.alert("Ошибка: " + e.message); }
    setBusy(false);
  };

  const clearAll = async () => {
    if (!window.confirm("Удалить ВСЕ записи в этой коллекции? Это необратимо.")) return;
    setBusy(true);
    try { await api.clear(); }
    catch (e) { window.alert("Ошибка: " + e.message); }
    setBusy(false);
  };

  const remove = async (id, title) => {
    if (!window.confirm(`Удалить запись "${title}"?`)) return;
    try { await api.remove(id); }
    catch (e) { window.alert("Ошибка: " + e.message); }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ fontSize: 14, color: "var(--muted)" }}>Всего: {items.length}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn btn-ghost" onClick={clearAll} disabled={busy}>Очистить всё</button>
          <button className="btn btn-ghost" onClick={seed} disabled={busy}>Засеять дефолт</button>
          <button className="btn btn-primary" onClick={() => setEditing("new")}>+ Добавить</button>
        </div>
      </div>

      {loading && <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>Загружаем…</div>}
      {error && (
        <div className="card" style={{ padding: 24, background: "#fff5f5", borderColor: "#ffd0d0", color: "#a00", marginBottom: 24 }}>
          <div className="h-title" style={{ fontSize: 18 }}>Ошибка Firestore</div>
          <p style={{ marginTop: 8, fontSize: 14 }}>{error}</p>
          <p style={{ marginTop: 8, fontSize: 13, color: "var(--muted)" }}>
            Открой Firebase Console → Firestore Database → Rules и разреши read/write для коллекции <code>{api?.collection}</code>.
          </p>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <div className="h-title" style={{ fontSize: 22 }}>Пусто</div>
          <p style={{ marginTop: 12, color: "var(--muted)" }}>Нажми «Засеять дефолт», чтобы добавить стандартный набор.</p>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="card" style={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 720 }}>
            <thead>
              <tr style={{ background: "var(--cream)", textAlign: "left" }}>
                {schema.columns.map(c => (
                  <th key={c.k} style={{ ...thStyleAd, width: c.w }}>{c.label}</th>
                ))}
                <th style={thStyleAd}></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{ borderTop: "1px solid var(--line)" }}>
                  {schema.columns.map(c => (
                    <td key={c.k} style={tdStyleAd}>
                      <div style={{ fontWeight: c.k === "name" || c.k === "title" || c.k === "q" ? 600 : 400 }}>
                        {c.render ? c.render(item) : (item[c.k] ?? "—")}
                      </div>
                      {c.sub && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{c.sub(item)}</div>}
                    </td>
                  ))}
                  <td style={{ ...tdStyleAd, textAlign: "right", whiteSpace: "nowrap" }}>
                    <button className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: 13 }} onClick={() => setEditing(item)}>Изменить</button>
                    <button className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: 13, marginLeft: 6, color: "#c33" }} onClick={() => remove(item.id, item.name || item.title || item.q || item.id)}>Удалить</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <ResourceEditor
          schema={schema}
          api={api}
          initial={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}

const thStyleAd = { padding: "12px 14px", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)" };
const tdStyleAd = { padding: "14px 14px", verticalAlign: "top" };

// ============================================================
// RESOURCE EDITOR — generic modal with field schema
// ============================================================
function ResourceEditor({ schema, api, initial, onClose }) {
  const isNew = !initial;

  const initFromFields = () => {
    const obj = {};
    const walk = (nodes) => nodes.forEach(node => {
      if (Array.isArray(node)) walk(node);
      else if (node.type === "rows") obj[node.k] = initial?.[node.k] || [];
      else if (node.type === "lines") obj[node.k] = (initial?.[node.k] || []).join("\n");
      else if (node.type === "number") obj[node.k] = initial?.[node.k] ?? 0;
      else obj[node.k] = initial?.[node.k] ?? "";
    });
    walk(schema.fields);
    if (isNew) obj.id = "";
    else obj.id = initial.id;
    return obj;
  };

  const [form, setForm] = useStateAd(initFromFields);
  const [busy, setBusy] = useStateAd(false);

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (isNew && schema.fields.some(f => f.k === "id" || (Array.isArray(f) && f.some(ff => ff.k === "id")))) {
      // schema explicitly declares ID, allow user-set id
    }
    setBusy(true);
    try {
      // Build payload by walking schema (excludes id)
      const payload = {};
      const walk = (nodes) => nodes.forEach(node => {
        if (Array.isArray(node)) { walk(node); return; }
        if (node.k === "id") return;
        const v = form[node.k];
        if (node.type === "number") payload[node.k] = Number(v) || 0;
        else if (node.type === "lines") payload[node.k] = (v || "").split("\n").map(s => s.trim()).filter(Boolean);
        else if (node.type === "rows") payload[node.k] = (v || []).map(row => {
          const r = {};
          node.rowFields.forEach(rf => {
            r[rf.k] = rf.type === "number" ? (Number(row[rf.k]) || 0) : (row[rf.k] || "");
          });
          return r;
        });
        else payload[node.k] = (v || "").toString().trim();
      });
      walk(schema.fields);

      const id = (form.id || "").trim();
      if (isNew && id) {
        await api.update(id, payload);
      } else if (isNew) {
        await api.create(payload);
      } else {
        await api.update(initial.id, payload);
      }
      onClose();
    } catch (e) {
      window.alert("Ошибка: " + e.message);
    }
    setBusy(false);
  };

  const renderField = (node) => {
    if (Array.isArray(node)) {
      return (
        <div key={node.map(n => n.k).join("_")} style={{ display: "grid", gridTemplateColumns: `repeat(${node.length}, 1fr)`, gap: 12 }}>
          {node.map(n => renderField(n))}
        </div>
      );
    }
    if (node.k === "id") {
      return (
        <FieldAd key="id" label={node.label}>
          <input value={form.id} onChange={e => upd("id", e.target.value)} disabled={!isNew && node.lockOnEdit} placeholder={node.placeholder} style={inputStyleAd} />
        </FieldAd>
      );
    }
    const v = form[node.k];
    if (node.type === "textarea") {
      return (
        <FieldAd key={node.k} label={node.label}>
          <textarea value={v} onChange={e => upd(node.k, e.target.value)} rows={4} style={{ ...inputStyleAd, fontFamily: "inherit", lineHeight: 1.5, resize: "vertical" }} />
        </FieldAd>
      );
    }
    if (node.type === "lines") {
      return (
        <FieldAd key={node.k} label={node.label}>
          <textarea value={v} onChange={e => upd(node.k, e.target.value)} rows={6} placeholder={node.placeholder} style={{ ...inputStyleAd, fontFamily: "inherit", lineHeight: 1.5, resize: "vertical" }} />
        </FieldAd>
      );
    }
    if (node.type === "select") {
      return (
        <FieldAd key={node.k} label={node.label}>
          <select value={v} onChange={e => upd(node.k, e.target.value)} style={inputStyleAd}>
            <option value="">—</option>
            {node.options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
        </FieldAd>
      );
    }
    if (node.type === "rows") {
      const rows = v || [];
      const updRow = (i, k, val) => upd(node.k, rows.map((r, idx) => idx === i ? { ...r, [k]: val } : r));
      const addRow = () => upd(node.k, [...rows, Object.fromEntries(node.rowFields.map(rf => [rf.k, rf.type === "number" ? 0 : ""]))]);
      const delRow = (i) => upd(node.k, rows.filter((_, idx) => idx !== i));
      return (
        <div key={node.k}>
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 10 }}>{node.label}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {rows.map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: node.rowFields.map(rf => rf.w || "1fr").join(" ") + " auto", gap: 8, alignItems: "center" }}>
                {node.rowFields.map(rf => (
                  <input key={rf.k} value={row[rf.k] ?? ""} onChange={e => updRow(i, rf.k, rf.type === "number" ? Number(e.target.value) : e.target.value)} type={rf.type === "number" ? "number" : "text"} placeholder={rf.placeholder} style={inputStyleAd} />
                ))}
                <button onClick={() => delRow(i)} aria-label="Удалить строку" style={{ width: 36, height: 36, borderRadius: 10, color: "#c33" }}>{Icons.close}</button>
              </div>
            ))}
          </div>
          <button className="btn btn-ghost" style={{ marginTop: 10, padding: "8px 14px", fontSize: 13 }} onClick={addRow}>+ Строку</button>
        </div>
      );
    }
    return (
      <FieldAd key={node.k} label={node.label}>
        <input
          value={v}
          onChange={e => upd(node.k, e.target.value)}
          type={node.type === "number" ? "number" : "text"}
          placeholder={node.placeholder}
          style={inputStyleAd}
        />
      </FieldAd>
    );
  };

  return (
    <div onClick={onClose} className="admin-editor-overlay" style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(7,38,15,.6)", display: "grid", placeItems: "center", padding: 16, overflow: "auto" }}>
      <div onClick={e => e.stopPropagation()} className="admin-editor" style={{ background: "#fff", borderRadius: 22, maxWidth: 720, width: "100%", maxHeight: "calc(100vh - 32px)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <div>
            <div className="h-eyebrow" style={{ color: "var(--green-700)" }}>{isNew ? "Новая запись" : "Редактирование"}</div>
            <div className="h-title" style={{ fontSize: 22, marginTop: 6 }}>{schema.label}</div>
          </div>
          <button onClick={onClose} aria-label="Закрыть" style={{ width: 36, height: 36, borderRadius: 10, display: "grid", placeItems: "center" }}>{Icons.close}</button>
        </div>
        <div style={{ padding: 24, overflow: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
          {schema.fields.map(node => renderField(node))}
        </div>
        <div style={{ padding: "14px 24px", borderTop: "1px solid var(--line)", background: "var(--cream)", display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button className="btn btn-ghost" onClick={onClose} disabled={busy}>Отмена</button>
          <button className="btn btn-primary" onClick={save} disabled={busy}>{busy ? "Сохраняем…" : "Сохранить"}</button>
        </div>
      </div>
    </div>
  );
}

function FieldAd({ label, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)" }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyleAd = {
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid var(--line)",
  fontSize: 14,
  fontFamily: "inherit",
  background: "#fff",
  color: "var(--ink)",
  width: "100%",
};

// ============================================================
// SETTINGS EDITOR — single doc settings/main
// ============================================================
function SettingsEditor() {
  const [settings, setSettings] = useStateAd(null);
  const [loading, setLoading] = useStateAd(true);
  const [error, setError] = useStateAd(null);
  const [busy, setBusy] = useStateAd(false);
  const [draft, setDraft] = useStateAd({});

  useEffectAd(() => {
    if (!window.SettingsApi) { setError("API не доступен"); setLoading(false); return; }
    const unsub = window.SettingsApi.watch((data, err) => {
      if (err) { setError(err.message || String(err)); setLoading(false); return; }
      const merged = { ...window.DEFAULT_SETTINGS, ...(data || {}) };
      setSettings(merged);
      setDraft(merged);
      setLoading(false);
    });
    return () => unsub && unsub();
  }, []);

  const upd = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  const save = async () => {
    setBusy(true);
    try { await window.SettingsApi.update(draft); }
    catch (e) { window.alert("Ошибка: " + e.message); }
    setBusy(false);
  };

  const seed = async () => {
    if (!window.confirm("Залить дефолтные настройки?")) return;
    setBusy(true);
    try { await window.SettingsApi.seed(window.DEFAULT_SETTINGS); }
    catch (e) { window.alert("Ошибка: " + e.message); }
    setBusy(false);
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>Загружаем…</div>;
  if (error) return (
    <div className="card" style={{ padding: 24, background: "#fff5f5", borderColor: "#ffd0d0", color: "#a00" }}>
      <div className="h-title" style={{ fontSize: 18 }}>Ошибка Firestore</div>
      <p style={{ marginTop: 8, fontSize: 14 }}>{error}</p>
    </div>
  );

  const dirty = JSON.stringify(draft) !== JSON.stringify(settings);

  return (
    <div className="card" style={{ padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
        <div className="h-title" style={{ fontSize: 22 }}>Настройки сайта</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost" onClick={seed} disabled={busy}>Сбросить к дефолту</button>
          <button className="btn btn-primary" onClick={save} disabled={busy || !dirty}>{busy ? "Сохраняем…" : (dirty ? "Сохранить" : "Сохранено")}</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <FieldAd label="Телефон (отображение)"><input value={draft.phone || ""} onChange={e => upd("phone", e.target.value)} style={inputStyleAd} placeholder="+996 555 612 612" /></FieldAd>
        <FieldAd label="Телефон для tel: (без пробелов)"><input value={draft.phoneTel || ""} onChange={e => upd("phoneTel", e.target.value)} style={inputStyleAd} placeholder="+996555612612" /></FieldAd>
        <FieldAd label="Email"><input value={draft.email || ""} onChange={e => upd("email", e.target.value)} style={inputStyleAd} placeholder="hello@sixbox.kg" /></FieldAd>
        <FieldAd label="Адрес"><input value={draft.address || ""} onChange={e => upd("address", e.target.value)} style={inputStyleAd} placeholder="Бишкек, ул. Ибраимова 115" /></FieldAd>
        <FieldAd label="Часы работы"><input value={draft.workingHours || ""} onChange={e => upd("workingHours", e.target.value)} style={inputStyleAd} placeholder="Каждый день, 8:00 — 22:00" /></FieldAd>
        <FieldAd label="Подпись копирайта"><input value={draft.copyright || ""} onChange={e => upd("copyright", e.target.value)} style={inputStyleAd} /></FieldAd>
        <FieldAd label="Instagram URL"><input value={draft.instagram || ""} onChange={e => upd("instagram", e.target.value)} style={inputStyleAd} /></FieldAd>
        <FieldAd label="Telegram URL"><input value={draft.telegram || ""} onChange={e => upd("telegram", e.target.value)} style={inputStyleAd} /></FieldAd>
        <FieldAd label="WhatsApp URL"><input value={draft.whatsapp || ""} onChange={e => upd("whatsapp", e.target.value)} style={inputStyleAd} /></FieldAd>
      </div>
    </div>
  );
}

// Hook for public pages: live settings from Firestore (with default fallback)
function useSiteSettings() {
  const [settings, setSettings] = useStateAd(window.DEFAULT_SETTINGS || {});
  useEffectAd(() => {
    if (!window.SettingsApi) return;
    const unsub = window.SettingsApi.watch(data => {
      setSettings({ ...window.DEFAULT_SETTINGS, ...(data || {}) });
    });
    return () => unsub && unsub();
  }, []);
  return settings;
}

// Hook for public pages: live collection (with default fallback)
function useCollection(apiName, defaultsKey) {
  const [items, setItems] = useStateAd(window[defaultsKey] || []);
  const [loaded, setLoaded] = useStateAd(false);
  useEffectAd(() => {
    const api = window[apiName];
    if (!api) return;
    const unsub = api.watch((data, err) => {
      if (err) { console.warn(`[${apiName}.watch]`, err); return; }
      // Use Firestore data if non-empty; otherwise fall back to defaults so pages aren't blank.
      setItems(data && data.length > 0 ? data : (window[defaultsKey] || []));
      setLoaded(true);
    });
    return () => unsub && unsub();
  }, [apiName, defaultsKey]);
  return { items, loaded };
}

// ============================================================
// ORDERS PANEL
// ============================================================
const STATUS_LABELS = {
  new:        { l: "Новый",      bg: "var(--lime-300)",   c: "var(--green-900)" },
  processing: { l: "В работе",   bg: "var(--orange-500)", c: "#1a0a00" },
  delivered:  { l: "Доставлен",  bg: "var(--green-600)",  c: "#fff" },
  cancelled:  { l: "Отменён",    bg: "#fee2e2",           c: "#a00" },
};

const fmtSom = (n) => Number(n || 0).toLocaleString("ru-RU").replace(/,/g, " ") + " сом";
const fmtDate = (ts) => {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
};

function OrdersPanel() {
  const [orders, setOrders] = useStateAd([]);
  const [loading, setLoading] = useStateAd(true);
  const [error, setError] = useStateAd(null);
  const [view, setView] = useStateAd(null);
  const [filter, setFilter] = useStateAd("all");

  useEffectAd(() => {
    if (!window.OrdersApi) { setError("OrdersApi не доступен"); setLoading(false); return; }
    const unsub = window.OrdersApi.watch((data, err) => {
      if (err) { setError(err.message || String(err)); setLoading(false); return; }
      setOrders(data || []);
      setLoading(false);
    });
    return () => unsub && unsub();
  }, []);

  const setStatus = async (id, status) => {
    try { await window.OrdersApi.update(id, { status }); }
    catch (e) { window.alert("Ошибка: " + e.message); }
  };

  const removeOrder = async (id) => {
    if (!window.confirm("Удалить заказ безвозвратно?")) return;
    try { await window.OrdersApi.remove(id); }
    catch (e) { window.alert("Ошибка: " + e.message); }
  };

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);
  const counts = orders.reduce((acc, o) => ({ ...acc, [o.status]: (acc[o.status] || 0) + 1 }), {});

  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>Все · {orders.length}</FilterChip>
        {Object.entries(STATUS_LABELS).map(([k, v]) => (
          <FilterChip key={k} active={filter === k} onClick={() => setFilter(k)}>
            {v.l} · {counts[k] || 0}
          </FilterChip>
        ))}
      </div>

      {loading && <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>Загружаем заказы…</div>}
      {error && (
        <div className="card" style={{ padding: 24, background: "#fff5f5", borderColor: "#ffd0d0", color: "#a00" }}>
          <div className="h-title" style={{ fontSize: 18 }}>Ошибка Firestore</div>
          <p style={{ marginTop: 8, fontSize: 14 }}>{error}</p>
          <p style={{ marginTop: 8, fontSize: 13, color: "var(--muted)" }}>
            Открой Firebase Console → Firestore → Rules и разреши read/write для коллекции <code>orders</code>.
          </p>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <div className="h-title" style={{ fontSize: 22 }}>Заказов нет</div>
          <p style={{ marginTop: 12, color: "var(--muted)" }}>Заказы появятся здесь автоматически после оформления через корзину.</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="card" style={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 760 }}>
            <thead>
              <tr style={{ background: "var(--cream)", textAlign: "left" }}>
                <th style={thStyleAd}>Дата</th>
                <th style={thStyleAd}>Клиент</th>
                <th style={thStyleAd}>Позиций</th>
                <th style={thStyleAd}>Сумма</th>
                <th style={thStyleAd}>Статус</th>
                <th style={thStyleAd}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} style={{ borderTop: "1px solid var(--line)" }}>
                  <td style={{ ...tdStyleAd, fontFamily: "var(--font-mono)", fontSize: 12 }}>{fmtDate(o.createdAt)}</td>
                  <td style={tdStyleAd}>
                    <div style={{ fontWeight: 600 }}>{o.userName || "—"}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{o.userPhone || o.userId}</div>
                  </td>
                  <td style={tdStyleAd}>{(o.items || []).length}</td>
                  <td style={{ ...tdStyleAd, fontWeight: 600 }}>{fmtSom(o.total)}</td>
                  <td style={tdStyleAd}>
                    <select value={o.status || "new"} onChange={e => setStatus(o.id, e.target.value)} style={{ ...inputStyleAd, padding: "6px 10px", fontSize: 13, width: "auto", background: STATUS_LABELS[o.status]?.bg || "#eee", color: STATUS_LABELS[o.status]?.c || "var(--ink)", fontWeight: 600 }}>
                      {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v.l}</option>)}
                    </select>
                  </td>
                  <td style={{ ...tdStyleAd, textAlign: "right", whiteSpace: "nowrap" }}>
                    <button className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: 13 }} onClick={() => setView(o)}>Открыть</button>
                    <button className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: 13, marginLeft: 6, color: "#c33" }} onClick={() => removeOrder(o.id)}>Удалить</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view && <OrderViewer order={view} onClose={() => setView(null)} onChangeStatus={(s) => { setStatus(view.id, s); setView({ ...view, status: s }); }} />}
    </>
  );
}

function OrderViewer({ order, onClose, onChangeStatus }) {
  return (
    <div onClick={onClose} className="admin-editor-overlay" style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(7,38,15,.6)", display: "grid", placeItems: "center", padding: 16, overflow: "auto" }}>
      <div onClick={e => e.stopPropagation()} className="admin-editor" style={{ background: "#fff", borderRadius: 22, maxWidth: 640, width: "100%", maxHeight: "calc(100vh - 32px)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <div>
            <div className="h-eyebrow" style={{ color: "var(--green-700)" }}>Заказ {order.id.slice(0, 6)}</div>
            <div className="h-title" style={{ fontSize: 22, marginTop: 6 }}>{order.userName || "—"} · {fmtSom(order.total)}</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{order.userPhone} · {fmtDate(order.createdAt)}</div>
          </div>
          <button onClick={onClose} aria-label="Закрыть" style={{ width: 36, height: 36, borderRadius: 10, display: "grid", placeItems: "center" }}>{Icons.close}</button>
        </div>
        <div style={{ padding: 24, overflow: "auto", display: "flex", flexDirection: "column", gap: 18 }}>
          <FieldAd label="Статус">
            <select value={order.status || "new"} onChange={e => onChangeStatus(e.target.value)} style={inputStyleAd}>
              {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v.l}</option>)}
            </select>
          </FieldAd>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 8 }}>Позиции ({(order.items || []).length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(order.items || []).map((it, i) => (
                <div key={it._id || i} style={{ padding: 14, borderRadius: 12, border: "1px solid var(--line)", background: "var(--paper)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>{it.kind || "Позиция"}</div>
                      <div style={{ fontWeight: 600, marginTop: 2 }}>{it.title || it.name || "—"}</div>
                      {it.subtitle && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{it.subtitle}</div>}
                    </div>
                    <div style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{fmtSom(it.price)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FieldAd label="Адрес доставки">
              <div style={{ ...inputStyleAd, background: "var(--paper)" }}>{order.address || "—"}</div>
            </FieldAd>
            <FieldAd label="Слот доставки">
              <div style={{ ...inputStyleAd, background: "var(--paper)" }}>{order.deliverySlot === "evening" ? "Вечером" : "Утром"}</div>
            </FieldAd>
            <FieldAd label="Способ оплаты">
              <div style={{ ...inputStyleAd, background: "var(--paper)" }}>{order.payment || "—"}</div>
            </FieldAd>
            <FieldAd label="Сумма">
              <div style={{ ...inputStyleAd, background: "var(--paper)", fontWeight: 600 }}>{fmtSom(order.total)}</div>
            </FieldAd>
          </div>
          {order.comment && (
            <FieldAd label="Комментарий клиента">
              <div style={{ ...inputStyleAd, background: "var(--paper)", whiteSpace: "pre-wrap" }}>{order.comment}</div>
            </FieldAd>
          )}
        </div>
        <div style={{ padding: "14px 24px", borderTop: "1px solid var(--line)", background: "var(--cream)", display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button className="btn btn-primary" onClick={onClose}>Закрыть</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// USERS PANEL
// ============================================================
function UsersPanel() {
  const [users, setUsers] = useStateAd([]);
  const [loading, setLoading] = useStateAd(true);
  const [error, setError] = useStateAd(null);
  const [view, setView] = useStateAd(null);

  useEffectAd(() => {
    if (!window.UsersAdminApi) { setError("UsersAdminApi не доступен"); setLoading(false); return; }
    const unsub = window.UsersAdminApi.watch((data, err) => {
      if (err) { setError(err.message || String(err)); setLoading(false); return; }
      setUsers(data || []);
      setLoading(false);
    });
    return () => unsub && unsub();
  }, []);

  const removeUser = async (uid, label) => {
    if (!window.confirm(`Удалить профиль ${label}? Аккаунт в Firebase Auth не удалится — только профиль в Firestore.`)) return;
    try { await window.UsersAdminApi.remove(uid); }
    catch (e) { window.alert("Ошибка: " + e.message); }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
        <div style={{ fontSize: 14, color: "var(--muted)" }}>Всего: {users.length}</div>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>Только пользователи, у которых есть профиль в Firestore (создаётся при первом заходе после входа)</div>
      </div>

      {loading && <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>Загружаем…</div>}
      {error && (
        <div className="card" style={{ padding: 24, background: "#fff5f5", borderColor: "#ffd0d0", color: "#a00" }}>
          <div className="h-title" style={{ fontSize: 18 }}>Ошибка Firestore</div>
          <p style={{ marginTop: 8, fontSize: 14 }}>{error}</p>
          <p style={{ marginTop: 8, fontSize: 13, color: "var(--muted)" }}>
            В правилах Firestore нужен open-read для коллекции <code>users</code> (или специальный admin-claim). Для прототипа добавь:
          </p>
          <pre style={{ fontSize: 12, marginTop: 8, background: "#fff", padding: 12, borderRadius: 8, overflow: "auto" }}>{`match /users/{uid} {
  allow read: if true;
  allow write: if request.auth != null && request.auth.uid == uid;
}`}</pre>
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <div className="h-title" style={{ fontSize: 22 }}>Пользователей пока нет</div>
          <p style={{ marginTop: 12, color: "var(--muted)" }}>Зарегистрированные через SMS юзеры появятся здесь, когда зайдут в кабинет/корзину.</p>
        </div>
      )}

      {!loading && !error && users.length > 0 && (
        <div className="card" style={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 720 }}>
            <thead>
              <tr style={{ background: "var(--cream)", textAlign: "left" }}>
                <th style={thStyleAd}>Телефон</th>
                <th style={thStyleAd}>Имя</th>
                <th style={thStyleAd}>В корзине</th>
                <th style={thStyleAd}>Подписка</th>
                <th style={thStyleAd}>Зарегистрирован</th>
                <th style={thStyleAd}></th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderTop: "1px solid var(--line)" }}>
                  <td style={{ ...tdStyleAd, fontFamily: "var(--font-mono)", fontSize: 13 }}>{u.phone || "—"}</td>
                  <td style={tdStyleAd}><div style={{ fontWeight: 600 }}>{u.name || <span style={{ color: "var(--muted)" }}>Гость</span>}</div></td>
                  <td style={tdStyleAd}>{(u.cart || []).length}</td>
                  <td style={tdStyleAd}>{u.subscription ? "Активна" : <span style={{ color: "var(--muted)" }}>Нет</span>}</td>
                  <td style={{ ...tdStyleAd, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--muted)" }}>{fmtDate(u.createdAt)}</td>
                  <td style={{ ...tdStyleAd, textAlign: "right", whiteSpace: "nowrap" }}>
                    <button className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: 13 }} onClick={() => setView(u)}>Открыть</button>
                    <button className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: 13, marginLeft: 6, color: "#c33" }} onClick={() => removeUser(u.id, u.phone || u.id)}>Удалить</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view && <UserViewer user={view} onClose={() => setView(null)} />}
    </>
  );
}

function UserViewer({ user, onClose }) {
  return (
    <div onClick={onClose} className="admin-editor-overlay" style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(7,38,15,.6)", display: "grid", placeItems: "center", padding: 16, overflow: "auto" }}>
      <div onClick={e => e.stopPropagation()} className="admin-editor" style={{ background: "#fff", borderRadius: 22, maxWidth: 540, width: "100%", maxHeight: "calc(100vh - 32px)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <div>
            <div className="h-eyebrow" style={{ color: "var(--green-700)" }}>Профиль</div>
            <div className="h-title" style={{ fontSize: 22, marginTop: 6 }}>{user.name || "Гость"}</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{user.phone}</div>
          </div>
          <button onClick={onClose} aria-label="Закрыть" style={{ width: 36, height: 36, borderRadius: 10, display: "grid", placeItems: "center" }}>{Icons.close}</button>
        </div>
        <div style={{ padding: 24, overflow: "auto", display: "flex", flexDirection: "column", gap: 18 }}>
          <FieldAd label="UID">
            <div style={{ ...inputStyleAd, background: "var(--paper)", fontFamily: "var(--font-mono)", fontSize: 12 }}>{user.id}</div>
          </FieldAd>
          <FieldAd label="Зарегистрирован">
            <div style={{ ...inputStyleAd, background: "var(--paper)" }}>{fmtDate(user.createdAt)}</div>
          </FieldAd>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 8 }}>Корзина ({(user.cart || []).length})</div>
            {(user.cart || []).length === 0 ? (
              <div style={{ ...inputStyleAd, background: "var(--paper)", color: "var(--muted)" }}>Пусто</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(user.cart || []).map((it, i) => (
                  <div key={it._id || i} style={{ padding: 12, borderRadius: 10, border: "1px solid var(--line)", background: "var(--paper)", display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{it.title || it.name || "—"}</div>
                      {it.subtitle && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{it.subtitle}</div>}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap" }}>{fmtSom(it.price)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div style={{ padding: "14px 24px", borderTop: "1px solid var(--line)", background: "var(--cream)", display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button className="btn btn-primary" onClick={onClose}>Закрыть</button>
        </div>
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 14px", borderRadius: 999, fontSize: 13, fontWeight: 600,
      background: active ? "var(--ink)" : "rgba(10,18,8,.06)",
      color: active ? "#fff" : "var(--ink)",
      cursor: "pointer", border: 0, fontFamily: "inherit",
    }}>{children}</button>
  );
}

Object.assign(window, { AdminPage, OrdersPanel, UsersPanel, useSiteSettings, useCollection });
