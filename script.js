gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

// Configure ScrollTrigger to avoid layout jumps when mobile address bars hide/show
ScrollTrigger.config({ ignoreMobileResize: true });

// Initialize Smooth Scroll
const smoother = ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",
  smooth: 1.5,
  effects: true,
  normalizeScroll: true,
});

// Smooth Scroll to Sections
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      smoother.scrollTo(targetElement, true, "top top");
    }
  });
});

// Entrance Animation on Load
const heroTitle = document.querySelector(".hero-title");
if (heroTitle) {
  // Split hero title into lines
  const heroSplit = new SplitText(heroTitle, {
    type: "lines",
    linesClass: "hero-title-line",
  });

  // Wrap each line in an overflow-hidden wrapper
  heroSplit.lines.forEach((line) => {
    const wrapper = document.createElement("div");
    wrapper.style.overflow = "hidden";
    line.parentNode.insertBefore(wrapper, line);
    wrapper.appendChild(line);
  });

  // Set initial states
  gsap.set(heroSplit.lines, { yPercent: 120 });
  gsap.set(".hero-btn-wrapper .btn-secondary", { yPercent: 120 });
  gsap.set(".hero-features", { y: 20, opacity: 0 });
  gsap.set(".video-card", { y: 30, opacity: 0 });
  gsap.set(".header", { yPercent: -100 });

  // Create timeline for the page entrance animation
  const entranceTl = gsap.timeline({ delay: 0.4 });

  entranceTl
    .to(heroSplit.lines, {
      yPercent: 0,
      duration: 1.2,
      stagger: 0.12,
      ease: "power4.out",
    })
    .to(
      ".hero-btn-wrapper .btn-secondary",
      {
        yPercent: 0,
        duration: 1.0,
        ease: "power3.out",
      },
      "-=0.8",
    )
    .to(
      [".hero-features", ".video-card"],
      {
        y: 0,
        opacity: 1,
        duration: 1.0,
        stagger: 0.15,
        ease: "power3.out",
      },
      "-=0.8",
    )
    .to(
      ".header",
      {
        yPercent: 0,
        duration: 1.0,
        ease: "power3.out",
      },
      "-=0.6",
    );
}

// Header Scrolled Effect and Hide/Show
ScrollTrigger.create({
  start: "top -550px",
  end: 99999,
  toggleClass: { className: "scrolled", targets: ".header" },
  onUpdate: (self) => {
    // self.direction: 1 = scrolling down, -1 = scrolling up
    if (self.direction === 1) {
      gsap.to(".header", { yPercent: -100, duration: 0.3, ease: "power2.out" });
    } else {
      gsap.to(".header", { yPercent: 0, duration: 0.3, ease: "power2.out" });
    }
  },
});

// Hero Parallax & Zoom Choreography
const heroTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: true,
  },
});

heroTl
  .to(".hero-bg", { scale: 1.2, ease: "none" }, 0)
  .to(".hero-content", { y: -50, ease: "none" }, 0);

