/* ===== Valsalya Clinic - main.js ===== */
(() => {
  "use strict";

  // Auto year in footer (if present)
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Smooth scroll buttons (moved from inline onclick)
  document.querySelectorAll("[data-scroll-target]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-scroll-target");
      const el = target ? document.querySelector(target) : null;
      if (el) el.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Image fallback (moved from inline onerror)
  document.querySelectorAll("img[data-fallback]").forEach((img) => {
    img.addEventListener("error", () => {
      const parent = img.parentElement;
      if (!parent) return;

      const msg = img.getAttribute("data-fallback") || "Image missing";
      img.remove();

      const ph = document.createElement("div");
      ph.className = "ph";
      ph.textContent = `Add: ${msg}`;
      parent.innerHTML = "";
      parent.appendChild(ph);
    });
  });

  // Branch dropdown toggle
  const branchBtn = document.getElementById("branchBtn");
  const branchDropdown = document.getElementById("branchDropdown");

  if (branchBtn && branchDropdown) {
    branchBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      branchDropdown.classList.toggle("open");
    });

    document.addEventListener("click", () =>
      branchDropdown.classList.remove("open"),
    );

    document.querySelectorAll(".ddItem").forEach((item) => {
      item.addEventListener("click", () => {
        document
          .querySelectorAll(".ddItem")
          .forEach((x) => x.classList.remove("selected"));
        item.classList.add("selected");
        branchDropdown.classList.remove("open");
      });
    });
  }

  // Gallery lightbox
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbTitle = document.getElementById("lbTitle");
  const lbClose = document.getElementById("lbClose");

  function openLB(src, title) {
    if (!lightbox || !lbImg || !lbTitle) return;

    lbImg.src = src;
    lbTitle.textContent = title || "Preview";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLB() {
    if (!lightbox || !lbImg) return;

    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lbImg.src = "";
    document.body.style.overflow = "";
  }

  if (lightbox && lbImg && lbTitle && lbClose) {
    document.querySelectorAll("[data-src]").forEach((el) => {
      el.addEventListener("click", () => {
        const img = el.querySelector("img");
        const src =
          el.getAttribute("data-src") || (img ? img.getAttribute("src") : "");
        if (!src) return;
        openLB(src, el.getAttribute("data-title"));
      });
    });

    lbClose.addEventListener("click", closeLB);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLB();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLB();
    });
  }

  // Reviews carousel
  const track = document.getElementById("rTrack");
  const prev = document.getElementById("prev");
  const next = document.getElementById("next");
  const dotsWrap = document.getElementById("dots");
  const dots = dotsWrap ? Array.from(dotsWrap.children) : [];

  let index = 0;

  function maxIndex() {
    if (!track) return 0;
    const isMobile = window.matchMedia("(max-width: 980px)").matches;
    const total = track.children.length;
    return isMobile ? total - 1 : total - 3;
  }

  function update() {
    if (!track) return;

    const isMobile = window.matchMedia("(max-width: 980px)").matches;

    if (isMobile) {
      track.style.transform = `translateX(${-index * 100}%)`;
      dots.forEach((d) => d.classList.remove("active"));
      if (dots[index]) dots[index].classList.add("active");
    } else {
      const card = track.querySelector(".reviewCard");
      if (!card) return;

      const w = card.getBoundingClientRect().width + 14;
      track.style.transform = `translateX(${-index * w}px)`;
      dots.forEach((d) => d.classList.remove("active"));
      if (dots.length) dots[Math.min(index, 1)].classList.add("active");
    }
  }

  if (prev && next && track) {
    prev.addEventListener("click", () => {
      index = Math.max(0, index - 1);
      update();
    });

    next.addEventListener("click", () => {
      index = Math.min(maxIndex(), index + 1);
      update();
    });

    window.addEventListener("resize", () => {
      index = Math.min(index, maxIndex());
      update();
    });

    update();
  }
})();
