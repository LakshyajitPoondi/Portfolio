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
