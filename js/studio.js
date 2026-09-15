(function () {
  var TOKEN = "as-studio-token";
  var SURFACES = [
    ["hardwood", "Hardwood"],
    ["tile", "Tile"],
    ["carpet", "Carpet"],
    ["lvp", "LVP"]
  ];
  var SLOTS = [
    ["hero", "Homepage hero"],
    ["stone", "Homepage — stone tile"],
    ["hardwood", "Homepage — hardwood tile"],
    ["mineral", "Homepage — mineral tile"],
    ["rooms", "Homepage — rooms tile"]
  ];

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  async function readPhoto(file) {
    var bmp = await createImageBitmap(file);
    var max = 1200;
    var scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    var canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bmp.width * scale));
    canvas.height = Math.max(1, Math.round(bmp.height * scale));
    canvas.getContext("2d").drawImage(bmp, 0, 0, canvas.width, canvas.height);
    var data = canvas.toDataURL("image/jpeg", 0.7);
    if (data.length > 350000) throw new Error("That photo is still too large. Try a smaller JPG.");
    return data;
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

  async function loadCatalog() {
    var res = await fetch("/api/catalog");
    if (!res.ok) throw new Error("Catalog is not live yet. After Cloudflare deploys this version, Studio can save.");
    return res.json();
  }

  var token = sessionStorage.getItem(TOKEN) || "";
  var login = $("[data-login]");
  var desk = $("[data-desk]");
  var err = $("[data-login-error]");

  function showDesk() {
    login.hidden = true;
    desk.hidden = false;
    render();
  }

  login.addEventListener("submit", async function (e) {
    e.preventDefault();
    err.hidden = true;
    try {
      var result = await api("/api/login", { pin: login.pin.value });
      if (!result.ok) throw new Error("That password did not match.");
      token = result.token;
      sessionStorage.setItem(TOKEN, token);
      showDesk();
    } catch (ex) {
      err.hidden = false;
      err.textContent = ex.message || "That password did not match.";
    }
  });

  $("[data-out]").addEventListener("click", function () {
    sessionStorage.removeItem(TOKEN);
    token = "";
    login.hidden = false;
    desk.hidden = true;
  });

  $$("[data-tab]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      $$("[data-tab]").forEach(function (b) { b.classList.toggle("is-on", b === btn); });
      $$("[data-pane]").forEach(function (p) { p.hidden = p.getAttribute("data-pane") !== btn.getAttribute("data-tab"); });
    });
  });

  function field(label, html) {
    return "<label>" + label + html + "</label>";
  }

  async function render() {
    var data;
    try { data = await loadCatalog(); }
    catch (ex) {
      $("[data-pane=remnants]").innerHTML = "<p class='lede'>" + ex.message + "</p>";
      return;
    }
    var remnants = data.remnants || [];
    var jobs = data.jobs || [];
    var photos = data.photos || {};

    $("[data-pane=remnants]").innerHTML =
      '<div class="split">' +
        '<form data-rem-form class="card form" style="padding:24px">' +
          "<h2>Add a remnant</h2>" +
          field("Surface", '<select name="surface">' + SURFACES.map(function (s) {
            return '<option value="' + s[0] + '">' + s[1] + "</option>";
          }).join("") + "</select>") +
          field("Title", '<input name="title" required>') +
          field("Quantity", '<input name="qty" placeholder="e.g. ~80 sq ft">') +
          field("Notes", '<textarea name="detail"></textarea>') +
          field("Photo", '<input type="file" name="photo" accept="image/*">') +
          '<input type="hidden" name="id">' +
          '<input type="hidden" name="photoUrl">' +
          '<img data-rem-preview alt="" hidden style="height:140px;width:100%;object-fit:cover;border-radius:18px">' +
          '<p data-rem-err class="lede" hidden></p>' +
          '<button class="btn" type="submit">Add remnant</button>' +
        "</form>" +
        '<div>' + remnants.map(function (r) {
          return '<article class="card" style="margin-bottom:12px">' +
            (r.photo ? '<img src="' + r.photo + '" alt="" style="height:120px;width:100%;object-fit:cover;border-radius:18px">' : "") +
            '<p class="kicker">' + (r.surface || "") + "</p>" +
            "<h3>" + (r.title || "") + "</h3>" +
            '<p class="lede">' + (r.qty || "") + "</p>" +
            '<div style="display:flex;gap:8px;margin-top:8px">' +
              '<button type="button" class="btn ghost" data-edit-rem="' + r.id + '">Edit</button>' +
              '<button type="button" class="btn ghost" data-del-rem="' + r.id + '">Remove</button>' +
            "</div></article>";
        }).join("") + "</div></div>";

    $("[data-pane=jobs]").innerHTML =
      '<div class="split">' +
        '<form data-job-form class="card form" style="padding:24px">' +
          "<h2>Add a recent job</h2>" +
          field("Caption", '<input name="caption" required>') +
          field("Photo", '<input type="file" name="photo" accept="image/*">') +
          '<input type="hidden" name="id">' +
          '<input type="hidden" name="photoUrl">' +
          '<img data-job-preview alt="" hidden style="height:140px;width:100%;object-fit:cover;border-radius:18px">' +
          '<p data-job-err class="lede" hidden></p>' +
          '<button class="btn" type="submit">Add job</button>' +
        "</form>" +
        '<div>' + jobs.map(function (j) {
          return '<article class="card" style="margin-bottom:12px">' +
            (j.photo ? '<img src="' + j.photo + '" alt="" style="height:120px;width:100%;object-fit:cover;border-radius:18px">' : "") +
            "<h3>" + (j.caption || j.title || "") + "</h3>" +
            '<div style="display:flex;gap:8px;margin-top:8px">' +
              '<button type="button" class="btn ghost" data-edit-job="' + j.id + '">Edit</button>' +
              '<button type="button" class="btn ghost" data-del-job="' + j.id + '">Remove</button>' +
            "</div></article>";
        }).join("") + "</div></div>";

    $("[data-pane=photos]").innerHTML =
      '<div class="cards cards-3">' + SLOTS.map(function (s) {
        var src = photos[s[0]] || "";
        return '<article class="card"><h3>' + s[1] + "</h3>" +
          (src ? '<img src="' + src + '" alt="" style="height:140px;width:100%;object-fit:cover;border-radius:18px;margin:8px 0">' : "") +
          '<label>Replace photo<input type="file" accept="image/*" data-slot="' + s[0] + '"></label></article>';
      }).join("") + "</div>";

    wire(data);
  }

  function wire(data) {
    var remForm = $("[data-rem-form]");
    remForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      var errn = $("[data-rem-err]");
      errn.hidden = true;
      try {
        var file = remForm.photo.files[0];
        var photo = remForm.photoUrl.value;
        if (file) photo = await readPhoto(file);
        await api("/api/remnant", {
          token: token,
          item: {
            id: remForm.id.value || undefined,
            surface: remForm.surface.value,
            title: remForm.title.value,
            qty: remForm.qty.value,
            detail: remForm.detail.value,
            photo: photo,
            status: "available"
          }
        });
        remForm.reset();
        await render();
      } catch (ex) {
        errn.hidden = false;
        errn.textContent = ex.message;
      }
    });

    $$("[data-edit-rem]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = (data.remnants || []).find(function (r) { return r.id === btn.getAttribute("data-edit-rem"); });
        if (!item) return;
        remForm.id.value = item.id;
        remForm.surface.value = item.surface || "hardwood";
        remForm.title.value = item.title || "";
        remForm.qty.value = item.qty || "";
        remForm.detail.value = item.detail || "";
        remForm.photoUrl.value = item.photo || "";
        $("[data-rem-form] button[type=submit]").textContent = "Save changes";
      });
    });
    $$("[data-del-rem]").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        await api("/api/remnant/delete", { token: token, id: btn.getAttribute("data-del-rem") });
        await render();
      });
    });

    var jobForm = $("[data-job-form]");
    jobForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      var errn = $("[data-job-err]");
      errn.hidden = true;
      try {
        var file = jobForm.photo.files[0];
        var photo = jobForm.photoUrl.value;
        if (file) photo = await readPhoto(file);
        await api("/api/job", {
          token: token,
          item: {
            id: jobForm.id.value || undefined,
            caption: jobForm.caption.value,
            photo: photo,
            featured: true
          }
        });
        jobForm.reset();
        await render();
      } catch (ex) {
        errn.hidden = false;
        errn.textContent = ex.message;
      }
    });
    $$("[data-edit-job]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = (data.jobs || []).find(function (r) { return r.id === btn.getAttribute("data-edit-job"); });
        if (!item) return;
        jobForm.id.value = item.id;
        jobForm.caption.value = item.caption || item.title || "";
        jobForm.photoUrl.value = item.photo || "";
        $("[data-job-form] button[type=submit]").textContent = "Save job";
      });
    });
    $$("[data-del-job]").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        await api("/api/job/delete", { token: token, id: btn.getAttribute("data-del-job") });
        await render();
      });
    });

    $$("[data-slot]").forEach(function (input) {
      input.addEventListener("change", async function () {
        var file = input.files[0];
        if (!file) return;
        var photo = await readPhoto(file);
        await api("/api/photo", { token: token, slot: input.getAttribute("data-slot"), photo: photo });
        await render();
      });
    });
  }

  if (token) showDesk();
})();
