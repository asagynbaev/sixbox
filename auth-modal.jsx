/* SixBox — Phone auth modal (Firebase) */
const { useState: useStateA, useEffect: useEffectA, useRef: useRefA } = React;

const PHONE_PREFIX = "+996";

function formatLocal(s) {
  const d = String(s || "").replace(/\D/g, "").slice(0, 9);
  // 555 612 612
  return d.replace(/(\d{3})(\d{0,3})(\d{0,3})/, (_, a, b, c) => [a, b, c].filter(Boolean).join(" "));
}

function AuthModal({ open, onClose }) {
  const [step, setStep] = useStateA("phone"); // phone | code | done
  const [phone, setPhone] = useStateA("");
  const [code, setCode] = useStateA("");
  const [busy, setBusy] = useStateA(false);
  const [error, setError] = useStateA("");
  const [resendCountdown, setResendCountdown] = useStateA(0);
  const recaptchaRef = useRefA(null);

  useEffectA(() => {
    if (!open) {
      setStep("phone");
      setPhone("");
      setCode("");
      setError("");
      setBusy(false);
      try { window._recaptcha && window._recaptcha.clear(); window._recaptcha = null; } catch (e) { /* ignore */ }
    }
  }, [open]);

  useEffectA(() => {
    if (resendCountdown <= 0) return;
    const t = setTimeout(() => setResendCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCountdown]);

  if (!open) return null;

  const fullPhone = PHONE_PREFIX + phone.replace(/\D/g, "");
  const phoneValid = phone.replace(/\D/g, "").length === 9;

  const sendSms = async () => {
    if (!phoneValid) { setError("Введите 9 цифр номера"); return; }
    setBusy(true);
    setError("");
    try {
      const verifier = window.AuthApi.ensureRecaptcha(recaptchaRef.current);
      // Required: render() before sending in some flows
      await verifier.render().catch(() => {});
      await window.AuthApi.sendCode(fullPhone, verifier);
      setStep("code");
      setResendCountdown(60);
    } catch (e) {
      setError(translateError(e));
    }
    setBusy(false);
  };

  const verifyCode = async () => {
    const c = code.replace(/\D/g, "");
    if (c.length < 6) { setError("Код 6 цифр"); return; }
    setBusy(true);
    setError("");
    try {
      await window.AuthApi.confirmCode(c);
      setStep("done");
      setTimeout(onClose, 800);
    } catch (e) {
      setError(translateError(e));
    }
    setBusy(false);
  };

  return ReactDOM.createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1500,
        background: "rgba(7, 38, 15, 0.7)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "grid", placeItems: "center",
        padding: 16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 24,
          width: "100%",
          maxWidth: 420,
          padding: 28,
          display: "flex",
          flexDirection: "column",
          gap: 18,
          boxShadow: "0 30px 80px -20px rgba(0,0,0,.4)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="h-eyebrow" style={{ color: "var(--green-700)" }}>Вход</div>
          <button onClick={onClose} aria-label="Закрыть" style={{ width: 36, height: 36, borderRadius: 10, display: "grid", placeItems: "center", background: "rgba(10,18,8,.04)" }}>
            {Icons.close}
          </button>
        </div>

        {step === "phone" && (
          <>
            <h2 className="h-display" style={{ fontSize: 28, margin: 0 }}>Войдите по номеру</h2>
            <p style={{ fontSize: 14, color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
              Отправим SMS с кодом подтверждения. Бесплатно, регистрация не нужна.
            </p>

            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)" }}>Телефон</span>
              <div style={{ display: "flex", gap: 8, alignItems: "center", border: "1px solid var(--line)", borderRadius: 12, padding: "0 14px", background: "#fff" }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--ink)" }}>{PHONE_PREFIX}</span>
                <input
                  autoFocus
                  inputMode="tel"
                  placeholder="555 612 612"
                  value={formatLocal(phone)}
                  onChange={e => { setPhone(e.target.value); setError(""); }}
                  onKeyDown={e => { if (e.key === "Enter") sendSms(); }}
                  style={{ flex: 1, padding: "14px 0", border: 0, outline: "none", fontSize: 16, fontFamily: "inherit", background: "transparent", color: "var(--ink)" }}
                />
              </div>
            </label>

            {error && <div style={{ color: "#c33", fontSize: 13 }}>{error}</div>}

            <button
              className="btn btn-primary"
              style={{ justifyContent: "center", padding: 14 }}
              onClick={sendSms}
              disabled={busy || !phoneValid}
            >
              {busy ? "Отправляем…" : "Отправить код"} {Icons.arrow}
            </button>

            <div style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", lineHeight: 1.5 }}>
              Нажимая «Отправить код», вы соглашаетесь с{" "}
              <button onClick={() => { onClose(); window.go?.("offer"); }} style={{ background: "transparent", border: 0, padding: 0, color: "var(--green-700)", textDecoration: "underline", fontFamily: "inherit", fontSize: 12, cursor: "pointer" }}>офертой</button>
              {" и "}
              <button onClick={() => { onClose(); window.go?.("privacy"); }} style={{ background: "transparent", border: 0, padding: 0, color: "var(--green-700)", textDecoration: "underline", fontFamily: "inherit", fontSize: 12, cursor: "pointer" }}>политикой</button>.
            </div>
          </>
        )}

        {step === "code" && (
          <>
            <h2 className="h-display" style={{ fontSize: 28, margin: 0 }}>Код из SMS</h2>
            <p style={{ fontSize: 14, color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
              Отправили на <b style={{ color: "var(--ink)" }}>{PHONE_PREFIX} {formatLocal(phone)}</b>.{" "}
              <button onClick={() => { setStep("phone"); setCode(""); setError(""); }} style={{ background: "transparent", border: 0, padding: 0, color: "var(--green-700)", fontFamily: "inherit", fontSize: 14, cursor: "pointer", textDecoration: "underline" }}>изменить</button>
            </p>

            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)" }}>6-значный код</span>
              <input
                autoFocus
                inputMode="numeric"
                pattern="\d*"
                maxLength={6}
                placeholder="••••••"
                value={code}
                onChange={e => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
                onKeyDown={e => { if (e.key === "Enter") verifyCode(); }}
                style={{
                  padding: "16px 18px", borderRadius: 12, border: "1px solid var(--line)",
                  fontSize: 26, fontFamily: "var(--font-mono)", letterSpacing: "0.4em",
                  textAlign: "center", background: "#fff", color: "var(--ink)",
                }}
              />
            </label>

            {error && <div style={{ color: "#c33", fontSize: 13 }}>{error}</div>}

            <button
              className="btn btn-primary"
              style={{ justifyContent: "center", padding: 14 }}
              onClick={verifyCode}
              disabled={busy || code.length < 6}
            >
              {busy ? "Проверяем…" : "Подтвердить"} {Icons.arrow}
            </button>

            <button
              onClick={sendSms}
              disabled={resendCountdown > 0 || busy}
              style={{ background: "transparent", border: 0, padding: 0, fontFamily: "inherit", color: resendCountdown > 0 ? "var(--muted)" : "var(--green-700)", fontSize: 13, cursor: resendCountdown > 0 ? "default" : "pointer", textAlign: "center" }}
            >
              {resendCountdown > 0 ? `Отправить заново через ${resendCountdown}с` : "Отправить код заново"}
            </button>
          </>
        )}

        {step === "done" && (
          <div style={{ padding: "28px 0", textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, background: "var(--lime-300)", display: "grid", placeItems: "center", margin: "0 auto 16px", color: "var(--green-900)" }}>
              {Icons.check}
            </div>
            <div className="h-title" style={{ fontSize: 22 }}>Вы вошли!</div>
            <div style={{ marginTop: 8, fontSize: 14, color: "var(--muted)" }}>{PHONE_PREFIX} {formatLocal(phone)}</div>
          </div>
        )}

        {/* invisible reCAPTCHA mount point */}
        <div ref={recaptchaRef} />
      </div>
    </div>,
    document.body
  );
}

function translateError(e) {
  const code = (e && e.code) || "";
  const map = {
    "auth/invalid-phone-number": "Неверный формат номера",
    "auth/missing-phone-number": "Введите номер",
    "auth/quota-exceeded": "Лимит SMS превышен. Попробуйте позже",
    "auth/too-many-requests": "Слишком много попыток. Подождите немного",
    "auth/invalid-verification-code": "Неверный код",
    "auth/code-expired": "Код истёк. Запросите новый",
    "auth/captcha-check-failed": "reCAPTCHA не прошла. Обновите страницу",
    "auth/operation-not-allowed": "Phone Auth не включён в Firebase Console",
    "auth/billing-not-enabled": "Нужен Blaze plan в Firebase для SMS на реальные номера",
  };
  return map[code] || (e && e.message) || String(e);
}

// Global mount: any component can call window.openAuth() to show the modal.
function AuthRoot() {
  const [open, setOpen] = useStateA(false);
  useEffectA(() => {
    window.openAuth = () => setOpen(true);
    window.closeAuth = () => setOpen(false);
    return () => { window.openAuth = null; window.closeAuth = null; };
  }, []);
  return <AuthModal open={open} onClose={() => setOpen(false)} />;
}

// Hook: subscribe to current user, force re-render on change
function useAuthUser() {
  const [user, setUser] = useStateA(() => window.AuthApi ? window.AuthApi.current() : null);
  useEffectA(() => {
    if (!window.AuthApi) return;
    const unsub = window.AuthApi.onChange(u => setUser(u));
    return () => unsub && unsub();
  }, []);
  return user;
}

Object.assign(window, { AuthModal, AuthRoot, useAuthUser, formatLocal, PHONE_PREFIX });
