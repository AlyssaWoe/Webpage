/**
 * Alexander Hamilton - An American Musical
 * Interactive Frontend Engine | Inspired by https://pjsekai.sega.jp/
 */

document.addEventListener("DOMContentLoaded", () => {
  initMenu();
  initParticleCanvas();
  initHeroSlider();
  initStoryTabs();
  initShareButtons();
  initHeaderScroll();
});

/* ==========================================================================
   1. LEFT UPPER MENU TOGGLE (Project SEKAI .header--nav)
   ========================================================================== */
function initMenu() {
  const menuBtn = document.getElementById("menu-btn");
  const navDrawer = document.getElementById("nav-drawer");

  if (!menuBtn || !navDrawer) return;

  function toggleMenu() {
    const isOpen = navDrawer.classList.toggle("is-open");
    menuBtn.classList.toggle("is-active", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  function closeMenu() {
    navDrawer.classList.remove("is-open");
    menuBtn.classList.remove("is-active");
    document.body.style.overflow = "";
  }

  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close when clicking any nav link
  const navLinks = navDrawer.querySelectorAll(".header--nav-item a");
  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navDrawer.classList.contains("is-open")) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   2. STAGE PARTICLES & STAR DUST CANVAS (Project SEKAI Stage Lighting)
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById("star-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 65;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.6,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -(Math.random() * 0.6 + 0.2), // float upward like stage dust
      opacity: Math.random() * 0.7 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      pulse: Math.random() * Math.PI,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let p of particles) {
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += p.pulseSpeed;

      // Wrap edges
      if (p.y < 0) p.y = height;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;

      const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${currentOpacity})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = "rgba(212, 175, 55, 0.6)";
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. HERO BANNER CAROUSEL (Project SEKAI .top-mv--slide)
   ========================================================================== */
function initHeroSlider() {
  const track = document.getElementById("slider-track");
  const prevBtn = document.getElementById("slider-prev");
  const nextBtn = document.getElementById("slider-next");
  const dotsContainer = document.getElementById("slider-dots");

  if (!track || !prevBtn || !nextBtn) return;

  const slides = track.querySelectorAll(".slide-item");
  if (slides.length === 0) return;

  let currentIndex = 0;
  let autoPlayTimer = null;

  // Create dot indicators
  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("div");
      dot.className = `slider-dot ${i === 0 ? "active" : ""}`;
      dot.addEventListener("click", () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });
  }

  function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll(".slider-dot");
      dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === currentIndex);
      });
    }
  }

  function goToSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    updateSlider();
    resetAutoPlay();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startAutoPlay() {
    autoPlayTimer = setInterval(nextSlide, 5500);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  prevBtn.addEventListener("click", prevSlide);
  nextBtn.addEventListener("click", nextSlide);

  startAutoPlay();
}

/* ==========================================================================
   4. STORYLINE TAB FILTERING
   ========================================================================== */
function initStoryTabs() {
  const tabBtns = document.querySelectorAll(".story-tab-btn");
  const storyItems = document.querySelectorAll(".story-item");

  if (tabBtns.length === 0 || storyItems.length === 0) return;

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const act = btn.getAttribute("data-act");
      storyItems.forEach((item) => {
        if (act === "all" || item.getAttribute("data-act") === act) {
          item.style.display = "grid";
        } else {
          item.style.display = "none";
        }
      });
    });
  });
}

/* ==========================================================================
   5. SOCIAL SHARE & COPY LINK HANDLERS
   ========================================================================== */
function initShareButtons() {
  const shareTwitter = document.querySelectorAll(".share-tw");
  const shareFacebook = document.querySelectorAll(".share-fb");
  const shareCopy = document.querySelectorAll(".share-copy");

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(
    "Alexander Hamilton: An American Musical - Official Storyline, Songs & Characters",
  );

  shareTwitter.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      window.open(
        `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
        "_blank",
        "width=600,height=400",
      );
    });
  });

  shareFacebook.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
        "_blank",
        "width=600,height=400",
      );
    });
  });

  shareCopy.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          alert("Link copied to clipboard!");
        })
        .catch(() => {
          prompt("Copy this link:", window.location.href);
        });
    });
  });
}

/* ==========================================================================
   6. HEADER SCROLL EFFECT
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector(".header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header.style.background = "rgba(0, 0, 0, 0.94)";
      header.style.borderBottomColor = "rgba(212, 175, 55, 0.3)";
    } else {
      header.style.background =
        "linear-gradient(180deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.75) 70%, transparent 100%)";
      header.style.borderBottomColor = "rgba(212, 175, 55, 0.15)";
    }
  });
}
