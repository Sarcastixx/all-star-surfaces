(function () {
  var form = document.querySelector("[data-survey]");
  if (!form) return;
  var slides = Array.prototype.slice.call(form.querySelectorAll("[data-step]"));
  var back = form.querySelector("[data-survey-back]");
  var next = form.querySelector("[data-survey-next]");
  var send = form.querySelector("[data-survey-send]");
  var count = form.querySelector("[data-survey-count]");
  var bar = form.querySelector("[data-survey-bar]");
  var error = form.querySelector("[data-survey-error]");
  var index = 0;

  var params = new URLSearchParams(window.location.search);
  var remnant = params.get("remnant");
  if (remnant) {
    var note = form.querySelector("[data-remnant-note]");
    if (note) {
      note.hidden = false;
      note.textContent = "Remnant " + remnant + " will be included with this request.";
    }
  }

  function syncRooms() {
    var picked = form.querySelectorAll("input[name=areas]:checked");
    var rooms = form.querySelector("input[name=rooms]");
    if (!rooms) return;
    var whole = false;
    picked.forEach(function (box) {
      if (box.value === "Whole home") whole = true;
    });
    if (!picked.length) rooms.value = "";
    else if (whole) rooms.value = "Full house";
    else if (picked.length >= 9) rooms.value = "9+";
    else rooms.value = String(picked.length);
  }

  function showError(message) {
    if (!error) return;
    error.hidden = false;
    error.textContent = message;
  }

  function currentValid() {
    var slide = slides[index];
    if (!slide) return true;
    var radios = slide.querySelectorAll("input[type=radio]");
    if (radios.length && !slide.querySelector("input[type=radio]:checked")) {
      showError("Choose one to continue.");
      return false;
    }
    var boxes = slide.querySelectorAll("input[type=checkbox]");
    if (boxes.length && !slide.querySelector("input[type=checkbox]:checked")) {
      showError("Pick at least one. None of these is fine.");
      return false;
    }
    var city = slide.querySelector("input[name=city]");
    if (city && city.value.trim().length < 2) {
      showError("Add the city so we know we cover the house.");
      return false;
    }
    var name = slide.querySelector("input[name=name]");
    if (name && name.value.trim().length < 2) {
      showError("Add your name.");
      return false;
    }
    var phone = slide.querySelector("input[name=phone]");
    if (phone && phone.value.replace(/\D/g, "").length < 10) {
      showError("Add a phone number we can call.");
      return false;
    }
    var email = slide.querySelector("input[name=email]");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      showError("Add an email we can reply to.");
      return false;
    }
    if (error) error.hidden = true;
    return true;
  }

  function show(n, focusHeading) {
    index = n;
    slides.forEach(function (slide, i) {
      var on = i === index;
      slide.hidden = !on;
      slide.classList.toggle("is-on", on);
    });
    var tone = slides[index] && slides[index].getAttribute("data-tone");
    if (tone) form.setAttribute("data-tone", tone);
    if (back) back.hidden = index === 0;
    if (next) next.hidden = index === slides.length - 1;
    if (send) send.hidden = index !== slides.length - 1;
    if (count) count.textContent = index + 1 + " of " + slides.length;
    if (bar) bar.style.width = ((index + 1) / slides.length) * 100 + "%";
    if (error) error.hidden = true;
    if (focusHeading) {
      var heading = slides[index].querySelector("h1");
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus();
      }
    }
  }

  form.addEventListener("change", function (e) {
    var target = e.target;
    if (!target || target.name !== "details") return;
    var group = form.querySelectorAll("input[name=details]");
    if (target.value === "None of these" && target.checked) {
      group.forEach(function (box) {
        if (box !== target) box.checked = false;
      });
    } else if (target.checked) {
      group.forEach(function (box) {
        if (box.value === "None of these") box.checked = false;
      });
    }
  });

  if (next) {
    next.addEventListener("click", function () {
      if (!currentValid()) return;
      syncRooms();
      if (index < slides.length - 1) show(index + 1, true);
    });
  }
  if (back) {
    back.addEventListener("click", function () {
      if (index > 0) show(index - 1, true);
    });
  }

  form.addEventListener("submit", function (e) {
    syncRooms();
    if (index !== slides.length - 1 || !currentValid()) {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (index < slides.length - 1 && currentValid()) show(index + 1, true);
    }
  }, true);

  show(0, false);

  var fileInput = form.querySelector("input[type=file]");
  var preview = form.querySelector("[data-photo-preview]");
  if (fileInput && preview) {
    fileInput.addEventListener("change", function () {
      preview.innerHTML = "";
      Array.prototype.forEach.call(fileInput.files, function (file) {
        if (!file.type || file.type.indexOf("image/") !== 0) return;
        var img = document.createElement("img");
        img.alt = "";
        img.src = URL.createObjectURL(file);
        preview.appendChild(img);
      });
    });
  }
})();