// Subtle Parallax for images with data-parallax="true"
function initParallax() {
  gsap.utils
    .toArray('img[data-parallax="true"]:not(.parallax-initialized)')
    .forEach((img) => {
      img.classList.add("parallax-initialized");
      gsap.fromTo(
        img,
        { y: -30, scale: 1 },
        {
          y: 35,
          scale: 1.1,
          ease: "none",
          scrollTrigger: {
            trigger: img.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });
}
initParallax();

// Global SplitText Animations (.animate-split-up)
gsap.utils.toArray(".animate-split-up").forEach((element) => {
  const split = new SplitText(element, {
    type: "lines",
    linesClass: "split-child",
  });

  // Explicitly wrap each line in an overflow-hidden mask
  split.lines.forEach((line) => {
    const wrapper = document.createElement("div");
    wrapper.style.overflow = "hidden";
    // Optional: match display style if needed, but div is block by default
    line.parentNode.insertBefore(wrapper, line);
    wrapper.appendChild(line);
  });

  gsap.from(split.lines, {
    yPercent: 120, // 120% ensures it's completely pushed out of the mask
    ease: "power4.out",
    stagger: 0.1,
    duration: 1.2,
    scrollTrigger: {
      trigger: element,
      start: "top 85%",
      toggleActions: "play none none reverse",
    },
  });
});

// Global Fade Up Animations (.animate-fade-up)
gsap.utils.toArray(".animate-fade-up").forEach((element) => {
  gsap.from(element, {
    opacity: 0,
    duration: 1.2,
    y: 50,
    ease: "power4.out",
    scrollTrigger: {
      trigger: element,
      start: "top 95%",
      toggleActions: "play none none reverse",
    },
  });
});

// Clip-Path Reveal Animation (Bottom to Top)
gsap.utils.toArray(".animate-clip-up").forEach((element) => {
  gsap.fromTo(
    element,
    { clipPath: "inset(100% 0% 0% 0%)" },
    {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1.5,
      ease: "power4.inOut",
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
      },
    },
  );
});

// Hero Background Slideshow (Ken Burns Zoom/Fade Transition)
const heroSlides = gsap.utils.toArray(".hero-slide");
if (heroSlides.length > 0) {
  let currentSlideIndex = 0;
  const slideDuration = 4000; // time each slide is visible (6 seconds)
  const transitionDuration = 1.5; // transition fade time (1.5 seconds)

  // Start Ken Burns zoom-out on the first slide immediately
  gsap.fromTo(
    heroSlides[0],
    { scale: 1.25 },
    { scale: 1.0, duration: slideDuration / 1000, ease: "sine.out" },
  );

  function playSlideshow() {
    const prevSlide = heroSlides[currentSlideIndex];
    currentSlideIndex = (currentSlideIndex + 1) % heroSlides.length;
    const nextSlide = heroSlides[currentSlideIndex];

    // Put next slide on top of previous
    gsap.set(nextSlide, { zIndex: 1 });
    gsap.set(prevSlide, { zIndex: 0 });

    // Fade in next slide
    gsap.fromTo(
      nextSlide,
      { opacity: 0 },
      { opacity: 1, duration: transitionDuration, ease: "power2.inOut" },
    );

    // Slowly zoom next slide from 1.15 down to 1.0 (Ken Burns Zoom Out)
    gsap.fromTo(
      nextSlide,
      { scale: 1.15 },
      { scale: 1.0, duration: slideDuration / 1000, ease: "sine.out" },
    );

    // Fade out previous slide and reset its scale after transition completes
    gsap.to(prevSlide, {
      opacity: 0,
      duration: transitionDuration,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.set(prevSlide, { scale: 1.15 });
      },
    });
  }

  setInterval(playSlideshow, slideDuration);
}

// Heritage Section – Pinned Scroll with Split-Text Transition
const heritageSection = document.querySelector("#heritage-section");

if (heritageSection) {
  // Split paragraphs into individual lines with overflow-hidden masks
  const heritageparas = gsap.utils.toArray(".heritage-para");
  const paraLineSets = [];

  heritageparas.forEach((para) => {
    const split = new SplitText(para, {
      type: "lines",
      linesClass: "heritage-para-line",
    });
    // Wrap each line in an overflow-hidden mask
    split.lines.forEach((line) => {
      const mask = document.createElement("div");
      mask.style.overflow = "hidden";
      line.parentNode.insertBefore(mask, line);
      mask.appendChild(line);
    });
    paraLineSets.push(split.lines);
  });

  // Gather all animatable elements per slide
  const slide1Lines = gsap.utils.toArray("#heritage-slide-1 .heritage-line");
  const slide1ParaLines = paraLineSets[0] || [];
  const slide2Lines = gsap.utils.toArray("#heritage-slide-2 .heritage-line");
  const slide2ParaLines = paraLineSets[1] || [];
  const slide3Lines = gsap.utils.toArray("#heritage-slide-3 .heritage-line");
  const slide3ParaLines = paraLineSets[2] || [];
  const slide1Imgs = gsap.utils.toArray("#heritage-slide-1 .heritage-img");
  const slide2Imgs = gsap.utils.toArray("#heritage-slide-2 .heritage-img");
  const slide3Imgs = gsap.utils.toArray("#heritage-slide-3 .heritage-img");
  const slide2BgContainer = document.querySelector(
    "#heritage-slide-2 .kandhari-bg",
  );
  const slide3BgContainer = document.querySelector(
    "#heritage-slide-3 .kandhari-bg",
  );

  // Set initial states
  gsap.set(slide2Lines, { yPercent: 120 });
  gsap.set(slide2ParaLines, { yPercent: 120 });
  if (slide2BgContainer) {
    gsap.set(slide2BgContainer, { clipPath: "inset(100% 0 0 0)" });
  }

  gsap.set(slide3Lines, { yPercent: 120 });
  gsap.set(slide3ParaLines, { yPercent: 120 });
  if (slide3BgContainer) {
    gsap.set(slide3BgContainer, { clipPath: "inset(100% 0 0 0)" });
  }

  const heritageTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#heritage-pin-wrapper",
      start: "top top",
      end: "+=250%",
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      pinType: "transform",
    },
  });

  // Phase 1: Slide 1 text lines exit (slide UP out of masks)
  heritageTl.to(
    slide1Lines,
    {
      yPercent: -120,
      stagger: 0.03,
      duration: 0.4,
      ease: "power2.in",
    },
    0.1,
  );

  // Slide 1 paragraph lines exit
  heritageTl.to(
    slide1ParaLines,
    {
      yPercent: -120,
      stagger: 0.02,
      duration: 0.4,
      ease: "power2.in",
    },
    0.15,
  );

  // Slide 1 images remain visible underneath Slide 2

  // Phase 2: Slide 2 background reveals
  if (slide2BgContainer) {
    heritageTl.to(
      slide2BgContainer,
      {
        clipPath: "inset(0% 0 0 0)",
        duration: 0.45,
        ease: "power2.out",
      },
      0.35,
    );
  }

  // Slide 2 text lines enter (slide UP into view)
  heritageTl.to(
    slide2Lines,
    {
      yPercent: 0,
      stagger: 0.03,
      duration: 0.4,
      ease: "power2.out",
    },
    0.4,
  );

  // Slide 2 paragraph lines enter
  heritageTl.to(
    slide2ParaLines,
    {
      yPercent: 0,
      stagger: 0.02,
      duration: 0.4,
      ease: "power2.out",
    },
    0.45,
  );

  // Slide 2 images reveal with clip-path
  heritageTl.to(
    slide2Imgs,
    {
      clipPath: "inset(0% 0 0% 0)",
      duration: 0.45,
      ease: "power2.out",
    },
    0.4,
  );

  // Phase 3: Slide 2 exits
  heritageTl.to(
    slide2Lines,
    {
      yPercent: -120,
      stagger: 0.03,
      duration: 0.4,
      ease: "power2.in",
    },
    1.2,
  );

  heritageTl.to(
    slide2ParaLines,
    {
      yPercent: -120,
      stagger: 0.02,
      duration: 0.4,
      ease: "power2.in",
    },
    1.25,
  );

  // Slide 2 images remain visible underneath Slide 3

  // Phase 4: Slide 3 background reveals
  if (slide3BgContainer) {
    heritageTl.to(
      slide3BgContainer,
      {
        clipPath: "inset(0% 0 0 0)",
        duration: 0.45,
        ease: "power2.out",
      },
      1.55,
    );
  }

  // Slide 3 text lines enter
  heritageTl.to(
    slide3Lines,
    {
      yPercent: 0,
      stagger: 0.03,
      duration: 0.4,
      ease: "power2.out",
    },
    1.6,
  );

  // Slide 3 paragraph lines enter
  heritageTl.to(
    slide3ParaLines,
    {
      yPercent: 0,
      stagger: 0.02,
      duration: 0.4,
      ease: "power2.out",
    },
    1.65,
  );

  // Slide 3 images reveal with clip-path
  heritageTl.to(
    slide3Imgs,
    {
      clipPath: "inset(0% 0 0% 0)",
      duration: 0.45,
      ease: "power2.out",
    },
    1.6,
  );
}

