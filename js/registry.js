(function () {
  var builder = document.querySelector("[data-builder]");
  var client = document.querySelector("[data-client]");
  if (!builder || !client) return;

  function blank() { return { name: "", note: "", id: "", items: [] }; }

  function staffToken() {
    return sessionStorage.getItem("as-studio-token") || "";
  }

  function renderGate() {
    builder.hidden = false;
    client.hidden = true;
    builder.innerHTML =
      '<header class="wrap page-hero">' +
      '<p class="kicker">Staff</p>' +
      "<h1>Client lists stay with us.</h1>" +
      '<p class="lede">Sign in with the staff password. Clients only see the link you send them.</p>' +
      "</header>" +
      '<form class="wrap board-setup" data-gate>' +
      '<label>Password<input class="field" type="password" name="pin" autocomplete="current-password" required></label>' +
      '<button class="btn" type="submit">Enter</button>' +
      '<p class="lede" data-gate-err hidden></p></form>';
    builder.querySelector("[data-gate]").addEventListener("submit", function (e) {
      e.preventDefault();
      var err = builder.querySelector("[data-gate-err]");
      err.hidden = true;
      var pin = e.target.pin.value;
      fetch("/api/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ pin: pin })
      }).then(function (r) { return r.json(); }).then(function (data) {
        if (!data || !data.ok || !data.token) throw new Error("no");
        sessionStorage.setItem("as-studio-token", data.token);
        sessionStorage.setItem("as-studio-role", data.role || "update");
        sessionStorage.setItem("as-studio-on", "1");
        renderBuilder(readBoard());
      }).catch(function () {
        err.hidden = false;
        err.textContent = "That password did not match.";
      });
    });
  }

  function readBoard() {
    try { return Object.assign(blank(), JSON.parse(localStorage.getItem("as-board")) || {}); }
    catch (e) { return blank(); }
  }

  function writeBoard(board) {
    localStorage.setItem("as-board", JSON.stringify(board));
  }

  function voter() {
    var id = localStorage.getItem("as-voter");
    if (!id) {
      id = Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
      localStorage.setItem("as-voter", id);
    }
    return id;
  }


  function pack(board) {
    var bytes = new TextEncoder().encode(JSON.stringify({
      name: board.name || "",
      note: board.note || "",
      items: board.items || [],
      likes: board.likes || {}
    }));
    var bin = "";
    bytes.forEach(function (b) { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  function unpack(hash) {
    var b64 = hash.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return JSON.parse(new TextDecoder().decode(bytes));
  }

  function esc(s) {
    return String(s || "").replace(/[&<>"']/g, function (c) {
      if (c === "&") return "&amp;";
      if (c === "<") return "&lt;";
      if (c === ">") return "&gt;";
      if (c === '"') return "&quot;";
      return "&#39;";
    });
  }

  function wireThumbs(root) {
    root.querySelectorAll(".board-thumb").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var img = btn.closest(".shop-card").querySelector("[data-main]");
        if (img) img.src = btn.getAttribute("data-swap");
      });
    });
  }

  function likedBy(board, key) {
    var list = board.likes && board.likes[key];
    return Array.isArray(list) ? list : [];
  }

  function card(item, opts) {
    var likes = likedBy(opts.board || {}, item.key);
    var mine = likes.indexOf(voter()) >= 0;
    var room = item.room ? " · " + esc(item.room) : "";
    var like = "";
    if (opts.client) {
      like = '<button type="button" class="like-bubble' + (mine ? " is-on" : "") + '" data-like="' + esc(item.key) + '">' +
        (mine ? "I like this" : "I like this") + (likes.length ? " · " + likes.length : "") + "</button>";
    }
    var photos = (item.photos && item.photos.length) ? item.photos : [item.photo];
    var thumbs = photos.length > 1
      ? '<div class="board-thumbs">' + photos.map(function (src) {
          return '<button type="button" class="board-thumb" data-swap="' + esc(src) + '"><img src="' + esc(src) + '" alt=""></button>';
        }).join("") + "</div>"
      : "";
    var fields = opts.client
      ? '<p class="shop-meta">' + esc(item.vendor || "Tile") + room + "</p><h2>" + esc(item.title || item.vendor || "Tile") + "</h2>"
      : '<p class="shop-meta">' + esc(item.vendor || "Tile") + "</p>" +
        '<label>Name<input class="field" data-title="' + esc(item.key) + '" value="' + esc(item.title) + '"></label>' +
        '<label>Where it goes<input class="field" data-room="' + esc(item.key) + '" value="' + esc(item.room) + '" placeholder="Main bath, kitchen…"></label>' +
        '<button type="button" class="btn ghost" data-details="' + esc(item.key) + '">Details</button>' +
        '<button type="button" class="btn ghost" data-remove="' + esc(item.key) + '">Remove</button>';
    return '<article class="shop-card profile-card" data-open="' + esc(item.key) + '">' +
      '<div class="shop-media"><img data-main src="' + esc(photos[0]) + '" alt="' + esc(item.title || item.vendor) + '">' +
      '<span class="shop-badge">' + esc(item.vendor || "Tile") + "</span>" + like + "</div>" +
      thumbs +
      '<div class="shop-body">' + fields + "</div></article>";
  }

  function openProfile(item, board) {
    var photos = (item.photos && item.photos.length) ? item.photos : [item.photo];
    var index = 0;
    var old = document.querySelector("[data-profile]");
    if (old) old.remove();
    var scrim = document.createElement("div");
    scrim.className = "detail-scrim";
    scrim.setAttribute("data-profile", "");
    var facts = (item.facts || []).map(function (line) {
      return '<span class="vendor-spec">' + esc(line) + "</span>";
    }).join("");
    scrim.innerHTML =
      '<div class="detail-sheet" role="dialog" aria-modal="true" aria-label="' + esc(item.title || "Tile") + '">' +
        '<button class="detail-close" type="button" aria-label="Close">×</button>' +
        '<div class="detail-photo">' +
          '<button class="detail-arrow is-prev" type="button" data-step="-1" aria-label="Previous photo">‹</button>' +
          '<div class="detail-frame"><img class="detail-shot" data-shot alt=""></div>' +
          '<button class="detail-arrow is-next" type="button" data-step="1" aria-label="Next photo">›</button>' +
          '<div class="detail-dots" data-dots></div>' +
        "</div>" +
        '<div class="detail-copy">' +
          '<p class="kicker">' + esc(item.vendor || "Tile") + (item.room ? " · " + esc(item.room) : "") + "</p>" +
          "<h2>" + esc(item.title || item.vendor || "Tile") + "</h2>" +
          (facts ? '<div class="detail-specs">' + facts + "</div>" : "") +
          (item.detail ? '<p class="detail-brief">' + esc(item.detail) + "</p>" : "") +
          '<div class="detail-actions"><button type="button" class="btn" data-sheet-like>I like this</button></div>' +
          (item.link ? '<p class="detail-extra"><a href="' + esc(item.link) + '" target="_blank" rel="noreferrer">Product page</a></p>' : "") +
        "</div></div>";
    document.body.appendChild(scrim);
    document.body.classList.add("detail-open");
    requestAnimationFrame(function () { scrim.classList.add("is-in"); });
    var shot = scrim.querySelector("[data-shot]");
    var dots = scrim.querySelector("[data-dots]");
    function paint() {
      shot.src = photos[index] || "";
      shot.alt = item.title || "";
      dots.innerHTML = photos.map(function (_, i) {
        return '<button type="button" data-dot="' + i + '"' + (i === index ? ' class="is-on"' : "") + ' aria-label="Photo ' + (i + 1) + '"></button>';
      }).join("");
      scrim.querySelectorAll("[data-step]").forEach(function (btn) {
        btn.hidden = photos.length < 2;
      });
    }
    function close() {
      scrim.classList.remove("is-in");
      document.body.classList.remove("detail-open");
      setTimeout(function () { scrim.remove(); }, 280);
    }
    scrim.addEventListener("click", function (e) {
      if (e.target === scrim || e.target.closest(".detail-close")) close();
      var step = e.target.closest("[data-step]");
      if (step) {
        index = (index + Number(step.getAttribute("data-step")) + photos.length) % photos.length;
        paint();
      }
      var dot = e.target.closest("[data-dot]");
      if (dot) {
        index = Number(dot.getAttribute("data-dot"));
        paint();
      }
    });
    var likeBtn = scrim.querySelector("[data-sheet-like]");
    function paintLike() {
      var mine = likedBy(board, item.key).indexOf(voter()) >= 0;
      likeBtn.classList.toggle("is-on", mine);
      likeBtn.textContent = mine ? "I like this" : "I like this";
    }
    likeBtn.addEventListener("click", function () {
      toggleLike(board, item.key, function () {
        paintLike();
        var cardBtn = document.querySelector('[data-like="' + item.key + '"]');
        if (cardBtn) {
          var count = likedBy(board, item.key).length;
          cardBtn.classList.toggle("is-on", likedBy(board, item.key).indexOf(voter()) >= 0);
          cardBtn.textContent = "I like this" + (count ? " · " + count : "");
        }
      });
    });
    paint();
    paintLike();
  }

  function wireOpen(root, items, board) {
    function find(key) {
      return items.filter(function (it) { return it.key === key; })[0];
    }
    root.querySelectorAll("[data-open]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        if (e.target.closest("button, a, input, label, textarea")) return;
        var item = find(el.getAttribute("data-open"));
        if (item) openProfile(item, board);
      });
    });
    root.querySelectorAll("[data-details]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = find(btn.getAttribute("data-details"));
        if (item) openProfile(item, board);
      });
    });
  }

  function toggleLike(board, key, done) {
    var on = likedBy(board, key).indexOf(voter()) < 0;
    if (!board.id) {
      if (!board.likes) board.likes = {};
      var list = likedBy(board, key).slice();
      board.likes[key] = on ? list.concat([voter()]) : list.filter(function (v) { return v !== voter(); });
      var builderEl = document.querySelector("[data-builder]");
      if (!builderEl || builderEl.hidden) {
        history.replaceState(null, "", location.pathname + "#" + pack(board));
      }
      if (done) done();
      return;
    }
    fetch("/api/board/like", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: board.id, key: key, voter: voter(), on: on })
    }).then(function (r) { return r.json(); }).then(function () {
      return fetch("/api/board?id=" + encodeURIComponent(board.id)).then(function (r) { return r.json(); });
    }).then(function (next) {
      if (next && next.likes) board.likes = next.likes;
      if (done) done();
    }).catch(function () {
      if (done) done(new Error("save"));
    });
  }

  function renderClient(board) {
    builder.hidden = true;
    client.hidden = false;
    var items = board.items || [];
    client.innerHTML =
      '<header class="wrap page-hero">' +
      '<p class="kicker">A selection</p>' +
      "<h1>Picked for " + esc(board.name || "you") + "</h1>" +
      '<p class="lede">' + esc(board.note || "The photos are here. Tap a tile if you want the size, price, and the rest.") + "</p>" +
      (board.id ? "" : '<p class="lede">Your picks stay in this page link. Send it back to AllStar when you are done.</p>') +
      "</header>" +
      '<section class="wrap shop-grid section">' + items.map(function (item) { return card(item, { client: true, board: board }); }).join("") + "</section>" +
      '<section class="wrap section"><a class="btn" href="/appointment">Book a showroom visit</a></section>';
    wireThumbs(client);
    wireOpen(client, items, board);
    client.querySelectorAll("[data-like]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-like");
        toggleLike(board, key, function (err) {
          if (err) {
            btn.textContent = "Could not save. Try again.";
            return;
          }
          renderClient(board);
        });
      });
    });
  }

  function renderBuilder(state) {
    if (!staffToken()) {
      renderGate();
      return;
    }
    builder.hidden = false;
    client.hidden = true;
    var items = state.items || [];
    builder.innerHTML =
      '<header class="wrap page-hero">' +
      '<p class="kicker">For the client</p>' +
      "<h1>Their vision board.</h1>" +
      '<p class="lede">Paste a product link, or open a vendor and tap Add this photo. The client sees every photo and the details, and can tap I like this.</p>' +
      "</header>" +
      '<section class="wrap board-setup">' +
      '<label>Client name<input class="field" data-name value="' + esc(state.name) + '" placeholder="The Chen kitchen"></label>' +
      '<label>A note for them<textarea class="field" data-note rows="3" placeholder="A few directions for the main bath.">' + esc(state.note) + "</textarea></label>" +
      '<label>Paste a product link<input class="field" data-url placeholder="https://www.flooranddecor.com/..."></label>' +
      '<div class="board-actions"><button type="button" class="btn" data-pull>Add that tile</button><button type="button" class="btn" data-share>Copy their link</button><a class="btn ghost" href="/vendors">Pick from vendors</a><button type="button" class="btn ghost" data-clear>Start over</button></div>' +
      '<p class="lede" data-share-msg></p></section>' +
      '<section class="wrap section"><h2>On the board</h2>' +
      (items.length ? '<div class="shop-grid">' + items.map(function (item) { return card(item, { client: false, board: state }); }).join("") + "</div>" : '<p class="lede">Nothing yet. Open Vendors, pick Daltile or another line, and tap Add this photo.</p>') +
      "</section>";

    builder.querySelector("[data-name]").addEventListener("input", function (e) {
      state.name = e.target.value;
      writeBoard(state);
    });
    builder.querySelector("[data-note]").addEventListener("input", function (e) {
      state.note = e.target.value;
      writeBoard(state);
    });
    builder.querySelectorAll("[data-title]").forEach(function (input) {
      input.addEventListener("input", function () {
        var item = state.items.filter(function (it) { return it.key === input.getAttribute("data-title"); })[0];
        if (item) item.title = input.value;
        writeBoard(state);
      });
    });
    builder.querySelectorAll("[data-room]").forEach(function (input) {
      input.addEventListener("input", function () {
        var item = state.items.filter(function (it) { return it.key === input.getAttribute("data-room"); })[0];
        if (item) item.room = input.value;
        writeBoard(state);
      });
    });
    builder.querySelectorAll("[data-remove]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.items = state.items.filter(function (it) { return it.key !== btn.getAttribute("data-remove"); });
        writeBoard(state);
        renderBuilder(state);
      });
    });
    wireThumbs(builder);
    wireOpen(builder, items, state);
    builder.querySelector("[data-pull]").addEventListener("click", function () {
      var input = builder.querySelector("[data-url]");
      var url = (input.value || "").trim();
      var msg = builder.querySelector("[data-share-msg]");
      if (!/^https:\/\//.test(url)) {
        msg.textContent = "Paste a full https link.";
        return;
      }
      msg.textContent = "Reading that page…";
      fetch("/api/product", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: url, token: staffToken() })
      }).then(function (r) { return r.json(); }).then(function (tile) {
        if (!tile || !tile.photo) throw new Error((tile && tile.error) || "No photos on that page");
        state.items.push({
          key: "link-" + Date.now(),
          vendor: tile.vendor || "Tile",
          title: tile.title || "Tile",
          room: "",
          photo: tile.photo,
          photos: tile.photos || [tile.photo],
          facts: tile.facts || [],
          detail: tile.detail || "",
          link: tile.link || url
        });
        writeBoard(state);
        renderBuilder(state);
      }).catch(function (err) {
        var box = document.querySelector("[data-share-msg]");
        if (box) box.textContent = (err && err.message) || "Could not read that page.";
      });
    });
    builder.querySelector("[data-share]").addEventListener("click", function () {
      var msg = builder.querySelector("[data-share-msg]");
      if (!state.items.length) {
        msg.textContent = "Add at least one photo first.";
        return;
      }
      msg.textContent = "Saving…";
      fetch("/api/board", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: state.id, name: state.name, note: state.note, items: state.items, token: staffToken() })
      }).then(function (r) { return r.json(); }).then(function (res) {
        if (!res || !res.id) throw new Error((res && res.error) || "Save failed");
        state.id = res.id;
        writeBoard(state);
        var link = location.origin + "/registry?b=" + res.id;
        return navigator.clipboard.writeText(link).then(function () {
          msg.textContent = "Link copied. Send that. When they tap I like this, you will see it on this same link.";
        }, function () {
          msg.textContent = link;
        });
      }).catch(function () {
        var link = location.origin + "/registry#" + pack(state);
        navigator.clipboard.writeText(link).then(function () {
          msg.textContent = "Link copied. Ask them to send the page back after they tap I like this.";
        }, function () {
          msg.textContent = link;
        });
      });
    });
    builder.querySelector("[data-clear]").addEventListener("click", function () {
      state = blank();
      writeBoard(state);
      renderBuilder(state);
    });
  }

  var params = new URLSearchParams(location.search);
  var shared = params.get("b");
  var hash = location.hash.replace(/^#/, "");
  if (!shared && hash) {
    try { renderClient(unpack(hash)); return; }
    catch (e) { /* builder */ }
  }
  if (shared) {
    client.hidden = false;
    client.innerHTML = '<p class="wrap lede">Loading their board…</p>';
    fetch("/api/board?id=" + encodeURIComponent(shared)).then(function (r) {
      if (!r.ok) throw new Error("missing");
      return r.json();
    }).then(renderClient).catch(function () {
      client.innerHTML = '<p class="wrap lede">That board is not ready yet. Ask AllStar for the link again.</p>';
    });
    return;
  }
  renderBuilder(readBoard());
})();
