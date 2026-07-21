/* ============================================================
   Himherbal — GSAP decorative layer (shared by both pages)
   Loads after main.js / portfolio.js.

   IMPORTANT: GSAP here is DECORATIVE ONLY. It never hides page
   content. All content reveals are handled by the CSS + Intersection
   Observer system in main.js / portfolio.js (guarded by the `.js`
   class), so if this CDN ever fails to load, every section still
   shows normally.
   ============================================================ */
(function () {
  "use strict";
  if (!window.gsap) return;                 // no GSAP → CSS/IO reveals still work
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.registerPlugin(ScrollTrigger);

  /* ---------------- Scroll progress bar ---------------- */
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  document.body.appendChild(bar);
  gsap.to(bar, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });

  /* ---------------- Marquees (seamless infinite loop) ---------------- */
  document.querySelectorAll("[data-marquee]").forEach((mq) => {
    const track = mq.querySelector(".marquee-track");
    if (!track) return;
    track.setAttribute("aria-hidden", "true");
    track.innerHTML += track.innerHTML; // duplicate for a seamless loop
    const reverse = mq.dataset.direction === "reverse";
    const speed = parseFloat(mq.dataset.speed || 55);
    let tween;
    const build = () => {
      const half = track.scrollWidth / 2;
      if (!half) return;
      if (tween) tween.kill();
      gsap.set(track, { x: reverse ? -half : 0 });
      tween = gsap.to(track, { x: reverse ? 0 : -half, duration: half / speed, ease: "none", repeat: -1 });
    };
    build();
    mq.addEventListener("mouseenter", () => tween && gsap.to(tween, { timeScale: 0, duration: 0.4 }));
    mq.addEventListener("mouseleave", () => tween && gsap.to(tween, { timeScale: 1, duration: 0.4 }));
    let rid;
    window.addEventListener("resize", () => { clearTimeout(rid); rid = setTimeout(build, 200); });
  });

  /* ---------------- Hero video ken-burns zoom on scroll (decorative) ---------------- */
  if (document.querySelector(".hero-vid")) {
    gsap.fromTo(".hero-vid", { scale: 1.02 }, {
      scale: 1.16, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.5 }
    });
  }

  /* ---------------- Curved "How We Work" path draw ---------------- */
  const flowPath = document.getElementById("flowPath");
  if (flowPath && flowPath.getTotalLength) {
    const len = flowPath.getTotalLength();
    gsap.set(flowPath, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(flowPath, {
      strokeDashoffset: 0, ease: "none",
      scrollTrigger: { trigger: "#process", start: "top 70%", end: "bottom 75%", scrub: 0.6 }
    });
  }

  /* ---------------- Journey timeline draw (portfolio) ---------------- */
  const timeline = document.querySelector(".timeline");
  if (timeline) {
    const prog = document.createElement("span");
    prog.className = "tl-progress";
    timeline.appendChild(prog);
    gsap.to(prog, {
      scaleY: 1, ease: "none",
      scrollTrigger: { trigger: timeline, start: "top 75%", end: "bottom 55%", scrub: 0.4 }
    });
  }

  /* ---------------- Portfolio filter re-stagger (clearProps → safe) ---------------- */
  const filters = document.getElementById("portfolioFilters");
  if (filters) {
    filters.addEventListener("click", (e) => {
      if (!e.target.closest(".filter-btn")) return;
      requestAnimationFrame(() => {
        gsap.from("#portfolioGrid .pf-item", {
          opacity: 0, y: 22, scale: 0.96, duration: 0.45, ease: "power2.out", stagger: 0.05, clearProps: "all"
        });
      });
    });
  }

  /* ---------------- Gallery tab swap (clearProps → safe) ---------------- */
  const gtabs = document.getElementById("galleryTabs");
  if (gtabs) {
    gtabs.addEventListener("click", (e) => {
      if (!e.target.closest(".gtab")) return;
      requestAnimationFrame(() => {
        const visible = document.querySelector(".gallery-grid:not([hidden])");
        if (visible) {
          gsap.from(visible.children, {
            opacity: 0, y: 18, scale: 0.97, duration: 0.4, ease: "power2.out", stagger: 0.04, clearProps: "all"
          });
        }
      });
    });
  }

  ScrollTrigger.refresh();
})();
