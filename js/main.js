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
  document.querySelectorAll(".vendor-card img").forEach(function (img) {
    function hide() { img.hidden = true; }
    img.addEventListener("error", hide);
    if (img.complete && img.naturalWidth === 0) hide();
  });
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
    var payload = {};
    for (var pair of data.entries()) {
      if (!pair[0]) continue;
      if (pair[1] && pair[1].name && pair[1].size != null) continue;
      var val = String(pair[1]).trim();
      if (!val || val === "[object File]") continue;
      if (payload[pair[0]]) payload[pair[0]] += ", " + val;
      else payload[pair[0]] = val;
    }
    if (!payload.projectType) payload.projectType = "Quote";
    var btn = form.querySelector("button[type=submit]");
    if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
    var shown = false;
    function done() {
      if (shown) return;
      shown = true;
      if (btn) btn.textContent = "Sent";
      form.hidden = true;
      thanks.hidden = false;
      var who = thanks.querySelector("[data-who]");
      if (who) who.textContent = (payload.name || "").split(" ")[0] || "";
    }
    function send() {
      var sheet = window.AS_SHEET_WEBHOOK;
      if (sheet) {
        fetch(sheet, {
          method: "POST",
          mode: "no-cors",
          body: JSON.stringify(payload)
        }).catch(function () {});
      }
      var timer = setTimeout(done, 7000);
      fetch("/api/quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      }).then(function (res) {
        if (!res.ok) throw new Error("send");
        clearTimeout(timer);
        done();
      }).catch(function () {
        clearTimeout(timer);
        if (sheet) { done(); return; }
        var mail = {};
        Object.keys(payload).forEach(function (k) { if (k !== "photoData") mail[k] = payload[k]; });
        var body = Object.keys(mail).map(function(k){ return k + ": " + mail[k]; }).join("\n");
        window.location.href = "mailto:Allstarseattle@gmail.com?subject=" + encodeURIComponent((payload.projectType || "Request") + " from " + (payload.name || "")) + "&body=" + encodeURIComponent(body);
        done();
      });
    }
    var fileInput = form.querySelector("input[type=file]");
    var files = fileInput && fileInput.files ? Array.prototype.slice.call(fileInput.files, 0, 3) : [];
    if (!files.length) { send(); return; }
    payload.photos = files.map(function (file) { return file.name; }).join(", ");
    Promise.all(files.map(shrinkPhoto)).then(function (shots) {
      var kept = shots.filter(Boolean);
      var packed = JSON.stringify(kept);
      if (kept.length && packed.length < 140000) payload.photoData = kept;
      send();
    }).catch(function () { send(); });
  });
})();

function shrinkPhoto(file) {
  return new Promise(function (resolve) {
    if (!file || !file.type || file.type.indexOf("image/") !== 0) { resolve(null); return; }
    var reader = new FileReader();
    reader.onerror = function () { resolve(null); };
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var max = 720;
        var scale = Math.min(1, max / Math.max(img.width, img.height));
        var canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve({ name: file.name, data: canvas.toDataURL("image/jpeg", 0.55) });
      };
      img.onerror = function () { resolve(null); };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

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

/* Cookie consent */
(function () {
  var KEY = "as-cookie-consent";
  var banner = null;

  var style = document.createElement("style");
  style.textContent = [
    ".cookie-banner{position:fixed;left:0;right:0;bottom:0;z-index:80;background:var(--cream,#efe8dc);color:var(--ink,#2f2a24);border-top:1px solid var(--line,#d9d0c3);padding:16px 20px;box-shadow:0 -8px 32px rgb(47 42 36 / .12);transform:translateY(110%);transition:transform .35s cubic-bezier(.2,0,0,1);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px}",
    ".cookie-banner.is-visible{transform:translateY(0)}",
    ".cookie-banner p{margin:0;flex:1 1 280px;font-size:14px;color:var(--ink-soft,#5a5248);line-height:1.45}",
    ".cookie-banner-actions{display:flex;gap:8px;flex-shrink:0}",
    ".cookie-banner .btn{min-height:44px;padding:0 16px;font-size:13px}",
    ".cookie-settings-link{color:var(--muted,#8a8175);font-size:12px;text-decoration:underline;cursor:pointer;background:none;border:0;padding:0;font-family:inherit}",
    ".cookie-settings-link:hover{color:var(--ink,#2f2a24)}",
    "body.has-cookie-banner .quote-fab{bottom:108px}",
    "@media(max-width:600px){.cookie-banner{padding:14px 16px;flex-direction:column;align-items:stretch}.cookie-banner-actions{justify-content:flex-end}body.has-cookie-banner .quote-fab{bottom:168px}}"
  ].join("\n");
  document.head.appendChild(style);

  function createBanner() {
    if (banner) return banner;
    banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Cookie consent");
    banner.innerHTML =
      '<p>This site keeps a preference in your browser so the banner stays dismissed. No ad cookies. <button type="button" class="cookie-settings-link" data-cookie-more>Learn more</button></p>' +
      '<div class="cookie-banner-actions">' +
        '<button type="button" class="btn ghost" data-cookie-decline>Decline</button>' +
        '<button type="button" class="btn" data-cookie-accept>Accept</button>' +
      '</div>';
    document.body.appendChild(banner);

    banner.querySelector("[data-cookie-accept]").addEventListener("click", function () {
      try { localStorage.setItem(KEY, "accepted"); } catch (e) {}
      hideBanner();
    });
    banner.querySelector("[data-cookie-decline]").addEventListener("click", function () {
      try { localStorage.setItem(KEY, "declined"); } catch (e) {}
      hideBanner();
    });
    banner.querySelector("[data-cookie-more]").addEventListener("click", function () {
      var p = banner.querySelector("p");
      if (!p) return;
      p.textContent = "ALLSTAR Surfaces stores your cookie choice and theme on this device. Quote requests go to the shop. There is no third-party ad tracker. Use Cookie settings in the footer to choose again.";
    });
    return banner;
  }

  function showBanner() {
    var b = createBanner();
    document.body.classList.add("has-cookie-banner");
    requestAnimationFrame(function () { b.classList.add("is-visible"); });
  }

  function hideBanner() {
    document.body.classList.remove("has-cookie-banner");
    if (!banner) return;
    banner.classList.remove("is-visible");
    var node = banner;
    banner = null;
    setTimeout(function () {
      if (node.parentNode) node.parentNode.removeChild(node);
    }, 400);
  }

  function addFooterLink() {
    var footBottom = document.querySelector(".foot-bottom");
    if (!footBottom || footBottom.querySelector("[data-cookie-settings]")) return;
    var link = document.createElement("button");
    link.type = "button";
    link.className = "cookie-settings-link";
    link.setAttribute("data-cookie-settings", "");
    link.textContent = "Cookie settings";
    link.style.marginLeft = "12px";
    link.addEventListener("click", function () {
      try { localStorage.removeItem(KEY); } catch (e) {}
      showBanner();
    });
    var end = footBottom.querySelector(".foot-bottom-end") || footBottom;
    end.appendChild(link);
  }

  function start() {
    addFooterLink();
    var saved = "";
    try { saved = localStorage.getItem(KEY) || ""; } catch (e) {}
    if (!saved) showBanner();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();

(function () {
  var header = document.querySelector(".site-header");
  if (!header) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function sync() {
    header.classList.toggle("is-top", !reduce && window.scrollY < 12);
  }
  sync();
  window.addEventListener("scroll", sync, { passive: true });
})();
