/* ============================================================
   BLAST Circuit Lab — the circuit builder
   Six spots around one loop. Fill them all, close the switch,
   and the electricity flows.
   ============================================================ */
(function () {
  "use strict";

  var SLOT_COUNT = 6;
  var ELECTRON_COUNT = 9;
  var VIEW_W = 600, VIEW_H = 400;

  /* how many of each part we hand out */
  var PARTS = {
    battery: { label: "Battery", total: 1 },
    bulb:    { label: "Bulb",    total: 1 },
    switch:  { label: "Switch",  total: 1 },
    wire:    { label: "Wire",    total: 3 }
  };

  var board, slotsEl, electronsEl, statusEl, statusEmoji, statusText, progressFill, progressLabel;
  var trayButtons = {};
  var slots = [];            // null, or { type: "wire" } / { type: "switch", open: true }
  var picked = null;         // part type currently selected in the tray
  var litOnce = false;
  var rafId = null, travelled = 0, loopLength = 0, loopPath = null;
  var electronEls = [];

  /* ---------------- tiny helpers ---------------- */
  function $(id) { return document.getElementById(id); }

  function sound(name) {
    if (window.BlastSound && window.BlastSound.play) window.BlastSound.play(name);
  }
  function toast(msg) {
    if (window.BlastToast) window.BlastToast(msg);
  }

  function countPlaced(type) {
    var n = 0;
    for (var i = 0; i < slots.length; i++) if (slots[i] && slots[i].type === type) n++;
    return n;
  }

  function isComplete() {
    for (var i = 0; i < slots.length; i++) if (!slots[i]) return false;
    return true;
  }

  function switchSlotIndex() {
    for (var i = 0; i < slots.length; i++) if (slots[i] && slots[i].type === "switch") return i;
    return -1;
  }

  function isLive() {
    var i = switchSlotIndex();
    return isComplete() && i !== -1 && slots[i].open === false;
  }

  /* ---------------- building the board ---------------- */
  function buildSlots() {
    var path = $("loopPath");
    loopPath = path;
    loopLength = path.getTotalLength();

    for (var i = 0; i < SLOT_COUNT; i++) {
      var frac = (i + 0.5) / SLOT_COUNT;             // centre of each sixth of the loop
      var pt = path.getPointAtLength(frac * loopLength);

      var el = document.createElement("div");
      el.className = "slot";
      el.setAttribute("role", "button");
      el.setAttribute("tabindex", "0");
      el.dataset.index = String(i);
      el.style.left = (pt.x / VIEW_W * 100) + "%";
      el.style.top = (pt.y / VIEW_H * 100) + "%";
      el.setAttribute("aria-label", "Empty spot " + (i + 1) + " on the circuit board");
      el.innerHTML =
        '<span class="slot-num" aria-hidden="true">' + (i + 1) + "</span>" +
        '<button class="slot-remove" type="button" tabindex="-1" aria-label="Take this part out">✕</button>';

      el.addEventListener("click", onSlotClick);
      el.addEventListener("keydown", onSlotKey);
      el.querySelector(".slot-remove").addEventListener("click", onRemoveClick);

      slotsEl.appendChild(el);
      slots.push(null);
    }

    for (var e = 0; e < ELECTRON_COUNT; e++) {
      var dot = document.createElement("div");
      dot.className = "electron";
      electronsEl.appendChild(dot);
      electronEls.push(dot);
    }
  }

  /* ---------------- drawing the board ---------------- */
  function render() {
    var slotEls = slotsEl.children;
    for (var i = 0; i < slotEls.length; i++) {
      var el = slotEls[i];
      var part = slots[i];
      var removeBtn = el.querySelector(".slot-remove");

      el.classList.toggle("is-filled", !!part);
      el.classList.toggle("is-target", !!picked && !part);

      if (!part) {
        el.dataset.part = "";
        el.classList.remove("is-lit");
        el.innerHTML = '<span class="slot-num" aria-hidden="true">' + (i + 1) + "</span>";
        el.appendChild(removeBtn);
        el.setAttribute("aria-label", "Empty spot " + (i + 1) + " on the circuit board");
        continue;
      }

      var state = part.type === "switch" ? (part.open ? "open" : "closed")
                : part.type === "bulb"   ? (isLive() ? "on" : "off")
                : undefined;

      el.dataset.part = part.type;
      el.innerHTML = '<span class="slot-icon">' + window.BlastIcon(part.type, state) + "</span>";
      el.appendChild(removeBtn);

      var lit = part.type === "bulb" && isLive();
      el.classList.toggle("is-lit", lit);

      if (part.type === "switch") {
        el.setAttribute("aria-label",
          (part.open ? "Open" : "Closed") + " switch. Press to " + (part.open ? "close" : "open") + " it.");
      } else {
        el.setAttribute("aria-label", PARTS[part.type].label + " in spot " + (i + 1) + ". Press the cross to take it out.");
      }
    }

    renderTray();
    renderStatus();
    renderElectrons();
  }

  function renderTray() {
    for (var type in PARTS) {
      var left = PARTS[type].total - countPlaced(type);
      var btn = trayButtons[type];
      if (!btn) continue;
      var badge = btn.querySelector('[data-count="' + type + '"]');
      if (badge) badge.textContent = left > 0 ? left + " left" : "✔ all used";
      btn.classList.toggle("is-picked", picked === type);
      btn.setAttribute("aria-pressed", picked === type ? "true" : "false");
      btn.disabled = left <= 0 && picked !== type;
      btn.style.opacity = left <= 0 ? ".5" : "";
    }
  }

  function renderStatus() {
    var filled = 0;
    for (var i = 0; i < slots.length; i++) if (slots[i]) filled++;

    progressFill.style.width = (filled / SLOT_COUNT * 100) + "%";
    progressLabel.textContent = filled + " of " + SLOT_COUNT + " spots filled";

    statusEl.classList.remove("is-win", "is-warn");

    if (isLive()) {
      statusEl.classList.add("is-win");
      statusEmoji.textContent = "💡";
      statusText.textContent = "WOW! Your circuit is complete and the switch is closed. Electricity is racing around the loop and the bulb is glowing!";
      return;
    }
    if (isComplete()) {
      statusEl.classList.add("is-warn");
      statusEmoji.textContent = "🎚️";
      statusText.textContent = "Your loop is complete! Now tap the switch to close it and let the electricity through.";
      return;
    }

    var missing = [];
    for (var type in PARTS) {
      var left = PARTS[type].total - countPlaced(type);
      if (left > 0) missing.push(left + " × " + PARTS[type].label.toLowerCase() + (left > 1 ? "s" : ""));
    }
    statusEmoji.textContent = "🧩";
    if (filled === 0) {
      statusText.textContent = "Pop a part into each circle to build your loop. You need a battery, a bulb, a switch and 3 wires.";
    } else {
      statusText.textContent = "Nice start! Still to add: " + missing.join(", ") + ".";
    }
  }

  /* ---------------- electricity animation ---------------- */
  function renderElectrons() {
    var live = isLive();
    board.classList.toggle("is-live", live);
    for (var i = 0; i < electronEls.length; i++) electronEls[i].style.display = live ? "block" : "none";

    if (live && rafId === null) {
      rafId = requestAnimationFrame(tick);
    } else if (!live && rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function tick() {
    rafId = requestAnimationFrame(tick);
    travelled = (travelled + 0.0022) % 1;
    for (var i = 0; i < electronEls.length; i++) {
      var frac = (travelled + i / electronEls.length) % 1;
      var pt = loopPath.getPointAtLength(frac * loopLength);
      electronEls[i].style.left = (pt.x / VIEW_W * 100) + "%";
      electronEls[i].style.top = (pt.y / VIEW_H * 100) + "%";
    }
  }

  /* ---------------- interactions ---------------- */
  function pickPart(type) {
    picked = picked === type ? null : type;
    sound("tap");
    render();
  }

  function placePart(index, type) {
    if (type === "wire" && countPlaced("wire") >= PARTS.wire.total) {
      toast("You already used all 3 wires!");
      return;
    }
    if (type !== "wire" && countPlaced(type) >= PARTS[type].total) {
      toast("You only need one " + PARTS[type].label.toLowerCase() + "!");
      return;
    }
    slots[index] = type === "switch" ? { type: "switch", open: true } : { type: type };
    picked = null;
    sound("place");
    render();
    celebrateIfLive();
  }

  function onSlotClick(ev) {
    var el = ev.currentTarget;
    var index = Number(el.dataset.index);
    var part = slots[index];

    if (part) {
      if (part.type === "switch") {
        part.open = !part.open;
        sound(part.open ? "off" : "on");
        render();
        celebrateIfLive();
        if (part.open) toast("The switch is open — that makes a gap, so the electricity stops.");
        return;
      }
      toast("Tap the ✕ to take the " + PARTS[part.type].label.toLowerCase() + " out.");
      return;
    }

    if (!picked) {
      toast("First pick a part from the parts box 👉");
      sound("nope");
      return;
    }
    placePart(index, picked);
  }

  function onSlotKey(ev) {
    if (ev.key === "Enter" || ev.key === " " || ev.key === "Spacebar") {
      ev.preventDefault();
      onSlotClick(ev);
    }
  }

  function onRemoveClick(ev) {
    ev.stopPropagation();
    var el = ev.currentTarget.closest(".slot");
    var index = Number(el.dataset.index);
    if (!slots[index]) return;
    slots[index] = null;
    sound("remove");
    render();
  }

  function celebrateIfLive() {
    if (!isLive()) { litOnce = false; return; }
    if (litOnce) return;
    litOnce = true;
    sound("win");
    toast("💡 You built a complete circuit — well done!");
  }

  /* ---------------- buttons ---------------- */
  function onHint() {
    if (isLive()) {
      toast("You already did it! Your circuit is complete and glowing. 🎉");
      return;
    }
    if (isComplete()) {
      toast("Almost there — tap the switch on the board to close the loop.");
      return;
    }
    for (var type in PARTS) {
      var left = PARTS[type].total - countPlaced(type);
      if (left > 0) {
        toast("Hint: add " + (left > 1 ? left + " " : "a ") + PARTS[type].label.toLowerCase() +
              (left > 1 ? "s" : "") + " next.");
        return;
      }
    }
  }

  function reset() {
    slots = [];
    for (var i = 0; i < SLOT_COUNT; i++) slots.push(null);
    picked = null;
    litOnce = false;
    sound("remove");
    render();
    toast("Fresh board! Let's build again. 🔧");
  }

  /* ---------------- start-up ---------------- */
  function init() {
    board = $("board");
    slotsEl = $("slots");
    electronsEl = $("electrons");
    statusEl = $("status");
    statusEmoji = statusEl.querySelector(".status-emoji");
    statusText = statusEl.querySelector(".status-text");
    progressFill = $("progressFill");
    progressLabel = $("progressLabel");

    var parts = document.querySelectorAll(".part");
    for (var i = 0; i < parts.length; i++) {
      var btn = parts[i];
      var type = btn.dataset.part;
      trayButtons[type] = btn;

      var iconBox = btn.querySelector(".part-icon");
      if (iconBox) iconBox.innerHTML = window.BlastIcon(type, type === "switch" ? "open" : "off");

      btn.setAttribute("aria-pressed", "false");
      btn.addEventListener("click", function () { pickPart(this.dataset.part); });
      btn.addEventListener("dragstart", function (ev) {
        ev.dataTransfer.setData("text/plain", this.dataset.part);
        ev.dataTransfer.effectAllowed = "copy";
        this.classList.add("is-dragging");
      });
      btn.addEventListener("dragend", function () { this.classList.remove("is-dragging"); });
    }

    buildSlots();

    slotsEl.addEventListener("dragover", function (ev) {
      var slot = ev.target.closest(".slot");
      if (!slot) return;
      ev.preventDefault();
      slot.classList.add("is-target");
    });
    slotsEl.addEventListener("dragleave", function (ev) {
      var slot = ev.target.closest(".slot");
      if (slot) slot.classList.remove("is-target");
    });
    slotsEl.addEventListener("drop", function (ev) {
      var slot = ev.target.closest(".slot");
      if (!slot) return;
      ev.preventDefault();
      var type = ev.dataTransfer.getData("text/plain");
      var index = Number(slot.dataset.index);
      if (!PARTS[type]) return;
      if (slots[index]) { toast("That spot is already full!"); return; }
      placePart(index, type);
    });

    $("hintButton").addEventListener("click", onHint);
    $("resetButton").addEventListener("click", reset);

    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
