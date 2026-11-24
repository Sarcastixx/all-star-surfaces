function vendorName(host) {
  const known = {
    "flooranddecor.com": "Floor & Decor",
    "daltile.com": "Daltile",
    "msisurfaces.com": "MSI",
    "bedrosians.com": "Bedrosians",
    "floridatile.com": "Florida Tile",
    "emser.com": "Emser",
    "arizonatile.com": "Arizona Tile",
    "shawfloors.com": "Shaw",
    "mohawkflooring.com": "Mohawk",
  };
  return known[host] || host.replace(/\.(com|net|org)$/, "");
}

function readProduct(html, pageUrl, host) {
  let product = null;
  const blocks = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi) || [];
  for (const block of blocks) {
    const raw = block.replace(/^<script[^>]*>/i, "").replace(/<\/script>$/i, "");
    try {
      const data = JSON.parse(raw);
      const list = Array.isArray(data) ? data : [data];
      const found = list.find((entry) => entry && (entry["@type"] === "Product" || (Array.isArray(entry["@type"]) && entry["@type"].includes("Product"))));
      if (found) product = found;
    } catch {
      /* ignore broken blocks */
    }
  }
  const facts = [];
  const want = ["Size", "Finish", "Material", "Color", "Brand", "Installation Options", "Coverage (sqft/pc)", "Product Thickness", "Shower Surface", "Placement Location", "Look", "Edge"];
  const spec = /b-pdp_specifications-name">\s*([^<]+?)\s*<\/span>[\s\S]{0,500}?b-pdp_specifications-number">\s*([^<]+?)\s*<\/span>/g;
  let match;
  while ((match = spec.exec(html))) {
    const name = match[1].replace(/\s+/g, " ").trim();
    const value = match[2].replace(/\s+/g, " ").trim();
    const line = name + ": " + value;
    if (want.includes(name) && value && !facts.includes(line)) facts.push(line);
  }
  let images = [];
  if (product && Array.isArray(product.image)) images = product.image;
  else if (product && typeof product.image === "string") images = [product.image];
  images = [...new Set(images.map((src) => String(src).replace(/&/g, "&")))].filter((src) => src.startsWith("https://")).slice(0, 8);
  const brand = product && product.brand && (product.brand.name || product.brand);
  const add = (label, value) => {
    if (!value) return;
    const line = label + ": " + String(value).replace(/\s+/g, " ").trim();
    if (!facts.some((fact) => fact.startsWith(label + ":"))) facts.unshift(line);
  };
  if (product) {
    add("Color", product.color);
    add("Material", product.material);
    add("Size", product.size);
    add("Brand", typeof brand === "string" ? brand : "");
    const price = product.offers && product.offers.price;
    if (price) facts.unshift("Price: $" + price + (html.includes("/ piece") ? " / piece" : ""));
  }
  const title = (product && product.name) || metaContent(html, "og:title") || "";
  const detail = String((product && product.description) || "").replace(/\s+/g, " ").trim().slice(0, 320);
  return {
    title: String(title).slice(0, 120),
    vendor: vendorName(host),
    photo: images[0] || "",
    photos: images,
    facts: facts.slice(0, 12),
    detail,
    link: pageUrl,
  };
}

function metaContent(html, prop) {
  const one = new RegExp("<meta[^>]+(?:property|name)=[\"']" + prop + "[\"'][^>]+content=[\"']([^\"']+)[\"']", "i");
  const two = new RegExp("<meta[^>]+content=[\"']([^\"']+)[\"'][^>]+(?:property|name)=[\"']" + prop + "[\"']", "i");
  const found = html.match(one) || html.match(two);
  return found ? found[1] : "";
}

const FULL_PIN = "1976@llstar!";
const UPDATE_PIN = "Allstar.update!";

function normPin(pin) {
  return String(pin || "").trim().replace(/\s+/g, "");
}

function roleFromPin(pin) {
  const p = normPin(pin);
  if (p === FULL_PIN) return "full";
  if (p.toLowerCase() === UPDATE_PIN.toLowerCase()) return "update";
  return null;
}

function pinForRole(role) {
  return role === "update" ? UPDATE_PIN : FULL_PIN;
}

