document.addEventListener('DOMContentLoaded', () => {
  // Update Time
  const updateTime = () => {
    const now = new Date();
    
    // Time format: 23:09:22
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' };
    const timeStr = new Intl.DateTimeFormat('en-US', timeOptions).format(now);
    
    // Date format: SATURDAY, 04.04.26 (Day, MM.DD.YY)
    const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const day = dayNames[now.getDay()];
    
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const year = String(now.getFullYear()).slice(-2);
    
    const formattedString = `${timeStr} CHENNAI, INDIA<br>${day}, ${month}.${date}.${year}`;
    
    const heroTime = document.getElementById('hero-time');
    if (heroTime) heroTime.innerHTML = formattedString;
    
    const footerTime = document.getElementById('footer-time');
    if (footerTime) footerTime.innerHTML = formattedString;
  };

  setInterval(updateTime, 1000);
  updateTime();

  // Header Scroll Effect — optimized with requestAnimationFrame
  const header = document.getElementById('main-header');
  let lastScrollY = window.scrollY;
  let ticking = false;
  // Cache hero reference and its scroll distance once
  const hero = document.querySelector('.hero');
  let heroScrollDistance = hero ? hero.offsetHeight * 2 : 0;
  // Track previous states to avoid redundant DOM writes
  let wasSolid = false;
  let wasHidden = false;
  
  if (header) {
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          if (hero) {
            const shouldBeSolid = currentScrollY > heroScrollDistance - 100;
            if (shouldBeSolid !== wasSolid) {
              header.classList.toggle('solid', shouldBeSolid);
              wasSolid = shouldBeSolid;
            }
          }
          
          const shouldHide = currentScrollY > lastScrollY && currentScrollY > Math.max(80, heroScrollDistance);
          if (shouldHide !== wasHidden) {
            header.style.transform = shouldHide ? 'translateY(-100%)' : 'translateY(0)';
            wasHidden = shouldHide;
          }
          
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // GSAP ScrollTrigger Animations
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
      // Cinematic Scroll-Driven Hero Transition
      const heroSection = document.querySelector('.scroll-video-hero');
      const pinContainer = document.querySelector('.video-pin-container');
      const videoWrapper = document.querySelector('.video-wrapper');
      const actualVideo = document.querySelector('.actual-video');
      
      if (heroSection && videoWrapper && actualVideo) {
        let tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroSection,
            start: "top top",
            end: "+=100%", // Finite defined scroll distance
            scrub: true,   // Direct 1:1 scrub without smoothing lag to ensure it stops hard
            pin: true      // Pin the section itself
          }
        });
        
        tl.to(videoWrapper, {
          width: "100vw",
          borderRadius: 0,
          ease: "none"
        });
      }
      
      // LXY Visuals Entrance Animation
      const aboutSection = document.querySelector('.about-section');
      if (aboutSection) {
        gsap.fromTo(aboutSection, 
          { opacity: 0, y: 80 },
          {
            opacity: 1, 
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: aboutSection,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    }
  }

  // Mobile Navigation Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
  
  if (mobileMenuBtn && mobileNavOverlay) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      mobileNavOverlay.classList.toggle('active');
      document.body.style.overflow = mobileNavOverlay.classList.contains('active') ? 'hidden' : '';
    });
  }

  // Image reveal animation — lightweight, uses native loading
  const galleryImages = document.querySelectorAll('.gallery-item img');
  if (galleryImages.length > 0) {
    galleryImages.forEach(img => {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
      }
    });
  }
});

// Lightbox Implementation
document.addEventListener('DOMContentLoaded', () => {
  // Inject Lightbox HTML if there are galleries on the page
  const galleries = document.querySelectorAll('.gallery-grid, .portraits-grid');
  if (galleries.length === 0) return;

  const lightboxHTML = `
    <div class="lightbox" id="lightbox">
      <button class="lightbox-close" id="lightbox-close" aria-label="Close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <button class="lightbox-nav lightbox-prev" id="lightbox-prev" aria-label="Previous">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      <div class="lightbox-img-wrapper" id="lightbox-img-wrapper">
        <!-- images injected here -->
      </div>
      <button class="lightbox-nav lightbox-next" id="lightbox-next" aria-label="Next">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', lightboxHTML);

  const lightbox = document.getElementById('lightbox');
  const imgWrapper = document.getElementById('lightbox-img-wrapper');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  let currentImages = [];
  let currentIndex = 0;
  
  galleries.forEach(gallery => {
    // Collect all images in this specific gallery section
    const images = Array.from(gallery.querySelectorAll('.gallery-item img'));
    
    images.forEach((img, index) => {
      img.style.cursor = 'zoom-in'; // UX enhancement
      img.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(images, index);
      });
    });
  });

  function openLightbox(imagesArray, index) {
    currentImages = imagesArray;
    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.classList.add('no-scroll');
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  function updateLightboxImage() {
    if (currentImages.length === 0) return;
    
    // Check if we already have an active image
    const oldImg = imgWrapper.querySelector('.lightbox-img.active');
    
    // Create new image
    const newImg = document.createElement('img');
    newImg.className = 'lightbox-img';
    newImg.src = currentImages[currentIndex].src;
    newImg.alt = 'Fullscreen image';
    
    // Append and trigger layout
    imgWrapper.appendChild(newImg);
    // force reflow
    newImg.offsetHeight; 
    
    newImg.classList.add('active');
    
    if (oldImg) {
      oldImg.classList.remove('active');
      // Remove old image after transition
      setTimeout(() => {
        if (oldImg.parentNode) oldImg.remove();
      }, 200); // match CSS transition duration
    }
    
    // Update button states
    if (currentIndex === 0) {
      prevBtn.classList.add('hidden');
    } else {
      prevBtn.classList.remove('hidden');
    }
    
    if (currentIndex === currentImages.length - 1) {
      nextBtn.classList.add('hidden');
    } else {
      nextBtn.classList.remove('hidden');
    }
  }

  function goNext(e) {
    if (e) e.stopPropagation();
    if (currentIndex < currentImages.length - 1) {
      currentIndex++;
      updateLightboxImage();
    }
  }

  function goPrev(e) {
    if (e) e.stopPropagation();
    if (currentIndex > 0) {
      currentIndex--;
      updateLightboxImage();
    }
  }

  // Event Listeners for controls
  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', goPrev);
  nextBtn.addEventListener('click', goNext);

  // Close when clicking outside image
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === imgWrapper) {
      closeLightbox();
    }
  });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      goPrev();
    } else if (e.key === 'ArrowRight') {
      goNext();
    }
  });
});
