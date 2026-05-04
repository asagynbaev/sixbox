/* SixBox shared components — exported to window */
const { useState, useEffect, useMemo, useRef } = React;

// ---------- Logo ----------
function Logo({ light = false, size = 1 }) {
  const color = light ? "#fff" : "var(--ink)";
  return (
    <button
      type="button"
      onClick={() => window.go?.("home")}
      className="logo"
      style={{ color, fontSize: `${20 * size}px`, background: "transparent", border: 0, padding: 0, cursor: "pointer", fontFamily: "inherit" }}
    >
      <div className="logo-mark" style={{ width: 32 * size, height: 32 * size, fontSize: 16 * size }}>S</div>
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 0.95, alignItems: "flex-start" }}>
        <span style={{ fontWeight: 800, letterSpacing: "0.02em" }}>SIX BOX</span>
        <span style={{ fontSize: 9 * size, fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.32em", opacity: 0.6, textTransform: "uppercase", marginTop: 2 }}>perfect meals</span>
      </div>
    </button>
  );
}

// ---------- Icons (line, 1.6 stroke) ----------
const Icon = ({ d, size = 20, stroke = "currentColor", fill = "none", strokeWidth = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {typeof d === "string" ? <path d={d} /> : d}
  </svg>
);
const Icons = {
  arrow: <Icon d="M5 12h14M13 6l6 6-6 6" />,
  arrowDown: <Icon d="M12 5v14M6 13l6 6 6-6" />,
  check: <Icon d="M5 12l5 5L20 7" />,
  plus: <Icon d="M12 5v14M5 12h14" />,
  minus: <Icon d="M5 12h14" />,
  flame: <Icon d={<path d="M12 3c2 4 6 5 6 10a6 6 0 1 1-12 0c0-3 2-4 3-6 0 2 1 3 3 3-1-2-1-5 0-7z" />} />,
  leaf: <Icon d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14zM5 19l7-7" />,
  truck: <Icon d={<g><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></g>} />,
  clock: <Icon d={<g><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></g>} />,
  bag: <Icon d={<g><path d="M5 8h14l-1 12H6z" /><path d="M9 8a3 3 0 0 1 6 0" /></g>} />,
  user: <Icon d={<g><circle cx="12" cy="8" r="3.5" /><path d="M5 20c1-3 4-5 7-5s6 2 7 5" /></g>} />,
  heart: <Icon d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />,
  star: <Icon d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6-5.4-2.9L6.6 19.8l1-6L3.2 9.5l6.1-.9z" fill="currentColor" stroke="none" />,
  fridge: <Icon d={<g><rect x="6" y="3" width="12" height="18" rx="2"/><path d="M6 11h12"/><path d="M9 7v1M9 14v2"/></g>} />,
  fire: <Icon d={<path d="M12 3c1 3 5 4 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 0 1 1 2 2 2-1-1-1-4 1-7z"/>} />,
  scale: <Icon d={<g><path d="M12 4v16M5 8h14"/><path d="M5 8l-2 7a3 3 0 0 0 6 0z"/><path d="M19 8l-2 7a3 3 0 0 0 6 0z"/></g>} />,
  chef: <Icon d={<g><path d="M7 11a4 4 0 1 1 5-3 3 3 0 1 1 0 3"/><path d="M7 11v8h10v-8"/></g>} />,
  phone: <Icon d="M5 4h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  pin: <Icon d={<g><path d="M12 21s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></g>} />,
  whats: <Icon d={<path d="M3 21l1.6-5A8 8 0 1 1 8 19.4L3 21z"/>} />,
  insta: <Icon d={<g><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></g>} />,
  tg: <Icon d="M3 11l18-7-3 17-7-4-3 4v-5l11-9-13 7z" />,
  menu: <Icon d="M4 7h16M4 12h16M4 17h16" />,
  close: <Icon d="M6 6l12 12M18 6L6 18" />,
};

