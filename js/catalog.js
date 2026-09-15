(function () {
  var SURFACES = { hardwood: "Hardwood", tile: "Tile", carpet: "Carpet", lvp: "LVP" };

  function el(tag, attrs, html) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (attrs[k] == null || attrs[k] === false) return;
      node.setAttribute(k, attrs[k] === true ? "" : attrs[k]);
    });
    if (html != null) node.innerHTML = html;
    return node;
  }

  function surfaceOf(item) {
    var raw = String(item.surface || item.material || "").toLowerCase();
    if (raw.indexOf("carpet") >= 0) return "carpet";
    if (raw.indexOf("lvp") >= 0 || raw.indexOf("vinyl") >= 0) return "lvp";
    if (raw.indexOf("tile") >= 0 || raw.indexOf("stone") >= 0 || raw.indexOf("porcelain") >= 0) return "tile";
    return "hardwood";
  }

  function remnantCard(item) {
    var card = el("article", { class: "shop-card", "data-id": item.id, "data-surface": surfaceOf(item) });
    var media = el("div", { class: "shop-media" });
    if (item.photo) media.appendChild(el("img", { src: item.photo, alt: item.title || "" }));
    media.appendChild(el("span", { class: "shop-badge" }, SURFACES[surfaceOf(item)] || "Lot"));
    card.appendChild(media);
    var body = el("div", { class: "shop-body" });
    body.appendChild(el("p", { class: "shop-meta" }, SURFACES[surfaceOf(item)] + (item.qty || item.size ? " · " + (item.qty || item.size) : "")));
    body.appendChild(el("h2", null, item.title || ""));
    if (item.detail || item.blurb) body.appendChild(el("p", { class: "lede" }, item.detail || item.blurb));
    var row = el("div", { class: "shop-row" });
    var href = "quote.html?remnant=" + encodeURIComponent(item.id);
    row.appendChild(el("a", { class: "btn ghost", href: href }, "Inquire"));
    body.appendChild(row);
    card.appendChild(body);
    return card;
  }

  function jobCard(item, asLink) {
    var caption = item.caption || item.title || "";
    var tag = asLink ? "a" : "article";
    var card = el(tag, { class: "shop-card job-card" });
    if (asLink) card.setAttribute("href", "portfolio.html");
    var media = el("div", { class: "shop-media" });
    if (item.photo) media.appendChild(el("img", { src: item.photo, alt: caption }));
    card.appendChild(media);
    var body = el("div", { class: "shop-body" });
    body.appendChild(el(asLink ? "h3" : "h2", null, caption));
    card.appendChild(body);
    return card;
  }

  function mount(sel, nodes) {
    var root = document.querySelector(sel);
    if (!root) return;
    root.innerHTML = "";
    nodes.forEach(function (n) { root.appendChild(n); });
  }

  function loadJson(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(url);
      return r.json();
    });
  }

  function normalize(api) {
    return {
      remnants: api.remnants || [],
      jobs: (api.jobs || []).map(function (j) {
        return { id: j.id, caption: j.caption || j.title, photo: j.photo, featured: j.featured };
      }),
      photos: api.photos || {}
    };
  }

  function loadCatalog() {
    return loadJson("/api/catalog").then(normalize).catch(function () {
      return Promise.all([
        loadJson("data/catalog.json").catch(function () { return null; }),
        loadJson("data/remnants.json").catch(function () { return { items: [] }; }),
        loadJson("data/jobs.json").catch(function () { return { items: [] }; })
      ]).then(function (pack) {
        if (pack[0]) return normalize(pack[0]);
        return {
          remnants: (pack[1].items || []).map(function (i) {
            return { id: i.id, surface: surfaceOf(i), title: i.title, qty: i.size, detail: i.blurb, photo: i.photo };
          }),
          jobs: (pack[2].items || []).map(function (i) {
            return { id: i.id, caption: i.title, photo: i.photo, featured: i.featured };
          }),
          photos: {}
        };
      });
    });
  }

  loadCatalog().then(function (data) {
    Object.keys(data.photos || {}).forEach(function (slot) {
      if (slot === "hero") return;
      document.querySelectorAll('[data-slot="' + slot + '"]').forEach(function (img) {
        if (data.photos[slot]) img.setAttribute("src", data.photos[slot]);
      });
    });
    Object.keys(data.copy || {}).forEach(function (k) {
      document.querySelectorAll('[data-copy="' + k + '"]').forEach(function (el) {
        if (data.copy[k]) el.textContent = data.copy[k];
      });
    });

    var remnantsRoot = document.querySelector("[data-remnants]");
    if (remnantsRoot) {
      var items = data.remnants.filter(function (i) { return i.status !== "hidden" && i.status !== "sold"; });
      function draw(filter) {
        var shown = items.filter(function (i) { return filter === "all" || surfaceOf(i) === filter; });
        mount("[data-remnants]", shown.map(remnantCard));
        if (!shown.length) {
          remnantsRoot.innerHTML = "<p class=\"lede\">Nothing on the rack in that finish this week.</p>";
        }
      }
      draw("all");
      var bar = document.querySelector("[data-filters]");
      if (bar) {
        bar.addEventListener("click", function (e) {
          var btn = e.target.closest("[data-filter]");
          if (!btn) return;
          bar.querySelectorAll("[data-filter]").forEach(function (b) {
            b.classList.toggle("is-on", b === btn);
          });
          draw(btn.getAttribute("data-filter"));
        });
      }
    }

    var jobsRoot = document.querySelector("[data-jobs]");
    if (jobsRoot) {
      var featuredOnly = jobsRoot.hasAttribute("data-featured");
      var jobs = data.jobs || [];
      if (featuredOnly) jobs = jobs.filter(function (i) { return i.featured !== false; }).slice(0, 3);
      mount("[data-jobs]", jobs.map(function (i) { return jobCard(i, featuredOnly); }));
    }
    document.dispatchEvent(new Event("as-catalog-ready"));
  });
})();
