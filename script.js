document.addEventListener("DOMContentLoaded", () => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Reveal sections as they enter the viewport. */
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      reveal.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => reveal.observe(el));

  /* Active navigation. */
  const links = [...document.querySelectorAll(".nav__links a")];
  const sections = [...document.querySelectorAll("main section[id]")];
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
      });
    });
  }, { rootMargin: "-42% 0px -48% 0px" });
  sections.forEach((section) => navObserver.observe(section));

  /* Mobile navigation. */
  const menu = document.querySelector(".menu");
  const nav = document.querySelector(".nav__links");
  menu?.addEventListener("click", () => {
    nav?.classList.toggle("open");
    menu.classList.toggle("is-open");
  });
  nav?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => nav.classList.remove("open"));
  });

  /* Hero particle field — DOM particles, no canvas and no CSS-drawn image. */
  const particleField = document.querySelector(".hero-particles");
  if (particleField && !reduce) {
    for (let i = 0; i < 34; i++) {
      const p = document.createElement("span");
      p.className = "hero-particle";
      p.style.left = (4 + Math.random() * 92) + "%";
      p.style.top = (4 + Math.random() * 92) + "%";
      p.style.setProperty("--dx", ((Math.random() - .5) * 55) + "px");
      p.style.setProperty("--dy", ((Math.random() - .5) * 75) + "px");
      p.style.setProperty("--dur", (3.5 + Math.random() * 5) + "s");
      p.style.animationDelay = (-Math.random() * 6) + "s";
      particleField.appendChild(p);
    }
  }

  /* Magnetic portrait + depth response. */
  const heroVisual = document.querySelector(".hero__visual");
  const portrait = document.querySelector(".hero__photo");
  if (heroVisual && portrait && !reduce) {
    heroVisual.addEventListener("pointermove", (event) => {
      if (window.innerWidth < 981) return;
      const r = heroVisual.getBoundingClientRect();
      const x = (event.clientX - r.left) / r.width - .5;
      const y = (event.clientY - r.top) / r.height - .5;
      portrait.style.transform =
        "perspective(1400px) rotateX(" + (-y * 5) + "deg) rotateY(" + (x * 6) + "deg) translate3d(" + (x * 7) + "px," + (y * 5) + "px,18px)";
    });
    heroVisual.addEventListener("pointerleave", () => {
      portrait.style.transform = "";
    });
  }

  /* Project media: real image assets with parallax, scan, focus and tilt. */
  document.querySelectorAll(".project-media").forEach((card) => {
    const image = card.querySelector(".media-image");
    if (!image || reduce) return;

    card.addEventListener("pointermove", (event) => {
      if (window.innerWidth < 981) return;
      const r = card.getBoundingClientRect();
      const x = (event.clientX - r.left) / r.width - .5;
      const y = (event.clientY - r.top) / r.height - .5;
      card.style.transform =
        "perspective(1500px) rotateX(" + (-y * 1.4) + "deg) rotateY(" + (x * 1.6) + "deg) translateZ(5px)";
      image.style.transform =
        "scale(1.075) translate3d(" + (-x * 12) + "px," + (-y * 10) + "px,0)";
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
      image.style.transform = "";
    });
  });

  /* Animated performance counters. */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count);
        if (!Number.isFinite(target)) return;
        const duration = 1200;
        const start = performance.now();
        const step = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const value = target < 1 ? target * eased : target * eased;
          el.textContent = target < 1 ? value.toFixed(2) : Math.round(value);
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
      counterObserver.unobserve(entry.target);
    });
  }, { threshold: .4 });
  document.querySelectorAll(".metric-tiles").forEach((el) => counterObserver.observe(el));

  /* Cursor glow for interactive cards. */
  if (!reduce) {
    document.querySelectorAll(".project-media, .system-card, .button, .text-link").forEach((el) => {
      el.addEventListener("pointerenter", () => el.classList.add("is-hovering"));
      el.addEventListener("pointerleave", () => el.classList.remove("is-hovering"));
    });
  }

  /* Scroll progress line. */
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  document.body.appendChild(progress);
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  /* Keep the full document scrollable even when visual effects are active. */
  document.documentElement.style.overflowY = "auto";
  document.body.style.overflowY = "visible";
});