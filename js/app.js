/* ============================================================
   BLAST Circuit Lab — tabs, sounds, facts and the timeline
   ============================================================ */
(function () {
  "use strict";

  function $(id) { return document.getElementById(id); }

  /* ---------------- friendly error banner (so problems are visible) ---------------- */
  function showError(msg) {
    var bar = $("errorBar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "errorBar";
      bar.style.cssText =
        "position:fixed;left:0;right:0;bottom:0;z-index:200;background:#b91c1c;color:#fff;" +
        "padding:10px 16px;font:700 14px/1.4 Verdana,sans-serif;text-align:center;";
      document.body.appendChild(bar);
    }
    bar.textContent = "Something went wrong on this page: " + msg;
  }
  window.addEventListener("error", function (e) { showError(e.message || "unknown error"); });
  window.addEventListener("unhandledrejection", function (e) {
    showError((e.reason && e.reason.message) || "unknown error");
  });

  /* ---------------- little sounds (Web Audio, no files needed) ---------------- */
  var soundOn = true;
  var ctx = null;

  function audio() {
    if (!soundOn) return null;
    try {
      if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === "suspended") ctx.resume();
      return ctx;
    } catch (err) { return null; }
  }

  function beep(freq, start, dur, type, volume) {
    var ac = audio();
    if (!ac) return;
    var osc = ac.createOscillator();
    var gain = ac.createGain();
    osc.type = type || "sine";
    osc.frequency.value = freq;
    var t0 = ac.currentTime + start;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(volume || 0.16, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.03);
  }

  var SOUNDS = {
    tap:    function () { beep(520, 0, 0.10, "triangle", 0.12); },
    place:  function () { beep(600, 0, 0.10, "triangle", 0.16); beep(820, 0.06, 0.12, "triangle", 0.13); },
    remove: function () { beep(320, 0, 0.12, "sine", 0.14); },
    on:     function () { beep(560, 0, 0.12, "square", 0.10); beep(880, 0.07, 0.16, "square", 0.08); },
    off:    function () { beep(420, 0, 0.16, "sine", 0.13); },
    nope:   function () { beep(200, 0, 0.20, "sawtooth", 0.09); },
    win:    function () {
      [523, 659, 784, 1047].forEach(function (f, i) { beep(f, i * 0.11, 0.24, "triangle", 0.14); });
    }
  };

  window.BlastSound = {
    play: function (name) { if (SOUNDS[name]) SOUNDS[name](); },
    isOn: function () { return soundOn; }
  };

  /* ---------------- toast ---------------- */
  var toastEl, toastTimer = null;
  window.BlastToast = function (message, ms) {
    if (!toastEl) toastEl = $("toast");
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.hidden = false;
    requestAnimationFrame(function () { toastEl.classList.add("show"); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("show");
      setTimeout(function () { toastEl.hidden = true; }, 320);
    }, ms || 3200);
  };

  /* ---------------- tabs ---------------- */
  function goToTab(name) {
    var tabs = document.querySelectorAll(".tab");
    var panels = document.querySelectorAll(".panel");
    for (var i = 0; i < tabs.length; i++) {
      var on = tabs[i].dataset.tab === name;
      tabs[i].classList.toggle("is-active", on);
      tabs[i].setAttribute("aria-selected", on ? "true" : "false");
    }
    for (var j = 0; j < panels.length; j++) {
      panels[j].classList.toggle("is-active", panels[j].id === "panel-" + name);
    }
  }

  function initTabs() {
    var tabs = document.querySelectorAll(".tab");
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener("click", function () {
        goToTab(this.dataset.tab);
        window.BlastSound.play("tap");
      });
    }
  }

  /* ---------------- fun fact cards ---------------- */
  var factCards = [];

  function initFacts() {
    var grid = $("factsGrid");
    var facts = window.BlastContent.facts;
    facts.forEach(function (f, i) {
      var card = document.createElement("button");
      card.type = "button";
      card.className = "fact";
      card.setAttribute("aria-pressed", "false");
      card.setAttribute("aria-label", "Fun fact " + (i + 1) + ": " + f.title + ". Tap to reveal.");
      card.innerHTML =
        '<div class="fact-inner">' +
          '<div class="fact-face fact-front">' +
            '<span class="fact-emoji" aria-hidden="true">' + f.emoji + "</span>" +
            '<span class="fact-title">' + f.title + "</span>" +
            '<span class="fact-tap">👆 tap to flip</span>' +
          "</div>" +
          '<div class="fact-face fact-back">' +
            '<span class="fact-text">' + f.text + "</span>" +
          "</div>" +
        "</div>";
      card.addEventListener("click", function () {
        var flipped = card.classList.toggle("is-flipped");
        card.setAttribute("aria-pressed", flipped ? "true" : "false");
        card.setAttribute("aria-label", "Fun fact " + (i + 1) + ": " + (flipped ? f.text : f.title + ". Tap to reveal."));
        window.BlastSound.play("tap");
      });
      grid.appendChild(card);
      factCards.push(card);
    });
  }

  function randomFact() {
    goToTab("facts");
    var i = Math.floor(Math.random() * factCards.length);
    var card = factCards[i];
    card.classList.add("is-flipped");
    card.setAttribute("aria-pressed", "true");
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    window.BlastSound.play("place");
    window.BlastToast("Here's a fun fact for you! 🤯");
  }

  /* ---------------- discoveries timeline ---------------- */
  function initTimeline() {
    var box = $("timeline");
    window.BlastContent.discoveries.forEach(function (d) {
      var item = document.createElement("article");
      item.className = "discovery";
      item.innerHTML =
        '<span class="when">' + d.when + "</span>" +
        "<h3>" + d.title + "</h3>" +
        '<p class="who">' + d.who + "</p>" +
        "<p>" + d.text + "</p>";
      box.appendChild(item);
    });
  }

  /* ---------------- sound toggle ---------------- */
  function initSoundToggle() {
    var btn = $("soundToggle");
    btn.addEventListener("click", function () {
      soundOn = !soundOn;
      btn.setAttribute("aria-pressed", soundOn ? "true" : "false");
      btn.textContent = soundOn ? "🔊 Sound: On" : "🔇 Sound: Off";
      if (soundOn) window.BlastSound.play("on");
    });
  }

  /* ---------------- start ---------------- */
  function init() {
    toastEl = $("toast");
    initTabs();
    initFacts();
    initTimeline();
    initSoundToggle();
    $("factButton").addEventListener("click", randomFact);

    // A tap anywhere unlocks sound on browsers that need a gesture.
    document.addEventListener("pointerdown", function once() {
      audio();
      document.removeEventListener("pointerdown", once);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
