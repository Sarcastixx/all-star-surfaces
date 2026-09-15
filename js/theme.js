(function () {
  function pref() {
    var p = localStorage.getItem("as-theme") || "auto";
    if (p !== "light" && p !== "dark") return "auto";
    return p;
  }
  function resolve(p) {
    if (p === "dark") return "dark";
    if (p === "light") return "light";
    return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function apply(p) {
    localStorage.setItem("as-theme", p);
    document.documentElement.setAttribute("data-theme-pref", p);
    document.documentElement.setAttribute("data-theme", resolve(p));
    document.querySelectorAll("[data-theme-pref]").forEach(function (b) {
      b.classList.toggle("is-on", b.getAttribute("data-theme-pref") === p);
    });
  }
  apply(pref());
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-theme-pref]");
    if (!b) return;
    apply(b.getAttribute("data-theme-pref"));
  });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
    if (pref() === "auto") apply("auto");
  });
})();
