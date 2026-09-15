(function () {
  var root = document.querySelector("[data-hero]");
  if (!root) return;
  var slides = Array.prototype.slice.call(root.querySelectorAll(".hero-slide"));
  var dotsWrap = root.querySelector("[data-hero-dots]");
  if (slides.length < 2) return;
  var i = 0;
  var paused = false;
  slides.forEach(function (_, n) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "hero-dot" + (n === 0 ? " is-on" : "");
    b.setAttribute("aria-label", "Photo " + (n + 1));
    b.addEventListener("click", function () { show(n); });
    dotsWrap.appendChild(b);
  });
  function show(n) {
    i = n;
    slides.forEach(function (s, k) { s.classList.toggle("is-active", k === n); });
    Array.prototype.forEach.call(dotsWrap.children, function (d, k) {
      d.classList.toggle("is-on", k === n);
    });
  }
  root.addEventListener("mouseenter", function () { paused = true; });
  root.addEventListener("mouseleave", function () { paused = false; });
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  setInterval(function () {
    if (paused) return;
    show((i + 1) % slides.length);
  }, 5200);
})();
