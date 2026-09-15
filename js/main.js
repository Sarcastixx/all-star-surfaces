(function () {
  var toggle = document.querySelector("[data-menu]");
  var panel = document.querySelector("[data-mobile-nav]");
  if (!toggle || !panel) return;
  toggle.addEventListener("click", function () {
    var open = panel.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
})();
(function () {
  var form = document.querySelector("[data-quote-form]");
  var thanks = document.querySelector("[data-thanks]");
  if (!form || !thanks) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = new FormData(form);
    var name = String(data.get("name") || "").trim();
    var phone = String(data.get("phone") || "").trim();
    var email = String(data.get("email") || "").trim();
    var alt = String(data.get("altEmail") || "").trim();
    var type = String(data.get("projectType") || "").trim();
    var notes = String(data.get("notes") || "").trim();
    var body = ["Name: " + name, "Phone: " + phone, "Email: " + email, alt ? "Second email: " + alt : "", "Project: " + type, "", notes].filter(Boolean).join("\n");
    window.location.href = "mailto:hello@all-star-flooring.com?subject=" + encodeURIComponent("Quote request from " + name) + "&body=" + encodeURIComponent(body);
    form.hidden = true;
    thanks.hidden = false;
    var who = thanks.querySelector("[data-who]");
    if (who) who.textContent = name.split(" ")[0] || "";
  });
})();
