/* ============================================================
   Himherbal Healthcare — B2B site interactions
   Vanilla JS, no dependencies
   ============================================================ */
(function () {
  "use strict";

  /* ---- Fail-safe ----------------------------------------------------------
     Content is hidden by default via `.js .reveal { opacity: 0 }` and only
     shown once the IntersectionObserver adds `.in`. That means ANY error in
     this file would leave whole sections invisible (but still occupying
     space). Registered first, before anything that can throw: if nothing has
     revealed after 3s, drop the `js` class so the CSS stops hiding content,
     and settle the stat counters on their final values. ---- */
  setTimeout(function () {
    try {
      if (document.querySelector(".reveal.in")) return;   // reveals are working
      document.documentElement.classList.remove("js");    // un-hide everything
      document.querySelectorAll(".stat-num").forEach(function (el) {
        var n = parseFloat(el.dataset.count);
        if (!isNaN(n)) el.textContent = (n >= 1000 ? n.toLocaleString() : n) + (el.dataset.suffix || "");
      });
    } catch (e) { /* nothing left to do */ }
  }, 3000);

  /* ---- tiny SVG icon helper (Lucide-style stroke icons) ---- */
  const ICON = {
    perfume: '<path d="M9 2h6v3H9z"/><path d="M10 5h4v2h-4z"/><rect x="6" y="7" width="12" height="15" rx="3"/><path d="M9 12h6"/>',
    mist: '<rect x="7" y="8" width="10" height="14" rx="3"/><path d="M9 8V4h6v4"/><circle cx="6" cy="4" r="1"/><circle cx="4" cy="6" r="1"/><circle cx="6" cy="8" r="1"/>',
    rollon: '<rect x="7" y="7" width="10" height="15" rx="3"/><circle cx="12" cy="6" r="2.5"/><path d="M9 12h6"/>',
    balm: '<circle cx="12" cy="13" r="7"/><path d="M9 4h6v3H9z"/><path d="M12 10v6M9 13h6"/>',
    oil: '<path d="M12 2s5 6 5 11a5 5 0 0 1-10 0c0-5 5-11 5-11z"/>',
    wash: '<path d="M8 2h8l-1 4H9z"/><rect x="6" y="6" width="12" height="16" rx="3"/><path d="M9 13h6"/>',
    cosmetic: '<path d="M4 20h16"/><rect x="6" y="9" width="5" height="11" rx="1"/><path d="M6 9V6l5-2v5"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
    skin: '<circle cx="12" cy="12" r="9"/><path d="M8 13c1.5 2 6.5 2 8 0"/><circle cx="9" cy="10" r="1"/><circle cx="15" cy="10" r="1"/>',
    hair: '<path d="M4 20c0-8 3.5-14 8-14s8 6 8 14"/><path d="M8 20c0-6 1.8-10 4-10s4 4 4 10"/>',
    health: '<path d="M11 3h2v18h-2z"/><path d="M3 11h18v2H3z"/><rect x="4" y="4" width="16" height="16" rx="4" fill="none"/>',
    menstrual: '<path d="M12 3s6 6 6 11a6 6 0 0 1-12 0c0-5 6-11 6-11z"/><path d="M9 14h6"/>',
    personal: '<circle cx="12" cy="7" r="4"/><path d="M5 21c0-4 3-6 7-6s7 2 7 6"/>',
    aerosol: '<rect x="8" y="7" width="8" height="15" rx="2"/><path d="M10 7V4h4v3"/><path d="M16 5h2M16 3h2M16 7h2"/>',
    // services
    label: '<path d="M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L3 13V3h10l7.59 7.59a2 2 0 0 1 0 2.82z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
    contract: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    oem: '<circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/>',
    odm: '<path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>',
    rnd: '<path d="M9 3h6v5l4 8a2 2 0 0 1-2 3H7a2 2 0 0 1-2-3l4-8z"/><path d="M8 14h8"/>',
    pack: '<path d="M12 2 3 7v10l9 5 9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/>',
    // why
    custom: '<path d="m12 3 2.5 5 5.5.8-4 3.9 1 5.5L12 15l-5 2.7 1-5.5-4-3.9 5.5-.8z"/>',
    quality: '<path d="m9 12 2 2 4-4"/><path d="M12 2 4 5v6c0 5 3.4 8 8 11 4.6-3 8-6 8-11V5z"/>',
    tech: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/>',
    scale: '<path d="M3 21h18M6 21V9M12 21V4M18 21v-7"/>',
    delivery: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    compliance: '<path d="M12 2 4 5v6c0 5 3.4 8 8 11 4.6-3 8-6 8-11V5z"/><path d="m9 12 2 2 4-4"/>'
  };

  const svg = (paths) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

  /* ---- Data ---- */
  const categories = [
    ["Perfumes", "perfume"], ["Body Mist", "mist"], ["Roll-On", "rollon"], ["Balms", "balm"],
    ["Essential Oils", "oil"], ["Hand Wash", "wash"], ["Cosmetics", "cosmetic"], ["Skin Care", "skin"],
    ["Hair Care", "hair"], ["Healthcare", "health"], ["Personal Care", "personal"], ["Aerosols", "aerosol"]
  ];

  const services = [
    ["Private Label Manufacturing", "Launch products under your own brand with our ready & custom formulations, packaging and labelling.", "label"],
    ["Third-Party / Contract Mfg.", "We manufacture to your specification and volume — you focus on marketing and distribution.", "contract"],
    ["OEM Manufacturing", "Original Equipment Manufacturing with formulations and processes tailored to your requirements.", "oem"],
    ["ODM Manufacturing", "Original Design Manufacturing — pick from our design library and go to market faster.", "odm"],
    ["Product Development / R&D", "In-house lab and R&D team to develop, test and stabilise new formulations for your brand.", "rnd"],
    ["Packaging Solutions", "End-to-end packaging design, sourcing and filling for retail-ready, compliant products.", "pack"]
  ];

  const process = [
    ["Idea & Concept", "Share your vision"],
    ["Formulation", "R&D develops it"],
    ["Sampling & Testing", "Approve the sample"],
    ["Client Approval", "Sign-off & specs"],
    ["Production & Filling", "Manufacture at scale"],
    ["Packaging & Labelling", "Retail-ready finish"],
    ["Delivery", "On-time dispatch"]
  ];

  const why = [
    ["Custom Formulations", "Bespoke recipes tuned to your brand, market and price point.", "custom"],
    ["High Quality Standards", "Every batch QC-tested against international standards.", "quality"],
    ["Advanced Technology", "Modern production lines for consistency and efficiency.", "tech"],
    ["Scalable Production", "From pilot batches to a million units a month.", "scale"],
    ["Timely Delivery", "Reliable lead times and dependable logistics.", "delivery"],
    ["Regulatory Compliance", "Full documentation for domestic sale and export.", "compliance"]
  ];

  const testimonials = [
    ["Himherbal has been an exceptional manufacturing partner. Their quality, commitment and professionalism are unmatched — we scaled our fragrance line from a single SKU to a full catalogue with them.", "Rajesh Mehta", "Founder, Aura Naturals"],
    ["From formulation to final packaging, the team handled everything. Our herbal skincare range launched three months ahead of schedule and passed every export check.", "Priya Nair", "Director, GlowLeaf Cosmetics"],
    ["Low MOQs let us test the market without huge risk, and the R&D support was outstanding. A genuine growth partner for a young brand.", "Aditya Verma", "Co-founder, Pure&Co"]
  ];

  /* ---- Render grids ---- */
  const grid = (sel) => document.querySelector(sel);

  const catGrid = grid("#categoryGrid");
  if (catGrid) {
    catGrid.innerHTML = categories.map(([name, ico]) =>
      `<article class="cat-card reveal"><div class="cat-ico">${svg(ICON[ico])}</div><h3>${name}</h3></article>`
    ).join("");
  }

  const svcGrid = grid("#serviceGrid");
  if (svcGrid) {
    svcGrid.innerHTML = services.map(([title, desc, ico]) =>
      `<article class="service-card reveal"><div class="service-ico">${svg(ICON[ico])}</div><h3>${title}</h3><p>${desc}</p></article>`
    ).join("");
  }

  const procTrack = grid("#processTrack");
  if (procTrack) {
    procTrack.innerHTML = process.map(([title, desc]) =>
      `<li class="process-step reveal"><h3>${title}</h3><p>${desc}</p></li>`
    ).join("");
  }

  const whyGrid = grid("#whyGrid");
  if (whyGrid) {
    whyGrid.innerHTML = why.map(([title, desc, ico]) =>
      `<article class="why-card reveal"><div class="why-ico">${svg(ICON[ico])}</div><div><h3>${title}</h3><p>${desc}</p></div></article>`
    ).join("");
  }

  /* ---- Header shadow on scroll ---- */
  const header = document.getElementById("siteHeader");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobile nav ---- */
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  let backdrop;
  const setNav = (open) => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open && !backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "nav-backdrop";
      document.body.appendChild(backdrop);
      requestAnimationFrame(() => backdrop.classList.add("show"));
      backdrop.addEventListener("click", () => setNav(false));
    } else if (!open && backdrop) {
      backdrop.classList.remove("show");
      const b = backdrop; backdrop = null;
      setTimeout(() => b.remove(), 300);
    }
  };
  toggle.addEventListener("click", () => setNav(toggle.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (e) => { if (e.target.tagName === "A") setNav(false); });

  /* ---- Active nav link on scroll (scroll-spy) ---- */
  // Only in-page anchors are valid selectors. Netlify's "Pretty URLs" rewrites
  // portfolio.html -> /portfolio, and querySelector("/portfolio") throws a
  // SyntaxError that would kill the rest of this script (reveals, counters…).
  const navLinks = Array.from(nav.querySelectorAll('a[href^="#"]'));
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        const id = "#" + en.target.id;
        navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === id));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));

  /* ---- Scroll reveal ---- */
  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); obs.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  const markReveal = () => document.querySelectorAll(".reveal:not(.in)").forEach((el) => revealObs.observe(el));
  markReveal();
  // sections themselves reveal
  document.querySelectorAll(".section-head, .about-copy, .about-media, .excellence-copy, .contact-form").forEach((el) => {
    el.classList.add("reveal"); revealObs.observe(el);
  });

  /* ---- Animated stat counters ---- */
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const dur = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const val = target * easeOut(p);
      el.textContent = (target >= 1000 ? Math.round(val).toLocaleString() : Math.round(val)) + (p === 1 ? suffix : "");
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = (target >= 1000 ? target.toLocaleString() : target) + suffix;
    };
    requestAnimationFrame(step);
  };
  const statObs = new IntersectionObserver((entries, obs) => {
    entries.forEach((en) => { if (en.isIntersecting) { animateCount(en.target); obs.unobserve(en.target); } });
  }, { threshold: 0.6 });
  document.querySelectorAll(".stat-num").forEach((el) => statObs.observe(el));

  /* ---- Testimonials rotator ---- */
  const qText = document.getElementById("quoteText");
  const qName = document.getElementById("quoteName");
  const qRole = document.getElementById("quoteRole");
  const qDots = document.getElementById("quoteDots");
  if (qText && qDots) {
    let idx = 0, timer;
    testimonials.forEach((_, i) => {
      const b = document.createElement("button");
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", "Testimonial " + (i + 1));
      b.addEventListener("click", () => { show(i); reset(); });
      qDots.appendChild(b);
    });
    const dots = Array.from(qDots.children);
    const show = (i) => {
      idx = i;
      const [t, n, r] = testimonials[i];
      qText.style.opacity = 0;
      setTimeout(() => { qText.textContent = t; qName.textContent = n; qRole.textContent = r; qText.style.opacity = 1; }, 180);
      dots.forEach((d, di) => d.classList.toggle("active", di === i));
    };
    qText.style.transition = "opacity .3s ease";
    const next = () => show((idx + 1) % testimonials.length);
    const reset = () => { clearInterval(timer); timer = setInterval(next, 6000); };
    show(0); reset();
  }

  /* ---- Contact form validation ---- */
  const form = document.getElementById("leadForm");
  if (form) {
    const showErr = (input, msg) => {
      input.classList.add("invalid");
      input.setAttribute("aria-invalid", "true");
      const box = form.querySelector(`.error[data-for="${input.id}"]`);
      if (box) box.textContent = msg;
    };
    const clearErr = (input) => {
      input.classList.remove("invalid");
      input.removeAttribute("aria-invalid");
      const box = form.querySelector(`.error[data-for="${input.id}"]`);
      if (box) box.textContent = "";
    };
    const validate = () => {
      let ok = true;
      const name = form.querySelector("#f-name");
      const email = form.querySelector("#f-email");
      const phone = form.querySelector("#f-phone");
      if (!name.value.trim()) { showErr(name, "Please enter your name."); ok = false; } else clearErr(name);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { showErr(email, "Enter a valid email address."); ok = false; } else clearErr(email);
      if (!/^[+\d][\d\s-]{7,}$/.test(phone.value.trim())) { showErr(phone, "Enter a valid phone number."); ok = false; } else clearErr(phone);
      return ok;
    };
    form.querySelectorAll("input").forEach((inp) => {
      inp.addEventListener("input", () => { if (inp.classList.contains("invalid")) clearErr(inp); });
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validate()) {
        form.querySelector(".invalid")?.focus();
        return;
      }
      const success = document.getElementById("formSuccess");
      success.hidden = false;
      form.querySelector("button[type=submit]").disabled = true;
      form.reset();
      success.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  /* ---- Lazy-play videos only while in view (saves the 5MB load on mobile) ---- */
  const lazyVids = document.querySelectorAll("video[data-lazyvideo]");
  if (lazyVids.length && "IntersectionObserver" in window) {
    const vidObs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const v = en.target;
        if (en.isIntersecting) {
          if (v.preload === "none") v.preload = "auto";
          v.play?.().catch(() => {});
        } else {
          v.pause?.();
        }
      });
    }, { threshold: 0.25 });
    lazyVids.forEach((v) => vidObs.observe(v));
  }

  /* ---- Footer year ---- */
  const yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
