/* ============================================================
   BLAST Circuit Lab — the quiz
   ============================================================ */
(function () {
  "use strict";

  var LETTERS = ["A", "B", "C", "D"];

  var questions = [];
  var index = 0;
  var score = 0;
  var answered = false;

  var els = {};

  function $(id) { return document.getElementById(id); }
  function sound(name) {
    if (window.BlastSound && window.BlastSound.play) window.BlastSound.play(name);
  }

  function start() {
    questions = window.BlastContent.quiz;
    index = 0;
    score = 0;
    answered = false;
    els.result.hidden = true;
    els.body.hidden = false;
    renderQuestion();
  }

  function renderQuestion() {
    answered = false;
    var q = questions[index];

    els.progress.textContent = "Question " + (index + 1) + " of " + questions.length;
    els.score.textContent = "⭐ " + score + (score === 1 ? " star" : " stars");
    els.question.textContent = q.q;
    els.feedback.className = "feedback";
    els.feedback.textContent = "";
    els.next.hidden = true;
    els.next.textContent = index === questions.length - 1 ? "See my stars 🌟" : "Next question ➡️";

    els.answers.innerHTML = "";
    q.answers.forEach(function (text, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "answer";
      btn.dataset.index = String(i);
      btn.innerHTML = '<span class="answer-letter" aria-hidden="true">' + LETTERS[i] + "</span><span>" + text + "</span>";
      btn.addEventListener("click", function () { choose(i); });
      els.answers.appendChild(btn);
    });
  }

  function choose(picked) {
    if (answered) return;
    answered = true;

    var q = questions[index];
    var buttons = els.answers.querySelectorAll(".answer");
    var right = picked === q.correct;

    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      btn.disabled = true;
      var n = Number(btn.dataset.index);
      if (n === q.correct) btn.classList.add("is-correct");
      else if (n === picked) btn.classList.add("is-wrong");
    }

    if (right) {
      score++;
      els.score.textContent = "⭐ " + score + (score === 1 ? " star" : " stars");
      els.feedback.className = "feedback show good";
      els.feedback.textContent = "✅ Yes! " + q.explain;
      sound("on");
    } else {
      els.feedback.className = "feedback show bad";
      els.feedback.textContent = "❌ Not quite — the answer is " + LETTERS[q.correct] + ". " + q.explain;
      sound("nope");
    }

    els.next.hidden = false;
    els.next.focus();
  }

  function next() {
    if (index === questions.length - 1) {
      showResult();
      return;
    }
    index++;
    renderQuestion();
  }

  function showResult() {
    var total = questions.length;
    var pct = score / total;
    var stars = pct >= 0.85 ? 3 : pct >= 0.6 ? 2 : pct >= 0.35 ? 1 : 0;

    els.body.hidden = true;
    els.result.hidden = false;

    var emoji, title;
    if (stars === 3)      { emoji = "🏆"; title = "Electrifying! You're a circuit expert!"; }
    else if (stars === 2) { emoji = "🌟"; title = "Great work, super scientist!"; }
    else if (stars === 1) { emoji = "👍"; title = "Nice try — you're getting there!"; }
    else                  { emoji = "🔌"; title = "Good start! Let's try again together."; }

    els.resultEmoji.textContent = emoji;
    els.resultTitle.textContent = title;
    els.resultText.textContent = "You got " + score + " out of " + total + " questions right.";

    var starHtml = "";
    for (var s = 0; s < 3; s++) {
      starHtml += s < stars ? '<span class="star-on">⭐</span>' : '<span class="star-off">⭐</span>';
    }
    els.resultStars.innerHTML = starHtml;

    sound(stars >= 2 ? "win" : "tap");
  }

  function init() {
    els.progress = $("quizProgress");
    els.score = $("quizScore");
    els.question = $("quizQuestion");
    els.answers = $("quizAnswers");
    els.feedback = $("quizFeedback");
    els.next = $("nextQuestion");
    els.body = $("quizBody");
    els.result = $("quizResult");
    els.resultEmoji = $("resultEmoji");
    els.resultTitle = $("resultTitle");
    els.resultText = $("resultText");
    els.resultStars = $("resultStars");

    els.next.addEventListener("click", next);
    $("restartQuiz").addEventListener("click", start);

    start();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