// Location Map Reveal Animation
gsap.fromTo(
  "#map-container",
  { clipPath: "circle(0% at 25% 85%)" },
  {
    clipPath: "circle(150% at 25% 85%)",
    duration: 2.5,
    ease: "power3.inOut",
    scrollTrigger: {
      trigger: "#map-container",
      start: "top 85%",
    },
  },
);

// Specifications Overlay Animation
const specsTl = gsap.timeline({ paused: true });

// Setup initial state
gsap.set("#specs-overlay", { display: "none" });

specsTl
  .set("#specs-overlay", { display: "flex" })
  // Slide the entire overlay (image and background together) from right to left
  .from("#specs-overlay", { xPercent: 100, duration: 1, ease: "power4.inOut" })
  // Fade in the text content only
  .from(
    ".specs-content",
    { opacity: 0, duration: 0.8, ease: "power2.out" },
    "-=0.4",
  );

const openSpecsBtn = document.getElementById("open-specs");
const closeSpecsBtn = document.getElementById("close-specs");

if (openSpecsBtn) {
  openSpecsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    specsTl.play();
  });
}

if (closeSpecsBtn) {
  closeSpecsBtn.addEventListener("click", () => {
    specsTl.reverse();
  });
}

// Floor Plan Overlay Animation
const fpTl = gsap.timeline({ paused: true });
gsap.set("#floor-plan-overlay", { display: "none" });

