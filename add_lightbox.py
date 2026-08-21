import os

css_code = """
/* Fullscreen Lightbox */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.lightbox.active {
  opacity: 1;
  pointer-events: auto;
}

.lightbox-img {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  user-select: none;
}

.lightbox-close {
  position: absolute;
  top: 2rem;
  right: 2rem;
  color: white;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 10000;
  padding: 0.5rem;
  transition: opacity 0.3s ease;
}

.lightbox-close:hover, .lightbox-nav:hover {
  opacity: 0.7;
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  z-index: 10000;
  padding: 1rem;
  transition: opacity 0.3s ease;
}

.lightbox-prev {
  left: 2rem;
}

.lightbox-next {
  right: 2rem;
}

.lightbox-nav:disabled, .lightbox-nav.hidden {
  opacity: 0 !important;
  pointer-events: none;
}

body.no-scroll {
  overflow: hidden !important;
}
"""

js_code = """
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
      <img class="lightbox-img" id="lightbox-img" src="" alt="Fullscreen image">
      <button class="lightbox-nav lightbox-next" id="lightbox-next" aria-label="Next">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', lightboxHTML);

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
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
    
    const imgSource = currentImages[currentIndex].src;
    lightboxImg.src = imgSource;
    
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
    if (e.target === lightbox) {
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
"""

css_path = os.path.join("styles", "main.css")
js_path = os.path.join("js", "main.js")

with open(css_path, "a", encoding="utf-8") as f:
    f.write(css_code)

with open(js_path, "a", encoding="utf-8") as f:
    f.write(js_code)

print("Appended lightbox code to CSS and JS files successfully.")
