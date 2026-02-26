/* ========================================
   LEMUEL MENSAH — PORTFOLIO SCRIPTS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initTypewriter();
  initScrollReveal();
  initStatCounters();
  initHighlightReel();
  initLightbox();
});

/* ---- NAVIGATION ---- */
function initNavigation() {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const links = navLinks.querySelectorAll('.nav__link');

  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    nav.classList.toggle('nav--scrolled', scrollY > 50);
    lastScroll = scrollY;
  }, { passive: true });

  // Mobile menu
  const overlay = document.createElement('div');
  overlay.className = 'nav__overlay';
  document.body.appendChild(overlay);

  function toggleMenu() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    overlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);

  links.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('.section[id]');
  const observerOptions = {
    rootMargin: '-30% 0px -70% 0px',
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(link => link.classList.remove('active'));
        const activeLink = navLinks.querySelector(`a[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, observerOptions);

  sections.forEach(section => navObserver.observe(section));
}

/* ---- TYPEWRITER ---- */
function initTypewriter() {
  const element = document.getElementById('typewriter');
  if (!element) return;

  const phrases = [
    'build distributed systems.',
    'design scalable platforms.',
    'engineer reliable infrastructure.',
    'love clean code.',
    'ship production software.',
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      element.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      element.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typeSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 400; // Pause before next word
    }

    setTimeout(type, typeSpeed);
  }

  setTimeout(type, 1000);
}

/* ---- SCROLL REVEAL ---- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger the reveal for elements in the same viewport
          const delay = index * 80;
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  reveals.forEach(el => revealObserver.observe(el));
}

/* ---- STAT COUNTERS ---- */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-card__number[data-count]');

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(el => counterObserver.observe(el));
}

function animateCounter(element) {
  const target = parseFloat(element.getAttribute('data-count'));
  const duration = 1500;
  const isDecimal = target % 1 !== 0;
  const start = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;

    if (isDecimal) {
      element.textContent = current.toFixed(1);
    } else {
      element.textContent = Math.round(current);
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* ---- HIGHLIGHT REEL TABS ---- */
function initHighlightReel() {
  const tabs = document.querySelectorAll('.reel__tab');
  const panels = document.querySelectorAll('.reel__panel');

  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');

      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update active panel
      panels.forEach(panel => panel.classList.remove('active'));
      const activePanel = document.getElementById(`panel-${target}`);
      if (activePanel) activePanel.classList.add('active');
    });
  });
}

/* ---- LIGHTBOX ---- */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxCounter = document.getElementById('lightboxCounter');

  if (!lightbox) return;

  let currentImages = [];
  let currentIndex = 0;

  // Collect all real images inside highlight reel (not placeholders)
  function getVisibleImages() {
    const activePanel = document.querySelector('.reel__panel.active');
    if (!activePanel) return [];
    return Array.from(activePanel.querySelectorAll('.reel__image-wrapper img'));
  }

  // Open lightbox
  function openLightbox(img) {
    currentImages = getVisibleImages();
    currentIndex = currentImages.indexOf(img);
    if (currentIndex === -1) return;

    showImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Show current image
  function showImage() {
    if (!currentImages.length) return;
    const img = currentImages[currentIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || 'Photo';
    lightboxCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;

    // Hide nav buttons if only one image
    lightboxPrev.style.display = currentImages.length > 1 ? '' : 'none';
    lightboxNext.style.display = currentImages.length > 1 ? '' : 'none';
  }

  // Navigate
  function prevImage() {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    showImage();
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % currentImages.length;
    showImage();
  }

  // Make photo wrappers keyboard-focusable and identifiable as interactive.
  const photoWrappers = document.querySelectorAll('.reel__image-wrapper');
  photoWrappers.forEach((wrapper) => {
    const img = wrapper.querySelector('img');
    if (!img) return;
    wrapper.setAttribute('tabindex', '0');
    wrapper.setAttribute('role', 'button');
    wrapper.setAttribute('aria-label', `Open photo: ${img.alt || 'Photo'}`);
  });

  // Event: click on any photo wrapper that contains an image.
  document.addEventListener('click', (e) => {
    const wrapper = e.target.closest('.reel__image-wrapper');
    if (!wrapper) return;
    const img = wrapper.querySelector('img');
    if (!img) return;
    e.preventDefault();
    openLightbox(img);
  });

  // Event: keyboard open on focused photo wrapper.
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const wrapper = document.activeElement;
    if (!wrapper || !wrapper.classList || !wrapper.classList.contains('reel__image-wrapper')) return;
    const img = wrapper.querySelector('img');
    if (!img) return;
    e.preventDefault();
    openLightbox(img);
  });

  // Event: close
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Event: navigation
  lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    prevImage();
  });
  lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    nextImage();
  });

  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
      case 'ArrowRight':
        nextImage();
        break;
    }
  });

  // Swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextImage();
      else prevImage();
    }
  }, { passive: true });
}
