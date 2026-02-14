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
  const viewport = track ? track.closest(".review-viewport") : null;

  let index = 0;

  function isMobileReviews() {
    return window.matchMedia("(max-width: 980px)").matches;
  }

  function maxIndex() {
    if (!track) return 0;
    const total = track.children.length;
    const max = isMobileReviews() ? total - 1 : total - 3;
    return Math.max(0, max);
  }

  function slideStep() {
    if (!track) return 0;

    const card = track.querySelector(".reviewCard");
    if (!card) return 0;

    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
    return card.getBoundingClientRect().width + gap;
  }

  function ensureDots() {
    if (!dotsWrap) return [];

    const needed = maxIndex() + 1;
    if (dotsWrap.children.length !== needed) {
      dotsWrap.innerHTML = "";
      for (let i = 0; i < needed; i += 1) {
        const dot = document.createElement("div");
        dot.className = "dot";
        dotsWrap.appendChild(dot);
      }
    }

    return Array.from(dotsWrap.children);
  }

  function update() {
    if (!track) return;

    index = Math.min(Math.max(0, index), maxIndex());
    track.style.transform = `translateX(${-index * slideStep()}px)`;

    const dots = ensureDots();
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  }

  if (track) {
    if (prev) {
      prev.addEventListener("click", () => {
        index = Math.max(0, index - 1);
        update();
      });
    }

    if (next) {
      next.addEventListener("click", () => {
        index = Math.min(maxIndex(), index + 1);
        update();
      });
    }

    if (dotsWrap) {
      dotsWrap.addEventListener("click", (e) => {
        const dot = e.target.closest(".dot");
        if (!dot || !dotsWrap.contains(dot)) return;

        const nextIndex = Array.from(dotsWrap.children).indexOf(dot);
        if (nextIndex < 0) return;

        index = Math.min(maxIndex(), nextIndex);
        update();
      });
    }

    if (viewport) {
      let touchStartX = 0;
      let touchStartY = 0;
      const SWIPE_THRESHOLD = 40;

      viewport.addEventListener(
        "touchstart",
        (e) => {
          const touch = e.changedTouches[0];
          touchStartX = touch.clientX;
          touchStartY = touch.clientY;
        },
        { passive: true },
      );

      viewport.addEventListener(
        "touchend",
        (e) => {
          const touch = e.changedTouches[0];
          const dx = touch.clientX - touchStartX;
          const dy = touch.clientY - touchStartY;

          if (Math.abs(dx) <= Math.abs(dy) || Math.abs(dx) < SWIPE_THRESHOLD) {
            return;
          }

          if (dx < 0) {
            index = Math.min(maxIndex(), index + 1);
          } else {
            index = Math.max(0, index - 1);
          }

          update();
        },
        { passive: true },
      );
    }

    window.addEventListener("resize", update);
    update();
  }

})();
