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
    }
  }
});