// ---------- Plates / Photo placeholders with food vibe ----------
function FoodPlate({ kind = "chicken-rice", size = "100%", round = true }) {
  // Stylized photo placeholder. Different kinds get different palettes.
  const palettes = {
    "chicken-rice": ["#f4e0a0", "#e8a85f", "#9ec96b", "#ff5252"],
    "salmon-greens": ["#ff8a5e", "#7fb87f", "#3d5a2c", "#f4e0a0"],
    "tofu-quinoa": ["#f7e3a3", "#9ec96b", "#4fd96f", "#ff8a1f"],
    "beef-bowl": ["#7a3a1a", "#c75a2a", "#e8a85f", "#9ec96b"],
    "salad": ["#9ec96b", "#4fd96f", "#ff5252", "#f4e0a0"],
    "smoothie": ["#ff5e8a", "#a06ed9", "#ff8a5e", "#f4e0a0"],
    "oats": ["#f4e0a0", "#a07a4a", "#ff5e8a", "#c8e09a"],
    "dessert": ["#e8b48c", "#7a3a1a", "#f4e0a0", "#fff"],
  };
  const p = palettes[kind] || palettes["chicken-rice"];
  return (
    <div style={{ width: size, aspectRatio: 1, position: "relative" }}>
      <div style={{
        position: "absolute", inset: 0,
        borderRadius: round ? "50%" : 18,
        background: round
          ? `radial-gradient(circle at 50% 40%, #1a2a14 0%, #050d04 80%)`
          : `linear-gradient(135deg, #0f1a0d, #1a2a14)`,
        overflow: "hidden",
        boxShadow: "inset 0 -24px 50px rgba(0,0,0,.5), 0 30px 60px -20px rgba(0,0,0,.4)",
      }}>
        {/* food blobs */}
        <div style={{
          position: "absolute", inset: round ? "8%" : "10%",
          borderRadius: round ? "50%" : 12,
          background: `
            radial-gradient(circle at 28% 32%, ${p[0]} 4%, transparent 5%),
            radial-gradient(circle at 62% 24%, ${p[1]} 5%, transparent 6%),
            radial-gradient(circle at 78% 48%, ${p[2]} 6%, transparent 7%),
            radial-gradient(circle at 34% 68%, ${p[3]} 4%, transparent 5%),
            radial-gradient(circle at 60% 72%, ${p[0]} 5%, transparent 6%),
            radial-gradient(circle at 22% 52%, ${p[2]} 4%, transparent 5%),
            radial-gradient(circle at 50% 50%, ${p[1]} 8%, transparent 9%),
            radial-gradient(circle at 70% 35%, ${p[3]} 3%, transparent 4%),
            radial-gradient(circle at 42% 42%, ${p[0]} 5%, transparent 6%),
            linear-gradient(135deg, #4a6a2a, #1a2a14)
          `,
        }} />
        {/* highlight */}
        <div style={{
          position: "absolute", top: "10%", left: "20%", width: "30%", height: "20%",
          background: "radial-gradient(ellipse, rgba(255,255,255,.15), transparent 70%)",
          filter: "blur(8px)",
        }} />
      </div>
    </div>
  );
}

// Container box (top-down view of food container)
function FoodContainer({ kind = "chicken-rice", label }) {
  const p = {
    "chicken-rice": { rice: "#f4e0a0", protein: "#d8853a", veg: "#9ec96b", accent: "#ff5252" },
    "salmon-greens": { rice: "#f4e0a0", protein: "#ff8a5e", veg: "#4fd96f", accent: "#3d5a2c" },
    "tofu-quinoa": { rice: "#dfd0a0", protein: "#f4e0a0", veg: "#9ec96b", accent: "#ff8a1f" },
    "beef-bowl": { rice: "#e8d49a", protein: "#7a3a1a", veg: "#9ec96b", accent: "#ff5252" },
  }[kind] || { rice: "#f4e0a0", protein: "#d8853a", veg: "#9ec96b", accent: "#ff5252" };

  return (
    <div style={{
      position: "relative",
      background: "#0a0e08",
      borderRadius: 14,
      padding: 14,
      aspectRatio: "4/3",
      boxShadow: "0 14px 30px -10px rgba(0,0,0,.4), inset 0 0 0 1px rgba(255,255,255,.05)",
    }}>
      <div style={{
        position: "absolute", inset: 14,
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6,
        borderRadius: 6, overflow: "hidden",
      }}>
        <div style={{ background: `radial-gradient(circle at 30% 30%, #fff 1.5px, transparent 2px) 0 0/8px 8px, ${p.rice}` }} />
        <div style={{
          background: `linear-gradient(120deg, ${p.protein} 0%, ${p.protein} 70%, rgba(0,0,0,.4) 100%)`,
          position: "relative",
        }}>
          {/* grill marks */}
          <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(115deg, transparent 0 12px, rgba(0,0,0,.3) 12px 14px)" }} />
        </div>
      </div>
      {/* veg/accent dots overlay */}
      <div style={{ position: "absolute", left: 22, top: 22, width: 10, height: 10, borderRadius: 5, background: p.veg }} />
      <div style={{ position: "absolute", left: 38, top: 30, width: 8, height: 8, borderRadius: 4, background: p.accent }} />
      <div style={{ position: "absolute", right: 30, bottom: 30, width: 10, height: 10, borderRadius: 5, background: p.veg }} />

      {/* SixBox sticker */}
      <div style={{
        position: "absolute", left: 18, top: 18,
        background: "#ff5252", color: "#fff",
        fontFamily: "var(--font-display)",
        fontSize: 8, fontWeight: 700, letterSpacing: "0.08em",
        padding: "4px 6px", borderRadius: 3,
        transform: "rotate(-4deg)",
      }}>
        SIX BOX
      </div>
      {label && (
        <div style={{
          position: "absolute", right: 12, bottom: 10,
          fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(255,255,255,.6)",
        }}>{label}</div>
      )}
    </div>
  );
}