fpTl
  .set("#floor-plan-overlay", { display: "flex" })
  .from("#floor-plan-overlay", {
    xPercent: 100,
    duration: 1,
    ease: "power4.inOut",
  })
  .from(
    ".floor-plan-content",
    { opacity: 0, duration: 0.8, ease: "power2.out" },
    "-=0.4",
  )
  .from(
    ".floor-plan-thumbnails",
    { opacity: 0, y: 20, duration: 0.5, ease: "power2.out" },
    "-=0.6",
  );

const openFpBtns = document.querySelectorAll(".open-floor-plan-btn");
const closeFpBtn = document.getElementById("close-floor-plan");

openFpBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    fpTl.play();
  });
});

if (closeFpBtn) {
  closeFpBtn.addEventListener("click", () => {
    fpTl.reverse();
  });
}

// Floor Plan Data & Carousel Logic
const floorPlans = [
  {
    image: "Images/Floor%20Plan%201.webp",
    subtitle: "(LOWER LEVEL)",
    title: "GRAND ENTRANCE & LIVING",
    desc: "A SPRAWLING LAYOUT FEATURING A MAJESTIC ENTRANCE, FORMAL LIVING AREAS, AND AN EXPANSIVE KITCHEN DESIGNED FOR ENTERTAINING.",
    planName: "Lower Level Plan",
    sqft: "2100",
  },
  {
    image: "Images/Floor%20Plan%202.webp",
    subtitle: "(MAIN LEVEL)",
    title: "MASTER SUITES",
    desc: "DEDICATED ENTIRELY TO PRIVATE LIVING, FEATURING PRIMARY SUITES WITH WALK-IN WARDROBES, SPA-LIKE BATHROOMS, AND PRIVATE BALCONIES.",
    planName: "Main Level Plan",
    sqft: "1850",
  },
  {
    image: "Images/Floor%20Plan%203.webp",
    subtitle: "(UPPER LEVEL)",
    title: "ENTERTAINMENT LOUNGE",
    desc: "THE ULTIMATE ENTERTAINMENT ZONE COMPLETE WITH A HOME THEATER SETUP, INDOOR BAR, AND A SPRAWLING RECREATIONAL AREA.",
    planName: "Upper Level Plan",
    sqft: "1900",
  },
  {
    image: "Images/Floor%20Plan%204.webp",
    subtitle: "(TERRACE)",
    title: "YOUR PRIVATE ROOFTOP RETREAT",
    desc: "FEATURING THE ONLY ROOFTOP SWIMMING POOL ON CARTER ROAD, THIS EXCLUSIVE TERRACE LEVEL COMBINES OPEN-AIR LEISURE, PANORAMIC VIEWS, AND PRIVATE OUTDOOR LIVING IN ONE EXTRAORDINARY SETTING.",
    planName: "Terrace Plan",
    sqft: "1562",
  },
];

