import { createFileRoute, Outlet, Link, redirect, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/acceso" });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <header className="shrink-0 border-b border-border">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          <Link to="/" className="text-base font-semibold tracking-tight">
            O-<span className="text-ferrari">BIM</span>
            <span className="ml-3 hidden font-mono text-xs font-normal text-muted-foreground sm:inline">
              Project Center
            </span>
          </Link>
          <SignOutButton />
        </div>
      </header>
      <main className="min-h-0 flex-1 overflow-auto px-3 py-4 sm:px-6 sm:py-6">
        <Outlet />
      </main>
    </div>
  );
}

function SignOutButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={async () => {
        await supabase.auth.signOut();
        navigate({ to: "/acceso", replace: true });
      }}
      className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
      title="Cerrar sesión"
    >
      <LogOut className="h-3.5 w-3.5" /> Salir
    </button>
  );
}