// ---------- Header / Nav ----------
const NAV_LINKS = [
  { id: "home", label: "Главная" },
  { id: "menu", label: "Меню" },
  { id: "programs", label: "Программы" },
  { id: "constructor", label: "Конструктор" },
  { id: "account", label: "Кабинет" },
  { id: "contacts", label: "Контакты" },
];

function Header({ light = false, active = "home", compact = false }) {
  const [open, setOpen] = useState(false);
  const isLight = light;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleNav = (id) => {
    setOpen(false);
    window.go?.(id);
  };

  return (
    <header className={`site-header ${isLight ? "site-header-dark" : "site-header-light"}`}>
      <div className="container site-header-row" style={{ height: compact ? 64 : 76 }}>
        <Logo light={isLight} />
        <nav className="site-nav">
          {NAV_LINKS.map(l => (
            <button
              type="button"
              key={l.id}
              onClick={() => handleNav(l.id)}
              className={active === l.id ? "site-nav-link is-active" : "site-nav-link"}
            >
              {l.label}
            </button>
          ))}
        </nav>
        <div className="site-header-actions">
          <div className="site-header-loc">
            {Icons.pin} <span>Бишкек</span>
          </div>
          <button className={isLight ? "btn btn-ghost-light" : "btn btn-ghost"} style={{ padding: "10px 16px" }}>
            {Icons.user}
            <span>Войти</span>
          </button>
          <button className="btn btn-primary site-header-cart" style={{ padding: "10px 18px" }} onClick={() => window.go?.("cart")}>
            {Icons.bag}
            <span className="site-header-cart-label">Корзина</span>
            <span style={{
              background: "rgba(0,0,0,.15)", padding: "2px 7px", borderRadius: 999,
              fontSize: 11, fontWeight: 700, marginLeft: 4,
            }}>3</span>
          </button>
          <button
            type="button"
            className="site-header-burger"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
          >
            {open ? Icons.close : Icons.menu}
          </button>
        </div>
      </div>

      {open && ReactDOM.createPortal(
        <div className="mobile-menu" role="dialog" aria-modal="true">
          <nav className="mobile-menu-nav">
            {NAV_LINKS.map(l => (
              <button
                type="button"
                key={l.id}
                onClick={() => handleNav(l.id)}
                className={active === l.id ? "mobile-menu-link is-active" : "mobile-menu-link"}
              >
                {l.label}
                {Icons.arrow}
              </button>
            ))}
          </nav>
          <div className="mobile-menu-foot">
            <button className="btn btn-ghost-light" style={{ width: "100%", justifyContent: "center" }}>
              {Icons.user} <span>Войти</span>
            </button>
            <a href="tel:+996555612612" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              {Icons.phone} <span>+996 555 612 612</span>
            </a>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}

// ---------- Footer ----------
function FooterLink({ children, to, scroll }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => window.go?.(to ?? "home", scroll)}
        style={{
          background: "transparent", border: 0, padding: 0, color: "inherit",
          fontSize: 14, opacity: 0.85, cursor: "pointer", fontFamily: "inherit",
          textAlign: "left", transition: "opacity .15s",
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = 1}
        onMouseLeave={e => e.currentTarget.style.opacity = 0.85}
      >{children}</button>
    </li>
  );
}

function Footer() {
  const cols = [
    { t: "Сайт", l: [
      { label: "Меню недели", to: "menu" },
      { label: "Программы питания", to: "programs" },
      { label: "Конструктор", to: "constructor" },
      { label: "Холодильник доверия", to: "home", scroll: "fridge" },
      { label: "Блог", to: "blog" },
    ]},
    { t: "Компания", l: [
      { label: "О нас", to: "about" },
      { label: "Команда поваров", to: "home", scroll: "team" },
      { label: "Кухня", to: "kitchen" },
      { label: "Карьера", to: "careers" },
      { label: "Партнёрам", to: "partners" },
    ]},
    { t: "Поддержка", l: [
      { label: "FAQ", to: "home", scroll: "faq" },
      { label: "Доставка", to: "delivery" },
      { label: "Оплата", to: "checkout" },
      { label: "Аллергены", to: "allergens" },
      { label: "Контакты", to: "contacts" },
    ]},
  ];
  const socials = [
    { ic: Icons.insta, href: "https://instagram.com/sixbox.kg", label: "Instagram" },
    { ic: Icons.tg, href: "https://t.me/sixbox_kg", label: "Telegram" },
    { ic: Icons.whats, href: "https://wa.me/996555612612", label: "WhatsApp" },
  ];
  return (
    <footer style={{ background: "var(--green-900)", color: "#fff", padding: "80px 0 36px" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1.2fr", gap: 48 }}>
          <div>
            <Logo light />
            <p style={{ marginTop: 18, opacity: 0.7, fontSize: 14, lineHeight: 1.6, maxWidth: 320 }}>
              Готовое здоровое питание с доставкой по Бишкеку. Рассчитываем калории, готовим на пару и су-вид, привозим утром или вечером.
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 22 }}>
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "rgba(255,255,255,.08)",
                  display: "grid", placeItems: "center",
                  color: "#fff", transition: "background .15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.16)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.08)"}
                >{s.ic}</a>
              ))}
            </div>
          </div>
          {cols.map(c => (
            <div key={c.t}>
              <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.2em", opacity: 0.5, marginBottom: 18 }}>{c.t}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {c.l.map(x => <FooterLink key={x.label} to={x.to} scroll={x.scroll}>{x.label}</FooterLink>)}
              </ul>
            </div>
          ))}
          <div>
            <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.2em", opacity: 0.5, marginBottom: 18 }}>Связь</div>
            <a href="tel:+996555612612" style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "#fff" }}>+996 555 612 612</a>
            <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>Каждый день, 8:00 — 22:00</div>
            <a href="https://maps.google.com/?q=Бишкек,+Ибраимова+115" target="_blank" rel="noopener noreferrer" style={{ marginTop: 16, padding: 12, borderRadius: 14, background: "rgba(255,255,255,.06)", display: "flex", gap: 10, alignItems: "center", color: "#fff" }}>
              {Icons.pin}
              <div>
                <div style={{ fontSize: 13 }}>Кухня SixBox</div>
                <div style={{ fontSize: 12, opacity: 0.6 }}>Бишкек, ул. Ибраимова 115</div>
              </div>
            </a>
          </div>
        </div>
        <div style={{ marginTop: 60, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,.08)", display: "flex", justifyContent: "space-between", fontSize: 12, opacity: 0.55 }}>
          <div>© 2026 SixBox · perfect meals since 2017</div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <button type="button" onClick={() => window.go?.("privacy")} style={{ background: "transparent", border: 0, color: "inherit", fontSize: 12, cursor: "pointer", padding: 0, fontFamily: "inherit" }}>Политика конфиденциальности</button>
            <button type="button" onClick={() => window.go?.("offer")} style={{ background: "transparent", border: 0, color: "inherit", fontSize: 12, cursor: "pointer", padding: 0, fontFamily: "inherit" }}>Договор оферты</button>
            <button type="button" onClick={() => window.go?.("admin")} style={{ background: "transparent", border: 0, color: "inherit", fontSize: 12, cursor: "pointer", padding: 0, fontFamily: "inherit", opacity: 0.6 }}>Админка</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ---------- Section header ----------
function SectionHeader({ eyebrow, title, sub, align = "left", light = false }) {
  return (
    <div style={{ textAlign: align, color: light ? "#fff" : "var(--ink)" }}>
      {eyebrow && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 14px",
          borderRadius: 999,
          background: light ? "rgba(179,240,106,.15)" : "rgba(21,168,58,.1)",
          color: light ? "var(--lime-300)" : "var(--green-700)",
          fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase",
          marginBottom: 20,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: "currentColor" }} />
          {eyebrow}
        </div>
      )}
      <h2 className="h-display" style={{
        fontSize: "clamp(40px, 5vw, 72px)", margin: 0,
        maxWidth: align === "center" ? "16ch" : "18ch",
        marginInline: align === "center" ? "auto" : 0,
      }}>{title}</h2>
      {sub && (
        <p style={{
          marginTop: 18, fontSize: 18, lineHeight: 1.5,
          color: light ? "rgba(255,255,255,.7)" : "var(--muted)",
          maxWidth: align === "center" ? "60ch" : "52ch",
          marginInline: align === "center" ? "auto" : 0,
        }}>{sub}</p>
      )}
    </div>
  );
}

Object.assign(window, {
  Logo, Icons, Icon,
  FoodPlate, FoodContainer,
  Header, Footer, SectionHeader,
});
