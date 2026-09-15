(function () {
  function el(tag, attrs, html) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (attrs[k] == null || attrs[k] === false) return;
      node.setAttribute(k, attrs[k] === true ? "" : attrs[k]);
    });
    if (html != null) node.innerHTML = html;
    return node;
  }

  function statusLabel(s) {
    if (s === "sold") return "Sold";
    if (s === "hold") return "On hold";
    return "Available";
  }

  function remnantCard(item) {
    var card = el("article", { class: "shop-card", "data-id": item.id });
    var media = el("div", { class: "shop-media" });
    media.appendChild(el("img", { src: item.photo, alt: item.title }));
    media.appendChild(el("span", { class: "shop-badge " + (item.status || "available") }, statusLabel(item.status)));
    card.appendChild(media);
    var body = el("div", { class: "shop-body" });
    body.appendChild(el("p", { class: "shop-meta" }, [item.material, item.size].filter(Boolean).join(" · ")));
    body.appendChild(el("h2", null, item.title));
    if (item.blurb) body.appendChild(el("p", { class: "lede" }, item.blurb));
    var row = el("div", { class: "shop-row" });
    row.appendChild(el("span", { class: "shop-price" }, item.price || "Ask"));
    var href = "quote.html?remnant=" + encodeURIComponent(item.id);
    row.appendChild(el("a", { class: "btn ghost", href: href }, "Inquire"));
    body.appendChild(row);
    card.appendChild(body);
    return card;
  }

  function jobCard(item, asLink) {
    var tag = asLink ? "a" : "article";
    var card = el(tag, { class: "shop-card job-card" });
    if (asLink) card.setAttribute("href", "portfolio.html#" + item.id);
    var media = el("div", { class: "shop-media" });
    media.appendChild(el("img", { src: item.photo, alt: item.title }));
    card.appendChild(media);
    var body = el("div", { class: "shop-body" });
    body.appendChild(el("p", { class: "shop-meta" }, [item.location, item.year].filter(Boolean).join(" · ")));
    body.appendChild(el(asLink ? "h3" : "h2", null, item.title));
    if (item.material) body.appendChild(el("p", { class: "lede" }, item.material + (item.blurb ? " — " + item.blurb : "")));
    card.appendChild(body);
    card.id = item.id;
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

  var remnantsRoot = document.querySelector("[data-remnants]");
  if (remnantsRoot) {
    loadJson("data/remnants.json").then(function (data) {
      var items = (data.items || []).filter(function (i) { return i.status !== "hidden"; });
      var filter = remnantsRoot.getAttribute("data-filter");
      if (filter) items = items.filter(function (i) { return i.material === filter; });
      mount("[data-remnants]", items.map(remnantCard));
    }).catch(function () {
      remnantsRoot.innerHTML = "<p class=\"lede\">Listings will appear here once data/remnants.json is published.</p>";
    });
  }

  var jobsRoot = document.querySelector("[data-jobs]");
  if (jobsRoot) {
    var featuredOnly = jobsRoot.hasAttribute("data-featured");
    loadJson("data/jobs.json").then(function (data) {
      var items = data.items || [];
      if (featuredOnly) {
        items = items.filter(function (i) { return i.featured; }).slice(0, 3);
      }
      mount("[data-jobs]", items.map(function (i) { return jobCard(i, featuredOnly); }));
    }).catch(function () {
      jobsRoot.innerHTML = "<p class=\"lede\">Jobs will appear here once data/jobs.json is published.</p>";
    });
  }
})();