const thumbnails = document.querySelectorAll(".thumbnail-wrapper");
const fpMainImage = document.getElementById("floor-plan-main-image");
const fpSubtitle = document.getElementById("fp-subtitle");
const fpTitle = document.getElementById("fp-title");
const fpDesc = document.getElementById("fp-desc");
const fpPlanName = document.getElementById("fp-plan-name");
const fpSqft = document.getElementById("fp-sqft");

thumbnails.forEach((thumb) => {
  thumb.addEventListener("click", () => {
    // Remove active state from all
    thumbnails.forEach((t) => {
      t.style.borderColor = "transparent";
      t.style.opacity = "0.6";
      t.classList.remove("active-thumb");
    });
    // Add active state to clicked
    thumb.style.borderColor = "var(--gold)";
    thumb.style.opacity = "1";
    thumb.classList.add("active-thumb");

    const index = parseInt(thumb.getAttribute("data-index"), 10);
    const data = floorPlans[index];

    // Crossfade content
    gsap.to([fpMainImage, ".floor-plan-content > *"], {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        fpMainImage.src = data.image;
        fpSubtitle.textContent = data.subtitle;
        fpTitle.textContent = data.title;
        fpDesc.textContent = data.desc;
        fpPlanName.textContent = data.planName;
        fpSqft.textContent = data.sqft;

        gsap.to([fpMainImage, ".floor-plan-content > *"], {
          opacity: 1,
          duration: 0.3,
        });
      },
    });
  });
});

// Mobile Menu Overlay Animation
const mobileMenuTl = gsap.timeline({ paused: true });
gsap.set("#mobile-menu-overlay", { display: "none" });

mobileMenuTl
  .set("#mobile-menu-overlay", { display: "flex" })
  .from("#mobile-menu-overlay", {
    xPercent: 100,
    duration: 0.8,
    ease: "power4.inOut",
  })
  .from(
    "#mobile-menu-overlay nav a, #mobile-menu-overlay .mt-10",
    {
      opacity: 0,
      y: 20,
      duration: 0.4,
      stagger: 0.1,
      ease: "power2.out",
    },
    "-=0.3",
  );

const openMobileMenuBtn = document.getElementById("open-mobile-menu");
const closeMobileMenuBtn = document.getElementById("close-mobile-menu");

if (openMobileMenuBtn) {
  openMobileMenuBtn.addEventListener("click", (e) => {
    e.preventDefault();
    mobileMenuTl.play();
  });
}

if (closeMobileMenuBtn) {
  closeMobileMenuBtn.addEventListener("click", () => {
    mobileMenuTl.reverse();
  });
}

const mobileMenuLinks = document.querySelectorAll("#mobile-menu-overlay nav a");
mobileMenuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenuTl.reverse();
  });
});
// Amenities Swiper Initialization
if (document.querySelector(".amenities-swiper")) {
  const amenitiesSwiper = new Swiper(".amenities-swiper", {
    slidesPerView: 1,
    centeredSlides: true,
    loop: true,
    spaceBetween: 50,
    grabCursor: true,
    breakpoints: {
      768: {
        slidesPerView: 2.2,
        spaceBetween: 250,
      },
    },
    navigation: {
      nextEl: ".amenities-next",
      prevEl: ".amenities-prev",
    },
    on: {
      init: function () {
        setTimeout(initParallax, 100);

        // Initialize custom pagination bullets (exactly 3 bullets for 3 unique slides)
        const paginationContainer = document.querySelector(
          ".amenities-pagination",
        );
        if (paginationContainer) {
          paginationContainer.innerHTML = `
            <span class="swiper-pagination-bullet swiper-pagination-bullet-active" data-index="0">(1)</span>
            <span class="swiper-pagination-bullet" data-index="1">(2)</span>
            <span class="swiper-pagination-bullet" data-index="2">(3)</span>
          `;

          const self = this;
          paginationContainer
            .querySelectorAll(".swiper-pagination-bullet")
            .forEach((bullet) => {
              bullet.addEventListener("click", function () {
                const idx = parseInt(this.getAttribute("data-index"));
                self.slideToLoop(idx);
              });
            });
        }
      },
      slideChange: function () {
        const activeSlide = this.slides[this.activeIndex];
        const img = activeSlide.querySelector("img");
        if (img) {
          const title = img.getAttribute("data-title");
          const desc = img.getAttribute("data-desc");

          const titleEl = document.getElementById("amenity-title");
          const descEl = document.getElementById("amenity-desc");

          if (titleEl) {
            gsap.fromTo(
              titleEl,
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.4 },
            );
            titleEl.textContent = title;
          }
          if (descEl) {
            gsap.fromTo(
              descEl,
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.4, delay: 0.1 },
            );
            descEl.textContent = desc;
          }
        }

        // Update active class on custom pagination bullets
        const realIndex = this.realIndex % 3; // map 0-5 index range to 0-2 bullets
        const bullets = document.querySelectorAll(
          ".amenities-pagination .swiper-pagination-bullet",
        );
        bullets.forEach((bullet, idx) => {
          if (idx === realIndex) {
            bullet.classList.add("swiper-pagination-bullet-active");
          } else {
            bullet.classList.remove("swiper-pagination-bullet-active");
          }
        });
      },
    },
  });
}

