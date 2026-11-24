(function () {
  var LINES = [
    { id: "daltile", name: "Daltile", kind: "Tile", n: 3 },
    { id: "msi", name: "MSI", kind: "Tile", n: 3 },
    { id: "bedrosians", name: "Bedrosians", kind: "Tile", n: 3 },
    { id: "florida", name: "Florida Tile", kind: "Tile", n: 3 },
    { id: "pental", name: "Pental", kind: "Porcelain & quartz", n: 3 },
    { id: "shaw", name: "Shaw", kind: "Tile & floors", n: 3 },
    { id: "mannington", name: "Mannington", kind: "Floors", n: 3 },
    { id: "forbo", name: "Forbo", kind: "Linoleum", n: 3 },
    { id: "krafters", name: "Krafter's Land", kind: "LVP", n: 3 },
    { id: "masland", name: "Masland", kind: "Carpet", n: 3 },
    { id: "bradley", name: "E.B. Bradley", kind: "Millwork", n: 3 },
    { id: "amorim", name: "Amorim", kind: "Cork", n: 1 }
  ];
  var byId = {};
  LINES.forEach(function (line) { byId[line.id] = line; });

  var builder = document.querySelector("[data-builder]");
  var client = document.querySelector("[data-client]");
  if (!builder || !client) return;

  function shot(id, n) { return "/images/vendors/shots/" + id + "-" + n + ".jpg"; }

  function encode(obj) {
    var bytes = new TextEncoder().encode(JSON.stringify(obj));
    var bin = "";
    bytes.forEach(function (b) { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  function decode(hash) {
    var b64 = hash.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return JSON.parse(new TextDecoder().decode(bytes));
  }

  function readDraft() {
    try { return JSON.parse(localStorage.getItem("as-board")) || blank(); }
    catch (e) { return blank(); }
  }

  function blank() { return { name: "", note: "", items: [] }; }

  function save(state) {
    localStorage.setItem("as-board", JSON.stringify(state));
  }

  function renderClient(data) {
    builder.hidden = true;
    client.hidden = false;
    var name = data.name || "you";
    var items = data.items || [];
    var html = '<header class="wrap page-hero">' +
      '<p class="kicker">A selection</p>' +
      '<h1>Picked for ' + esc(name) + '</h1>' +
      '<p class="lede">' + esc(data.note || "A short list from the lines we install. Nothing here is a checkout. Come see the samples in Lynnwood.") + '</p>' +
      '</header><section class="wrap section board-grid">';
    items.forEach(function (item) {
      var line = byId[item.id] || { name: item.id, kind: "" };
      html += '<article class="board-card">' +
        '<img src="' + shot(item.id, item.n) + '" alt="' + esc(item.title || line.name) + '">' +
        '<div class="board-card-body">' +
        '<p class="kicker">' + esc(line.name) + (line.kind ? " · " + esc(line.kind) : "") + '</p>' +
        '<h2>' + esc(item.title || line.name) + '</h2>' +
        (item.room ? '<p class="lede">' + esc(item.room) + '</p>' : '') +
        '</div></article>';
    });
    html += '</section><section class="wrap section"><a class="btn" href="/appointment">Book a showroom visit</a></section>';
    client.innerHTML = html;
  }

  function esc(s) {
    return String(s || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&", "<": "<", ">": ">", '"': """, "'": "&#39;" }[c];
    });
  }

  function renderBuilder(state) {
    builder.hidden = false;
    client.hidden = true;
    var picked = state.items.map(function (item, index) {
      var line = byId[item.id] || { name: item.id };
      return '<article class="board-card">' +
        '<img src="' + shot(item.id, item.n) + '" alt="">' +
        '<div class="board-card-body">' +
        '<p class="kicker">' + esc(line.name) + '</p>' +
        '<label>Tile name<input class="field" data-title="' + index + '" value="' + esc(item.title) + '"></label>' +
        '<label>Where it goes<input class="field" data-room="' + index + '" value="' + esc(item.room) + '" placeholder="Main bath, kitchen…"></label>' +
        '<button type="button" class="btn ghost" data-remove="' + index + '">Remove</button>' +
        '</div></article>';
    }).join("");

    var shelves = LINES.map(function (line) {
      var photos = "";
      for (var n = 1; n <= line.n; n++) {
        var on = state.items.some(function (item) { return item.id === line.id && item.n === n; });
        photos += '<button type="button" class="board-shot' + (on ? " is-on" : "") + '" data-add="' + line.id + '" data-n="' + n + '">' +
          '<img src="' + shot(line.id, n) + '" alt="' + esc(line.name) + ' sample ' + n + '">' +
          '<span>' + (on ? "Added" : "Add") + '</span></button>';
      }
      return '<div class="board-line"><div><p class="kicker">' + esc(line.kind) + '</p><h2>' + esc(line.name) + '</h2></div><div class="board-shots">' + photos + '</div></div>';
    }).join("");

    builder.innerHTML =
      '<header class="wrap page-hero">' +
      '<p class="kicker">For the client</p>' +
      '<h1>A list, not a checkout.</h1>' +
      '<p class="lede">Pick samples from the vendors we install. Name the client, then copy a link. They see only the tiles you chose.</p>' +
      '</header>' +
      '<section class="wrap board-setup">' +
      '<label>Client name<input class="field" data-name value="' + esc(state.name) + '" placeholder="The Chen kitchen"></label>' +
      '<label>A note for them<textarea class="field" data-note rows="3" placeholder="A few directions for the main bath.">' + esc(state.note) + '</textarea></label>' +
      '<div class="board-actions"><button type="button" class="btn" data-share>Copy the client link</button><button type="button" class="btn ghost" data-clear>Start over</button></div>' +
      '<p class="lede" data-share-msg></p>' +
      '</section>' +
      '<section class="wrap section"><h2>On their list</h2>' +
      (picked ? '<div class="board-grid">' + picked + '</div>' : '<p class="lede">Nothing yet. Add a photo below.</p>') +
      '</section>' +
      '<section class="wrap section board-shelves"><h2>From the vendors</h2>' + shelves + '</section>';

    builder.querySelector("[data-name]").addEventListener("input", function (e) {
      state.name = e.target.value;
      save(state);
    });
    builder.querySelector("[data-note]").addEventListener("input", function (e) {
      state.note = e.target.value;
      save(state);
    });
    builder.querySelectorAll("[data-title]").forEach(function (input) {
      input.addEventListener("input", function () {
        state.items[Number(input.getAttribute("data-title"))].title = input.value;
        save(state);
      });
    });
    builder.querySelectorAll("[data-room]").forEach(function (input) {
      input.addEventListener("input", function () {
        state.items[Number(input.getAttribute("data-room"))].room = input.value;
        save(state);
      });
    });
    builder.querySelectorAll("[data-remove]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.items.splice(Number(btn.getAttribute("data-remove")), 1);
        save(state);
        renderBuilder(state);
      });
    });
    builder.querySelectorAll("[data-add]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-add");
        var n = Number(btn.getAttribute("data-n"));
        var exists = state.items.some(function (item) { return item.id === id && item.n === n; });
        if (exists) {
          state.items = state.items.filter(function (item) { return !(item.id === id && item.n === n); });
        } else {
          var line = byId[id];
          state.items.push({ id: id, n: n, title: line.name, room: "" });
        }
        save(state);
        renderBuilder(state);
      });
    });
    builder.querySelector("[data-share]").addEventListener("click", function () {
      if (!state.items.length) {
        builder.querySelector("[data-share-msg]").textContent = "Add at least one tile first.";
        return;
      }
      var link = location.origin + "/registry#" + encode({
        name: state.name || "you",
        note: state.note,
        items: state.items
      });
      navigator.clipboard.writeText(link).then(function () {
        builder.querySelector("[data-share-msg]").textContent = "Link copied. Send that to the client.";
      }, function () {
        builder.querySelector("[data-share-msg]").textContent = link;
      });
    });
    builder.querySelector("[data-clear]").addEventListener("click", function () {
      state = blank();
      save(state);
      renderBuilder(state);
    });
  }

  var hash = location.hash.replace(/^#/, "");
  if (hash) {
    try { renderClient(decode(hash)); return; }
    catch (e) { /* fall through to the builder */ }
  }
  renderBuilder(readDraft());
})();
