type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    // www.o-bim.com → o-bim.com (301 permanente).
    const url = new URL(request.url);
    if (url.hostname.startsWith("www.")) {
      url.hostname = url.hostname.slice(4);
      return Response.redirect(url.toString(), 301);
    }

    const handler = await getServerEntry();
    const response = await handler.fetch(request, env, ctx);

    // El HTML lo sirve el Worker: forzar revalidación para no cachear
    // versiones antiguas tras un despliegue (los assets hasheados van aparte).
    const ct = response.headers.get("content-type") ?? "";
    if (ct.includes("text/html") && !response.headers.has("cache-control")) {
      const headers = new Headers(response.headers);
      headers.set("cache-control", "no-cache");
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }
    return response;
  },
};
