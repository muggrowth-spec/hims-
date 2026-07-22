/* ============================================================
   Himherbal Healthcare — Portfolio page interactions
   Vanilla JS, no dependencies. Reuses shared theme.
   ============================================================ */
(function () {
  "use strict";

  const svg = (p) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const TROPHY = '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>';

  /* ---------- DATA ---------- */
  const timeline = [
    ["2004", "The beginning", "Founded as a small herbal formulation lab with a single production line and a big vision."],
    ["2008", "First certifications", "Achieved ISO 9001 and GMP certification, opening the door to serious brand partners."],
    ["2012", "Facility expansion", "Moved into a 50,000+ sq. ft. integrated manufacturing facility with in-house R&D."],
    ["2016", "Going global", "Began exporting to international markets; crossed 20 export countries."],
    ["2020", "Scaling capacity", "Upgraded to 1M+ units/month capacity with automated filling and packing lines."],
    ["2024", "Industry recognition", "300+ brand partners, 45+ export countries and 30+ industry awards to date."]
  ];

  const team = [
    ["founder-pranay.jpg", "Director", "Mr. Pranay Agrawal", "A BBA graduate with strong ambitions and the drive to take our organisation to new heights of excellence and global growth."],
    ["founder-adnan.jpg", "Manager — Exports", "Mr. Adnan Durvesh", "The key person behind the smooth functioning of our production unit — an asset for quality control and on-time delivery to every customer."]
  ];

  const awards = [
    ["2024", "Best Contract Manufacturer", "National Beauty & Wellness Awards"],
    ["2023", "Excellence in Herbal Manufacturing", "Ayurveda Industry Council"],
    ["2023", "Export Excellence Award", "Regional Chamber of Commerce"],
    ["2022", "Quality Leadership Recognition", "Cosmetics Manufacturers Association"],
    ["2021", "Emerging Manufacturer of the Year", "India Personal Care Summit"],
    ["2020", "Sustainability in Production", "Green Manufacturing Forum"]
  ];

  const portfolio = [
    ["Signature Perfume", "Fragrance", "product-1.jpg"],
    ["Eau de Parfum", "Fragrance", "product-2.jpg"],
    ["Body Mist Range", "Personal Care", "product-3.jpg"],
    ["Deodorant Line", "Personal Care", "product-4.jpg"],
    ["Cosmetics Range", "Cosmetics", "product-5.jpg"],
    ["Skin Care Serum", "Skin Care", "product-6.jpg"],
    ["Attar Collection", "Fragrance", "product-7.jpg"],
    ["Private Label Range", "Personal Care", "product-show.jpg"]
  ];
  const categories = ["All", "Fragrance", "Personal Care", "Cosmetics", "Skin Care"];

  const events = [
    ["exhibition-1.jpg", "International Expo", "Global Beauty Expo", "Showcased our fragrance and personal-care capabilities to international buyers."],
    ["exhibition-2.jpg", "Trade Fair", "Cosmetics & Fragrance Fair", "Presented our private-label and contract-manufacturing offerings to the trade."],
    ["exhibition-3.jpg", "B2B Summit", "Private Label Summit", "Connected with brand owners and startups launching their own product lines."],
    ["exhibition-4.jpg", "Ingredients Show", "Formulation & Ingredients", "Explored new herbal actives and formulation innovation with global suppliers."],
    ["exhibition-5.jpg", "Export Meet", "Global Export Trade Show", "Expanded our export partnerships across new international territories."],
    ["exhibition-6.jpg", "Industry Event", "Beauty & Wellness Congress", "Networked with the international beauty-manufacturing community."]
  ];

  const photos = [
    ["gallery-1.jpg", "At the Expo"], ["gallery-2.jpg", "Team & Partners"], ["exhibition-2.jpg", "Exhibition Booth"],
    ["celebrity-1.jpg", "Celebrity Association"], ["csr-1.jpg", "CSR Initiative"], ["gallery-4.jpg", "Global Meetings"],
    ["machinery-lg.jpg", "Production Floor"], ["product-show.jpg", "Product Showcase"]
  ];
  const videos = [
    ["machinery-1.jpg", "Factory Tour"], ["machinery-lg.jpg", "Manufacturing Process"],
    ["product-1.jpg", "Product Showcase"], ["feature-privatelabel.jpg", "Private Label Story"]
  ];

  const press = [
    ["media-mag-1.jpg", "Featured in a leading cosmetics trade magazine for our private-label and contract-manufacturing capabilities.", "Cosmetic Magazine"],
    ["media-mag-2.jpg", "Recognised for excellence in herbal, fragrance and personal-care product manufacturing.", "Cosmetic Magazine"],
    ["media-1.jpg", "Covered for our international expo presence and growing global export footprint.", "Industry Press"],
    ["media-3.jpg", "Highlighted among India's fast-growing contract manufacturers for beauty & wellness.", "Trade Press"]
  ];

  const stories = [
    ["+400%", "revenue in 18 months", "From single SKU to full range", "A boutique fragrance brand scaled its catalogue with our private-label support and hit new markets.", "Aura Naturals"],
    ["3 months", "faster to market", "Launched ahead of schedule", "Our R&D and packaging teams compressed an entire skincare launch timeline for a new entrant.", "GlowLeaf Cosmetics"],
    ["12 → 45", "countries served", "Export-ready from day one", "Full compliance documentation let this brand expand internationally without regulatory friction.", "Pure&Co"]
  ];

  const $ = (s) => document.querySelector(s);

  /* ---------- Scroll reveal (defined early: render fns call markReveal) ---------- */
  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); obs.unobserve(en.target); } });
  }, { threshold: 0.12 });
  function markReveal() { document.querySelectorAll(".reveal:not(.in)").forEach((el) => revealObs.observe(el)); }

  /* ---------- RENDER ---------- */
  $("#timeline").innerHTML = timeline.map(([yr, title, desc]) =>
    `<li class="tl-item reveal"><span class="tl-dot"></span><span class="tl-year">${yr}</span><div class="tl-card"><h3>${title}</h3><p>${desc}</p></div></li>`
  ).join("");

  $("#teamGrid").innerHTML = team.map(([img, role, name, bio]) =>
    `<article class="team-card reveal"><div class="team-avatar has-img"><img src="assets/img/${img}" alt="${name}" class="ph mono" loading="lazy"></div><h3>${name}</h3><span class="team-role">${role}</span><p class="team-bio">${bio}</p></article>`
  ).join("");

  $("#awardsGrid").innerHTML = awards.map(([yr, title, org]) =>
    `<article class="award-card reveal"><div class="award-ico">${svg(TROPHY)}</div><div><span class="award-year">${yr}</span><h3>${title}</h3><p>${org}</p></div></article>`
  ).join("");

  $("#eventsGrid").innerHTML = events.map(([img, tag, name, desc]) =>
    `<article class="event-card reveal mono-card"><div class="event-img has-img"><img src="assets/img/${img}" alt="${name}" class="ph mono" loading="lazy"></div><div class="event-body"><span class="event-tag">${tag}</span><h3>${name}</h3><p>${desc}</p></div></article>`
  ).join("");

  $("#pressGrid").innerHTML = press.map(([img, quote, src]) =>
    `<article class="press-card reveal mono-card"><div class="press-logo has-img"><img src="assets/img/${img}" alt="${src}" class="ph mono" loading="lazy"></div><div><p>${quote}</p><span class="press-src">${src}</span></div></article>`
  ).join("");

  $("#storiesGrid").innerHTML = stories.map(([metric, unit, title, desc, brand]) =>
    `<article class="story-card reveal"><div class="story-metric">${metric}<span>${unit}</span></div><h3>${title}</h3><p>${desc}</p><div class="story-brand">— ${brand}</div></article>`
  ).join("");

  /* ---- Portfolio grid + filters ---- */
  const pfGrid = $("#portfolioGrid");
  const renderPortfolio = (cat) => {
    pfGrid.innerHTML = portfolio
      .filter(([, c]) => cat === "All" || c === cat)
      .map(([name, c, img]) =>
        `<article class="pf-item reveal mono-card" data-cap="${name}" data-img="assets/img/${img}" tabindex="0" role="button" aria-label="View ${name}">
           <div class="pf-thumb has-img"><img src="assets/img/${img}" alt="${name}" class="ph mono" loading="lazy"></div>
           <div class="pf-cap"><strong>${name}</strong><span>${c}</span></div>
         </article>`
      ).join("");
    markReveal();
  };
  $("#portfolioFilters").innerHTML = categories.map((c, i) =>
    `<button class="filter-btn${i === 0 ? " active" : ""}" data-cat="${c}" role="tab" aria-selected="${i === 0}">${c}</button>`
  ).join("");
  $("#portfolioFilters").addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    $("#portfolioFilters").querySelectorAll(".filter-btn").forEach((b) => {
      b.classList.toggle("active", b === btn);
      b.setAttribute("aria-selected", b === btn);
    });
    renderPortfolio(btn.dataset.cat);
  });
  renderPortfolio("All");

  /* ---- Gallery tabs ---- */
  const photoGrid = $("#photoGrid");
  const videoGrid = $("#videoGrid");
  photoGrid.innerHTML = photos.map(([img, label], i) =>
    `<figure class="g-item has-img" data-type="photo" data-idx="${i}" tabindex="0" role="button" aria-label="View ${label}"><img src="assets/img/${img}" alt="${label}" class="ph mono" loading="lazy"><span class="g-label">${label}</span></figure>`
  ).join("");
  videoGrid.innerHTML = videos.map(([img, label], i) =>
    `<figure class="g-item video has-img" data-type="video" data-idx="${i}" tabindex="0" role="button" aria-label="Play ${label}"><img src="assets/img/${img}" alt="${label}" class="ph mono" loading="lazy"><span class="play"><span></span></span><span class="g-label">${label}</span></figure>`
  ).join("");
  $("#galleryTabs").addEventListener("click", (e) => {
    const b = e.target.closest(".gtab");
    if (!b) return;
    $("#galleryTabs").querySelectorAll(".gtab").forEach((t) => {
      const on = t === b;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", on);
    });
    const showVideos = b.dataset.tab === "videos";
    photoGrid.hidden = showVideos;
    videoGrid.hidden = !showVideos;
  });

  /* ---- Lightbox (photos, videos, portfolio items) ---- */
  const lb = $("#lightbox");
  const lbMedia = $("#lbMedia");
  const lbCap = $("#lbCaption");
  let lbSet = [], lbPos = 0;

  const openLb = (set, pos) => {
    lbSet = set; lbPos = pos;
    renderLb();
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    $("#lbClose").focus();
  };
  const renderLb = () => {
    const item = lbSet[lbPos];
    lbMedia.innerHTML = `<img src="${item.img}" alt="${item.label}">` + (item.video ? '<span class="lb-play" aria-hidden="true"></span>' : '');
    lbCap.textContent = item.label + (item.sub ? " — " + item.sub : "");
  };
  const closeLb = () => { lb.hidden = true; document.body.style.overflow = ""; };
  const move = (d) => { lbPos = (lbPos + d + lbSet.length) % lbSet.length; renderLb(); };

  $("#lbClose").addEventListener("click", closeLb);
  $("#lbPrev").addEventListener("click", () => move(-1));
  $("#lbNext").addEventListener("click", () => move(1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") move(-1);
    if (e.key === "ArrowRight") move(1);
  });

  const activateItem = (el) => {
    if (el.dataset.type === "photo") {
      openLb(photos.map(([img, label]) => ({ img: "assets/img/" + img, label })), +el.dataset.idx);
    } else if (el.dataset.type === "video") {
      openLb(videos.map(([img, label]) => ({ img: "assets/img/" + img, label, video: true, sub: "Video" })), +el.dataset.idx);
    } else if (el.classList.contains("pf-item")) {
      const items = Array.from(pfGrid.querySelectorAll(".pf-item"));
      openLb(items.map((n) => ({ img: n.dataset.img, label: n.dataset.cap })), items.indexOf(el));
    }
  };
  document.addEventListener("click", (e) => {
    const el = e.target.closest(".g-item, .pf-item");
    if (el) activateItem(el);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const el = e.target.closest(".g-item, .pf-item");
    if (el) { e.preventDefault(); activateItem(el); }
  });

  /* ============================================================
     SHARED behaviours (header, nav, reveal, counters, scroll-spy)
     ============================================================ */
  const header = document.getElementById("siteHeader");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

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

  const navLinks = Array.from(nav.querySelectorAll('a[href^="#"]'));
  const spySections = navLinks.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        const id = "#" + en.target.id;
        navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === id));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  spySections.forEach((s) => spy.observe(s));

  document.querySelectorAll(".section-head, .about-copy, .about-media, .founder-copy, .founder-photo").forEach((el) => el.classList.add("reveal"));
  markReveal();

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count), suffix = el.dataset.suffix || "", dur = 1400, start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = (target >= 1000 ? Math.round(target * easeOut(p)).toLocaleString() : Math.round(target * easeOut(p))) + (p === 1 ? suffix : "");
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = (target >= 1000 ? target.toLocaleString() : target) + suffix;
    };
    requestAnimationFrame(step);
  };
  const statObs = new IntersectionObserver((entries, obs) => {
    entries.forEach((en) => { if (en.isIntersecting) { animateCount(en.target); obs.unobserve(en.target); } });
  }, { threshold: 0.6 });
  document.querySelectorAll(".stat-num").forEach((el) => statObs.observe(el));

  const yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
