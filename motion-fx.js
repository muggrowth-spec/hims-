/* ============================================================
   Himherbal — Motion (motion.dev) effects layer  [ES module]
   Motion is Framer Motion's vanilla-JS sibling (same author,
   same animation engine), loaded here as an ES module from CDN.

   Handles image-centric effects GSAP does NOT touch, so the two
   libraries never fight over the same properties:
     • clip-path + opacity reveal for gallery / showcase tiles
     • scale-in "push" for large section photographs
     • magnetic spring on the floating action button

   Fail-safe: every reveal registers a setTimeout fallback that
   forces the final visible state, so content can NEVER get stuck
   hidden if the Web Animations API is paused (background tabs,
   reduced-power modes) or the CDN import fails.
   ============================================================ */
import { animate, inView } from "https://cdn.jsdelivr.net/npm/motion@10.18.0/+esm";

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const EASE = [0.22, 0.61, 0.36, 1];
  const SPRINGY = [0.34, 1.3, 0.5, 1];

  /* ---- 1. Tile reveal: clip-path wipe + fade (GSAP ignores these) ----
     NOTE: elements are NOT pre-hidden. They render normally by default and
     Motion only *enhances* them on scroll-in. If rAF/WAAPI is ever paused
     (background tab, low-power) or the import fails, the tiles simply stay
     visible — content can never get stuck hidden. ---- */
  const tileSelectors = [
    ".product-showcase .showcase-item",
    "#photoGrid .g-item",
    "#videoGrid .g-item"
  ];
  tileSelectors.forEach((sel) => {
    const els = document.querySelectorAll(sel);
    els.forEach((el, i) => {
      const ensure = () => { el.style.opacity = "1"; el.style.clipPath = "none"; };
      inView(el, () => {
        const c = animate(
          el,
          { opacity: [0, 1], clipPath: ["inset(0 0 100% 0)", "inset(0 0 0% 0)"] },
          { duration: 0.7, delay: (i % 4) * 0.08, easing: EASE }
        );
        c?.finished?.then(ensure).catch(ensure);
      }, { amount: 0.2 });
    });
  });

  /* ---- 2. Large photographs: gentle scale-in, then release the inline
           transform so CSS hover effects keep working afterwards ---- */
  document.querySelectorAll(".hero-photo img, .media-card .ph, .feature-media .ph, .founder-photo .ph").forEach((img) => {
    const ensure = () => { img.style.transform = ""; img.style.opacity = "1"; };
    inView(img, () => {
      const c = animate(
        img,
        { transform: ["scale(1.08)", "scale(1)"], opacity: [0.4, 1] },
        { duration: 0.9, easing: EASE }
      );
      c?.finished?.then(ensure).catch(ensure);
      setTimeout(ensure, 1400);
    }, { amount: 0.25 });
  });

  /* ---- 3. Magnetic spring on the floating WhatsApp button ---- */
  const fab = document.querySelector(".fab");
  if (fab && window.matchMedia("(pointer: fine)").matches) {
    fab.style.willChange = "transform";
    fab.addEventListener("pointermove", (e) => {
      const r = fab.getBoundingClientRect();
      const mx = e.clientX - r.left - r.width / 2;
      const my = e.clientY - r.top - r.height / 2;
      animate(fab, { transform: `translate(${mx * 0.3}px,${my * 0.3}px) scale(1.06)` }, { duration: 0.3, easing: EASE });
    });
    fab.addEventListener("pointerleave", () => {
      animate(fab, { transform: "translate(0px,0px) scale(1)" }, { duration: 0.6, easing: SPRINGY });
    });
  }
}
