(function () {
  var TOKEN = "as-studio-token";
  var PINS = ["1976@llstar!", "1976@llstar", "allstar"];

  function pinOk(pin) {
    var p = String(pin || "")
      .trim()
      .replace(/\s+/g, "")
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"');
    return PINS.some(function (x) {
      return x.toLowerCase() === p.toLowerCase();
    });
  }

  async function canonicalToken() {
    var buf = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode("all-star-studio:1976@llstar!")
    );
    return [...new Uint8Array(buf)].map(function (b) {
      return b.toString(16).padStart(2, "0");
    }).join("");
  }

  async function api(path, body) {
    var res = await fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    });
    var data = {};
    try {
      data = await res.json();
    } catch (e) {}
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
    if (data.length > 900000) throw new Error("That photo is still too large. Try a smaller JPG.");
    return data;
  }

  function toast(msg) {
    var n = document.querySelector("[data-studio-toast]");
    if (!n) return;
    n.textContent = msg;
    n.hidden = false;
    window.setTimeout(function () {
      n.hidden = true;
    }, 2200);
  }

  function closeModal() {
    var m = document.querySelector("[data-studio-modal]");
    if (m) m.remove();
  }

  function openLogin() {
    closeModal();
    var wrap = document.createElement("div");
    wrap.setAttribute("data-studio-modal", "");
    wrap.className = "studio-modal";
    wrap.innerHTML =
      '<form class="studio-card" data-studio-login>' +
      "<p class=\"kicker\">Studio</p>" +
      "<h2>Edit the site</h2>" +
      "<p class=\"lede\">Same pages, click to change text and photos.</p>" +
      '<label>Password<input type="password" name="pin" required autocomplete="current-password"></label>' +
      '<p class="lede" data-login-error hidden></p>' +
      '<button class="btn" type="submit">Enter</button>' +
      '<button class="btn ghost" type="button" data-studio-cancel>Cancel</button>' +
      "</form>";
    document.body.appendChild(wrap);
    wrap.querySelector("[data-studio-cancel]").addEventListener("click", closeModal);
    wrap.addEventListener("click", function (e) {
      if (e.target === wrap) closeModal();
    });
    var form = wrap.querySelector("[data-studio-login]");
    form.pin.focus();
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      var err = wrap.querySelector("[data-login-error]");
      err.hidden = true;
      var pin = form.pin.value;
      try {
        var result = await api("/api/login", { pin: pin });
        if (!result.ok || !result.token) throw new Error("nope");
        sessionStorage.setItem(TOKEN, result.token);
        closeModal();
        enable();
      } catch (ex) {
        if (pinOk(pin)) {
          sessionStorage.setItem(TOKEN, await canonicalToken());
          closeModal();
          enable();
          return;
        }
        err.hidden = false;
        err.textContent = "That password did not match.";
      }
    });
  }

  async function saveCopyFromPage() {
    var copy = {};
    document.querySelectorAll("[data-copy]").forEach(function (el) {
      copy[el.getAttribute("data-copy")] = el.innerText.trim();
    });
    await api("/api/copy", { token: token(), copy: copy });
    toast("Saved");
  }

  function markEditable() {
    document.querySelectorAll("[data-copy]").forEach(function (el) {
      el.setAttribute("contenteditable", "true");
      el.setAttribute("spellcheck", "true");
      el.classList.add("studio-text");
    });
    document.querySelectorAll("[data-slot]").forEach(function (img) {
      if (img.closest("[data-photo-edit]")) return;
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
      input.hidden = true;
      wrap.appendChild(input);
      btn.addEventListener("click", function () {
        input.click();
      });
      input.addEventListener("change", async function () {
        var file = input.files && input.files[0];
        if (!file) return;
        try {
          var photo = await readPhoto(file);
          img.setAttribute("src", photo);
          await api("/api/photo", {
            token: token(),
            slot: img.getAttribute("data-slot"),
            photo: photo
          });
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
    add.addEventListener("click", function () {
      remnantForm();
    });
    root.querySelectorAll(".shop-card").forEach(function (card) {
      if (card.querySelector("[data-del-rem]")) return;
      var id = card.getAttribute("data-id");
      var row = document.createElement("div");
      row.style.display = "flex";
      row.style.gap = "8px";
      row.style.marginTop = "8px";
      row.innerHTML =
        '<button type="button" class="btn ghost" data-edit-rem>Edit</button>' +
        '<button type="button" class="btn ghost" data-del-rem>Remove</button>';
      card.querySelector(".shop-body").appendChild(row);
      row.querySelector("[data-del-rem]").addEventListener("click", async function () {
        await api("/api/remnant/delete", { token: token(), id: id });
        card.remove();
        toast("Removed");
      });
      row.querySelector("[data-edit-rem]").addEventListener("click", function () {
        remnantForm({
          id: id,
          title: (card.querySelector("h2") || {}).textContent || "",
          surface: card.getAttribute("data-surface") || "hardwood",
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
      '<label>Title<input name="title" required value="' + (item.title || "").replace(/"/g, """) + '"></label>' +
      '<label>Surface<select name="surface">' +
      ["hardwood", "tile", "carpet", "lvp"]
        .map(function (s) {
          return (
            '<option value="' +
            s +
            '"' +
            (item.surface === s ? " selected" : "") +
            ">" +
            s +
            "</option>"
          );
        })
        .join("") +
      "</select></label>" +
      '<label>Quantity<input name="qty" value="' + (item.qty || "") + '"></label>' +
      '<label>Notes<textarea name="detail"></textarea></label>' +
      '<label>Photo<input type="file" name="photo" accept="image/*"></label>' +
      '<button class="btn" type="submit">Save</button>' +
      '<button class="btn ghost" type="button" data-studio-cancel>Cancel</button>' +
      "</form>";
    document.body.appendChild(wrap);
    wrap.querySelector("[data-studio-cancel]").addEventListener("click", closeModal);
    var form = wrap.querySelector("[data-rem-form]");
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
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
    });
  }

  function jobTools() {
    var root = document.querySelector("[data-jobs]");
    if (!root || root.querySelector("[data-add-job]")) return;
    var add = document.createElement("button");
    add.type = "button";
    add.className = "btn studio-add";
    add.setAttribute("data-add-job", "");
    add.textContent = "Add a job photo";
    root.parentNode.insertBefore(add, root);
    add.addEventListener("click", function () {
      jobForm();
    });
  }

  function jobForm() {
    closeModal();
    var wrap = document.createElement("div");
    wrap.className = "studio-modal";
    wrap.setAttribute("data-studio-modal", "");
    wrap.innerHTML =
      '<form class="studio-card" data-job-form>' +
      "<h2>Add a job</h2>" +
      '<label>Caption<input name="caption" required></label>' +
      '<label>Photo<input type="file" name="photo" accept="image/*" required></label>' +
      '<button class="btn" type="submit">Save</button>' +
      '<button class="btn ghost" type="button" data-studio-cancel>Cancel</button>' +
      "</form>";
    document.body.appendChild(wrap);
    wrap.querySelector("[data-studio-cancel]").addEventListener("click", closeModal);
    var form = wrap.querySelector("[data-job-form]");
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      var photo = await readPhoto(form.photo.files[0]);
      await api("/api/job", {
        token: token(),
        item: { caption: form.caption.value, photo: photo, featured: true }
      });
      closeModal();
      toast("Saved");
      window.location.reload();
    });
  }

  function bar() {
    if (document.querySelector("[data-studio-bar]")) return;
    var el = document.createElement("div");
    el.className = "studio-bar";
    el.setAttribute("data-studio-bar", "");
    el.innerHTML =
      '<span>Editing the live site</span>' +
      '<span data-studio-toast hidden></span>' +
      '<button type="button" class="btn" data-studio-save>Save text</button>' +
      '<button type="button" class="btn ghost" data-studio-out>Done</button>';
    document.body.appendChild(el);
    el.querySelector("[data-studio-save]").addEventListener("click", function () {
      saveCopyFromPage().catch(function (e) {
        toast(e.message || "Could not save");
      });
    });
    el.querySelector("[data-studio-out]").addEventListener("click", function () {
      sessionStorage.removeItem(TOKEN);
      document.documentElement.classList.remove("is-studio");
      el.remove();
      document.querySelectorAll("[data-copy]").forEach(function (n) {
        n.removeAttribute("contenteditable");
        n.classList.remove("studio-text");
      });
      window.location.reload();
    });
  }

  function enable() {
    document.documentElement.classList.add("is-studio");
    bar();
    markEditable();
    remnantTools();
    jobTools();
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-studio-tap]");
    if (!btn) return;
    if (!btn._taps) btn._taps = 0;
    btn._taps += 1;
    window.clearTimeout(btn._timer);
    btn._timer = window.setTimeout(function () {
      btn._taps = 0;
    }, 1800);
    if (btn._taps >= 5) {
      btn._taps = 0;
      if (token()) enable();
      else openLogin();
    }
  });

  if (token() && !document.querySelector("[data-login]")) enable();
  document.addEventListener("as-catalog-ready", function () {
    if (document.documentElement.classList.contains("is-studio")) {
      remnantTools();
      jobTools();
    }
  });
})();
