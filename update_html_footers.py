import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

footer_html = """  <div class="footer-reveal-wrapper">
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-brand">
          <a href="index.html" class="title-md logo">LAKSHYAJIT PHOTOGRAPHY</a>
          <p>out at the bottom.</p>
        </div>
        <div class="footer-editorial">
          <p class="footer-desc">Hello yes glad you made it to the bottom. This website is just meant for me to show off my photography.</p>
          <p class="footer-subdesc">For now...</p>
          <div class="footer-newsletter">
            <h4>Newsletter</h4>
            <form class="newsletter-form">
              <input type="email" placeholder="Email Address" required>
              <button type="submit" class="btn-newsletter">Sign Up</button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  </div>"""

for file in html_files:
    if file == 'contact.html':
        continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Update contact links
    content = content.replace('index.html#contact', 'contact.html')
    
    # 2. Add main-content-wrapper (only to index, gallery, animals, cars, portraits)
    # The header and mobile nav overlay should stay outside.
    # Actually, we can just replace the <footer class="footer">...</footer>
    # Wait, for the reveal to work, does the main content need to be wrapped?
    # In my CSS, I put .main-content-wrapper { position: relative; z-index: 2; background-color: var(--color-white); }
    # So we need to wrap the body contents EXCEPT header, nav, and footer in .main-content-wrapper.
    # This is tricky with regex.
    # An easier way is to just let the body be z-index: 2, but body can't be z-index 2 over footer if footer is fixed.
    # But wait, .footer-reveal-wrapper is in the normal flow! We animate its contents using GSAP!
    # Ah! Since .footer-reveal-wrapper is in normal flow, it pushes the page down normally.
    # The main content does NOT need to be wrapped! It just needs to have an opaque background!
    # Wait, the footer reveal parallax using GSAP:
    # GSAP animates .footer yPercent from -50 to 0 relative to .footer-reveal-wrapper (which is overflow: hidden).
    # This works entirely independently of the rest of the page because .footer-reveal-wrapper takes up space in the document flow,
    # and .footer is just moved inside it. So NO main content wrapping is needed at all for this effect!
    
    # Let's replace the footer block.
    content = re.sub(r'\s*<!-- Footer -->\s*<footer class="footer">.*?</footer>', '\n  <!-- Footer -->\n' + footer_html, content, flags=re.DOTALL)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
        
print('Updated footers and links')
