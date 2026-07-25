import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  Building2,
  CalendarDays,
  Code2,
  Euro,
  ExternalLink,
  FileCheck2,
  Flag,
  FolderOpen,
  LayoutDashboard,
  Plus,
  TrendingUp,
  Trash2,
  Users,
  FileText,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Page } from "@/components/layout/page";
import {
  CAPITULOS,
  obimEventoCreate,
  obimEventoDelete,
  obimEventosList,
  obimHitoDelete,
  obimHitoUpdate,
  obimHitosList,
  obimInversionCreate,
  obimInversionDelete,
  obimInversionesList,
  obimJustificacionCreate,
  obimJustificacionDelete,
  obimJustificacionUpdate,
  obimJustificacionViewUrl,
  obimJustificacionesList,
  obimPersonaCreate,
  obimPersonaDelete,
  obimPersonaUpdate,
  obimPersonalList,
  obimDocumentoCreate,
  obimDocumentoDelete,
  obimDocumentoViewUrl,
  obimDocumentosList,
  obimAvanceCreate,
  obimAvanceDelete,
  obimAvancesList,
  obimParticipanteCreate,
  obimParticipanteDelete,
  obimParticipanteUpdate,
  obimParticipantesList,
  type ObimEvento,
  type ObimHito,
  type ObimInversion,
  type ObimJustificacion,
  type ObimPersona,
  type ObimDocumento,
  type ObimAvance,
  type ObimParticipante,
} from "@/lib/obim.functions";

export const Route = createFileRoute("/_authenticated/center")({
  head: () => ({
    meta: [
      { title: "O-BIM Project Center" },
      {
        name: "description",
        content:
          "Gestión interna del programa O-BIM: inversión, personal, justificación, agenda e hitos.",
      },
    ],
  }),
  component: ObimCenterPage,
});

type Tab =
  | "resumen"
  | "avances"
  | "documental"
  | "agenda"
  | "inversion"
  | "personal"
  | "participantes"
  | "justificacion"
  | "codigo";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "resumen", label: "Resumen", icon: LayoutDashboard },
  { id: "avances", label: "Avances", icon: TrendingUp },
  { id: "documental", label: "Documental", icon: FolderOpen },
  { id: "agenda", label: "Agenda e hitos", icon: CalendarDays },
  { id: "inversion", label: "Inversión", icon: Euro },
  { id: "personal", label: "Personal", icon: Users },
  { id: "participantes", label: "Participantes", icon: Building2 },
  { id: "justificacion", label: "Justificación", icon: FileCheck2 },
  { id: "codigo", label: "Código", icon: Code2 },
];

const eur = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

