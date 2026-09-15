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
    var name = String(data.get("name") || "").trim();
    var phone = String(data.get("phone") || "").trim();
    var email = String(data.get("email") || "").trim();
    var alt = String(data.get("altEmail") || "").trim();
    var type = String(data.get("projectType") || "").trim();
    var lot = String(data.get("remnant") || "").trim();
    var notes = String(data.get("notes") || "").trim();
    var rooms = String(data.get("rooms") || "").trim();
    var timing = String(data.get("timing") || "").trim();
    var sqft = String(data.get("sqft") || "").trim();
    var fileInput = form.querySelector('input[type=file]');
    var files = fileInput && fileInput.files ? Array.prototype.map.call(fileInput.files, function (f) { return f.name; }).join(", ") : "";
    var body = ["Name: " + name, "Phone: " + phone, "Email: " + email, alt ? "Second email: " + alt : "", "Project: " + type, lot ? "Remnant ID: " + lot : "", rooms ? "Rooms: " + rooms : "", timing ? "Timing: " + timing : "", sqft ? "Square footage: " + sqft : "", files ? "Attachments: " + files : "", "", notes].filter(Boolean).join("\n");
    window.location.href = "mailto:hello@all-star-flooring.com?subject=" + encodeURIComponent("Quote request from " + name) + "&body=" + encodeURIComponent(body);
    form.hidden = true;
    thanks.hidden = false;
    var who = thanks.querySelector("[data-who]");
    if (who) who.textContent = name.split(" ")[0] || "";
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
  var taps = 0;
  var timer = 0;
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-studio-tap]");
    if (!btn) return;
    taps += 1;
    window.clearTimeout(timer);
    timer = window.setTimeout(function () { taps = 0; }, 1800);
    if (taps >= 5) {
      taps = 0;
      window.location.href = "studio.html";
    }
  });
})();

(function () {
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-quote-go]");
    if (!a) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault();
    var burst = document.createElement("span");
    burst.className = "quote-burst";
    burst.setAttribute("aria-hidden", "true");
    document.body.appendChild(burst);
    window.setTimeout(function () { window.location.href = a.getAttribute("href"); }, 520);
  });
})();
