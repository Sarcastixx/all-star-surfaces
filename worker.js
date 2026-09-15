const PIN = "allstar";

async function tokenFor(pin) {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode("all-star-studio:" + String(pin || "").trim()),
  );
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

export class CatalogDO {
  constructor(ctx, env) {
    this.ctx = ctx;
    this.env = env;
  }

  sql() {
    const sql = this.ctx.storage.sql;
    sql.exec("create table if not exists catalog (id integer primary key, body text)");
    return sql;
  }

  read() {
    const rows = this.sql().exec("select body from catalog where id = 1").toArray();
    if (!rows.length || !rows[0].body) return null;
    try {
      return JSON.parse(rows[0].body);
    } catch {
      return null;
    }
  }

  write(data) {
    this.sql().exec(
      "insert into catalog (id, body) values (1, ?) on conflict(id) do update set body = excluded.body",
      JSON.stringify(data),
    );
  }

  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (request.method === "GET" && path === "/api/catalog") {
      const stored = this.read();
      return json(stored || { remnants: [], jobs: [], photos: {} });
    }
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
    let body = {};
    try {
      body = await request.json();
    } catch {
      return json({ error: "Bad request" }, 400);
    }
    if (path === "/api/login") {
      const ok = (await tokenFor(body.pin)) === (await tokenFor(PIN));
      if (!ok) return json({ ok: false }, 401);
      return json({ ok: true, token: await tokenFor(PIN) });
    }
    const expected = await tokenFor(PIN);
    if (body.token !== expected) return json({ error: "Studio login required" }, 401);
    const current = this.read() || { remnants: [], jobs: [], photos: {} };
    if (!Array.isArray(current.remnants)) current.remnants = [];
    if (!Array.isArray(current.jobs)) current.jobs = [];
    if (!current.photos) current.photos = {};
    if (path === "/api/remnant") {
      const item = body.item || {};
      if (!item.title) return json({ error: "Add a title" }, 400);
      if (!item.id) item.id = "r-" + Date.now();
      const idx = current.remnants.findIndex((r) => r.id === item.id);
      if (idx >= 0) current.remnants[idx] = item;
      else current.remnants.unshift(item);
      this.write(current);
      return json({ ok: true, id: item.id });
    }
    if (path === "/api/remnant/delete") {
      current.remnants = current.remnants.filter((r) => r.id !== body.id);
      this.write(current);
      return json({ ok: true });
    }
    if (path === "/api/job") {
      const item = body.item || {};
      if (!item.caption || !item.photo) return json({ error: "Photo and caption are required" }, 400);
      if (!item.id) item.id = "j-" + Date.now();
      const idx = current.jobs.findIndex((r) => r.id === item.id);
      if (idx >= 0) current.jobs[idx] = item;
      else current.jobs.unshift(item);
      this.write(current);
      return json({ ok: true, id: item.id });
    }
    if (path === "/api/job/delete") {
      current.jobs = current.jobs.filter((r) => r.id !== body.id);
      this.write(current);
      return json({ ok: true });
    }
    if (path === "/api/photo") {
      if (!body.slot || !body.photo) return json({ error: "Add a photo" }, 400);
      current.photos[body.slot] = body.photo;
      this.write(current);
      return json({ ok: true });
    }
    return json({ error: "Not found" }, 404);
  }
}

async function seedIfEmpty(env, request, stub) {
  const res = await stub.fetch(new Request("https://catalog/api/catalog"));
  const data = await res.json();
  const empty =
    (!data.remnants || !data.remnants.length) &&
    (!data.jobs || !data.jobs.length);
  if (!empty) return;
  const seedRes = await env.ASSETS.fetch(new URL("/data/catalog.json", request.url));
  if (!seedRes.ok) return;
  const seed = await seedRes.json();
  const token = await tokenFor(PIN);
  for (const item of seed.remnants || []) {
    await stub.fetch(
      new Request("https://catalog/api/remnant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, item }),
      }),
    );
  }
  for (const item of seed.jobs || []) {
    await stub.fetch(
      new Request("https://catalog/api/job", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, item }),
      }),
    );
  }
  for (const slot of Object.keys(seed.photos || {})) {
    await stub.fetch(
      new Request("https://catalog/api/photo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, slot, photo: seed.photos[slot] }),
      }),
    );
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      if (!env.CATALOG) return json({ error: "Catalog is not bound yet" }, 503);
      const stub = env.CATALOG.get(env.CATALOG.idFromName("main"));
      if (request.method === "GET" && url.pathname === "/api/catalog") {
        await seedIfEmpty(env, request, stub);
      }
      return stub.fetch(request);
    }
    return env.ASSETS.fetch(request);
  },
};
