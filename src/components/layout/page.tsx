// Patrón de layout "pantalla fija" para las páginas internas de NEXUS METADATA.
//
// Regla base: el shell (_authenticated.tsx) ya fija el viewport (h-screen + overflow-hidden)
// y deja el scroll en <main> (min-h-0 flex-1 overflow-auto). Estas piezas hacen que cada
// página llene ese alto y mueva el scroll DENTRO de cada panel, no en la pantalla completa.
//
// Clave técnica: en una cadena flex/grid, cada hijo que deba encoger para que su scroll
// interno funcione necesita `min-h-0`. Sin él, el contenido empuja la altura y reaparece
// el scroll global. Por eso Page/Panel/PanelBody lo llevan integrado.
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Contenedor raíz de una página interna. Llena el alto disponible del <main> y no provoca
 * scroll de pantalla: el scroll vive en los paneles hijos.
 */
export function Page({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("flex h-full min-h-0 flex-col gap-4", className)}>{children}</div>;
}

/** Cabecera de página (título + acciones). Fija: nunca scrollea. */
export function PageHeader({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("flex shrink-0 items-start justify-between gap-4", className)}>{children}</div>;
}

/**
 * Recuadro con geometría coherente (radio, borde, sombra y fondo de tarjeta).
 * Pensado para vivir dentro de un contenedor flex/grid con altura acotada.
 */
export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Cabecera fija de un panel (no scrollea). Padding y separación constantes. */
export function PanelHeader({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-between gap-2 border-b border-border px-4 py-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Cuerpo del panel: ÚNICO punto con scroll. `min-h-0` es imprescindible aquí. */
export function PanelBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("min-h-0 flex-1 overflow-y-auto p-4", className)}>{children}</div>;
}
