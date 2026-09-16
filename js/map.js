(function () {
  var el = document.querySelector("[data-sea-map]");
  if (!el) return;

  function boot() {
    if (!window.L) {
      window.setTimeout(boot, 40);
      return;
    }
    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    var map = L.map(el, {
      scrollWheelZoom: false,
      zoomControl: true
    }).setView([47.62, -122.32], 9);

    var layer;
    function tiles() {
      if (layer) map.removeLayer(layer);
      var url = dark
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
      layer = L.tileLayer(url, {
        attribution: "&copy; OpenStreetMap &copy; CARTO",
        maxZoom: 18
      }).addTo(map);
    }
    tiles();

    var coverage = [
      [48.25, -122.78],
      [48.25, -122.08],
      [47.86, -121.88],
      [47.36, -121.94],
      [47.14, -122.22],
      [47.14, -122.62],
      [47.40, -122.58],
      [47.70, -122.62],
      [48.05, -122.78]
    ];
    L.polygon(coverage, {
      color: dark ? "#d8cfc0" : "#2f2a24",
      weight: 1.2,
      fillColor: dark ? "#d8cfc0" : "#2f2a24",
      fillOpacity: 0.14
    }).addTo(map);

    L.circleMarker([47.821, -122.315], {
      radius: 8,
      color: dark ? "#f4efe6" : "#2f2a24",
      fillColor: dark ? "#f4efe6" : "#2f2a24",
      fillOpacity: 1,
      weight: 2
    }).addTo(map).bindPopup("All Star Surfaces<br>18000 Hwy 99, Lynnwood");

    [
      [47.2529, -122.4443, "Tacoma"],
      [47.366, -122.045, "Maple Valley"],
      [47.855, -121.972, "Monroe"],
      [48.198, -122.125, "Arlington"],
      [47.655, -122.535, "Bainbridge"],
      [47.447, -122.46, "Vashon"],
      [48.03, -122.4, "Whidbey"]
    ].forEach(function (c) {
      L.circleMarker([c[0], c[1]], {
        radius: 4,
        color: dark ? "#cfc6b8" : "#5a5248",
        fillColor: dark ? "#cfc6b8" : "#5a5248",
        fillOpacity: 1,
        weight: 0
      }).addTo(map).bindTooltip(c[2], { permanent: false });
    });

    new MutationObserver(function () {
      var next = document.documentElement.getAttribute("data-theme") === "dark";
      if (next !== dark) {
        dark = next;
        tiles();
      }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }

  boot();
})();
