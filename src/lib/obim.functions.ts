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
