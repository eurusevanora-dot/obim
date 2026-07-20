# O-BIM — Open Building Intelligence Manager

Portal público del proyecto (presentación del Proyecto Director) y Project
Center privado para participantes: inversión, personal, justificación
documental, agenda e hitos.

## Stack

TanStack Start (React 19) + Tailwind v4, desplegado como Cloudflare Worker
(preset nitro `cloudflare_module`). Datos y autenticación en Supabase
(proyecto NEXUS-METADATA, tablas `obim_*`, bucket privado `obim-docs`).

## Rutas

- `/` — portal público.
- `/acceso` — login de participantes (email + contraseña, Supabase Auth).
- `/center` — Project Center (requiere sesión).

## Desarrollo

```sh
npm install
npm run dev
```

Para las server functions en local hace falta `.dev.vars` (no se sube) con:

```
SUPABASE_URL=https://irpkofhsaahwwkyszmzm.supabase.co
SUPABASE_PUBLISHABLE_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>
```

## Despliegue

`npm run build` genera `.output/` y la config de wrangler. En Cloudflare:

1. Conectar este repo en Workers → Create → Import a repository.
2. Build command `npm run build`; deploy command `npx wrangler deploy`.
3. Añadir el secreto `SUPABASE_SERVICE_ROLE_KEY` al worker.
4. Los custom domains `o-bim.com` y `www.o-bim.com` se aprovisionan desde
   `wrangler.jsonc` en el deploy de producción (la zona debe estar libre y el
   dominio desvinculado del worker anterior).

## Altas de participantes

Supabase → Authentication → Users → Add user (email + contraseña).
