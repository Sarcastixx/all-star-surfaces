(function () {
  var toggle = document.querySelector("[data-menu]");
  var panel = document.querySelector("[data-mobile-nav]");
  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      var open = panel.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
})();
(function () {
  var wrap = document.querySelector("[data-svc]");
  var btn = document.querySelector("[data-svc-btn]");
  if (!wrap || !btn) return;
  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    wrap.classList.toggle("open");
    btn.setAttribute("aria-expanded", wrap.classList.contains("open") ? "true" : "false");
  });
  document.addEventListener("click", function (e) {
    if (!wrap.contains(e.target)) wrap.classList.remove("open");
  });
})();
(function () {
  var form = document.querySelector("[data-quote-form]");
  var thanks = document.querySelector("[data-thanks]");
  if (!form || !thanks) return;
  var params = new URLSearchParams(window.location.search);
  var remnant = params.get("remnant");
  if (remnant && form.remnant) {
    form.remnant.value = remnant;
    if (form.projectType) form.projectType.value = "Remnant inquiry";
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = new FormData(form);
    var payload = {
      name: String(data.get("name") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      email: String(data.get("email") || "").trim(),
      projectType: String(data.get("projectType") || "").trim(),
      remnant: String(data.get("remnant") || "").trim(),
      rooms: String(data.get("rooms") || "").trim(),
      timing: String(data.get("timing") || "").trim(),
      sqft: String(data.get("sqft") || "").trim(),
      notes: String(data.get("notes") || "").trim()
    };
    var btn = form.querySelector("button[type=submit]");
    if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
    var lead = {
      _subject: "Quote request from " + payload.name,
      _template: "table",
      _captcha: "false",
      _replyto: payload.email,
      Name: payload.name,
      Phone: payload.phone,
      Email: payload.email,
      Project: payload.projectType,
      Rooms: payload.rooms,
      Timing: payload.timing,
      "Square footage": payload.sqft,
      Remnant: payload.remnant,
      Notes: payload.notes
    };
    var emailSend = fetch("https://formsubmit.co/ajax/Allstarseattle@gmail.com", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(lead)
    }).catch(function () { return null; });
    var siteSend = fetch("/api/quote", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    Promise.all([siteSend, emailSend]).then(function (results) {
      var res = results[0];
      if (!res.ok) throw new Error("send");
      form.hidden = true;
      thanks.hidden = false;
      var who = thanks.querySelector("[data-who]");
      if (who) who.textContent = payload.name.split(" ")[0] || "";
    }).catch(function () {
      var body = ["Name: " + payload.name, "Phone: " + payload.phone, "Email: " + payload.email, "Project: " + payload.projectType, payload.rooms ? "Rooms: " + payload.rooms : "", payload.timing ? "Timing: " + payload.timing : "", payload.sqft ? "Square footage: " + payload.sqft : "", "", payload.notes].filter(Boolean).join("\n");
      window.location.href = "mailto:Allstarseattle@gmail.com?subject=" + encodeURIComponent("Quote request from " + payload.name) + "&body=" + encodeURIComponent(body);
      form.hidden = true;
      thanks.hidden = false;
    });
  });
})();

(function () {
  var bar = document.querySelector("[data-filters]");
  if (!bar) return;
  bar.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-filter]");
    if (!btn) return;
    var id = btn.getAttribute("data-filter");
    bar.querySelectorAll("[data-filter]").forEach(function (b) {
      b.classList.toggle("is-on", b === btn);
    });
    document.querySelectorAll("[data-group]").forEach(function (g) {
      g.style.display = id === "all" || g.getAttribute("data-group") === id ? "" : "none";
    });
  });
})();


(function () {
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-quote-go]");
    if (!a) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault();
    var r = a.getBoundingClientRect();
    var x = r.left + r.width / 2;
    var y = r.top + r.height / 2;
    var size = Math.max(r.width, r.height);
    var reach = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    var scale = (reach / (size / 2)) * 1.2;
    var wrap = document.createElement("div");
    wrap.className = "quote-water is-in";
    wrap.setAttribute("aria-hidden", "true");
    function drop(extra) {
      var s = document.createElement("span");
      s.className = "quote-water-drop" + (extra || "");
      s.style.left = x + "px";
      s.style.top = y + "px";
      s.style.width = size + "px";
      s.style.height = size + "px";
      s.style.marginLeft = -size / 2 + "px";
      s.style.marginTop = -size / 2 + "px";
      s.style.setProperty("--quote-scale", String(scale));
      wrap.appendChild(s);
    }
    drop(" quote-water-drop-2");
    drop("");
    document.body.appendChild(wrap);
    sessionStorage.setItem("as-quote-veil", "1");
    window.setTimeout(function () { window.location.href = a.getAttribute("href"); }, 640);
  });
})();

(function () {
  var btn = document.querySelector("[data-mobile-svc]");
  var panel = document.querySelector("[data-mobile-svc-panel]");
  if (!btn || !panel) return;
  var path = (location.pathname.replace(/\/$/, "") || "/");
  var inSvc = ["/services", "/vendors", "/portfolio", "/remnants"].indexOf(path) >= 0;
  if (inSvc) {
    panel.classList.add("open");
    btn.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
  }
  document.querySelectorAll(".svc-panel a, .mobile-svc a").forEach(function (a) {
    var href = (a.getAttribute("href") || "").replace(/\/$/, "") || "/";
    if (href === path) a.classList.add("is-on");
  });
  btn.addEventListener("click", function () {
    var open = panel.classList.toggle("open");
    btn.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
})();

(function () {
  var input = document.querySelector("[data-vendor-q]");
  var grid = document.querySelector("[data-vendor-grid]");
  var empty = document.querySelector("[data-vendor-empty]");
  if (!input || !grid) return;
  var cards = grid.querySelectorAll("[data-vendor]");
  input.addEventListener("input", function () {
    var q = input.value.trim().toLowerCase();
    var n = 0;
    cards.forEach(function (c) {
      var show = !q || (c.getAttribute("data-vendor") || "").indexOf(q) >= 0;
      c.classList.toggle("is-hide", !show);
      if (show) n += 1;
    });
    if (empty) empty.hidden = n > 0;
  });
})();
