/* ============================================================
   HIMHERBAL — REFINEMENT PASS (motion)

   Masked line-reveal headings, the editorial move high-end
   manufacturer sites use: each heading is split into its real
   rendered lines, every line sits in an overflow-hidden mask,
   and the inner span slides up when the heading scrolls in.

   Deliberately restrained — reveals and hovers only, no ambient
   loops. Delete this file + css/refined.css to revert.

   TWO THINGS THAT MAKE OR BREAK THIS
   ----------------------------------
   1. SplitText freezes line boxes AT THE MOMENT IT RUNS. Split
      before the webfont loads, or while the element has no width
      (hidden tab, collapsed viewport, late layout), and a headline
      shatters into one-word-per-line. So: wait for fonts, refuse to
      split at zero width, and re-split when the width really changes.
   2. Nothing may stay hidden. css/refined.css only masks lines under
      `html.refined`, set here after a successful split and cleared by
      a watchdog if any on-screen line fails to reveal.
   ============================================================ */
(function () {
  "use strict";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  /* Headings worth the editorial treatment — deliberately NOT every
     heading, so the effect keeps its impact. Card titles stay static. */
  var SELECTOR = [
    ".section-head h2",
    ".about-copy h2",
    ".excellence-copy h2",
    ".global-copy h2",
    ".contact-copy h2",
    ".cta-band h2",
    ".portfolio-hero-copy h1",
    ".founder-copy h2"
  ].join(",");

  var heads = Array.prototype.slice.call(document.querySelectorAll(SELECTOR));
  if (!heads.length) return;

  var prepared = [];
  var lastWidth = 0;

  /* ---------- split one heading into masked lines ---------- */
  function splitToLines(el) {
    if (!el._origHTML) el._origHTML = el.innerHTML;   // pristine copy for re-splits

    if (window.SplitText) {
      try {
        var st = new window.SplitText(el, { type: "lines", linesClass: "ln" });
        st.lines.forEach(function (line) {
          var inner = document.createElement("span");
          while (line.firstChild) inner.appendChild(line.firstChild);
          line.appendChild(inner);
        });
        if (st.lines.length) return true;
      } catch (e) { /* fall through */ }
    }
    // Fallback: one mask around the whole heading — still reveals nicely.
    var wrap = document.createElement("span");
    wrap.className = "ln";
    var inner2 = document.createElement("span");
    while (el.firstChild) inner2.appendChild(el.firstChild);
    wrap.appendChild(inner2);
    el.appendChild(wrap);
    return true;
  }

  function revealHead(h) {
    h.querySelectorAll(".ln").forEach(function (l) { l.classList.add("in"); });
  }

  /* ---------- build (or rebuild) every heading ---------- */
  function build(reveal) {
    prepared = [];
    heads.forEach(function (h) {
      if (h._origHTML) h.innerHTML = h._origHTML;     // reset before re-splitting
      if (splitToLines(h)) prepared.push(h);
    });
    if (!prepared.length) return false;
    document.documentElement.classList.add("refined");
    if (reveal) prepared.forEach(revealHead);         // re-splits show instantly
    return true;
  }

  /* ---------- only split once the layout is real ---------- */
  function layoutReady() {
    return document.documentElement.clientWidth > 0 &&
           heads.some(function (h) { return h.getBoundingClientRect().width > 0; });
  }

  var started = false;
  function boot() {
    if (started) return;
    if (!layoutReady()) return;                       // try again on a later signal
    started = true;
    lastWidth = document.documentElement.clientWidth;
    if (!build(false)) return;
    observe();
    watchdog();
  }

  /* Try on fonts-ready (correct metrics), then keep retrying briefly in case
     the element still has no width — e.g. a background tab that hasn't laid out. */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(boot).catch(boot);
  }
  var tries = 0;
  var poll = setInterval(function () {
    boot();
    if (started || ++tries > 20) clearInterval(poll);  // give up after ~3s
  }, 150);
  window.addEventListener("load", boot);

  /* ---------- reveal on scroll-in ---------- */
  function observe() {
    if (!("IntersectionObserver" in window)) { prepared.forEach(revealHead); return; }
    var obs = new IntersectionObserver(function (entries, o) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { revealHead(en.target); o.unobserve(en.target); }
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -6% 0px" });
    prepared.forEach(function (h) { obs.observe(h); });
  }

  /* ---------- watchdog: never leave a visible headline masked ---------- */
  function watchdog() {
    setTimeout(function () {
      try {
        var stuck = prepared.filter(function (h) {
          var r = h.getBoundingClientRect();
          return r.top < window.innerHeight * 0.95 && r.bottom > 0 && !h.querySelector(".ln.in");
        });
        if (stuck.length) {
          prepared.forEach(revealHead);
          document.documentElement.classList.remove("refined");
        }
      } catch (e) {
        prepared.forEach(revealHead);
        document.documentElement.classList.remove("refined");
      }
    }, 3000);
  }

  /* ---------- re-split when the width genuinely changes ----------
     Line boxes depend on width, so stale lines look wrong after a resize
     or an orientation change. Ignore height-only changes (mobile URL bar). */
  var rid;
  window.addEventListener("resize", function () {
    if (!started) { boot(); return; }
    var w = document.documentElement.clientWidth;
    if (Math.abs(w - lastWidth) < 40) return;
    lastWidth = w;
    clearTimeout(rid);
    rid = setTimeout(function () { build(true); }, 200);
  }, { passive: true });
})();
