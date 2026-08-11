import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

// Portal público de O-BIM: presentación del proyecto (Proyecto Director v1.0).
// Sin datos económicos ni información sensible: eso vive en /center
// (área autenticada, solo participantes).

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "O-BIM — Open Building Intelligence Manager" },
      {
        name: "description",
        content:
          "O-BIM es una plataforma de coordinación para la construcción industrializada: BIM, ingeniería, presupuestos, fabricación, compras, calidad, PRL e inteligencia artificial gobernada en un entorno único y trazable.",
      },
      { property: "og:title", content: "O-BIM — Open Building Intelligence Manager" },
      {
        property: "og:description",
        content:
          "Plataforma de coordinación para la construcción industrializada, con IA gobernada, conocimiento trazable y computación distribuida.",
      },
    ],
  }),
  component: ObimPortal,
});

const PROBLEMAS = [
  [
    "P-01",
    "Fragmentación de datos y herramientas",
    "Doble introducción de información, incoherencias y pérdida de trazabilidad.",
  ],
  [
    "P-02",
    "Escasa conexión entre BIM y presupuesto",
    "Mediciones desactualizadas y dificultad para anticipar desviaciones.",
  ],
  ["P-03", "Industrialización tardía", "Soluciones que deben rediseñarse para ser fabricables."],
  [
    "P-06",
    "Conocimiento no sistematizado",
    "Las lecciones aprendidas permanecen en personas o archivos aislados.",
  ],
  [
    "P-07",
    "Falta de trazabilidad de la IA",
    "Imposibilidad de auditar una recomendación o reproducir su razonamiento.",
  ],
  [
    "P-08",
    "Infraestructura infrautilizada",
    "Equipos potentes ociosos mientras otras tareas saturan recursos.",
  ],
] as const;

const CAPAS = [
  ["Experiencia", "Portal web, aplicaciones móviles, plugins y escritorios remotos."],
  ["Orquestación", "i-Well, motor de workflows, reglas y colas de trabajo."],
  ["Dominios", "BIM, ERP, industrialización, compras, PRL, calidad y legal."],
  ["Conocimiento", "RAG global, de empresa y de proyecto, con fuentes citadas."],
  ["Datos", "PostgreSQL, base vectorial, almacenamiento de objetos y registros."],
  ["Integración", "APIs, webhooks, IFC, BCF, conectores y agentes de nodo."],
  ["Infraestructura", "Clúster, workstations, red, almacenamiento y observabilidad."],
] as const;

const AGENTES = [
  [
    "i-Well",
    "Orquestador general",
    "Interpreta la solicitud, planifica subtareas, selecciona agentes y recursos, consolida resultados y exige validación humana cuando procede.",
  ],
  [
    "i-Gloria",
    "Prevención de riesgos laborales",
    "Detecta riesgos de geometría, acceso, izado y montaje; propone medidas y las relaciona con elementos BIM y fases.",
  ],
  [
    "i-Díaz",
    "Asesoría legal y financiera",
    "Analiza contratos, prepara escenarios de financiación y gestiona evidencias para programas de ayudas. Siempre bajo revisión profesional.",
  ],
  [
    "i-Toled",
    "Calidad y trazabilidad",
    "Planes de inspección, lotes, no conformidades y expediente final vinculados al modelo y a la orden de fabricación.",
  ],
  [
    "Compras",
    "Estrategia de suministro",
    "Coste total puesto en obra, disponibilidad, homologación, riesgo y agrupación de compras. No solo precio unitario.",
  ],
  [
    "Organización industrial",
    "Plan de producción",
    "Rutas de fabricación, lotes, cuellos de botella, turnos y coordinación entre taller, transporte y montaje.",
  ],
  [
    "Interiores",
    "Configurador de acabados",
    "El cliente elige entre opciones compatibles con el sistema, el presupuesto y el plazo. Cada elección actualiza modelo y pedido.",
  ],
] as const;

const FASES = [
  ["F0", "Alta y viabilidad"],
  ["F1", "Requisitos"],
  ["F2", "Alternativas"],
  ["F3", "Proyecto BIM"],
  ["F4", "Industrialización"],
  ["F5", "Costes y contratación"],
  ["F6", "Fabricación"],
  ["F7", "Obra y montaje"],
  ["F8", "Entrega"],
  ["F9", "Operación"],
] as const;

const ETAPAS = [
  ["Etapa 0", "Definición y constitución", "0-3 meses"],
  ["Etapa 1", "Project Center", "3-7 meses"],
  ["Etapa 2", "RAG y orquestación inicial", "6-12 meses"],
  ["Etapa 3", "BIM e interoperabilidad", "10-18 meses"],
  ["Etapa 4", "Costes, compras e industrialización", "15-26 meses"],
  ["Etapa 5", "Configurador y cliente final", "22-30 meses"],
  ["Etapa 6", "Clúster distribuido", "24-34 meses"],
  ["Etapa 7", "Pilotos y comercialización", "30-42 meses"],
] as const;