// Amenities Section Desktop Parallax
let amenitiesMm = gsap.matchMedia();

amenitiesMm.add("(min-width: 769px)", () => {
  if (document.querySelector("#amenities-section")) {
    gsap.to(".mobile-amenities-topbar, .amenities-title", {
      y: -100, // Subtly moves up during scroll
      ease: "none",
      scrollTrigger: {
        trigger: "#amenities-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }
});

// Gallery Swiper Initialization
if (document.querySelector(".gallery-swiper")) {
  const gallerySwiper = new Swiper(".gallery-swiper", {
    slidesPerView: 1.5,
    centeredSlides: true,
    loop: true,
    spaceBetween: 20,
    initialSlide: 2,
    grabCursor: true,
    breakpoints: {
      769: {
        slidesPerView: 4,
        spaceBetween: 30,
        centeredSlides: false,
      },
    },
    navigation: {
      nextEl: ".gallery-next",
      prevEl: ".gallery-prev",
    },
    on: {
      init: function () {
        ScrollTrigger.refresh();
      },
    },
  });
}

// Video Modal Open / Close Logic
const videoCards = document.querySelectorAll(".video-card");
const videoModal = document.getElementById("video-modal");
const closeVideoModal = document.getElementById("close-video-modal");
const modalIframe = document.getElementById("modal-video-iframe");

if (videoCards.length > 0 && videoModal && closeVideoModal && modalIframe) {
  videoCards.forEach((card) => {
    card.addEventListener("click", () => {
      const videoSrc = card.getAttribute("data-video-src");
      modalIframe.src = videoSrc;
      videoModal.classList.add("active");
    });
  });

  const closeModal = () => {
    videoModal.classList.remove("active");
    modalIframe.src = "";
  };

  closeVideoModal.addEventListener("click", closeModal);

  const backdrop = videoModal.querySelector(".video-modal-backdrop");
  if (backdrop) {
    backdrop.addEventListener("click", closeModal);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && videoModal.classList.contains("active")) {
      closeModal();
    }
  });
}

// Contact Popup Modal Open / Close Logic
const contactModal = document.getElementById("contact-modal");
const closeContactModal = document.getElementById("close-contact-modal");

if (contactModal && closeContactModal) {
  // Show popup after 2 seconds when page loads
  window.addEventListener("load", () => {
    setTimeout(() => {
      contactModal.classList.add("active");
    }, 3000);
  });

  // Target the Hero CTA button to open the modal
  const heroCtaBtn = document.getElementById("hero-cta-btn");
  if (heroCtaBtn) {
    heroCtaBtn.addEventListener("click", (e) => {
      e.preventDefault();
      contactModal.classList.add("active");
    });
  }

  const closeContact = () => {
    contactModal.classList.remove("active");
  };

  closeContactModal.addEventListener("click", closeContact);

  const contactBackdrop = contactModal.querySelector(".video-modal-backdrop");
  if (contactBackdrop) {
    contactBackdrop.addEventListener("click", closeContact);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && contactModal.classList.contains("active")) {
      closeContact();
    }
  });

  // Handle Form Submission for both forms
  const contactForms = document.querySelectorAll("form");
  contactForms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thank you! Your request has been sent.");
      closeContact();
      form.reset();
    });
  });
}
