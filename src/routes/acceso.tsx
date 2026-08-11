import { createFileRoute, redirect, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Acceso de participantes: email + contraseña (Supabase Auth).
// Las cuentas se dan de alta desde el panel de Supabase (Authentication → Users).

export const Route = createFileRoute("/acceso")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) throw redirect({ to: "/center" });
  },
  head: () => ({ meta: [{ title: "Acceso — O-BIM" }] }),
  component: AccesoPage,
});

function AccesoPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: pin,
    });
    setBusy(false);
    if (err) {
      setError(
        err.message === "Invalid login credentials"
          ? "Email o PIN incorrectos, o cuenta no autorizada."
          : err.message,
      );
      return;
    }
    navigate({ to: "/center", replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="text-base font-semibold tracking-tight">
            O-<span className="text-ferrari">BIM</span>
          </Link>
          <span className="font-mono text-xs text-muted-foreground">Área de participantes</span>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4">
        <form
          onSubmit={entrar}
          className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-sm"
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-ferrari/10 text-ferrari">
              <Lock className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Acceso participantes</h1>
              <p className="text-xs text-muted-foreground">O-BIM Project Center</p>
            </div>
          </div>

          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />

          <label className="mb-1 block text-sm font-medium">PIN</label>
          <input
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="••••••"
            className="mb-4 w-full rounded-md border border-border bg-background px-3 py-2 text-sm tracking-[0.3em] outline-none focus:border-primary"
          />

          {error && (
            <p className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy || !email || pin.length < 6}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Entrar
          </button>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Acceso solo para usuarios autorizados con email y PIN. Pide el alta al administrador del
            proyecto.
          </p>
        </form>
      </main>
    </div>
  );
}
