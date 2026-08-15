import os
import re

css = """/* Footer Reveal & New Footer Design */
.main-content-wrapper {
  position: relative;
  z-index: 2;
  background-color: var(--color-white);
}
.footer-reveal-wrapper {
  position: relative;
  overflow: hidden;
  z-index: 1;
}
.footer {
  background-color: #000000;
  color: var(--color-white);
  padding: 6rem 2rem 2rem 2rem;
  width: 100%;
}
.footer-top {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  padding-bottom: 4rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.footer-bottom {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
}
.footer-brand .logo {
  color: var(--color-white);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  display: block;
}
.footer-newsletter .footer-desc {
  font-size: 1rem;
  line-height: 1.4;
  margin-bottom: 1rem;
}
.footer-newsletter .footer-subdesc {
  color: var(--color-text-muted);
  margin-bottom: 2rem;
}
.footer-newsletter .newsletter-form {
  display: flex;
  gap: 1rem;
  align-items: center;
}
.footer-newsletter input {
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--color-white);
  padding: 0.5rem 0;
  font-size: 0.85rem;
  font-family: inherit;
  flex: 1;
  min-width: 0;
}
.footer-newsletter input:focus {
  outline: none;
  border-bottom-color: var(--color-white);
}
.btn-newsletter-solid {
  background-color: var(--color-white);
  color: var(--color-black);
  border: none;
  padding: 0.5rem 1.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: opacity 0.3s ease;
}
.btn-newsletter-solid:hover {
  opacity: 0.8;
}
.footer-links {
  display: flex;
  gap: 2rem;
}
.footer-links a {
  color: var(--color-text-muted);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: color 0.3s ease;
}
.footer-links a:hover {
  color: var(--color-white);
}
.footer-socials a {
  color: var(--color-text-muted);
  transition: color 0.3s ease;
}
.footer-socials a:hover {
  color: var(--color-white);
}

@media (max-width: 768px) {
  .footer-top {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  .footer-bottom {
    flex-direction: column;
    gap: 1.5rem;
    align-items: flex-start;
  }
  .footer-links {
    flex-wrap: wrap;
    gap: 1rem;
  }
}
"""

with open('styles/main.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the previous footer block
content = re.sub(r'/\* Footer Reveal & New Footer Design \*/.*?(?=/\* Contact Page Design \*/)', css + '\n', content, flags=re.DOTALL)

with open('styles/main.css', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated styles/main.css')
