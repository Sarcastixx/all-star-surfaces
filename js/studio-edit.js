(function () {
  var TOKEN = "as-studio-token";
  var ROLE = "as-studio-role";
  var ON = "as-studio-on";

  function token() { return sessionStorage.getItem(TOKEN) || ""; }
  function role() { return sessionStorage.getItem(ROLE) || ""; }
  function isOn() { return sessionStorage.getItem(ON) === "1"; }
  function isFull() { return role() === "full"; }
  function isStaff() { return role() === "full" || role() === "update"; }

  function esc(s) {
    return String(s || "").replace(/[&"<>]/g, function (ch) {
      if (ch === "&") return "&#38;";
      if (ch === '"') return "&#34;";
      if (ch === "<") return "&#60;";
      return "&#62;";
    });
  }

  async function api(path, body) {
    var res = await fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    });
    var data = {};
    try { data = await res.json(); } catch (e) {}
    if (!res.ok) throw new Error(data.error || "Could not save");
    return data;
  }

  async function readPhoto(file) {
    var bmp = await createImageBitmap(file);
    var max = 1400;
    var scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    var canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bmp.width * scale));
    canvas.height = Math.max(1, Math.round(bmp.height * scale));
    canvas.getContext("2d").drawImage(bmp, 0, 0, canvas.width, canvas.height);
    var q = 0.72;
    var data = canvas.toDataURL("image/jpeg", q);
    while (data.length > 700000 && q > 0.4) {
      q -= 0.08;
      data = canvas.toDataURL("image/jpeg", q);
    }
    if (data.length > 900000) throw new Error("That photo is still too large.");
    return data;
  }

  function toast(msg) {
    var n = document.querySelector("[data-studio-toast]");
    if (!n) return;
    n.textContent = msg;
    n.hidden = false;
    window.clearTimeout(toast._t);
    toast._t = window.setTimeout(function () { n.hidden = true; }, 2200);
  }

  function closeModal() {
    var m = document.querySelector("[data-studio-modal]");
    if (m) m.remove();
  }

  async function saveOne(key, value) {
    await api("/api/copy", { token: token(), copy: (function () {
      var o = {}; o[key] = value; return o;
    })() });
    try {
      var copy = JSON.parse(localStorage.getItem("as-copy") || "{}");
      copy[key] = value;
      localStorage.setItem("as-copy", JSON.stringify(copy));
    } catch (err) {}
  }

  function copyTargets() {
    var main = document.querySelector("main");
    if (!main) return [];
    var nodes = main.querySelectorAll("h1, h2, h3, p, .lede, .kicker, figcaption, .quote-card-brand, [data-copy]");
    var out = [];
    nodes.forEach(function (el) {
      if (el.closest("form, button, .studio-bar, .studio-modal, .shop-grid, [data-jobs], [data-remnants], a.btn, .nav, header.site-header")) return;
      if (el.matches("a")) return;
      if (!el.getAttribute("data-copy") && !String(el.textContent || "").trim()) return;
      out.push(el);
    });
    document.querySelectorAll(".home-tiles span, [data-copy]").forEach(function (el) {
      if (out.indexOf(el) < 0) out.push(el);
    });
    return out;
  }

  function markEditable() {
    if (!isFull()) return;
    var n = 0;
    copyTargets().forEach(function (el) {
      var key = el.getAttribute("data-copy");
      if (!key) {
        n += 1;
        key = (location.pathname.replace(/\W+/g, "-") || "home") + "-" + el.tagName.toLowerCase() + "-" + n;
        el.setAttribute("data-copy", key);
      }
      el.setAttribute("contenteditable", "true");
      el.setAttribute("spellcheck", "true");
      el.classList.add("studio-text");
      if (el._asBound) return;
      el._asBound = true;
      el.addEventListener("blur", function () {
        saveOne(key, el.innerText.trim()).then(function () {
          toast("Saved");
        }).catch(function (err) {
          toast(err.message || "Could not save");
        });
      });
    });

    document.querySelectorAll("[data-slot]").forEach(function (img) {
      if (img.classList.contains("hero-slide")) return;
      if (img.closest("[data-photo-edit], [data-jobs], [data-remnants]")) return;
      var wrap = document.createElement("span");
      wrap.setAttribute("data-photo-edit", "");
      wrap.className = "studio-photo";
      img.parentNode.insertBefore(wrap, img);
      wrap.appendChild(img);
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "studio-photo-btn";
      btn.textContent = "Change photo";
      wrap.appendChild(btn);
      var input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.setAttribute("capture", "environment");
      input.hidden = true;
      document.body.appendChild(input);
      function stop(e) {
        e.preventDefault();
        e.stopPropagation();
      }
      wrap.addEventListener("click", function (e) {
        stop(e);
        input.click();
      }, true);
      btn.addEventListener("click", function (e) {
        stop(e);
        input.click();
      }, true);
      var link = wrap.closest("a");
      if (link) {
        link.setAttribute("data-studio-locked", "");
        link.addEventListener("click", function (e) {
          stop(e);
        }, true);
      }
      input.addEventListener("change", async function () {
        var file = input.files && input.files[0];
        input.value = "";
        if (!file) return;
        try {
          var photo = await readPhoto(file);
          var slot = img.getAttribute("data-slot");
          document.querySelectorAll('[data-slot="' + slot + '"]').forEach(function (node) {
            node.setAttribute("src", photo);
          });
          try { localStorage.setItem("as-photo-" + slot, photo); } catch (err) {}
          await api("/api/photo", { token: token(), slot: slot, photo: photo });
          toast("Photo saved");
        } catch (ex) {
          toast(ex.message || "Could not save photo");
        }
      });
    });
  }

  function remnantTools() {
    var root = document.querySelector("[data-remnants]");
    if (!root || root.querySelector("[data-add-remnant]")) return;
    var add = document.createElement("button");
    add.type = "button";
    add.className = "btn studio-add";
    add.setAttribute("data-add-remnant", "");
    add.textContent = "Add a remnant";
    root.parentNode.insertBefore(add, root);
    add.addEventListener("click", function () { remnantForm(); });
    root.querySelectorAll(".shop-card").forEach(function (card) {
      if (card.querySelector("[data-del-rem]")) return;
      var id = card.getAttribute("data-id");
      var row = document.createElement("div");
      row.className = "studio-row";
      row.innerHTML = '<button type="button" class="btn ghost" data-edit-rem>Edit</button><button type="button" class="btn ghost" data-del-rem>Remove</button>';
      (card.querySelector(".shop-body") || card).appendChild(row);
      row.querySelector("[data-del-rem]").addEventListener("click", async function () {
        if (!window.confirm("Remove this remnant?")) return;
        await api("/api/remnant/delete", { token: token(), id: id });
        card.remove();
        toast("Removed");
      });
      row.querySelector("[data-edit-rem]").addEventListener("click", function () {
        remnantForm({
          id: id,
          title: (card.querySelector("h2") || {}).textContent || "",
          surface: card.getAttribute("data-surface") || "hardwood",
          qty: ((card.querySelector(".shop-meta") || {}).textContent || "").split("·")[1] || "",
          detail: (card.querySelector(".lede") || {}).textContent || "",
          photo: (card.querySelector("img") || {}).src || ""
        });
      });
    });
  }

  function remnantForm(item) {
    item = item || {};
    closeModal();
    var wrap = document.createElement("div");
    wrap.className = "studio-modal";
    wrap.setAttribute("data-studio-modal", "");
    wrap.innerHTML =
      '<form class="studio-card" data-rem-form>' +
      "<h2>" + (item.id ? "Edit remnant" : "Add remnant") + "</h2>" +
      '<label>Title<input name="title" required value="' + esc(item.title) + '"></label>' +
      '<label>Surface<select name="surface">' +
      ["hardwood", "tile", "carpet", "lvp"].map(function (s) {
        return '<option value="' + s + '"' + (item.surface === s ? " selected" : "") + ">" + s + "</option>";
      }).join("") +
      "</select></label>" +
      '<label>Quantity<input name="qty" value="' + esc((item.qty || "").trim()) + '"></label>' +
      '<label>Notes<textarea name="detail">' + esc(item.detail) + "</textarea></label>" +
      '<label>Photo<input type="file" name="photo" accept="image/*"></label>' +
      '<button class="btn" type="submit">Save</button>' +
      '<button class="btn ghost" type="button" data-studio-cancel>Cancel</button></form>';
    document.body.appendChild(wrap);
    wrap.querySelector("[data-studio-cancel]").addEventListener("click", closeModal);
    var form = wrap.querySelector("[data-rem-form]");
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      var btn = form.querySelector("[type=submit]");
      btn.disabled = true;
      try {
        var photo = item.photo || "";
        if (form.photo.files[0]) photo = await readPhoto(form.photo.files[0]);
        await api("/api/remnant", {
          token: token(),
          item: {
            id: item.id,
            title: form.title.value,
            surface: form.surface.value,
            qty: form.qty.value,
            detail: form.detail.value,
            photo: photo
          }
        });
        closeModal();
        toast("Saved");
        window.location.reload();
      } catch (ex) {
        btn.disabled = false;
        toast(ex.message || "Could not save");
      }
    });
  }

  function jobTools() {
    var root = document.querySelector("[data-jobs]");
    if (!root || root.hasAttribute("data-featured") || root.querySelector("[data-add-job]")) return;
    var add = document.createElement("button");
    add.type = "button";
    add.className = "btn studio-add";
    add.setAttribute("data-add-job", "");
    add.textContent = "Add a job";
    root.parentNode.insertBefore(add, root);
    add.addEventListener("click", function () { jobForm(); });
    root.querySelectorAll(".shop-card").forEach(function (card) {
      if (card.querySelector("[data-del-job]")) return;
      var id = card.getAttribute("data-id");
      var row = document.createElement("div");
      row.className = "studio-row";
      row.innerHTML = '<button type="button" class="btn ghost" data-edit-job>Edit</button><button type="button" class="btn ghost" data-del-job>Remove</button>';
      (card.querySelector(".shop-body") || card).appendChild(row);
      row.querySelector("[data-del-job]").addEventListener("click", async function () {
        if (!window.confirm("Remove this job?")) return;
        await api("/api/job/delete", { token: token(), id: id });
        card.remove();
        toast("Removed");
      });
      row.querySelector("[data-edit-job]").addEventListener("click", function () {
        jobForm({
          id: id,
          caption: (card.querySelector("h2, h3") || {}).textContent || "",
          photo: (card.querySelector("img") || {}).src || ""
        });
      });
    });
  }

  function jobForm(item) {
    item = item || {};
    closeModal();
    var wrap = document.createElement("div");
    wrap.className = "studio-modal";
    wrap.setAttribute("data-studio-modal", "");
    wrap.innerHTML =
      '<form class="studio-card" data-job-form>' +
      "<h2>" + (item.id ? "Edit job" : "Add a job") + "</h2>" +
      '<label>Caption<input name="caption" required value="' + esc(item.caption) + '"></label>' +
      '<label>Photo<input type="file" name="photo" accept="image/*"' + (item.photo ? "" : " required") + "></label>" +
      '<button class="btn" type="submit">Save</button>' +
      '<button class="btn ghost" type="button" data-studio-cancel>Cancel</button></form>';
    document.body.appendChild(wrap);
    wrap.querySelector("[data-studio-cancel]").addEventListener("click", closeModal);
    var form = wrap.querySelector("[data-job-form]");
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      var btn = form.querySelector("[type=submit]");
      btn.disabled = true;
      try {
        var photo = item.photo || "";
        if (form.photo.files[0]) photo = await readPhoto(form.photo.files[0]);
        if (!photo) throw new Error("Add a photo");
        await api("/api/job", {
          token: token(),
          item: { id: item.id, caption: form.caption.value, photo: photo, featured: true }
        });
        closeModal();
        toast("Saved");
        window.location.reload();
      } catch (ex) {
        btn.disabled = false;
        toast(ex.message || "Could not save");
      }
    });
  }

  function bar() {
    if (document.querySelector("[data-studio-bar]")) return;
    var el = document.createElement("div");
    el.className = "studio-bar";
    el.setAttribute("data-studio-bar", "");
    var label = isFull() ? "Full edit" : "Update remnants & jobs";
    el.innerHTML =
      "<span>" + label + "</span>" +
      '<span data-studio-toast hidden></span>' +
      (isFull()
        ? '<input data-sheet-url placeholder="Paste Google Web app URL" style="flex:1;min-width:180px;max-width:360px;min-height:40px;border-radius:999px;border:0;padding:0 14px">' +
          '<button type="button" class="btn ghost" data-sheet-save>Save leads</button>'
        : "") +
      '<a class="btn ghost" href="/remnants">Remnants</a><a class="btn ghost" href="/portfolio">Jobs</a>' +
      '<button type="button" class="btn ghost" data-studio-out>Done</button>';
    document.body.appendChild(el);
    el.querySelector("[data-studio-out]").addEventListener("click", function () {
      sessionStorage.removeItem(TOKEN);
      sessionStorage.removeItem(ROLE);
      sessionStorage.removeItem(ON);
      window.location.reload();
    });
    var sheetInput = el.querySelector("[data-sheet-url]");
    var sheetSave = el.querySelector("[data-sheet-save]");
    if (sheetInput) {
      fetch("/api/catalog").then(function (r) { return r.json(); }).then(function (d) {
        if (d && d.copy && d.copy.sheetWebhook) sheetInput.value = d.copy.sheetWebhook;
      }).catch(function () {});
    }
    if (sheetSave && sheetInput) {
      sheetSave.addEventListener("click", function () {
        var url = sheetInput.value.trim();
        saveOne("sheetWebhook", url).then(function () {
          window.AS_SHEET_WEBHOOK = url;
          toast("Leads sheet saved");
        }).catch(function (err) { toast(err.message || "Could not save"); });
      });
    }
  }

  function enable() {
    if (!isStaff()) return;
    sessionStorage.setItem(ON, "1");
    document.documentElement.classList.add("is-studio");
    document.documentElement.setAttribute("data-studio-role", role());
    bar();
    if (isFull()) markEditable();
    remnantTools();
    jobTools();
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-photo-edit], .studio-photo-btn")) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  }

  document.addEventListener("as-catalog-ready", function () {
    if (isOn() && isStaff()) {
      remnantTools();
      jobTools();
    }
  });

  if (isOn() && isStaff()) enable();
})();
