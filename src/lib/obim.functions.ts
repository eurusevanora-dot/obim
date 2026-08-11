// O-BIM Project Center: server functions.
// Mismo modelo que el resto de la app: acceso con service role desde el
// servidor; las tablas tienen RLS activo sin políticas (solo service_role).

import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

import { supabaseAdmin } from "@/integrations/supabase/client.server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as unknown as { from: (t: string) => any };
const BUCKET = "obim-docs";

function safeName(name: string) {
  return name.replace(/[^\w.-]+/g, "_").slice(0, 180);
}

// ---------- Hitos y hoja de ruta ----------

export type ObimHito = {
  id: string;
  etapa: string;
  titulo: string;
  descripcion: string;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  estado: "pendiente" | "en_curso" | "completado";
  orden: number;
};

export const obimHitosList = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async (): Promise<ObimHito[]> => {
    const { data, error } = await db
      .from("obim_hitos")
      .select("id,etapa,titulo,descripcion,fecha_inicio,fecha_fin,estado,orden")
      .order("orden", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as ObimHito[];
  });

export const obimHitoCreate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      etapa: z.string().default(""),
      titulo: z.string().min(1),
      descripcion: z.string().default(""),
      fecha_inicio: z.string().nullable().default(null),
      fecha_fin: z.string().nullable().default(null),
      orden: z.number().int().default(0),
    }),
  )
  .handler(async ({ data }) => {
    const { error } = await db.from("obim_hitos").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const obimHitoUpdate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      id: z.string().uuid(),
      estado: z.enum(["pendiente", "en_curso", "completado"]).optional(),
      fecha_inicio: z.string().nullable().optional(),
      fecha_fin: z.string().nullable().optional(),
      titulo: z.string().optional(),
      descripcion: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const { id, ...patch } = data;
    const { error } = await db.from("obim_hitos").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const obimHitoDelete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const { error } = await db.from("obim_hitos").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Inversiones ----------

export type ObimInversion = {
  id: string;
  concepto: string;
  capitulo: string;
  tipo: "prevista" | "comprometida" | "ejecutada";
  importe: number;
  fecha: string;
  notas: string;
};

export const CAPITULOS = [
  "Personal",
  "Hardware",
  "Software",
  "Servicios externos",
  "Pilotos",
  "Formación",
  "Difusión",
  "Contingencia",
  "Otros",
] as const;

export const obimInversionesList = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async (): Promise<ObimInversion[]> => {
    const { data, error } = await db
      .from("obim_inversiones")
      .select("id,concepto,capitulo,tipo,importe,fecha,notas")
      .order("fecha", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as ObimInversion[];
  });

export const obimInversionCreate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      concepto: z.string().min(1),
      capitulo: z.string().default("Otros"),
      tipo: z.enum(["prevista", "comprometida", "ejecutada"]).default("prevista"),
      importe: z.number().min(0),
      fecha: z.string().min(1),
      notas: z.string().default(""),
    }),
  )
  .handler(async ({ data }) => {
    const { error } = await db.from("obim_inversiones").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const obimInversionDelete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const { error } = await db.from("obim_inversiones").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Personal ----------

export type ObimPersona = {
  id: string;
  nombre: string;
  rol: string;
  dedicacion_pct: number;
  coste_mensual: number | null;
  email: string;
  notas: string;
  activo: boolean;
};

export const obimPersonalList = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async (): Promise<ObimPersona[]> => {
    const { data, error } = await db
      .from("obim_personal")
      .select("id,nombre,rol,dedicacion_pct,coste_mensual,email,notas,activo")
      .order("nombre", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as ObimPersona[];
  });

export const obimPersonaCreate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      nombre: z.string().min(1),
      rol: z.string().default(""),
      dedicacion_pct: z.number().min(0).max(100).default(100),
      coste_mensual: z.number().min(0).nullable().default(null),
      email: z.string().default(""),
      notas: z.string().default(""),
    }),
  )
  .handler(async ({ data }) => {
    const { error } = await db.from("obim_personal").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const obimPersonaUpdate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      id: z.string().uuid(),
      activo: z.boolean().optional(),
      rol: z.string().optional(),
      dedicacion_pct: z.number().min(0).max(100).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const { id, ...patch } = data;
    const { error } = await db.from("obim_personal").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const obimPersonaDelete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const { error } = await db.from("obim_personal").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Justificación documental ----------

export type ObimJustificacion = {
  id: string;
  titulo: string;
  tipo: "factura" | "nomina" | "memoria" | "evidencia" | "contrato" | "otro";
  fecha: string;
  importe: number | null;
  doc_path: string | null;
  doc_nombre: string | null;
  doc_mime: string | null;
  estado: "pendiente" | "presentado" | "aprobado" | "rechazado";
  notas: string;
};

export const obimJustificacionesList = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async (): Promise<ObimJustificacion[]> => {
    const { data, error } = await db
      .from("obim_justificaciones")
      .select("id,titulo,tipo,fecha,importe,doc_path,doc_nombre,doc_mime,estado,notas")
      .order("fecha", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as ObimJustificacion[];
  });

// Crea el registro y devuelve una URL firmada de subida (el binario va
// directo del navegador a Storage, igual que los planos de O-BIN).
export const obimJustificacionCreate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      titulo: z.string().min(1),
      tipo: z
        .enum(["factura", "nomina", "memoria", "evidencia", "contrato", "otro"])
        .default("otro"),
      fecha: z.string().min(1),
      importe: z.number().nullable().default(null),
      notas: z.string().default(""),
      fileName: z.string().nullable().default(null),
      mime: z.string().default(""),
    }),
  )
  .handler(async ({ data }) => {
    const { data: ins, error: insErr } = await db
      .from("obim_justificaciones")
      .insert({
        titulo: data.titulo,
        tipo: data.tipo,
        fecha: data.fecha,
        importe: data.importe,
        notas: data.notas,
      })
      .select("id")
      .single();
    if (insErr || !ins) throw new Error(insErr?.message ?? "No se pudo crear el registro.");
    const id = ins.id as string;

    if (!data.fileName) return { id, path: null as string | null, token: null as string | null };

    const path = `${id}/${safeName(data.fileName)}`;
    const { data: signed, error: upErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUploadUrl(path);
    if (upErr || !signed) throw new Error(upErr?.message ?? "No se pudo preparar la subida.");

    const { error: updErr } = await db
      .from("obim_justificaciones")
      .update({ doc_path: path, doc_nombre: data.fileName, doc_mime: data.mime })
      .eq("id", id);
    if (updErr) throw new Error(updErr.message);

    return { id, path, token: signed.token };
  });

export const obimJustificacionUpdate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      id: z.string().uuid(),
      estado: z.enum(["pendiente", "presentado", "aprobado", "rechazado"]).optional(),
      notas: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const { id, ...patch } = data;
    const { error } = await db.from("obim_justificaciones").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const obimJustificacionDelete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid(), path: z.string().nullable().default(null) }))
  .handler(async ({ data }) => {
    if (data.path) await supabaseAdmin.storage.from(BUCKET).remove([data.path]);
    const { error } = await db.from("obim_justificaciones").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const obimJustificacionViewUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ path: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { data: signed, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrl(data.path, 3600);
    if (error || !signed) throw new Error(error?.message ?? "No se pudo abrir el documento.");
    return { url: signed.signedUrl };
  });

// ---------- Agenda ----------

export type ObimEvento = {
  id: string;
  titulo: string;
  cuando: string;
  lugar: string;
  notas: string;
};

export const obimEventosList = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async (): Promise<ObimEvento[]> => {
    const { data, error } = await db
      .from("obim_eventos")
      .select("id,titulo,cuando,lugar,notas")
      .order("cuando", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as ObimEvento[];
  });

export const obimEventoCreate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      titulo: z.string().min(1),
      cuando: z.string().min(1),
      lugar: z.string().default(""),
      notas: z.string().default(""),
    }),
  )
  .handler(async ({ data }) => {
    const { error } = await db.from("obim_eventos").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const obimEventoDelete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const { error } = await db.from("obim_eventos").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Documental del proyecto ----------

export type ObimDocumento = {
  id: string;
  titulo: string;
  categoria: "memoria" | "acta" | "contrato" | "plano" | "informe" | "presentacion" | "general";
  fecha: string;
  doc_path: string | null;
  doc_nombre: string | null;
  doc_mime: string | null;
  notas: string;
};

export const obimDocumentosList = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async (): Promise<ObimDocumento[]> => {
    const { data, error } = await db
      .from("obim_documentos")
      .select("id,titulo,categoria,fecha,doc_path,doc_nombre,doc_mime,notas")
      .order("fecha", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as ObimDocumento[];
  });

export const obimDocumentoCreate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      titulo: z.string().min(1),
      categoria: z
        .enum(["memoria", "acta", "contrato", "plano", "informe", "presentacion", "general"])
        .default("general"),
      fecha: z.string().min(1),
      notas: z.string().default(""),
      fileName: z.string().nullable().default(null),
      mime: z.string().default(""),
    }),
  )
  .handler(async ({ data }) => {
    const { data: ins, error: insErr } = await db
      .from("obim_documentos")
      .insert({ titulo: data.titulo, categoria: data.categoria, fecha: data.fecha, notas: data.notas })
      .select("id")
      .single();
    if (insErr || !ins) throw new Error(insErr?.message ?? "No se pudo crear el documento.");
    const id = ins.id as string;

    if (!data.fileName) return { id, path: null as string | null, token: null as string | null };

    const path = `documentos/${id}/${safeName(data.fileName)}`;
    const { data: signed, error: upErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUploadUrl(path);
    if (upErr || !signed) throw new Error(upErr?.message ?? "No se pudo preparar la subida.");

    const { error: updErr } = await db
      .from("obim_documentos")
      .update({ doc_path: path, doc_nombre: data.fileName, doc_mime: data.mime })
      .eq("id", id);
    if (updErr) throw new Error(updErr.message);

    return { id, path, token: signed.token };
  });

export const obimDocumentoDelete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid(), path: z.string().nullable().default(null) }))
  .handler(async ({ data }) => {
    if (data.path) await supabaseAdmin.storage.from(BUCKET).remove([data.path]);
    const { error } = await db.from("obim_documentos").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const obimDocumentoViewUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ path: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { data: signed, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrl(data.path, 3600);
    if (error || !signed) throw new Error(error?.message ?? "No se pudo abrir el documento.");
    return { url: signed.signedUrl };
  });

// ---------- Avances del proyecto ----------

export type ObimAvance = {
  id: string;
  fecha: string;
  titulo: string;
  detalle: string;
  etapa: string;
};

export const obimAvancesList = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async (): Promise<ObimAvance[]> => {
    const { data, error } = await db
      .from("obim_avances")
      .select("id,fecha,titulo,detalle,etapa")
      .order("fecha", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as ObimAvance[];
  });

export const obimAvanceCreate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      fecha: z.string().min(1),
      titulo: z.string().min(1),
      detalle: z.string().default(""),
      etapa: z.string().default(""),
    }),
  )
  .handler(async ({ data }) => {
    const { error } = await db.from("obim_avances").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const obimAvanceDelete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const { error } = await db.from("obim_avances").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Participantes y subcontratas (con logo) ----------

export type ObimParticipante = {
  id: string;
  nombre: string;
  tipo: "participante" | "subcontrata";
  rol: string;
  contacto: string;
  email: string;
  telefono: string;
  logo_path: string | null;
  logo_url: string | null;
  activo: boolean;
};

export const obimParticipantesList = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async (): Promise<ObimParticipante[]> => {
    const { data, error } = await db
      .from("obim_participantes")
      .select("id,nombre,tipo,rol,contacto,email,telefono,logo_path,activo")
      .order("nombre", { ascending: true });
    if (error) throw new Error(error.message);
    const rows = (data ?? []) as Omit<ObimParticipante, "logo_url">[];
    // URLs firmadas de los logos (1 h) para pintarlos en la lista.
    return Promise.all(
      rows.map(async (r) => {
        let logo_url: string | null = null;
        if (r.logo_path) {
          const { data: signed } = await supabaseAdmin.storage
            .from(BUCKET)
            .createSignedUrl(r.logo_path, 3600);
          logo_url = signed?.signedUrl ?? null;
        }
        return { ...r, logo_url };
      }),
    );
  });

export const obimParticipanteCreate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      nombre: z.string().min(1),
      tipo: z.enum(["participante", "subcontrata"]).default("participante"),
      rol: z.string().default(""),
      contacto: z.string().default(""),
      email: z.string().default(""),
      telefono: z.string().default(""),
      logoFileName: z.string().nullable().default(null),
    }),
  )
  .handler(async ({ data }) => {
    const { logoFileName, ...row } = data;
    const { data: ins, error: insErr } = await db
      .from("obim_participantes")
      .insert(row)
      .select("id")
      .single();
    if (insErr || !ins) throw new Error(insErr?.message ?? "No se pudo crear el registro.");
    const id = ins.id as string;

    if (!logoFileName) return { id, path: null as string | null, token: null as string | null };

    const path = `logos/${id}/${safeName(logoFileName)}`;
    const { data: signed, error: upErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUploadUrl(path);
    if (upErr || !signed) throw new Error(upErr?.message ?? "No se pudo preparar la subida.");

    const { error: updErr } = await db
      .from("obim_participantes")
      .update({ logo_path: path })
      .eq("id", id);
    if (updErr) throw new Error(updErr.message);

    return { id, path, token: signed.token };
  });

export const obimParticipanteUpdate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid(), activo: z.boolean().optional(), rol: z.string().optional() }))
  .handler(async ({ data }) => {
    const { id, ...patch } = data;
    const { error } = await db.from("obim_participantes").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const obimParticipanteDelete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid(), logoPath: z.string().nullable().default(null) }))
  .handler(async ({ data }) => {
    if (data.logoPath) await supabaseAdmin.storage.from(BUCKET).remove([data.logoPath]);
    const { error } = await db.from("obim_participantes").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Usuarios autorizados (login email+PIN) y roles ----------

export type ObimUsuario = {
  id: string;
  auth_user_id: string | null;
  email: string;
  nombre: string;
  rol: "admin" | "participante";
  puesto: string;
  dedicacion_pct: number;
  coste_hora: number;
  telefono: string;
  notas: string;
  activo: boolean;
};

// Perfil del usuario de la sesión actual (para saber su rol en la UI).
export const obimMe = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ObimUsuario | null> => {
    const uid = (context as { userId?: string }).userId;
    if (!uid) return null;
    const { data } = await db
      .from("obim_usuarios")
      .select("id,auth_user_id,email,nombre,rol,puesto,dedicacion_pct,coste_hora,telefono,notas,activo")
      .eq("auth_user_id", uid)
      .maybeSingle();
    return (data ?? null) as ObimUsuario | null;
  });

async function exigirAdmin(context: unknown): Promise<void> {
  const uid = (context as { userId?: string }).userId;
  if (!uid) throw new Error("No autorizado.");
  const { data } = await db.from("obim_usuarios").select("rol,activo").eq("auth_user_id", uid).maybeSingle();
  if (!data || data.rol !== "admin" || !data.activo) throw new Error("Solo un administrador puede gestionar usuarios.");
}

export const obimUsuariosList = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ObimUsuario[]> => {
    await exigirAdmin(context);
    const { data, error } = await db
      .from("obim_usuarios")
      .select("id,auth_user_id,email,nombre,rol,puesto,dedicacion_pct,coste_hora,telefono,notas,activo")
      .order("nombre", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as ObimUsuario[];
  });

// Alta de participante: crea la cuenta de auth (email + PIN) y su ficha.
export const obimUsuarioCreate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      email: z.string().email(),
      pin: z.string().regex(/^\d{6,}$/u, "El PIN debe tener al menos 6 dígitos."),
      nombre: z.string().default(""),
      rol: z.enum(["admin", "participante"]).default("participante"),
      puesto: z.string().default(""),
      dedicacion_pct: z.number().min(0).max(100).default(100),
      coste_hora: z.number().min(0).default(0),
      telefono: z.string().default(""),
      notas: z.string().default(""),
    }),
  )
  .handler(async ({ data, context }) => {
    await exigirAdmin(context);
    const admin = (supabaseAdmin as unknown as {
      auth: { admin: { createUser: (a: unknown) => Promise<{ data: { user: { id: string } | null }; error: { message: string } | null }> } };
    }).auth.admin;
    const { data: created, error: cErr } = await admin.createUser({
      email: data.email,
      password: data.pin,
      email_confirm: true,
    });
    if (cErr || !created?.user) throw new Error(cErr?.message ?? "No se pudo crear la cuenta.");
    const authId = created.user.id;
    const { error } = await db.from("obim_usuarios").insert({
      auth_user_id: authId,
      email: data.email,
      nombre: data.nombre,
      rol: data.rol,
      puesto: data.puesto,
      dedicacion_pct: data.dedicacion_pct,
      coste_hora: data.coste_hora,
      telefono: data.telefono,
      notas: data.notas,
      activo: true,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const obimUsuarioUpdate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      id: z.string().uuid(),
      nombre: z.string().optional(),
      rol: z.enum(["admin", "participante"]).optional(),
      puesto: z.string().optional(),
      dedicacion_pct: z.number().min(0).max(100).optional(),
      coste_hora: z.number().min(0).optional(),
      telefono: z.string().optional(),
      notas: z.string().optional(),
      activo: z.boolean().optional(),
      pin: z.string().regex(/^\d{6,}$/u).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    await exigirAdmin(context);
    const { id, pin, ...patch } = data;
    const { data: row } = await db.from("obim_usuarios").select("auth_user_id").eq("id", id).maybeSingle();
    if (Object.keys(patch).length) {
      const { error } = await db.from("obim_usuarios").update(patch).eq("id", id);
      if (error) throw new Error(error.message);
    }
    if (pin && row?.auth_user_id) {
      const admin = (supabaseAdmin as unknown as {
        auth: { admin: { updateUserById: (id: string, a: unknown) => Promise<{ error: { message: string } | null }> } };
      }).auth.admin;
      const { error } = await admin.updateUserById(row.auth_user_id, { password: pin });
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const obimUsuarioDelete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    await exigirAdmin(context);
    const { data: row } = await db.from("obim_usuarios").select("auth_user_id").eq("id", data.id).maybeSingle();
    const { error } = await db.from("obim_usuarios").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    if (row?.auth_user_id) {
      const admin = (supabaseAdmin as unknown as {
        auth: { admin: { deleteUser: (id: string) => Promise<{ error: { message: string } | null }> } };
      }).auth.admin;
      await admin.deleteUser(row.auth_user_id).catch(() => {});
    }
    return { ok: true };
  });

// Cambiar el propio PIN (cualquier usuario autenticado).
export const obimCambiarPin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ pin: z.string().regex(/^\d{6,}$/u, "El PIN debe tener al menos 6 dígitos.") }))
  .handler(async ({ data, context }) => {
    const uid = (context as { userId?: string }).userId;
    if (!uid) throw new Error("No autorizado.");
    const admin = (supabaseAdmin as unknown as {
      auth: { admin: { updateUserById: (id: string, a: unknown) => Promise<{ error: { message: string } | null }> } };
    }).auth.admin;
    const { error } = await admin.updateUserById(uid, { password: data.pin });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Fichaje / tickaje (coste imputado al proyecto) ----------

export type ObimFichaje = {
  id: string;
  usuario_id: string;
  usuario_nombre?: string;
  fecha: string;
  horas: number;
  tarea: string;
  etapa: string;
  coste: number;
};

// Lista de fichajes: un admin ve todos; un participante solo los suyos.
export const obimFichajesList = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ObimFichaje[]> => {
    const uid = (context as { userId?: string }).userId;
    const { data: me } = await db.from("obim_usuarios").select("id,rol").eq("auth_user_id", uid).maybeSingle();
    if (!me) return [];
    let q = db
      .from("obim_fichajes")
      .select("id,usuario_id,fecha,horas,tarea,etapa,coste,obim_usuarios(nombre)")
      .order("fecha", { ascending: false });
    if (me.rol !== "admin") q = q.eq("usuario_id", me.id);
    const { data, error } = await q;
    if (error) throw new Error(error.message);
    return (data ?? []).map((r: Record<string, unknown>) => ({
      id: r.id as string,
      usuario_id: r.usuario_id as string,
      usuario_nombre: (r.obim_usuarios as { nombre?: string } | null)?.nombre ?? "",
      fecha: r.fecha as string,
      horas: Number(r.horas),
      tarea: (r.tarea as string) ?? "",
      etapa: (r.etapa as string) ?? "",
      coste: Number(r.coste),
    }));
  });

// Registrar horas: se imputa el coste = horas * coste_hora del usuario.
export const obimFichajeCreate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      fecha: z.string().min(1),
      horas: z.number().positive(),
      tarea: z.string().default(""),
      etapa: z.string().default(""),
      usuario_id: z.string().uuid().optional(), // solo admin puede fichar por otro
    }),
  )
  .handler(async ({ data, context }) => {
    const uid = (context as { userId?: string }).userId;
    const { data: me } = await db.from("obim_usuarios").select("id,rol,coste_hora").eq("auth_user_id", uid).maybeSingle();
    if (!me) throw new Error("No autorizado.");
    let usuarioId = me.id as string;
    let costeHora = Number(me.coste_hora);
    if (data.usuario_id && data.usuario_id !== me.id) {
      if (me.rol !== "admin") throw new Error("Solo un administrador puede fichar por otra persona.");
      const { data: otro } = await db.from("obim_usuarios").select("id,coste_hora").eq("id", data.usuario_id).maybeSingle();
      if (!otro) throw new Error("Usuario no encontrado.");
      usuarioId = otro.id as string;
      costeHora = Number(otro.coste_hora);
    }
    const coste = Math.round(data.horas * costeHora * 100) / 100;
    const { error } = await db.from("obim_fichajes").insert({
      usuario_id: usuarioId,
      fecha: data.fecha,
      horas: data.horas,
      tarea: data.tarea,
      etapa: data.etapa,
      coste,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const obimFichajeDelete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const uid = (context as { userId?: string }).userId;
    const { data: me } = await db.from("obim_usuarios").select("id,rol").eq("auth_user_id", uid).maybeSingle();
    if (!me) throw new Error("No autorizado.");
    let q = db.from("obim_fichajes").delete().eq("id", data.id);
    if (me.rol !== "admin") q = q.eq("usuario_id", me.id);
    const { error } = await q;
    if (error) throw new Error(error.message);
    return { ok: true };
  });
