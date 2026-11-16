/* ============================================================
   BLAST Circuit Lab — component drawings (inline SVG)
   Every part is drawn as an SVG so it looks the same everywhere.
   ============================================================ */
(function () {
  "use strict";

  var SVG_OPEN = '<svg viewBox="0 0 60 48" xml:space="preserve">';
  var FONT = 'font-family="Verdana,DejaVu Sans,sans-serif"';

  function battery() {
    return (
      SVG_OPEN +
      '<rect x="4" y="11" width="44" height="26" rx="7" fill="#ffcf33" stroke="#a97400" stroke-width="3"/>' +
      '<rect x="4" y="19" width="44" height="9" fill="#5b6472" opacity="0.16"/>' +
      '<rect x="48" y="18" width="8" height="12" rx="3" fill="#cfd6e0" stroke="#8b95a5" stroke-width="2.5"/>' +
      '<text x="17" y="31" font-size="17" font-weight="700" text-anchor="middle" fill="#7a5400" ' + FONT + '>−</text>' +
      '<text x="35" y="31" font-size="17" font-weight="700" text-anchor="middle" fill="#7a5400" ' + FONT + '>+</text>' +
      "</svg>"
    );
  }

  function bulb(state) {
    var lit = state === "on";
    var glass = lit ? "#ffe680" : "#e8f1ff";
    var edge = lit ? "#f5a623" : "#7f8fa6";
    var filament = lit ? "#ff7a18" : "#8b95a5";
    var rays = "";
    if (lit) {
      rays =
        '<g stroke="#ffc400" stroke-width="3" stroke-linecap="round">' +
        '<line x1="30" y1="0.5" x2="30" y2="5"/>' +
        '<line x1="9" y1="8" x2="13" y2="11"/>' +
        '<line x1="51" y1="8" x2="47" y2="11"/>' +
        '<line x1="2" y1="24" x2="7" y2="23"/>' +
        '<line x1="58" y1="24" x2="53" y2="23"/>' +
        "</g>";
    }
    return (
      SVG_OPEN +
      rays +
      '<circle cx="30" cy="19" r="15" fill="' + glass + '" stroke="' + edge + '" stroke-width="3"/>' +
      '<path d="M24 25 q3 -9 6 0 q3 9 6 0" fill="none" stroke="' + filament + '" stroke-width="2.6" stroke-linecap="round"/>' +
      '<rect x="21" y="32" width="18" height="6" rx="2" fill="#9aa6b6"/>' +
      '<rect x="23" y="38" width="14" height="6" rx="2" fill="#7f8fa6"/>' +
      "</svg>"
    );
  }

  function switchPart(state) {
    var closed = state !== "open";
    var lever = closed
      ? '<line x1="11" y1="31" x2="49" y2="31" stroke="#22c55e" stroke-width="6" stroke-linecap="round"/>'
      : '<line x1="11" y1="31" x2="45" y2="13" stroke="#ef4444" stroke-width="6" stroke-linecap="round"/>';
    return (
      SVG_OPEN +
      '<rect x="3" y="24" width="54" height="14" rx="4" fill="#eef2f8" stroke="#c3cddc" stroke-width="2"/>' +
      '<circle cx="11" cy="31" r="5" fill="#4b5563"/>' +
      '<circle cx="49" cy="31" r="5" fill="#4b5563"/>' +
      lever +
      "</svg>"
    );
  }

  function wire() {
    return (
      SVG_OPEN +
      '<path d="M4 24 q14 -15 28 0 q14 15 24 0" fill="none" stroke="#8b95a5" stroke-width="6" stroke-linecap="round"/>' +
      '<circle cx="4" cy="24" r="5" fill="#6b7686"/>' +
      '<circle cx="56" cy="24" r="5" fill="#6b7686"/>' +
      "</svg>"
    );
  }

  /**
   * @param {string} type  battery | bulb | switch | wire
   * @param {string} [state]  for bulb: "on"/"off"; for switch: "open"/"closed"
   * @returns {string} SVG markup
   */
  function BlastIcon(type, state) {
    switch (type) {
      case "battery": return battery();
      case "bulb": return bulb(state);
      case "switch": return switchPart(state);
      case "wire": return wire();
      default: return "";
    }
  }

  window.BlastIcon = BlastIcon;
})();
