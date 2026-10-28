(function () {
  var STUDIO = "ALLSTAR studio, 18000 Hwy 99, Lynnwood, WA 98037";
  var STUDIO_HOURS = "Mon–Fri 9 AM–5 PM. After hours by appointment.";

  var VENDORS = {
    "https://www.daltile.com": {
      id: "daltile", title: "Daltile",
      brief: "Daltile is the porcelain, ceramic, natural stone, quartz, and vinyl we specify when a floor or wall needs a large format. Their Georgetown showroom carries the stone and slab; we match the board in Lynnwood.",
      placeLabel: "Seattle showroom", place: "540 S Front St, Seattle, WA 98108"
    },
    "https://www.mohawkflooring.com": {
      id: "mohawk", title: "Mohawk",
      brief: "Mohawk supplies the carpet, hardwood, luxury vinyl, tile, and laminate on a lot of our residential jobs, including waterproof vinyl for kitchens and basements.",
      placeLabel: "See samples", place: STUDIO, extra: STUDIO_HOURS
    },
    "https://shawfloors.com": {
      id: "shaw", title: "Shaw",
      brief: "Shaw is a full floor line for us: carpet, hardwood, tile, laminate, and waterproof luxury vinyl. We pull from it when one house needs more than one surface to match.",
      placeLabel: "See samples", place: STUDIO, extra: STUDIO_HOURS
    },
    "https://www.mannington.com": {
      id: "mannington", title: "Mannington",
      brief: "Mannington is where we go for hardwood, waterproof luxury vinyl, laminate, and carpet. The Adura vinyl is the line we use when a room has to be waterproof and still look like wood.",
      placeLabel: "See samples", place: STUDIO, extra: STUDIO_HOURS
    },
    "https://www.msisurfaces.com": {
      id: "msi", title: "MSI",
      brief: "MSI supplies the porcelain, natural stone, quartz, and luxury vinyl we use for slabs and large-format floors. The Kent showroom is the local slab yard.",
      placeLabel: "Local showroom", place: "19624 62nd Ave S, Kent, WA 98032"
    },
    "https://www.emser.com": {
      id: "emser", title: "Emser",
      brief: "Emser is a tile and natural stone house: porcelain, ceramic, marble, limestone, travertine, and slate. The Tukwila design showroom is the local stop.",
      placeLabel: "Design showroom", place: "18401 Cascade Ave S, Tukwila, WA 98188"
    },
    "https://www.arizonatile.com": {
      id: "arizona", title: "Arizona Tile",
      brief: "Arizona Tile is a slab and tile yard we use for porcelain, natural stone, and quartz. Their Seattle showroom is on Tukwila International Boulevard.",
      placeLabel: "Seattle showroom", place: "11060 Tukwila International Blvd, Seattle, WA 98168"
    },
    "https://www.bedrosians.com": {
      id: "bedrosians", title: "Bedrosians",
      brief: "Bedrosians is a tile and stone line: porcelain, ceramic, and natural stone for floors, walls, and wet rooms.",
      placeLabel: "See samples", place: STUDIO, extra: STUDIO_HOURS
    },
    "https://www.pentalquartz.com": {
      id: "pental", title: "Pental",
      brief: "Pental is the quartz and porcelain-slab line we specify for counters and full-height walls.",
      placeLabel: "See samples", place: STUDIO, extra: STUDIO_HOURS
    },
    "https://www.floridatile.com": {
      id: "florida", title: "Florida Tile",
      brief: "Florida Tile is a porcelain and ceramic line. We use it when the look is a clean field tile rather than a stone slab.",
      placeLabel: "See samples", place: STUDIO, extra: STUDIO_HOURS
    },
    "https://www.forbo.com": {
      id: "forbo", title: "Forbo",
      brief: "Forbo is the Marmoleum linoleum we specify, plus their vinyl and carpet tile. It is the practical choice when a floor needs to be resilient and quiet.",
      placeLabel: "See samples", place: STUDIO, extra: STUDIO_HOURS
    },
    "https://www.thedixiegroup.com": {
      id: "dixie", title: "Dixie Group",
      brief: "Dixie Group is the mill behind several soft-surface lines we install, including Masland. We use them when the room is carpet.",
      placeLabel: "See samples", place: STUDIO, extra: STUDIO_HOURS
    },
    "https://www.maslandcarpets.com": {
      id: "masland", title: "Masland",
      brief: "Masland is a higher-end carpet we specify for bedrooms, stairs, and quieter rooms. It is a Dixie Group line.",
      placeLabel: "See samples", place: STUDIO, extra: STUDIO_HOURS
    },
    "https://www.dreamweavercarpet.com": {
      id: "dreamweaver", title: "Dreamweaver",
      brief: "Dreamweaver is a soft, solution-dyed carpet we use when a room needs something gentler underfoot than a hard surface.",
      placeLabel: "See samples", place: STUDIO, extra: STUDIO_HOURS
    },
    "https://www.amorim.com": {
      id: "amorim", title: "Amorim",
      brief: "Amorim is the cork flooring we specify, usually through the Wicanders line, when a floor should be warm, quiet, and renewable.",
      placeLabel: "See samples", place: STUDIO, extra: STUDIO_HOURS
    },
    "https://www.aurorahardwood.com": {
      id: "aurora", title: "Aurora Hardwood",
      brief: "Aurora supplies the solid and engineered hardwood we install, and also luxury vinyl and SPC when the same look has to be waterproof.",
      placeLabel: "See samples", place: STUDIO, extra: STUDIO_HOURS
    },
    "https://www.ebbradley.com": {
      id: "bradley", title: "E.B. Bradley",
      brief: "E.B. Bradley is the millwork house we use for mouldings, doors, and trim that have to meet the floor.",
      placeLabel: "See samples", place: STUDIO, extra: STUDIO_HOURS
    },
    "https://www.ghsproducts.com": {
      id: "greenhome", title: "Greenhome Solutions",
      brief: "Greenhome is the earth-friendly yard: cork, Marmoleum, hardened wood, natural carpet, quartz, and cabinetry. We use them when the material itself is the point.",
      placeLabel: "See samples", place: STUDIO, extra: STUDIO_HOURS
    },
    "https://www.piuskb.com": {
      id: "pius", title: "Pius",
      brief: "Pius Kitchen & Bath is a Seattle yard for in-stock wood cabinetry, engineered stone, and natural stone counters. We send people there when the kitchen has to be seen in person.",
      placeLabel: "Seattle showroom", place: "1900 4th Ave S, Seattle, WA 98134",
      extra: "Mon–Fri 8:30 AM–6 PM. Saturday until 5:30 PM. Sunday closed."
    },
    "https://www.kraftersland.com": {
      id: "krafters", title: "Krafter's Land",
      brief: "Krafter's Land stocks cabinets, quartz, natural stone, mosaic tile, and waterproof SPC vinyl. Their Tukwila showroom is the local one we use.",
      placeLabel: "Tukwila showroom", place: "1201 Andover Park E, Suite 103, Tukwila, WA 98188"
    }
  };

  function savedCopy(key, fallback) {
    try {
      var copy = JSON.parse(localStorage.getItem("as-copy") || "{}");
      if (copy[key]) return copy[key];
    } catch (e) {}
    return fallback || "";
  }

  function photoOf(slot) {
    try {
      var v = localStorage.getItem("as-photo-" + slot) || "";
      if (v.indexOf("data:image/") === 0) return v;
    } catch (e) {}
    return "";
  }

  function fullEdit() {
    return sessionStorage.getItem("as-studio-role") === "full" && sessionStorage.getItem("as-studio-on") === "1";
  }

  function saveCopy(key, value) {
    try {
      var copy = JSON.parse(localStorage.getItem("as-copy") || "{}");
      copy[key] = value;
      localStorage.setItem("as-copy", JSON.stringify(copy));
    } catch (e) {}
    var token = sessionStorage.getItem("as-studio-token") || "";
    if (!token) return;
    fetch("/api/copy", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token: token, copy: (function () { var o = {}; o[key] = value; return o; })() })
    }).catch(function () {});
  }

  function savePhoto(slot, photo) {
    try { localStorage.setItem("as-photo-" + slot, photo || "removed"); } catch (e) {}
    var token = sessionStorage.getItem("as-studio-token") || "";
    if (!token) return;
    fetch("/api/photo", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token: token, slot: slot, photo: photo || "" })
    }).catch(function () {});
  }

  var keyHandler = null;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return "&#" + c.charCodeAt(0) + ";";
    });
  }

  function toneOf(text) {
    var raw = String(text || "").toLowerCase();
    if (raw.indexOf("carpet") >= 0 || raw.indexOf("wool") >= 0) return "carpet";
    if (raw.indexOf("lvp") >= 0 || raw.indexOf("vinyl") >= 0) return "lvp";
    if (raw.indexOf("tile") >= 0 || raw.indexOf("porcelain") >= 0) return "tile";
    if (raw.indexOf("stone") >= 0 || raw.indexOf("limestone") >= 0) return "stone";
    if (raw.indexOf("quartz") >= 0) return "quartz";
    if (raw.indexOf("cork") >= 0) return "cork";
    if (raw.indexOf("lino") >= 0) return "linoleum";
    return "hardwood";
  }

  function close() {
    var scrim = document.querySelector("[data-detail]");
    if (scrim) scrim.remove();
    document.body.classList.remove("detail-open");
    if (keyHandler) document.removeEventListener("keydown", keyHandler);
    keyHandler = null;
  }

  function floatFrom(scrim, el) {
    var sheet = scrim.querySelector(".detail-sheet");
    if (!el || !el.getBoundingClientRect || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      requestAnimationFrame(function () { scrim.classList.add("is-in"); });
      return;
    }
    var from = el.getBoundingClientRect();
    var to = sheet.getBoundingClientRect();
    var dx = (from.left + from.width / 2) - (to.left + to.width / 2);
    var dy = (from.top + from.height / 2) - (to.top + to.height / 2);
    var scale = Math.max(0.22, Math.min(from.width / to.width, 0.72));
    sheet.style.transition = "none";
    sheet.style.transform = "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px) scale(" + scale.toFixed(3) + ")";
    requestAnimationFrame(function () {
      scrim.classList.add("is-in");
      sheet.style.transition = "transform 520ms cubic-bezier(.22,1,.36,1)";
      sheet.style.transform = "translate(0,0) scale(1)";
    });
  }

  function open(item) {
    close();
    var photos = [];
    for (var i = 0; i < 5; i++) photos.push(photoOf(item.slots[i]) || item.photos[i] || "");
    var index = 0;
    var scrim = document.createElement("div");
    scrim.className = "detail-scrim";
    scrim.setAttribute("data-detail", "");
    scrim.innerHTML =
      '<div class="detail-sheet" role="dialog" aria-modal="true" aria-label="' + esc(item.title) + '">' +
        '<button class="detail-close" type="button" aria-label="Close">×</button>' +
        '<div class="detail-photo">' +
          '<button class="detail-arrow is-prev" type="button" aria-label="Previous photo">‹</button>' +
          '<div class="detail-frame" data-frame></div>' +
          '<button class="detail-arrow is-next" type="button" aria-label="Next photo">›</button>' +
          '<div class="detail-dots" data-dots></div>' +
        '</div>' +
        '<div class="detail-copy">' +
          '<p class="kicker">' + esc(item.kind) + '</p>' +
          '<h2>' + esc(item.title) + '</h2>' +
          '<div class="detail-specs"></div>' +
          '<p class="detail-brief" data-copy="' + esc(item.copyKey) + '"></p>' +
          '<div class="detail-actions"></div>' +
          '<p class="detail-place"></p>' +
          '<p class="detail-extra"></p>' +
        '</div>' +
      '</div>';
    document.body.appendChild(scrim);
    document.body.classList.add("detail-open");
    floatFrom(scrim, item.fromEl);

    var specs = scrim.querySelector(".detail-specs");
    (item.specs || []).forEach(function (s) {
      var chip = document.createElement("span");
      chip.className = "vendor-spec";
      chip.setAttribute("data-tone", s.tone);
      chip.textContent = s.label;
      specs.appendChild(chip);
    });

    var brief = scrim.querySelector(".detail-brief");
    brief.textContent = savedCopy(item.copyKey, item.brief);
    if (fullEdit()) {
      brief.setAttribute("contenteditable", "true");
      brief.classList.add("studio-text");
      brief.addEventListener("blur", function () { saveCopy(item.copyKey, brief.innerText.trim()); });
    }

    var actions = scrim.querySelector(".detail-actions");
    if (item.site) {
      var link = document.createElement("a");
      link.className = "btn";
      link.href = item.site;
      link.textContent = item.siteLabel || "Show site";
      if (/^https?:/.test(item.site)) {
        link.target = "_blank";
        link.rel = "noreferrer";
      }
      actions.appendChild(link);
    }
    var place = scrim.querySelector(".detail-place");
    if (item.place) {
      var map = "https://maps.google.com/?q=" + encodeURIComponent(item.place);
      place.innerHTML = '<span class="kicker">' + (item.placeLabel || "Showroom") + '</span><a href="' + map + '" target="_blank" rel="noreferrer">' + item.place + '</a>';
    }
    var extra = scrim.querySelector(".detail-extra");
    extra.textContent = item.extra || "";
    if (!item.extra) extra.hidden = true;

    var frame = scrim.querySelector("[data-frame]");
    var dots = scrim.querySelector("[data-dots]");
    function paint() {
      frame.innerHTML = "";
      if (photos[index]) {
        var img = document.createElement("img");
        img.className = "detail-shot";
        img.src = photos[index];
        img.alt = item.title;
        frame.appendChild(img);
      } else {
        var hold = document.createElement("div");
        hold.className = "detail-empty";
        if (item.logo && index === 0) {
          var mark = document.createElement("img");
          mark.src = item.logo;
          mark.alt = "";
          hold.appendChild(mark);
        }
        if (!(item.logo && index === 0)) {
          var word = document.createElement("p");
          word.className = "detail-empty-word";
          word.textContent = item.title;
          hold.appendChild(word);
        }
        var cap = document.createElement("span");
        cap.className = "detail-count";
        cap.textContent = (index + 1) + "  /  5";
        hold.appendChild(cap);
        frame.appendChild(hold);
      }
      if (fullEdit()) {
        var change = document.createElement("button");
        change.type = "button";
        change.className = "detail-upload";
        change.textContent = photos[index] ? "Change photo" : "Add photo";
        frame.appendChild(change);
        var input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.hidden = true;
        frame.appendChild(input);
        change.addEventListener("click", function () { input.click(); });
        input.addEventListener("change", function () {
          var file = input.files && input.files[0];
          if (!file) return;
          var reader = new FileReader();
          reader.onload = function () {
            photos[index] = String(reader.result || "");
            savePhoto(item.slots[index], photos[index]);
            paint();
          };
          reader.readAsDataURL(file);
        });
      }
      dots.querySelectorAll("button").forEach(function (d, n) { d.classList.toggle("is-on", n === index); });
    }
    for (var d = 0; d < 5; d++) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Photo " + (d + 1));
      (function (n) { dot.addEventListener("click", function () { index = n; paint(); }); })(d);
      dots.appendChild(dot);
    }
    function step(dir) { index = (index + dir + 5) % 5; paint(); }
    scrim.querySelector(".is-prev").addEventListener("click", function () { step(-1); });
    scrim.querySelector(".is-next").addEventListener("click", function () { step(1); });
    var dragX = null;
    frame.addEventListener("pointerdown", function (e) {
      if (e.target.closest("button, a, input")) return;
      dragX = e.clientX;
    });
    frame.addEventListener("pointerup", function (e) {
      if (dragX == null) return;
      var dx = e.clientX - dragX;
      dragX = null;
      if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
    });
    paint();

    scrim.querySelector(".detail-close").addEventListener("click", close);
    scrim.addEventListener("click", function (e) { if (e.target === scrim) close(); });
    keyHandler = function (e) {
      if (!document.querySelector("[data-detail]")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", keyHandler);
  }

  function specsFrom(card) {
    return Array.prototype.map.call(card.querySelectorAll(".vendor-spec"), function (s) {
      return { tone: s.getAttribute("data-tone") || "", label: s.textContent.trim() };
    });
  }

  function slots(prefix) {
    return [1, 2, 3, 4, 5].map(function (n) { return prefix + "-" + n; });
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest(".detail-sheet")) return;
    var vendor = e.target.closest(".vendor-grid .vendor-card");
    if (vendor) {
      e.preventDefault();
      var href = vendor.getAttribute("href") || "";
      var info = VENDORS[href] || { id: "vendor", title: vendor.querySelector("span:last-child").textContent.trim(), brief: "" };
      var mark = vendor.querySelector(".vendor-mark img");
      open({
        kind: "Vendor",
        title: info.title,
        brief: info.brief,
        copyKey: "vendor-" + info.id,
        specs: specsFrom(vendor),
        site: href,
        siteLabel: "Show site",
        placeLabel: info.placeLabel,
        place: info.place,
        extra: info.extra || "",
        slots: slots("vendor-" + info.id),
        photos: [],
        logo: mark ? mark.getAttribute("src") : "",
        fromEl: vendor
      });
      return;
    }
    if (e.target.closest("a, button")) return;
    var remnant = e.target.closest("[data-remnants] .shop-card");
    if (remnant) {
      var rec = (window.ASCatalog && window.ASCatalog.remnants || []).filter(function (r) { return r.id === remnant.getAttribute("data-id"); })[0] || {};
      var title = rec.title || remnant.querySelector("h2, h3") && remnant.querySelector("h2, h3").textContent || "Remnant";
      open({
        kind: "Remnant",
        title: title,
        brief: rec.detail || rec.blurb || "A leftover lot on the Lynnwood rack. Inquire if you want it held.",
        copyKey: "remnant-" + (rec.id || "lot"),
        specs: [{ tone: remnant.getAttribute("data-surface") || toneOf(title), label: ((remnant.querySelector(".shop-badge") || {}).textContent || "").trim() }].filter(function (s) { return s.label; }),
        site: "/quote?remnant=" + encodeURIComponent(rec.id || ""),
        siteLabel: "Inquire",
        placeLabel: "On the rack",
        place: STUDIO,
        extra: [rec.qty || rec.size || "", rec.status === "hold" ? "Currently on hold" : "", STUDIO_HOURS].filter(Boolean).join(" · "),
        slots: slots("remnant-" + (rec.id || "lot")),
        photos: rec.photo && String(rec.photo).indexOf("data:image/") === 0 ? [rec.photo] : [],
        fromEl: remnant
      });
      return;
    }
    var job = e.target.closest("[data-jobs] .shop-card");
    if (job) {
      e.preventDefault();
      var item = (window.ASCatalog && window.ASCatalog.jobs || []).filter(function (j) { return j.id === job.getAttribute("data-id"); })[0] || {};
      var name = item.caption || item.title || (job.querySelector("h2, h3") && job.querySelector("h2, h3").textContent) || "Recent job";
      var bits = [item.material, item.year].filter(Boolean).join(" · ");
      open({
        kind: "Recent job",
        title: name,
        brief: item.blurb || item.detail || (name + (item.location ? " in " + item.location : "") + "."),
        copyKey: "job-" + (item.id || "job"),
        specs: item.material ? [{ tone: toneOf(item.material), label: item.material }] : [],
        site: "/quote",
        siteLabel: "Get a quote",
        placeLabel: item.location ? "Neighborhood" : "Studio",
        place: item.location ? item.location + ", Washington" : STUDIO,
        extra: bits ? bits + ". Similar work starts at the Lynnwood studio." : STUDIO_HOURS,
        slots: slots("job-" + (item.id || "job")),
        photos: item.photo && String(item.photo).indexOf("data:image/") === 0 ? [item.photo] : [],
        fromEl: job
      });
    }
  });

  window.ASDetail = { open: open, close: close };
})();