const PRINCIPIOS = [
  "La información se introduce una sola vez y se reutiliza en todos los procesos autorizados.",
  "Toda decisión relevante es explicable mediante datos, fuentes y reglas identificables.",
  "La IA asiste al profesional; no sustituye responsabilidades legalmente reservadas.",
  "Interoperabilidad prioritaria por APIs, IFC, BCF y formatos documentados.",
  "Privacidad, aislamiento entre organizaciones y mínimo privilegio desde el diseño.",
  "La plataforma funciona en entornos locales, privados, híbridos y en la nube.",
] as const;

const METODO = [
  ["MI-01", "Definir prestaciones y requisitos", "Uso, geometría, cargas, fuego, acústica, energía, durabilidad, transporte y montaje."],
  ["MI-02", "Descomponer el sistema", "Subconjuntos, interfaces, tolerancias, uniones y responsabilidades."],
  ["MI-03", "Parametrizar", "Dimensiones, reglas, variantes, límites y dependencias."],
  ["MI-04", "Diseñar para fabricación", "Procesos, maquinaria, materiales, utillajes y control."],
  ["MI-05", "Diseñar para montaje", "Accesos, izado, secuencia, medios auxiliares y PRL."],
  ["MI-06", "Validar", "Cálculo, prototipo, ensayo, simulación, normativa y calidad."],
  ["MI-07", "Costear", "Material, mano de obra, mermas, transporte, montaje y mantenimiento."],
  ["MI-08", "Documentar", "BIM, planos, instrucciones, fichas, certificados y trazabilidad."],
  ["MI-09", "Pilotar", "Fabricación y montaje controlados con medición de resultados."],
  ["MI-10", "Estandarizar", "Biblioteca, catálogo, reglas, formación y mejora continua."],
] as const;

const PILOTOS = [
  ["Vivienda industrializada", "Diseño, configuración, presupuesto y fabricación: modelo BIM, sistema modular, acabados, proveedores, coste y gemelo digital."],
  ["Edificio hotelero", "Repetición y variantes: habitaciones tipo, instalaciones, fabricación, logística y control de cambios."],
  ["Nave industrial", "Estructura, envolvente y montaje: cálculo, planificación, compras, PRL y trazabilidad de paneles."],
  ["Rehabilitación", "Información incompleta y existente: captura, diagnóstico, alternativas, normativa y fases."],
  ["Nuevo sistema constructivo", "Aplicación del Método O-BIM: requisitos, patentes, parametrización, prototipo, ensayo y coste."],
] as const;

const GOBIERNO = [
  ["Comité de Dirección", "Aprueba alcance, presupuesto, hitos, riesgos y alianzas."],
  ["Comité Técnico", "Define estándares, arquitectura, integraciones y criterios de aceptación."],
  ["Comité de Conocimiento", "Valida fuentes, reglas, versiones y políticas del RAG."],
  ["Oficina del Programa", "Planificación, seguimiento, actas, dependencias y reporting."],
  ["Consejo de Usuarios", "Prioriza problemas reales y valida la experiencia de uso."],
] as const;

function SectionHeading({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-8 flex items-baseline gap-4 border-b border-border pb-4">
      <span className="font-mono text-sm text-ferrari">{n}</span>
      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
    </div>
  );
}

