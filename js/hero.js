(function () {
  var root = document.querySelector("[data-hero]");
  if (!root) return;
  var slides = Array.prototype.slice.call(root.querySelectorAll(".hero-slide"));
  var dotsWrap = root.querySelector("[data-hero-dots]");
  if (slides.length < 2) return;
  var i = 0;
  var paused = false;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  slides.forEach(function (_, n) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "hero-dot" + (n === 0 ? " is-on" : "");
    b.setAttribute("aria-label", "Photo " + (n + 1));
    b.addEventListener("click", function () { show(n); });
    dotsWrap.appendChild(b);
  });

  function travel(slide) {
    return Math.max(0, Math.round(slide.getBoundingClientRect().height - root.getBoundingClientRect().height));
  }

  function play(slide) {
    if (reduce) {
      slide.style.transition = "none";
      slide.style.transform = "none";
      return;
    }
    var distance = travel(slide);
    slide.style.transition = "none";
    slide.style.transform = "translate3d(0," + (-distance) + "px,0)";
    void slide.offsetWidth;
    slide.style.transition = "transform 18s linear, opacity 1.1s ease";
    slide.style.transform = "translate3d(0,0,0)";
  }

  function show(n) {
    var guard = 0;
    while (slides[n] && slides[n].classList.contains("is-cleared") && guard < slides.length) {
      n = (n + 1) % slides.length;
      guard += 1;
    }
    i = n;
    slides.forEach(function (s, k) {
      var on = k === n && !s.classList.contains("is-cleared");
      s.classList.toggle("is-active", on);
      if (on) play(s);
    });
    Array.prototype.forEach.call(dotsWrap.children, function (d, k) {
      d.classList.toggle("is-on", k === n);
      d.hidden = slides[k].classList.contains("is-cleared");
    });
  }

  function start() {
    slides.forEach(function (s) {
      if (!s.complete) s.addEventListener("load", function () { if (s.classList.contains("is-active")) play(s); }, { once: true });
    });
    play(slides[0]);
  }

  root.addEventListener("mouseenter", function () { paused = true; });
  root.addEventListener("mouseleave", function () { paused = false; });
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start);
  if (reduce) return;
  setInterval(function () {
    if (paused || root.getAttribute("data-paused") === "1") return;
    show((i + 1) % slides.length);
  }, 20000);
})();
