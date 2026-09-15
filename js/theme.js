(function () {
  function current() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }
  function apply(next) {
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("as-theme", next); } catch (e) {}
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.textContent = next === "dark" ? "Light" : "Dark";
    });
  }
  apply(current());
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-theme-toggle]");
    if (!btn) return;
    apply(current() === "dark" ? "light" : "dark");
  });
})();