function ObimPortal() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Barra superior */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <span className="text-base font-semibold tracking-tight">
            O-<span className="text-ferrari">BIM</span>
            <span className="ml-3 hidden font-mono text-xs font-normal text-muted-foreground sm:inline">
              Open Building Intelligence Manager
            </span>
          </span>
          <nav className="flex items-center gap-1 text-sm">
            <a
              href="#plataforma"
              className="hidden rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground md:inline"
            >
              Plataforma
            </a>
            <a
              href="#agentes"
              className="hidden rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground md:inline"
            >
              Agentes
            </a>
            <a
              href="#hoja-de-ruta"
              className="hidden rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground md:inline"
            >
              Hoja de ruta
            </a>
            <a
              href="#metodo"
              className="hidden rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground md:inline"
            >
              Método
            </a>
            <a
              href="#pilotos"
              className="hidden rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground md:inline"
            >
              Pilotos
            </a>
            <Link
              to="/center"
              className="ml-2 rounded-md bg-primary px-4 py-1.5 font-medium text-primary-foreground hover:bg-primary/90"
            >
              Acceso participantes
            </Link>
          </nav>
        </div>
      </header>

      {/* Aviso de estado */}
      <div className="border-b border-amber-500/30 bg-amber-500/10">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 text-xs sm:px-6">
          <span className="inline-block h-2 w-2 shrink-0 animate-pulse rounded-full bg-amber-500" />
          <span className="font-medium text-amber-700 dark:text-amber-400">
            Proyecto en desarrollo
          </span>
          <span className="text-muted-foreground">
            — esta página es una presentación del proyecto de I+D+i; la gestión completa está en el
            área privada.
          </span>
        </div>
      </div>

      {/* Hero */}
      <section className="border-b border-border bg-[#0b0b0c] text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-white/50">
              Proyecto de I+D+i · Construcción industrializada
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wide text-amber-300">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              En desarrollo
            </span>
          </div>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            Una capa de inteligencia y coordinación sobre todo el ciclo de la construcción.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            O-BIM conecta BIM, ingeniería, presupuestos, planificación, compras, fabricación,
            calidad, prevención y operación en un entorno único, trazable y gobernado. No sustituye
            a las herramientas especializadas: las interconecta, interpreta su información y aplica
            reglas de negocio y conocimiento técnico.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              to="/center"
              className="inline-flex items-center gap-2 rounded-md bg-ferrari px-5 py-2.5 text-sm font-medium text-white hover:bg-ferrari/90"
            >
              Acceso participantes <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#problema"
              className="rounded-md border border-white/20 px-5 py-2.5 text-sm text-white/80 hover:border-white/40 hover:text-white"
            >
              Conocer el proyecto
            </a>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-4">
            {[
              ["10", "fases de proyecto, de viabilidad a operación"],
              ["7", "capas funcionales desacopladas"],
              ["7", "inteligencias especializadas coordinadas"],
              ["3", "niveles de conocimiento: global, empresa y proyecto"],
            ].map(([num, label]) => (
              <div key={label} className="bg-[#0b0b0c] p-5">
                <p className="font-mono text-3xl text-ferrari">{num}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/60">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 01 Problema */}
      <section id="problema" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading n="01" title="El problema no es solo tecnológico" />
        <p className="mb-10 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          El sector arrastra una fragmentación estructural entre proyectistas, ingenierías,
          fabricantes, constructoras, proveedores, direcciones facultativas y clientes. Cada actor
          usa herramientas distintas, modelos de datos incompatibles y procedimientos que rara vez
          se mantienen sincronizados. La industrialización agrava el coste de cada error: fabricar
          exige cerrar geometría, tolerancias e interfaces antes de producir.
        </p>
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {PROBLEMAS.map(([code, titulo, consecuencia]) => (
            <div key={code} className="bg-background p-5">
              <p className="font-mono text-xs text-ferrari">{code}</p>
              <h3 className="mt-2 text-sm font-semibold">{titulo}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{consecuencia}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 02 Plataforma */}
      <section id="plataforma" className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeading n="02" title="Arquitectura funcional por capas" />
          <p className="mb-10 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            O-BIM se sitúa por encima de Revit, Archicad, Tekla, SolidWorks, CYPE, Presto,
            Arquímedes, el ERP y la gestión documental. Cada capa tiene responsabilidades definidas
            y se comunica mediante contratos de servicio, eventos y modelos de datos comunes: ningún
            componente es insustituible.
          </p>
          <div className="overflow-hidden rounded-lg border border-border">
            {CAPAS.map(([capa, detalle], i) => (
              <div
                key={capa}
                className={`flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-baseline sm:gap-6 ${
                  i > 0 ? "border-t border-border" : ""
                } bg-background`}
              >
                <span className="w-40 shrink-0 font-mono text-xs text-muted-foreground">
                  {String(i + 1).padStart(2, "0")} · {capa}
                </span>
                <span className="text-sm">{detalle}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-sm text-muted-foreground">
            Cada proyecto dispone de un RAG específico, aislado y versionado, apoyado en un RAG
            privado de empresa y en un RAG global de conocimiento validado. Toda respuesta cita el
            documento y la ubicación concreta de la evidencia.
          </p>
        </div>
      </section>

      {/* 03 Agentes */}
      <section id="agentes" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading n="03" title="Un ecosistema de inteligencias especializadas" />
        <p className="mb-10 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Los agentes operan como una organización digital controlada: cada uno tiene ficha técnica,
          ámbito de actuación, fuentes autorizadas, herramientas disponibles y reglas de escalado.
          Las decisiones críticas se someten siempre a validación humana.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AGENTES.map(([nombre, ambito, detalle]) => (
            <div key={nombre} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-mono text-sm font-semibold text-ferrari">{nombre}</h3>
                <span className="text-right text-xs text-muted-foreground">{ambito}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{detalle}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 04 Ciclo */}
      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeading n="04" title="El expediente digital continuo del proyecto" />
          <p className="mb-10 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Cada proyecto avanza por estados con validaciones, conservando el historial completo. La
            versión del modelo, del presupuesto y de la planificación usada en cada decisión queda
            identificada y es auditable.
          </p>
          <div className="flex flex-wrap gap-2">
            {FASES.map(([code, nombre]) => (
              <div
                key={code}
                className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2"
              >
                <span className="font-mono text-xs text-ferrari">{code}</span>
                <span className="text-sm">{nombre}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-sm text-muted-foreground">
            Las decisiones son objetos de primera clase: problema, alternativas, criterios,
            evidencias, recomendación de la IA, decisión humana, responsable e impactos sobre BIM,
            presupuesto, planificación, compras o contratos.
          </p>
        </div>
      </section>

      {/* 05 Hoja de ruta */}
      <section id="hoja-de-ruta" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading n="05" title="Hoja de ruta" />
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/60 text-left">
                <th className="px-5 py-3 font-mono text-xs font-medium text-muted-foreground">
                  Etapa
                </th>
                <th className="px-5 py-3 font-medium">Denominación</th>
                <th className="px-5 py-3 text-right font-mono text-xs font-medium text-muted-foreground">
                  Plazo orientativo
                </th>
              </tr>
            </thead>
            <tbody>
              {ETAPAS.map(([etapa, nombre, plazo], i) => (
                <tr key={etapa} className={i > 0 ? "border-t border-border" : ""}>
                  <td className="px-5 py-3 font-mono text-xs text-ferrari">{etapa}</td>
                  <td className="px-5 py-3">{nombre}</td>
                  <td className="px-5 py-3 text-right font-mono text-xs text-muted-foreground">
                    {plazo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Plazos orientativos del Proyecto Director v1.0, sujetos a revisión tras definir equipo,
          integraciones obligatorias, alcance contractual y financiación.
        </p>
      </section>

      {/* 06 Método O-BIM */}
      <section id="metodo" className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeading n="06" title="Método O-BIM de industrialización" />
          <p className="mb-10 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Metodología propia para transformar una solución constructiva en un sistema repetible,
            fabricable y verificable. Aplicable a sistemas existentes y al desarrollo de nuevas
            familias de producto.
          </p>
          <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
            {METODO.map(([code, etapa, detalle]) => (
              <div key={code} className="flex gap-4 bg-background p-4">
                <span className="shrink-0 font-mono text-xs text-ferrari">{code}</span>
                <div>
                  <p className="text-sm font-semibold">{etapa}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{detalle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 07 Casos piloto */}
      <section id="pilotos" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading n="07" title="Casos piloto propuestos" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PILOTOS.map(([nombre, detalle]) => (
            <div key={nombre} className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-sm font-semibold">{nombre}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{detalle}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-3xl text-sm text-muted-foreground">
          Cada piloto debe demostrar una mejora medible frente al proceso actual: horas de
          modelado y coordinación, errores evitados, desviación de coste y plazo de diseño a
          fabricación.
        </p>
      </section>

      {/* 08 Gobierno */}
      <section id="gobierno" className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeading n="08" title="Gobierno del programa" />
          <div className="overflow-hidden rounded-lg border border-border">
            {GOBIERNO.map(([organo, funciones], i) => (
              <div
                key={organo}
                className={`flex flex-col gap-1 bg-background px-5 py-4 sm:flex-row sm:items-baseline sm:gap-6 ${
                  i > 0 ? "border-t border-border" : ""
                }`}
              >
                <span className="w-56 shrink-0 text-sm font-semibold">{organo}</span>
                <span className="text-sm text-muted-foreground">{funciones}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-sm text-muted-foreground">
            El desarrollo se organiza en 14 paquetes de trabajo, desde dirección y gobierno hasta
            difusión y transferencia, con criterios de aceptación funcionales, técnicos, de
            seguridad y de observabilidad en cada incremento.
          </p>
        </div>
      </section>

      {/* 09 Principios */}
      <section className="border-t border-border bg-[#0b0b0c] text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-8 flex items-baseline gap-4 border-b border-white/10 pb-4">
            <span className="font-mono text-sm text-ferrari">09</span>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Principios rectores
            </h2>
          </div>
          <ol className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
            {PRINCIPIOS.map((p, i) => (
              <li key={p} className="flex gap-4 text-sm leading-relaxed text-white/80">
                <span className="font-mono text-xs text-ferrari">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {p}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Acceso */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="rounded-lg border border-border bg-card p-8 sm:p-10">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Área de participantes
              </h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Documental, avances, participantes y subcontratas, inversión, personal,
                justificación, agenda, hitos y acceso al código de producción se gestionan en el
                O-BIM Project Center, con acceso restringido a los participantes del proyecto.
              </p>
            </div>
            <Link
              to="/center"
              className="inline-flex shrink-0 items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Iniciar sesión <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-6">
          <span>O-BIM · Open Building Intelligence Manager · Proyecto Director v1.0</span>
          <span>Documento vivo sujeto a revisión y aprobación formal.</span>
        </div>
      </footer>
    </div>
  );
}