function ObimCenterPage() {
  const [tab, setTab] = useState<Tab>("resumen");

  return (
    <Page>
      <div className="shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              O-<span className="text-ferrari">BIM</span> Project Center
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gestión del programa: avances, documental, inversión, personal, participantes,
              justificación, agenda, hitos y código de producción.
            </p>
          </div>
          <Link
            to="/"
            className="shrink-0 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            Portal público
          </Link>
        </div>
        <nav className="mt-4 flex gap-1 overflow-x-auto border-b border-border pb-px [scrollbar-width:none]">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-2 text-sm transition-colors ${
                tab === t.id
                  ? "border-ferrari font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pb-8">
        {tab === "resumen" && <Resumen />}
        {tab === "avances" && <Avances />}
        {tab === "documental" && <Documental />}
        {tab === "agenda" && <Agenda />}
        {tab === "inversion" && <Inversion />}
        {tab === "personal" && <Personal />}
        {tab === "participantes" && <Participantes />}
        {tab === "justificacion" && <Justificacion />}
        {tab === "codigo" && <Codigo />}
      </div>
    </Page>
  );
}

// ---------- Resumen ----------

function Resumen() {
  const hitosFn = useServerFn(obimHitosList);
  const invFn = useServerFn(obimInversionesList);
  const persFn = useServerFn(obimPersonalList);
  const justFn = useServerFn(obimJustificacionesList);
  const evFn = useServerFn(obimEventosList);

  const { data: hitos = [] } = useQuery({ queryKey: ["obim", "hitos"], queryFn: () => hitosFn() });
  const { data: inversiones = [] } = useQuery({
    queryKey: ["obim", "inversiones"],
    queryFn: () => invFn(),
  });
  const { data: personal = [] } = useQuery({
    queryKey: ["obim", "personal"],
    queryFn: () => persFn(),
  });
  const { data: justificaciones = [] } = useQuery({
    queryKey: ["obim", "justificaciones"],
    queryFn: () => justFn(),
  });
  const { data: eventos = [] } = useQuery({ queryKey: ["obim", "eventos"], queryFn: () => evFn() });

  const total = (tipo: ObimInversion["tipo"]) =>
    inversiones.filter((i) => i.tipo === tipo).reduce((s, i) => s + Number(i.importe), 0);

  const proximos = eventos.filter((e) => new Date(e.cuando) >= new Date()).slice(0, 5);
  const enCurso = hitos.filter((h) => h.estado === "en_curso");
  const pendientesJust = justificaciones.filter((j) => j.estado === "pendiente").length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Inversión prevista", eur.format(total("prevista"))],
          ["Comprometida", eur.format(total("comprometida"))],
          ["Ejecutada", eur.format(total("ejecutada"))],
          ["Personal activo", String(personal.filter((p) => p.activo).length)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="mt-1 font-mono text-2xl">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-4 py-3 text-sm font-medium">
            <Flag className="mr-2 inline h-4 w-4 text-ferrari" />
            Hitos en curso
          </div>
          <div className="divide-y divide-border">
            {enCurso.length === 0 && (
              <p className="px-4 py-6 text-sm text-muted-foreground">Ningún hito en curso.</p>
            )}
            {enCurso.map((h) => (
              <div key={h.id} className="px-4 py-3">
                <p className="text-sm font-medium">
                  <span className="mr-2 font-mono text-xs text-ferrari">{h.etapa}</span>
                  {h.titulo}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{h.descripcion}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-4 py-3 text-sm font-medium">
            <CalendarDays className="mr-2 inline h-4 w-4 text-ferrari" />
            Próximas citas
          </div>
          <div className="divide-y divide-border">
            {proximos.length === 0 && (
              <p className="px-4 py-6 text-sm text-muted-foreground">Sin citas próximas.</p>
            )}
            {proximos.map((e) => (
              <div key={e.id} className="flex items-baseline justify-between gap-3 px-4 py-3">
                <p className="min-w-0 truncate text-sm">{e.titulo}</p>
                <p className="shrink-0 font-mono text-xs text-muted-foreground">
                  {new Date(e.cuando).toLocaleString("es-ES", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            ))}
          </div>
          {pendientesJust > 0 && (
            <p className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
              {pendientesJust} justificante{pendientesJust === 1 ? "" : "s"} pendiente
              {pendientesJust === 1 ? "" : "s"} de presentar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Agenda e hitos ----------

function Agenda() {
  const qc = useQueryClient();
  const hitosFn = useServerFn(obimHitosList);
  const hitoUpdFn = useServerFn(obimHitoUpdate);
  const hitoDelFn = useServerFn(obimHitoDelete);
  const evFn = useServerFn(obimEventosList);
  const evAddFn = useServerFn(obimEventoCreate);
  const evDelFn = useServerFn(obimEventoDelete);

  const { data: hitos = [] } = useQuery({ queryKey: ["obim", "hitos"], queryFn: () => hitosFn() });
  const { data: eventos = [] } = useQuery({ queryKey: ["obim", "eventos"], queryFn: () => evFn() });

  const [titulo, setTitulo] = useState("");
  const [cuando, setCuando] = useState("");
  const [lugar, setLugar] = useState("");

  const addEvento = useMutation({
    mutationFn: () =>
      evAddFn({ data: { titulo, cuando: new Date(cuando).toISOString(), lugar, notas: "" } }),
    onSuccess: () => {
      setTitulo("");
      setCuando("");
      setLugar("");
      qc.invalidateQueries({ queryKey: ["obim", "eventos"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updHito = useMutation({
    mutationFn: (d: { id: string; estado: ObimHito["estado"] }) => hitoUpdFn({ data: d }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["obim", "hitos"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const delHito = useMutation({
    mutationFn: (id: string) => hitoDelFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["obim", "hitos"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const delEvento = useMutation({
    mutationFn: (id: string) => evDelFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["obim", "eventos"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Hoja de ruta del programa
        </h2>
        <div className="space-y-2">
          {hitos.map((h) => (
            <div key={h.id} className="group rounded-lg border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    <span className="mr-2 font-mono text-xs text-ferrari">{h.etapa}</span>
                    {h.titulo}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{h.descripcion}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <select
                    value={h.estado}
                    onChange={(e) =>
                      updHito.mutate({ id: h.id, estado: e.target.value as ObimHito["estado"] })
                    }
                    className={`rounded-md border px-2 py-1 text-xs focus:outline-none ${
                      h.estado === "completado"
                        ? "border-green-600/40 bg-green-600/10 text-green-700"
                        : h.estado === "en_curso"
                          ? "border-ferrari/40 bg-ferrari/10 text-ferrari"
                          : "border-border text-muted-foreground"
                    }`}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en_curso">En curso</option>
                    <option value="completado">Completado</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => delHito.mutate(h.id)}
                    aria-label="Borrar hito"
                    className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Agenda
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (titulo.trim() && cuando) addEvento.mutate();
          }}
          className="mb-4 grid gap-2 rounded-lg border border-border bg-card p-4 sm:grid-cols-[1fr_auto_auto_auto]"
        >
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Reunión, entrega, convocatoria…"
            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
          />
          <input
            type="datetime-local"
            value={cuando}
            onChange={(e) => setCuando(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
          />
          <input
            value={lugar}
            onChange={(e) => setLugar(e.target.value)}
            placeholder="Lugar"
            className="w-28 rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={!titulo.trim() || !cuando || addEvento.isPending}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> Añadir
          </button>
        </form>
        <div className="divide-y divide-border rounded-lg border border-border bg-card">
          {eventos.length === 0 && (
            <p className="px-4 py-6 text-sm text-muted-foreground">Sin citas registradas.</p>
          )}
          {eventos.map((e: ObimEvento) => (
            <div key={e.id} className="group flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm">{e.titulo}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(e.cuando).toLocaleString("es-ES", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                  {e.lugar ? ` · ${e.lugar}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => delEvento.mutate(e.id)}
                aria-label="Borrar cita"
                className="shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ---------- Inversión ----------

function Inversion() {
  const qc = useQueryClient();
  const listFn = useServerFn(obimInversionesList);
  const addFn = useServerFn(obimInversionCreate);
  const delFn = useServerFn(obimInversionDelete);

  const { data: items = [] } = useQuery({
    queryKey: ["obim", "inversiones"],
    queryFn: () => listFn(),
  });

  const [concepto, setConcepto] = useState("");
  const [capitulo, setCapitulo] = useState<string>("Personal");
  const [tipo, setTipo] = useState<ObimInversion["tipo"]>("prevista");
  const [importe, setImporte] = useState("");
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));

  const add = useMutation({
    mutationFn: () =>
      addFn({ data: { concepto, capitulo, tipo, importe: Number(importe), fecha, notas: "" } }),
    onSuccess: () => {
      setConcepto("");
      setImporte("");
      qc.invalidateQueries({ queryKey: ["obim", "inversiones"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["obim", "inversiones"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const total = (t: ObimInversion["tipo"]) =>
    items.filter((i) => i.tipo === t).reduce((s, i) => s + Number(i.importe), 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {(["prevista", "comprometida", "ejecutada"] as const).map((t) => (
          <div key={t} className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{t}</p>
            <p className="mt-1 font-mono text-xl">{eur.format(total(t))}</p>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (concepto.trim() && Number(importe) > 0) add.mutate();
        }}
        className="grid gap-2 rounded-lg border border-border bg-card p-4 sm:grid-cols-[1fr_auto_auto_auto_auto_auto]"
      >
        <input
          value={concepto}
          onChange={(e) => setConcepto(e.target.value)}
          placeholder="Concepto"
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
        />
        <select
          value={capitulo}
          onChange={(e) => setCapitulo(e.target.value)}
          className="rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-primary"
        >
          {CAPITULOS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as ObimInversion["tipo"])}
          className="rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-primary"
        >
          <option value="prevista">Prevista</option>
          <option value="comprometida">Comprometida</option>
          <option value="ejecutada">Ejecutada</option>
        </select>
        <input
          type="number"
          min="0"
          step="0.01"
          value={importe}
          onChange={(e) => setImporte(e.target.value)}
          placeholder="Importe €"
          className="w-32 rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
        />
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={!concepto.trim() || !(Number(importe) > 0) || add.isPending}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> Añadir
        </button>
      </form>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Fecha</th>
              <th className="px-4 py-2.5 font-medium">Concepto</th>
              <th className="px-4 py-2.5 font-medium">Capítulo</th>
              <th className="px-4 py-2.5 font-medium">Tipo</th>
              <th className="px-4 py-2.5 text-right font-medium">Importe</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                  Sin apuntes de inversión.
                </td>
              </tr>
            )}
            {items.map((i) => (
              <tr key={i.id} className="group">
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{i.fecha}</td>
                <td className="px-4 py-2.5">{i.concepto}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{i.capitulo}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{i.tipo}</td>
                <td className="px-4 py-2.5 text-right font-mono">
                  {eur.format(Number(i.importe))}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <button
                    type="button"
                    onClick={() => del.mutate(i.id)}
                    aria-label="Borrar apunte"
                    className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- Personal ----------

function Personal() {
  const qc = useQueryClient();
  const listFn = useServerFn(obimPersonalList);
  const addFn = useServerFn(obimPersonaCreate);
  const updFn = useServerFn(obimPersonaUpdate);
  const delFn = useServerFn(obimPersonaDelete);

  const { data: items = [] } = useQuery({
    queryKey: ["obim", "personal"],
    queryFn: () => listFn(),
  });

  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState("");
  const [dedicacion, setDedicacion] = useState("100");

  const add = useMutation({
    mutationFn: () =>
      addFn({
        data: {
          nombre,
          rol,
          dedicacion_pct: Number(dedicacion) || 100,
          coste_mensual: null,
          email: "",
          notas: "",
        },
      }),
    onSuccess: () => {
      setNombre("");
      setRol("");
      setDedicacion("100");
      qc.invalidateQueries({ queryKey: ["obim", "personal"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const upd = useMutation({
    mutationFn: (d: { id: string; activo: boolean }) => updFn({ data: d }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["obim", "personal"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["obim", "personal"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (nombre.trim()) add.mutate();
        }}
        className="grid gap-2 rounded-lg border border-border bg-card p-4 sm:grid-cols-[1fr_1fr_auto_auto]"
      >
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre y apellidos"
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
        />
        <input
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          placeholder="Rol (dirección, BIM, IA, PMO…)"
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
        />
        <input
          type="number"
          min="0"
          max="100"
          value={dedicacion}
          onChange={(e) => setDedicacion(e.target.value)}
          placeholder="% dedicación"
          className="w-28 rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={!nombre.trim() || add.isPending}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> Añadir
        </button>
      </form>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Nombre</th>
              <th className="px-4 py-2.5 font-medium">Rol</th>
              <th className="px-4 py-2.5 text-right font-medium">Dedicación</th>
              <th className="px-4 py-2.5 font-medium">Estado</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                  Sin personas registradas.
                </td>
              </tr>
            )}
            {items.map((p: ObimPersona) => (
              <tr key={p.id} className="group">
                <td className="px-4 py-2.5">{p.nombre}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{p.rol}</td>
                <td className="px-4 py-2.5 text-right font-mono text-xs">
                  {Number(p.dedicacion_pct)}%
                </td>
                <td className="px-4 py-2.5">
                  <button
                    type="button"
                    onClick={() => upd.mutate({ id: p.id, activo: !p.activo })}
                    className={`rounded-full border px-2.5 py-0.5 text-xs ${
                      p.activo
                        ? "border-green-600/40 bg-green-600/10 text-green-700"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {p.activo ? "Activo" : "Inactivo"}
                  </button>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <button
                    type="button"
                    onClick={() => del.mutate(p.id)}
                    aria-label="Borrar persona"
                    className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- Justificación documental ----------

function Justificacion() {
  const qc = useQueryClient();
  const listFn = useServerFn(obimJustificacionesList);
  const addFn = useServerFn(obimJustificacionCreate);
  const updFn = useServerFn(obimJustificacionUpdate);
  const delFn = useServerFn(obimJustificacionDelete);
  const viewFn = useServerFn(obimJustificacionViewUrl);

  const { data: items = [] } = useQuery({
    queryKey: ["obim", "justificaciones"],
    queryFn: () => listFn(),
  });

  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState<ObimJustificacion["tipo"]>("factura");
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));
  const [importe, setImporte] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function crear() {
    if (!titulo.trim()) return;
    setBusy(true);
    try {
      const res = await addFn({
        data: {
          titulo: titulo.trim(),
          tipo,
          fecha,
          importe: importe ? Number(importe) : null,
          notas: "",
          fileName: file?.name ?? null,
          mime: file?.type ?? "",
        },
      });
      if (file && res.path && res.token) {
        const { error } = await supabase.storage
          .from("obim-docs")
          .uploadToSignedUrl(res.path, res.token, file);
        if (error) throw new Error(error.message);
      }
      setTitulo("");
      setImporte("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      qc.invalidateQueries({ queryKey: ["obim", "justificaciones"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo registrar el justificante.");
    } finally {
      setBusy(false);
    }
  }

  async function ver(j: ObimJustificacion) {
    if (!j.doc_path) return;
    try {
      const { url } = await viewFn({ data: { path: j.doc_path } });
      window.open(url, "_blank", "noopener");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo abrir el documento.");
    }
  }

  const upd = useMutation({
    mutationFn: (d: { id: string; estado: ObimJustificacion["estado"] }) => updFn({ data: d }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["obim", "justificaciones"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: (j: ObimJustificacion) => delFn({ data: { id: j.id, path: j.doc_path } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["obim", "justificaciones"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          crear();
        }}
        className="grid gap-2 rounded-lg border border-border bg-card p-4 sm:grid-cols-[1fr_auto_auto_auto_auto_auto]"
      >
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título del justificante"
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
        />
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as ObimJustificacion["tipo"])}
          className="rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-primary"
        >
          <option value="factura">Factura</option>
          <option value="nomina">Nómina</option>
          <option value="memoria">Memoria</option>
          <option value="evidencia">Evidencia</option>
          <option value="contrato">Contrato</option>
          <option value="otro">Otro</option>
        </select>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
        />
        <input
          type="number"
          min="0"
          step="0.01"
          value={importe}
          onChange={(e) => setImporte(e.target.value)}
          placeholder="Importe €"
          className="w-28 rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
        />
        <input
          ref={fileRef}
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="max-w-52 text-xs text-muted-foreground file:mr-2 file:rounded-md file:border file:border-border file:bg-background file:px-2 file:py-1.5 file:text-xs"
        />
        <button
          type="submit"
          disabled={!titulo.trim() || busy}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> {busy ? "Subiendo…" : "Registrar"}
        </button>
      </form>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Fecha</th>
              <th className="px-4 py-2.5 font-medium">Título</th>
              <th className="px-4 py-2.5 font-medium">Tipo</th>
              <th className="px-4 py-2.5 text-right font-medium">Importe</th>
              <th className="px-4 py-2.5 font-medium">Documento</th>
              <th className="px-4 py-2.5 font-medium">Estado</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                  Sin justificantes registrados.
                </td>
              </tr>
            )}
            {items.map((j) => (
              <tr key={j.id} className="group">
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{j.fecha}</td>
                <td className="px-4 py-2.5">{j.titulo}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{j.tipo}</td>
                <td className="px-4 py-2.5 text-right font-mono">
                  {j.importe != null ? eur.format(Number(j.importe)) : "—"}
                </td>
                <td className="px-4 py-2.5">
                  {j.doc_path ? (
                    <button
                      type="button"
                      onClick={() => ver(j)}
                      className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      {j.doc_nombre ?? "Ver documento"}
                    </button>
                  ) : (
                    <span className="text-xs text-muted-foreground">Sin adjunto</span>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  <select
                    value={j.estado}
                    onChange={(e) =>
                      upd.mutate({
                        id: j.id,
                        estado: e.target.value as ObimJustificacion["estado"],
                      })
                    }
                    className={`rounded-md border px-2 py-1 text-xs focus:outline-none ${
                      j.estado === "aprobado"
                        ? "border-green-600/40 bg-green-600/10 text-green-700"
                        : j.estado === "rechazado"
                          ? "border-destructive/40 bg-destructive/10 text-destructive"
                          : "border-border text-muted-foreground"
                    }`}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="presentado">Presentado</option>
                    <option value="aprobado">Aprobado</option>
                    <option value="rechazado">Rechazado</option>
                  </select>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <button
                    type="button"
                    onClick={() => del.mutate(j)}
                    aria-label="Borrar justificante"
                    className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- Avances del proyecto ----------

function Avances() {
  const qc = useQueryClient();
  const listFn = useServerFn(obimAvancesList);
  const addFn = useServerFn(obimAvanceCreate);
  const delFn = useServerFn(obimAvanceDelete);

  const { data: items = [] } = useQuery({ queryKey: ["obim", "avances"], queryFn: () => listFn() });

  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));
  const [titulo, setTitulo] = useState("");
  const [detalle, setDetalle] = useState("");
  const [etapa, setEtapa] = useState("");

  const add = useMutation({
    mutationFn: () => addFn({ data: { fecha, titulo, detalle, etapa } }),
    onSuccess: () => {
      setTitulo("");
      setDetalle("");
      setEtapa("");
      qc.invalidateQueries({ queryKey: ["obim", "avances"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["obim", "avances"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (titulo.trim()) add.mutate();
        }}
        className="space-y-2 rounded-lg border border-border bg-card p-4"
      >
        <div className="grid gap-2 sm:grid-cols-[auto_1fr_auto_auto]">
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
          />
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título del avance"
            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
          />
          <input
            value={etapa}
            onChange={(e) => setEtapa(e.target.value)}
            placeholder="Etapa (opcional)"
            className="w-36 rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={!titulo.trim() || add.isPending}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> Publicar
          </button>
        </div>
        <textarea
          value={detalle}
          onChange={(e) => setDetalle(e.target.value)}
          placeholder="Detalle del avance: qué se ha hecho, resultados, siguientes pasos…"
          rows={3}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </form>

      <div className="space-y-3">
        {items.length === 0 && (
          <p className="rounded-lg border border-border bg-card px-4 py-6 text-sm text-muted-foreground">
            Sin avances publicados.
          </p>
        )}
        {items.map((a: ObimAvance) => (
          <article key={a.id} className="group rounded-lg border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-mono text-xs text-muted-foreground">
                  {a.fecha}
                  {a.etapa ? ` · ${a.etapa}` : ""}
                </p>
                <h3 className="mt-1 text-sm font-semibold">{a.titulo}</h3>
                {a.detalle && (
                  <p className="mt-1.5 whitespace-pre-wrap text-sm text-muted-foreground">{a.detalle}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => del.mutate(a.id)}
                aria-label="Borrar avance"
                className="shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// ---------- Documental del proyecto ----------

function Documental() {
  const qc = useQueryClient();
  const listFn = useServerFn(obimDocumentosList);
  const addFn = useServerFn(obimDocumentoCreate);
  const delFn = useServerFn(obimDocumentoDelete);
  const viewFn = useServerFn(obimDocumentoViewUrl);

  const { data: items = [] } = useQuery({ queryKey: ["obim", "documentos"], queryFn: () => listFn() });

  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState<ObimDocumento["categoria"]>("general");
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function crear() {
    if (!titulo.trim()) return;
    setBusy(true);
    try {
      const res = await addFn({
        data: {
          titulo: titulo.trim(),
          categoria,
          fecha,
          notas: "",
          fileName: file?.name ?? null,
          mime: file?.type ?? "",
        },
      });
      if (file && res.path && res.token) {
        const { error } = await supabase.storage
          .from("obim-docs")
          .uploadToSignedUrl(res.path, res.token, file);
        if (error) throw new Error(error.message);
      }
      setTitulo("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      qc.invalidateQueries({ queryKey: ["obim", "documentos"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo registrar el documento.");
    } finally {
      setBusy(false);
    }
  }

  async function ver(d: ObimDocumento) {
    if (!d.doc_path) return;
    try {
      const { url } = await viewFn({ data: { path: d.doc_path } });
      window.open(url, "_blank", "noopener");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo abrir el documento.");
    }
  }

  const del = useMutation({
    mutationFn: (d: ObimDocumento) => delFn({ data: { id: d.id, path: d.doc_path } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["obim", "documentos"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          crear();
        }}
        className="grid gap-2 rounded-lg border border-border bg-card p-4 sm:grid-cols-[1fr_auto_auto_auto_auto]"
      >
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título del documento"
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
        />
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value as ObimDocumento["categoria"])}
          className="rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-primary"
        >
          <option value="memoria">Memoria</option>
          <option value="acta">Acta</option>
          <option value="contrato">Contrato</option>
          <option value="plano">Plano</option>
          <option value="informe">Informe</option>
          <option value="presentacion">Presentación</option>
          <option value="general">General</option>
        </select>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
        />
        <input
          ref={fileRef}
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="max-w-52 text-xs text-muted-foreground file:mr-2 file:rounded-md file:border file:border-border file:bg-background file:px-2 file:py-1.5 file:text-xs"
        />
        <button
          type="submit"
          disabled={!titulo.trim() || busy}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> {busy ? "Subiendo…" : "Añadir"}
        </button>
      </form>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Fecha</th>
              <th className="px-4 py-2.5 font-medium">Título</th>
              <th className="px-4 py-2.5 font-medium">Categoría</th>
              <th className="px-4 py-2.5 font-medium">Archivo</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                  Sin documentos.
                </td>
              </tr>
            )}
            {items.map((d) => (
              <tr key={d.id} className="group">
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{d.fecha}</td>
                <td className="px-4 py-2.5">{d.titulo}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{d.categoria}</td>
                <td className="px-4 py-2.5">
                  {d.doc_path ? (
                    <button
                      type="button"
                      onClick={() => ver(d)}
                      className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      {d.doc_nombre ?? "Abrir"}
                    </button>
                  ) : (
                    <span className="text-xs text-muted-foreground">Sin adjunto</span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <button
                    type="button"
                    onClick={() => del.mutate(d)}
                    aria-label="Borrar documento"
                    className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- Participantes y subcontratas ----------

function Participantes() {
  const qc = useQueryClient();
  const listFn = useServerFn(obimParticipantesList);
  const addFn = useServerFn(obimParticipanteCreate);
  const updFn = useServerFn(obimParticipanteUpdate);
  const delFn = useServerFn(obimParticipanteDelete);

  const { data: items = [] } = useQuery({
    queryKey: ["obim", "participantes"],
    queryFn: () => listFn(),
  });

  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState<ObimParticipante["tipo"]>("participante");
  const [rol, setRol] = useState("");
  const [email, setEmail] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const logoRef = useRef<HTMLInputElement>(null);

  async function crear() {
    if (!nombre.trim()) return;
    setBusy(true);
    try {
      const res = await addFn({
        data: {
          nombre: nombre.trim(),
          tipo,
          rol,
          contacto: "",
          email,
          telefono: "",
          logoFileName: logo?.name ?? null,
        },
      });
      if (logo && res.path && res.token) {
        const { error } = await supabase.storage
          .from("obim-docs")
          .uploadToSignedUrl(res.path, res.token, logo);
        if (error) throw new Error(error.message);
      }
      setNombre("");
      setRol("");
      setEmail("");
      setLogo(null);
      if (logoRef.current) logoRef.current.value = "";
      qc.invalidateQueries({ queryKey: ["obim", "participantes"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo crear el registro.");
    } finally {
      setBusy(false);
    }
  }

  const upd = useMutation({
    mutationFn: (d: { id: string; activo: boolean }) => updFn({ data: d }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["obim", "participantes"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: (p: ObimParticipante) => delFn({ data: { id: p.id, logoPath: p.logo_path } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["obim", "participantes"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const grupos: { titulo: string; tipo: ObimParticipante["tipo"] }[] = [
    { titulo: "Participantes", tipo: "participante" },
    { titulo: "Subcontratas", tipo: "subcontrata" },
  ];

  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          crear();
        }}
        className="grid gap-2 rounded-lg border border-border bg-card p-4 sm:grid-cols-[1fr_auto_1fr_1fr_auto_auto]"
      >
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Empresa o persona"
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
        />
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as ObimParticipante["tipo"])}
          className="rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-primary"
        >
          <option value="participante">Participante</option>
          <option value="subcontrata">Subcontrata</option>
        </select>
        <input
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          placeholder="Rol en el proyecto"
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email de contacto"
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
        />
        <input
          ref={logoRef}
          type="file"
          accept="image/*"
          onChange={(e) => setLogo(e.target.files?.[0] ?? null)}
          className="max-w-44 text-xs text-muted-foreground file:mr-2 file:rounded-md file:border file:border-border file:bg-background file:px-2 file:py-1.5 file:text-xs"
        />
        <button
          type="submit"
          disabled={!nombre.trim() || busy}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> {busy ? "Guardando…" : "Añadir"}
        </button>
      </form>

      {grupos.map((g) => {
        const lista = items.filter((p) => p.tipo === g.tipo);
        return (
          <section key={g.tipo}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {g.titulo}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {lista.length === 0 && (
                <p className="rounded-lg border border-border bg-card px-4 py-6 text-sm text-muted-foreground">
                  Sin registros.
                </p>
              )}
              {lista.map((p) => (
                <div key={p.id} className="group rounded-lg border border-border bg-card p-4">
                  <div className="flex items-start gap-3">
                    {p.logo_url ? (
                      <img
                        src={p.logo_url}
                        alt={`Logo de ${p.nombre}`}
                        className="h-12 w-12 shrink-0 rounded-md border border-border object-contain p-1"
                      />
                    ) : (
                      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                        <Building2 className="h-6 w-6" />
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{p.nombre}</p>
                      {p.rol && <p className="truncate text-xs text-muted-foreground">{p.rol}</p>}
                      {p.email && <p className="truncate text-xs text-muted-foreground">{p.email}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => del.mutate(p)}
                      aria-label="Borrar registro"
                      className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => upd.mutate({ id: p.id, activo: !p.activo })}
                    className={`mt-3 rounded-full border px-2.5 py-0.5 text-xs ${
                      p.activo
                        ? "border-green-600/40 bg-green-600/10 text-green-700"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {p.activo ? "Activo" : "Inactivo"}
                  </button>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

// ---------- Código de producción ----------

const RECURSOS_CODIGO = [
  {
    nombre: "Repositorio de producción",
    detalle: "Código fuente de la aplicación O-BIM (GitHub, rama main desplegada).",
    url: "https://github.com/eurusevanora-dot/obim",
  },
  {
    nombre: "Worker de Cloudflare",
    detalle: "Despliegues, registros y configuración del worker que sirve o-bim.com.",
    url: "https://dash.cloudflare.com/?to=/:account/workers/services/view/obim",
  },
  {
    nombre: "Base de datos y almacenamiento",
    detalle: "Supabase NEXUS-METADATA: tablas obim_*, bucket obim-docs y usuarios de acceso.",
    url: "https://supabase.com/dashboard/project/irpkofhsaahwwkyszmzm",
  },
  {
    nombre: "Módulo O-BIN (análisis de planos)",
    detalle: "Herramienta de planos y anotaciones dentro de NEXUS METADATA (repo real-data-essence).",
    url: "https://github.com/eurusevanora-dot/real-data-essence",
  },
] as const;

function Codigo() {
  return (
    <div className="space-y-4">
      <p className="max-w-2xl text-sm text-muted-foreground">
        Accesos al código y a la infraestructura de producción real del proyecto. Requieren
        permisos propios en cada servicio (GitHub, Cloudflare, Supabase); este panel solo enlaza.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {RECURSOS_CODIGO.map((r) => (
          <a
            key={r.nombre}
            href={r.url}
            target="_blank"
            rel="noreferrer noopener"
            className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold">{r.nombre}</h3>
              <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">{r.detalle}</p>
            <p className="mt-2 truncate font-mono text-xs text-muted-foreground">{r.url}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
