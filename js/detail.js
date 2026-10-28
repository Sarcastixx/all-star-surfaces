(function () {
  var STUDIO = "ALLSTAR studio, 18000 Hwy 99, Lynnwood, WA 98037";
  var STUDIO_HOURS = "Mon–Fri 9 AM–4 PM. After hours by appointment.";

  function shots(id, n) {
    var list = [];
    for (var i = 1; i <= n; i++) list.push("/images/vendors/shots/" + id + "-" + i + ".jpg");
    return list;
  }

  var VENDORS = {
    "https://www.daltile.com": {
      id: "daltile", title: "Daltile",
      brief: "Daltile makes porcelain, ceramic, natural stone, quartz, and luxury vinyl, and is known for large-format tile. The Seattle showroom is in Georgetown.",
      placeLabel: "Seattle showroom", place: "540 S Front St, Seattle, WA 98108",
      photos: shots("daltile", 3)
    },
    "https://www.mohawkflooring.com": {
      id: "mohawk", title: "Mohawk",
      brief: "Mohawk is a major flooring manufacturer with carpet, hardwood, luxury vinyl, tile, and laminate, including waterproof vinyl for kitchens and basements.",
      placeLabel: "Samples held here", place: STUDIO, extra: STUDIO_HOURS
    },
    "https://shawfloors.com": {
      id: "shaw", title: "Shaw",
      brief: "Shaw Floors makes carpet, hardwood, tile, laminate, and waterproof luxury vinyl, often used when one home needs several surfaces that still belong together.",
      placeLabel: "Samples held here", place: STUDIO, extra: STUDIO_HOURS,
      photos: shots("shaw", 3)
    },
    "https://www.mannington.com": {
      id: "mannington", title: "Mannington",
      brief: "Mannington makes hardwood, waterproof luxury vinyl (including the Adura line), laminate, and carpet.",
      placeLabel: "Samples held here", place: STUDIO, extra: STUDIO_HOURS,
      photos: shots("mannington", 3)
    },
    "https://www.msisurfaces.com": {
      id: "msi", title: "MSI",
      brief: "MSI supplies porcelain, natural stone, quartz, and luxury vinyl for slabs and large-format floors. A local slab showroom is in Kent.",
      placeLabel: "Kent showroom", place: "19624 62nd Ave S, Kent, WA 98032",
      photos: shots("msi", 3)
    },
    "https://www.emser.com": {
      id: "emser", title: "Emser",
      brief: "Emser is a tile and natural stone company, with porcelain, ceramic, marble, limestone, travertine, and slate. The design showroom is in Tukwila.",
      placeLabel: "Design showroom", place: "18401 Cascade Ave S, Tukwila, WA 98188"
    },
    "https://www.arizonatile.com": {
      id: "arizona", title: "Arizona Tile",
      brief: "Arizona Tile is a slab and tile yard for porcelain, natural stone, and quartz. The Seattle showroom is on Tukwila International Boulevard.",
      placeLabel: "Seattle showroom", place: "11060 Tukwila International Blvd, Seattle, WA 98168"
    },
    "https://www.bedrosians.com": {
      id: "bedrosians", title: "Bedrosians",
      brief: "Bedrosians is a tile and stone showroom with porcelain, ceramic, and natural stone, plus a slab yard. The Seattle store is on 6th Avenue South.",
      placeLabel: "Seattle showroom", place: "5930 6th Ave S, Seattle, WA 98108",
      extra: "Showroom and slab yard.",
      photos: shots("bedrosians", 3)
    },
    "https://www.pentalquartz.com": {
      id: "pental", title: "Pental",
      brief: "Pental Quartz makes engineered stone and porcelain slabs used for counters and full-height walls.",
      placeLabel: "Samples held here", place: STUDIO, extra: STUDIO_HOURS,
      photos: shots("pental", 3)
    },
    "https://www.floridatile.com": {
      id: "florida", title: "Florida Tile",
      brief: "Florida Tile makes porcelain and ceramic tile, including field tile for clean, simple floors and walls.",
      placeLabel: "Samples held here", place: STUDIO, extra: STUDIO_HOURS,
      photos: shots("florida", 3)
    },
    "https://www.forbo.com": {
      id: "forbo", title: "Forbo",
      brief: "Forbo makes Marmoleum linoleum, plus vinyl and carpet tile. The floors are known for being resilient and quiet underfoot.",
      placeLabel: "Samples held here", place: STUDIO, extra: STUDIO_HOURS,
      photos: shots("forbo", 3)
    },
    "https://www.thedixiegroup.com": {
      id: "dixie", title: "Dixie Group",
      brief: "The Dixie Group is a soft-surface mill behind several carpet lines, including Masland and Dixie Home.",
      placeLabel: "Samples held here", place: STUDIO, extra: STUDIO_HOURS
    },
    "https://www.maslandcarpets.com": {
      id: "masland", title: "Masland",
      brief: "Masland makes higher-end carpet for bedrooms, stairs, and quieter rooms. It is a Dixie Group brand.",
      placeLabel: "Samples held here", place: STUDIO, extra: STUDIO_HOURS,
      photos: shots("masland", 3)
    },
    "https://www.dreamweavercarpet.com": {
      id: "dreamweaver", title: "Dreamweaver",
      brief: "Dreamweaver makes soft, solution-dyed carpet meant to feel gentler underfoot than a hard surface.",
      placeLabel: "Samples held here", place: STUDIO, extra: STUDIO_HOURS
    },
    "https://www.amorim.com": {
      id: "amorim", title: "Amorim",
      brief: "Amorim is a cork company. The Wicanders flooring line is warm, quiet, and made from renewable bark.",
      placeLabel: "Samples held here", place: STUDIO, extra: STUDIO_HOURS,
      photos: shots("amorim", 1)
    },
    "https://www.aurorahardwood.com": {
      id: "aurora", title: "Aurora Hardwood",
      brief: "Aurora Hardwood supplies solid and engineered hardwood, and also luxury vinyl and SPC when the same look needs to be waterproof.",
      placeLabel: "Samples held here", place: STUDIO, extra: STUDIO_HOURS
    },
    "https://www.ebbradley.com": {
      id: "bradley", title: "E.B. Bradley",
      brief: "E.B. Bradley supplies millwork, mouldings, doors, cabinet hardware, and trim.",
      placeLabel: "Samples held here", place: STUDIO, extra: STUDIO_HOURS,
      photos: shots("bradley", 3)
    },
    "https://www.ghsproducts.com": {
      id: "greenhome", title: "Greenhome Solutions",
      brief: "Greenhome Solutions carries earth-friendly materials: cork, Marmoleum, hardened wood, natural carpet, quartz, and cabinetry.",
      placeLabel: "Samples held here", place: STUDIO, extra: STUDIO_HOURS
    },
    "https://www.piuskb.com": {
      id: "pius", title: "Pius",
      brief: "Pius Kitchen & Bath is a Seattle showroom for in-stock wood cabinetry, engineered stone, and natural stone counters.",
      placeLabel: "Seattle showroom", place: "1900 4th Ave S, Seattle, WA 98134",
      extra: "Mon–Fri 8:30 AM–6 PM. Saturday until 5:30 PM. Sunday closed."
    },
    "https://www.kraftersland.com": {
      id: "krafters", title: "Krafter's Land",
      brief: "Krafter's Land is a Tukwila showroom for cabinets, quartz, natural stone, mosaic tile, and waterproof SPC vinyl.",
      placeLabel: "Tukwila showroom", place: "1201 Andover Park E, Suite 103, Tukwila, WA 98188",
      photos: shots("krafters", 3)
    }
  };


  function savedCopy(key, fallback) {
    try {
      var copy = JSON.parse(localStorage.getItem("as-copy") || "{}");
      if (copy[key]) return copy[key];
    } catch (e) {}
    return fallback || "";
  }

  function photoOf(slot, fallback) {
    try {
      var v = localStorage.getItem("as-photo-" + slot);
      if (v === "removed") return "";
      if (v && v.indexOf("data:image/") === 0) return v;
    } catch (e) {}
    return fallback || "";
  }

  function phaseOf(slot) {
    try {
      var copy = JSON.parse(localStorage.getItem("as-copy") || "{}");
      if (Object.prototype.hasOwnProperty.call(copy, "phase-" + slot)) return copy["phase-" + slot] || "";
    } catch (e) {}
    return "";
  }

  function bindText(el, key, fallback) {
    el.textContent = savedCopy(key, fallback);
    if (!fullEdit()) return;
    el.setAttribute("contenteditable", "true");
    el.setAttribute("spellcheck", "true");
    el.classList.add("studio-text");
    el.addEventListener("blur", function () { saveCopy(key, el.innerText.trim()); });
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
    for (var i = 0; i < 5; i++) photos.push(photoOf(item.slots[i], (item.photos || [])[i] || ""));
    var index = 0;
    var scrim = document.createElement("div");
    scrim.className = "detail-scrim";
    scrim.setAttribute("data-detail", "");
    scrim.innerHTML =
      '<div class="detail-sheet' + (item.simple ? " is-simple" : "") + '" role="dialog" aria-modal="true" aria-label="' + esc(item.title) + '">' +
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
    bindText(brief, item.copyKey, item.brief);

    var actions = scrim.querySelector(".detail-actions");
    if (item.hold) {
      var holdRow = document.createElement("div");
      holdRow.className = "detail-hold";
      var holdChip = document.createElement("span");
      holdChip.className = "vendor-spec";
      holdChip.setAttribute("data-tone", "earth");
      bindText(holdChip, item.copyKey + "-hold", "We hold these samples");
      var book = document.createElement("a");
      book.className = "btn ghost";
      book.href = "/appointment";
      book.textContent = "Book a showroom visit";
      holdRow.appendChild(holdChip);
      holdRow.appendChild(book);
      actions.parentNode.insertBefore(holdRow, actions);
    }
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
      var label = document.createElement("span");
      label.className = "kicker";
      bindText(label, item.copyKey + "-label", item.placeLabel || "Showroom");
      var addr = document.createElement("span");
      bindText(addr, item.copyKey + "-place", item.place);
      var map = document.createElement("a");
      map.target = "_blank";
      map.rel = "noreferrer";
      map.textContent = "Map";
      function syncMap() {
        map.href = "https://maps.google.com/?q=" + encodeURIComponent(addr.textContent.trim() || item.place);
      }
      syncMap();
      addr.addEventListener("blur", syncMap);
      place.appendChild(label);
      place.appendChild(addr);
      place.appendChild(map);
    }
    var extra = scrim.querySelector(".detail-extra");
    if (item.extra) bindText(extra, item.copyKey + "-extra", item.extra);
    else extra.hidden = true;

    var frame = scrim.querySelector("[data-frame]");
    var dots = scrim.querySelector("[data-dots]");
    function shown() {
      if (fullEdit()) return 5;
      var n = 0;
      photos.forEach(function (ph, i) { if (ph) n = i + 1; });
      return Math.max(1, n);
    }
    function paint() {
      var total = shown();
      if (index >= total) index = 0;
      frame.innerHTML = "";
      if (photos[index]) {
        var img = document.createElement("img");
        img.className = "detail-shot";
        img.src = photos[index];
        img.alt = item.title;
        img.addEventListener("error", function () {
          photos[index] = "";
          paint();
        });
        frame.appendChild(img);
      } else {
        var empty = document.createElement("div");
        empty.className = "detail-empty";
        if (item.logo && index === 0 && !item.simple) {
          var mark = document.createElement("img");
          mark.src = item.logo;
          mark.alt = "";
          empty.appendChild(mark);
        }
        var cap = document.createElement("span");
        cap.className = "detail-count";
        cap.textContent = (index + 1) + "  /  " + total;
        empty.appendChild(cap);
        frame.appendChild(empty);
      }
      var phase = item.simple ? phaseOf(item.slots[index]) : "";
      if (phase === "before" || phase === "after") {
        var bubble = document.createElement("span");
        bubble.className = "vendor-spec phase-bubble";
        bubble.setAttribute("data-tone", phase === "before" ? "hardwood" : "earth");
        bubble.textContent = phase === "before" ? "Before" : "After";
        frame.appendChild(bubble);
      }
      if (fullEdit()) {
        var tools = document.createElement("div");
        tools.className = "detail-edits";
        var change = document.createElement("button");
        change.type = "button";
        change.textContent = photos[index] ? "Change photo" : "Add photo";
        var remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "Remove";
        var input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.hidden = true;
        tools.appendChild(change);
        if (photos[index]) tools.appendChild(remove);
        if (item.simple) {
          ["before", "after"].forEach(function (name) {
            var pick = document.createElement("button");
            pick.type = "button";
            pick.className = "phase-pick" + (phase === name ? " is-on" : "");
            pick.setAttribute("data-phase", name);
            pick.textContent = name === "before" ? "Before" : "After";
            pick.addEventListener("click", function () {
              saveCopy("phase-" + item.slots[index], phase === name ? "" : name);
              paint();
            });
            tools.appendChild(pick);
          });
        }
        frame.appendChild(tools);
        frame.appendChild(input);
        change.addEventListener("click", function () { input.click(); });
        remove.addEventListener("click", function () {
          photos[index] = "";
          savePhoto(item.slots[index], "");
          paint();
        });
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
      dots.innerHTML = "";
      var prev = scrim.querySelector(".is-prev");
      var next = scrim.querySelector(".is-next");
      if (prev) prev.hidden = total < 2;
      if (next) next.hidden = total < 2;
      for (var d = 0; d < total; d++) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", "Photo " + (d + 1));
        dot.classList.toggle("is-on", d === index);
        (function (n) { dot.addEventListener("click", function () { index = n; paint(); }); })(d);
        dots.appendChild(dot);
      }
    }
    function step(dir) {
      var total = shown();
      index = (index + dir + total) % total;
      paint();
    }
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
        photos: info.photos || [],
        hold: true,
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
        simple: true,
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
        simple: true,
        fromEl: job
      });
    }
  });

  window.ASDetail = { open: open, close: close };
})();