async function tokenFor(pin) {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode("all-star-studio:" + String(pin || "").trim()),
  );
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function roleFromToken(token) {
  if (!token) return null;
  if (token === (await tokenFor(FULL_PIN))) return "full";
  if (token === (await tokenFor(UPDATE_PIN))) return "update";
  return null;
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
    sql.exec("create table if not exists boards (id text primary key, body text)");
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

  readBoard(id) {
    const rows = this.sql().exec("select body from boards where id = ?", id).toArray();
    if (!rows.length || !rows[0].body) return null;
    try {
      return JSON.parse(rows[0].body);
    } catch {
      return null;
    }
  }

  saveBoard(board) {
    this.sql().exec(
      "insert into boards (id, body) values (?, ?) on conflict(id) do update set body = excluded.body",
      board.id,
      JSON.stringify(board),
    );
  }

  listBoards() {
    const rows = this.sql().exec("select body from boards").toArray();
    const boards = [];
    for (const row of rows) {
      let board;
      try { board = JSON.parse(row.body); } catch { continue; }
      if (!board || !board.id) continue;
      const items = Array.isArray(board.items) ? board.items : [];
      const real = items.some((item) => String(item.photo || "").startsWith("https://") || String(item.photo || "").startsWith("/images/"));
      if (!real && !String(board.name || "").trim()) continue;
      const likes = board.likes && typeof board.likes === "object" ? board.likes : {};
      let liked = 0;
      Object.keys(likes).forEach((key) => {
        if (Array.isArray(likes[key]) && likes[key].length) liked += 1;
      });
      boards.push({
        id: String(board.id),
        name: String(board.name || "Untitled").slice(0, 80),
        count: items.length,
        liked,
      });
    }
    boards.sort((a, b) => a.name.localeCompare(b.name));
    return json({ boards });
  }

  boardWrite(path, body) {
    if (path === "/api/board/like") {
      const id = String(body.id || "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 24);
      const key = String(body.key || "").slice(0, 80);
      const voter = String(body.voter || "").replace(/[^a-zA-Z0-9]/g, "").slice(0, 32);
      const board = this.readBoard(id);
      if (!board || !voter || !key) return json({ error: "Not found" }, 404);
      if (!board.likes || typeof board.likes !== "object") board.likes = {};
      const list = Array.isArray(board.likes[key]) ? board.likes[key] : [];
      const next = body.on === false ? list.filter((v) => v !== voter) : list.concat(list.indexOf(voter) >= 0 ? [] : [voter]);
      board.likes[key] = next.slice(0, 40);
      this.saveBoard(board);
      return json({ ok: true, count: board.likes[key].length });
    }
    const items = (Array.isArray(body.items) ? body.items : []).slice(0, 24).map((item, i) => ({
      key: String((item && item.key) || ("i" + i)).slice(0, 80),
      vendor: String((item && item.vendor) || "").slice(0, 80),
      title: String((item && item.title) || "").slice(0, 120),
      room: String((item && item.room) || "").slice(0, 80),
      photo: String((item && item.photo) || "").slice(0, 500000),
      photos: (Array.isArray(item && item.photos) ? item.photos : []).slice(0, 8).map((src) => String(src).slice(0, 400)).filter((src) => src.startsWith("https://") || src.startsWith("/")),
      facts: (Array.isArray(item && item.facts) ? item.facts : []).slice(0, 12).map((line) => String(line).slice(0, 120)),
      detail: String((item && item.detail) || "").slice(0, 500),
      link: String((item && item.link) || "").slice(0, 400),
    })).filter((item) => item.photo);
    if (!items.length) return json({ error: "Add a photo first" }, 400);
    let id = String(body.id || "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 24);
    const existing = id ? this.readBoard(id) : null;
    if (!id || !existing) id = "b" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const board = {
      id,
      name: String(body.name || "").slice(0, 80),
      note: String(body.note || "").slice(0, 400),
      items,
      likes: (existing && existing.likes) || {},
    };
    this.saveBoard(board);
    return json({ ok: true, id });
  }

  async product(raw) {
    let page;
    try {
      page = new URL(String(raw || "").trim());
    } catch {
      return json({ error: "Paste a full product link" }, 400);
    }
    if (page.protocol !== "https:") return json({ error: "Use an https link" }, 400);
    const host = page.hostname.replace(/^www\./, "");
    if (!host.includes(".") || /^(localhost|127\.|10\.|192\.168\.|169\.254\.)/.test(host)) {
      return json({ error: "That link is not allowed" }, 400);
    }
    let html = "";
    try {
      const res = await fetch(page.toString(), {
        headers: { "user-agent": "Mozilla/5.0", accept: "text/html" },
        redirect: "follow",
      });
      if (!res.ok) return json({ error: "That page did not open" }, 400);
      html = (await res.text()).slice(0, 1600000);
    } catch {
      return json({ error: "That page did not open" }, 400);
    }
    const parsed = readProduct(html, page.toString(), host);
    if (!parsed.title || !parsed.photo) return json({ error: "No tile photos on that page" }, 400);
    return json(parsed);
  }

  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (request.method === "GET" && path === "/api/catalog") {
      const stored = this.read() || { remnants: [], jobs: [], photos: {}, copy: {} };
      const copy = Object.assign({}, stored.copy || {});
      delete copy.sheetWebhook;
      return json({
        remnants: stored.remnants || [],
        jobs: stored.jobs || [],
        photos: stored.photos || {},
        copy: copy,
      });
    }
    if (request.method === "GET" && path === "/api/boards") {
      const role = await roleFromToken(request.headers.get("x-studio-token") || "");
      if (!role) return json({ error: "Staff sign-in required" }, 401);
      return this.listBoards();
    }
    if (request.method === "GET" && path === "/api/board") {
      const id = String(url.searchParams.get("id") || "").replace(/[^a-zA-Z0-9_-]/g, "");
      const rows = this.sql().exec("select body from boards where id = ?", id).toArray();
      if (!rows.length || !rows[0].body) return json({ error: "Not found" }, 404);
      try {
        return json(JSON.parse(rows[0].body));
      } catch {
        return json({ error: "Not found" }, 404);
      }
    }
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
    let body = {};
    try {
      body = await request.json();
    } catch {
      return json({ error: "Bad request" }, 400);
    }
    if (path === "/api/login") {
      const role = roleFromPin(body.pin);
      if (!role) return json({ ok: false }, 401);
      return json({ ok: true, token: await tokenFor(pinForRole(role)), role });
    }
    if (path === "/api/quote") {
      const current = this.read() || { remnants: [], jobs: [], photos: {}, copy: {}, quotes: [] };
      if (!Array.isArray(current.quotes)) current.quotes = [];
      if (!current.copy) current.copy = {};
      const item = {
        at: new Date().toISOString(),
        name: String(body.name || "").trim(),
        phone: String(body.phone || "").trim(),
        email: String(body.email || "").trim(),
        projectType: String(body.projectType || "").trim(),
        rooms: String(body.rooms || "").trim(),
        timing: String(body.timing || "").trim(),
        sqft: String(body.sqft || "").trim(),
        notes: String(body.notes || "").trim(),
        remnant: String(body.remnant || "").trim(),
      };
      if (!item.name || !item.phone || !item.email) {
        return json({ error: "Name, phone, and email are required" }, 400);
      }
      current.quotes.unshift(item);
      current.quotes = current.quotes.slice(0, 200);
      this.write(current);
      const sheet =
        (this.env && this.env.SHEET_WEBHOOK) ||
        (current.copy && current.copy.sheetWebhook) ||
        "";
      if (sheet) {
        const job = fetch(sheet, {
          method: "POST",
          headers: { "content-type": "text/plain;charset=utf-8" },
          body: JSON.stringify(item),
          redirect: "follow",
        }).catch(() => null);
        if (this.ctx && this.ctx.waitUntil) this.ctx.waitUntil(job);
        else await job;
      }
      return json({ ok: true });
    }
    if (path === "/api/board/like") {
      return this.boardWrite(path, body);
    }
    if (path === "/api/board" || path === "/api/product") {
      const role = await roleFromToken(body.token);
      if (!role) return json({ error: "Staff sign-in required" }, 401);
      if (path === "/api/product") return this.product(body.url || "");
      return this.boardWrite(path, body);
    }
    const role = await roleFromToken(body.token);
    if (!role) return json({ error: "Studio login required" }, 401);
    if ((path === "/api/copy" || path === "/api/photo" || path === "/api/photo/delete") && role !== "full") {
      return json({ error: "Full edit login required" }, 403);
    }
    const current = this.read() || { remnants: [], jobs: [], photos: {} };
    if (!Array.isArray(current.remnants)) current.remnants = [];
    if (!Array.isArray(current.jobs)) current.jobs = [];
    if (!current.photos) current.photos = {};
    if (!current.copy) current.copy = {};
    if (!Array.isArray(current.quotes)) current.quotes = [];
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
    if (path === "/api/photo/delete") {
      delete current.photos[body.slot];
      this.write(current);
      return json({ ok: true });
    }
    if (path === "/api/copy") {
      current.copy = Object.assign({}, current.copy || {}, body.copy || {});
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
