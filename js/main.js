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

  // Header Scroll Effect
  const header = document.getElementById('main-header');
  let lastScrollY = window.scrollY;
  
  if (header) {
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const hero = document.querySelector('.hero');
      // The hero is pinned for an extra 100% of its height, so total distance is height * 2
      const heroScrollDistance = hero ? hero.offsetHeight * 2 : 0;
      
      // Toggle solid background if hero exists, but ONLY after the pinned hero animation finishes
      if (hero) {
        if (currentScrollY > heroScrollDistance - 100) {
          header.classList.add('solid');
        } else {
          header.classList.remove('solid');
        }
      }
      
      // Hide on scroll down, show on scroll up, BUT keep visible throughout the entire cinematic hero
      if (currentScrollY > lastScrollY && currentScrollY > Math.max(80, heroScrollDistance)) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      
      lastScrollY = currentScrollY;
    });
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

      // Footer Reveal Animation (Parallax)
      const footerRevealWrapper = document.querySelector('.footer-reveal-wrapper');
      const footerElement = document.querySelector('.footer');
      if (footerRevealWrapper && footerElement) {
        gsap.fromTo(footerElement,
          { yPercent: -100 },
          {
            yPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: footerRevealWrapper,
              start: "top bottom",
              end: "bottom bottom",
              scrub: true
            }
          }
        );
      }
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
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

  // Photography Gallery Shuffle
  const galleryGrid = document.querySelector('.gallery-grid');
  if (galleryGrid) {
    const items = Array.from(galleryGrid.querySelectorAll('.gallery-item'));
    if (items.length > 0) {
      // 1. Visual Shuffle (in-memory)
      for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
      }
      // Single DOM operation
      const fragment = document.createDocumentFragment();
      items.forEach(item => fragment.appendChild(item));
      galleryGrid.appendChild(fragment);
    }
  }

  // Progressive Interleaved Loading for all lazy images
  const images = Array.from(document.querySelectorAll('img[data-src]'));
  if (images.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      const visibleImages = entries
        .filter(entry => entry.isIntersecting)
        .map(entry => entry.target);
        
      if (visibleImages.length === 0) return;
      
      // Group by priority
      const queues = { high: [], medium: [], low: [] };
      visibleImages.forEach(img => {
        const priority = img.dataset.priority || 'medium';
        if (queues[priority]) queues[priority].push(img);
        observer.unobserve(img);
      });
      
      // Interleaved ratio: 2 high, 1 medium, 1 low
      const loadQueue = [];
      while (queues.high.length > 0 || queues.medium.length > 0 || queues.low.length > 0) {
        if (queues.high.length > 0) loadQueue.push(queues.high.shift());
        if (queues.high.length > 0) loadQueue.push(queues.high.shift());
        if (queues.medium.length > 0) loadQueue.push(queues.medium.shift());
        if (queues.low.length > 0) loadQueue.push(queues.low.shift());
      }
      
      // Load sequence
      loadQueue.forEach(img => {
        img.onload = () => img.classList.add('loaded');
        img.src = img.dataset.src;
      });
    }, { rootMargin: "300px" });
    
    images.forEach(img => observer.observe(img));
  }
});
