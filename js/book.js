(function () {
  var root = document.querySelector("[data-calendar]");
  if (!root) return;
  var form = root.closest("form");
  var dateInput = form.querySelector("[data-visit-date]");
  var timeInput = form.querySelector("[data-visit-time]");
  var when = document.querySelector("[data-when]");
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var week = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  var selected = null;
  var view = new Date();
  view.setDate(1);
  view.setHours(0, 0, 0, 0);

  function dayStart(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  function addDays(d, n) {
    var x = dayStart(d);
    x.setDate(x.getDate() + n);
    return x;
  }
  function earliest() { return addDays(new Date(), 1); }
  function latest() { return addDays(new Date(), 60); }
  function sameDay(a, b) {
    return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }
  function pretty(d) {
    return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  }
  function hourLabel(h) {
    var suffix = h >= 12 ? "PM" : "AM";
    var hr = h % 12 || 12;
    return hr + " " + suffix;
  }
  function hoursFor(d) {
    if (d.getDay() === 0) return [];
    if (d.getDay() === 6) return [9, 10, 11, 12, 13, 14, 15];
    return [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
  }
  function canOpen(d) {
    var t = dayStart(d);
    return d.getDay() !== 0 && t >= earliest() && t <= latest();
  }
  function syncWhen() {
    if (!when) return;
    if (dateInput.value && timeInput.value) when.textContent = dateInput.value + " at " + timeInput.value;
    else when.textContent = "your visit";
  }

  function paintTimes() {
    var box = root.querySelector("[data-times]");
    box.innerHTML = "";
    if (!selected) {
      box.hidden = true;
      return;
    }
    box.hidden = false;
    var hours = hoursFor(selected);
    var groups = selected.getDay() === 6
      ? [{ label: "Saturday appointment", hours: hours }]
      : [
          { label: "Showroom", hours: hours.filter(function (h) { return h < 16; }) },
          { label: "After hours", hours: hours.filter(function (h) { return h >= 16; }) }
        ];
    groups.forEach(function (group) {
      var label = document.createElement("p");
      label.className = "book-time-label";
      label.textContent = group.label;
      box.appendChild(label);
      var grid = document.createElement("div");
      grid.className = "hour-grid";
      group.hours.forEach(function (h) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "hour";
        var text = hourLabel(h);
        btn.textContent = text;
        if (timeInput.value === text) btn.classList.add("is-on");
        btn.addEventListener("click", function () {
          timeInput.value = text;
          syncWhen();
          paintTimes();
        });
        grid.appendChild(btn);
      });
      box.appendChild(grid);
    });
  }

  function paint() {
    var first = new Date(view.getFullYear(), view.getMonth(), 1);
    var start = new Date(first);
    start.setDate(1 - first.getDay());
    var monthName = months[view.getMonth()] + " " + view.getFullYear();
    var prevOff = new Date(view.getFullYear(), view.getMonth(), 1) <= new Date(earliest().getFullYear(), earliest().getMonth(), 1);
    var nextLimit = latest();
    var nextOff = new Date(view.getFullYear(), view.getMonth() + 1, 1) > nextLimit;
    var cells = "";
    for (var i = 0; i < 42; i++) {
      var d = new Date(start);
      d.setDate(start.getDate() + i);
      var outside = d.getMonth() !== view.getMonth();
      var open = !outside && canOpen(d);
      var on = selected && sameDay(d, selected);
      var cls = "book-day" + (outside ? " is-out" : "") + (open ? "" : " is-off") + (on ? " is-on" : "");
      cells += '<button type="button" class="' + cls + '"' + (open ? "" : " disabled") + ' data-date="' + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + '">' + d.getDate() + "</button>";
    }
    root.innerHTML =
      '<div class="book-cal">' +
        '<div class="book-head">' +
          '<button type="button" class="book-nav" data-prev' + (prevOff ? " disabled" : "") + ' aria-label="Previous month">\u2039</button>' +
          '<p class="book-month">' + monthName + "</p>" +
          '<button type="button" class="book-nav" data-next' + (nextOff ? " disabled" : "") + ' aria-label="Next month">\u203a</button>' +
        "</div>" +
        '<div class="book-week">' + week.map(function (d) { return "<span>" + d + "</span>"; }).join("") + "</div>" +
        '<div class="book-grid">' + cells + "</div>" +
      "</div>" +
        '<div class="book-times" data-times hidden></div>';
    root.querySelector("[data-prev]").addEventListener("click", function () {
      view.setMonth(view.getMonth() - 1);
      paint();
    });
    root.querySelector("[data-next]").addEventListener("click", function () {
      view.setMonth(view.getMonth() + 1);
      paint();
    });
    root.querySelectorAll(".book-day:not(.is-off)").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var parts = btn.getAttribute("data-date").split("-");
        selected = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        dateInput.value = pretty(selected);
        timeInput.value = "";
        syncWhen();
        paint();
      });
    });
    paintTimes();
  }

  if (form) {
    form.addEventListener("submit", syncWhen);
  }
  paint();
})();
