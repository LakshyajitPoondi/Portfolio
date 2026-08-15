import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

footer_html = """  <div class="footer-reveal-wrapper">
    <footer class="footer">
      <div class="footer-top">
        <div class="footer-brand">
          <a href="index.html" class="title-md logo" style="font-family: 'RF Dewi Expanded', sans-serif; font-weight: 900; text-transform: uppercase;">LXY VISUALS</a>
          <p class="sub-text" style="text-transform: none; margin-top: 0.5rem;">but at the bottom.</p>
        </div>
        <div class="footer-newsletter">
          <p class="footer-desc">Hello yes glad you made it to the bottom. This website is just meant for me to show off my photography.</p>
          <p class="footer-subdesc">For now...</p>
          <h4 style="font-family: inherit; font-size: 0.85rem; font-weight: 400; color: var(--color-text-muted); margin-bottom: 0.25rem;">Newsletter</h4>
          <p class="sub-text" style="text-transform: none; margin-bottom: 1.5rem;">Uhh... I don't have newsletter yet, but if I make one you'll be the first to know.</p>
          
          <form class="newsletter-form">
            <input type="email" placeholder="Email Address" required>
            <button type="submit" class="btn-newsletter-solid">SIGN UP</button>
          </form>
          <p class="sub-text" style="text-transform: none; margin-top: 1rem; font-size: 0.75rem;">We respect your privacy.</p>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div>
          <span id="footer-time" class="sub-text" style="line-height: 1.5; font-size: 0.7rem;"></span>
        </div>
        <div class="footer-socials">
          <a href="https://www.instagram.com/lxy_visuals/" target="_blank" aria-label="Instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
        </div>
        <div class="footer-links">
          <a href="contact.html">CONTACT</a>
          <a href="#">TERMS OF SERVICE</a>
          <a href="#">PRIVACY POLICY</a>
        </div>
      </div>
    </footer>
  </div>"""

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace the existing footer-reveal-wrapper completely
    content = re.sub(r'\s*<div class="footer-reveal-wrapper">.*?</footer>\s*</div>', '\n' + footer_html, content, flags=re.DOTALL)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
        
print('Updated HTML footers.')
