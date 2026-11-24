(function () {
  var builder = document.querySelector("[data-builder]");
  var client = document.querySelector("[data-client]");
  if (!builder || !client) return;

  function blank() { return { name: "", note: "", id: "", items: [] }; }

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

  function esc(s) {
    return String(s || "").replace(/[&<>"']/g, function (c) {
      if (c === "&") return "&amp;";
      if (c === "<") return "&lt;";
      if (c === ">") return "&gt;";
      if (c === '"') return "&quot;";
      return "&#39;";
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
    var fields = opts.client
      ? '<p class="shop-meta">' + esc(item.vendor || "Tile") + room + "</p><h2>" + esc(item.title || item.vendor || "Tile") + "</h2>"
      : '<p class="shop-meta">' + esc(item.vendor || "Tile") + "</p>" +
        '<label>Name<input class="field" data-title="' + esc(item.key) + '" value="' + esc(item.title) + '"></label>' +
        '<label>Where it goes<input class="field" data-room="' + esc(item.key) + '" value="' + esc(item.room) + '" placeholder="Main bath, kitchen…"></label>' +
        '<button type="button" class="btn ghost" data-remove="' + esc(item.key) + '">Remove</button>';
    return '<article class="shop-card">' +
      '<div class="shop-media"><img src="' + esc(item.photo) + '" alt="' + esc(item.title || item.vendor) + '">' +
      '<span class="shop-badge">' + esc(item.vendor || "Tile") + "</span>" + like + "</div>" +
      '<div class="shop-body">' + fields + "</div></article>";
  }

  function renderClient(board) {
    builder.hidden = true;
    client.hidden = false;
    var items = board.items || [];
    client.innerHTML =
      '<header class="wrap page-hero">' +
      '<p class="kicker">A selection</p>' +
      "<h1>Picked for " + esc(board.name || "you") + "</h1>" +
      '<p class="lede">' + esc(board.note || "These are the options we pulled. Tap I like this on the ones you want to see in the showroom.") + "</p>" +
      "</header>" +
      '<section class="wrap shop-grid section">' + items.map(function (item) { return card(item, { client: true, board: board }); }).join("") + "</section>" +
      '<section class="wrap section"><a class="btn" href="/appointment">Book a showroom visit</a></section>';
    client.querySelectorAll("[data-like]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-like");
        var on = likedBy(board, key).indexOf(voter()) < 0;
        fetch("/api/board/like", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ id: board.id, key: key, voter: voter(), on: on })
        }).then(function (r) { return r.json(); }).then(function () {
          return fetch("/api/board?id=" + encodeURIComponent(board.id)).then(function (r) { return r.json(); });
        }).then(function (next) {
          if (next && next.items) renderClient(next);
        }).catch(function () {
          btn.textContent = "Could not save. Try again.";
        });
      });
    });
  }

  function renderBuilder(state) {
    builder.hidden = false;
    client.hidden = true;
    var items = state.items || [];
    builder.innerHTML =
      '<header class="wrap page-hero">' +
      '<p class="kicker">For the client</p>' +
      "<h1>Their vision board.</h1>" +
      '<p class="lede">Open a vendor, like Daltile, and tap Add this photo. Come back here, name the client, then copy the link. They see a rack like the remnants page and can tap I like this.</p>' +
      "</header>" +
      '<section class="wrap board-setup">' +
      '<label>Client name<input class="field" data-name value="' + esc(state.name) + '" placeholder="The Chen kitchen"></label>' +
      '<label>A note for them<textarea class="field" data-note rows="3" placeholder="A few directions for the main bath.">' + esc(state.note) + "</textarea></label>" +
      '<div class="board-actions"><button type="button" class="btn" data-share>Copy their link</button><a class="btn ghost" href="/vendors">Pick from vendors</a><button type="button" class="btn ghost" data-clear>Start over</button></div>' +
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
        body: JSON.stringify({ id: state.id, name: state.name, note: state.note, items: state.items })
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
        msg.textContent = "The list did not save. Try again in a minute.";
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
