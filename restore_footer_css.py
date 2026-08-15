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
  padding: 4rem;
  display: flex;
  flex-direction: column;
}

.footer-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6rem;
}

.footer-brand .logo {
  margin-bottom: 1rem;
  display: block;
}

.footer-brand p {
  font-size: 0.875rem;
  opacity: 0.7;
}

.footer-newsletter {
  max-width: 400px;
}

.footer-newsletter p {
  font-size: 1.125rem;
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.footer-newsletter .sub-text {
  font-size: 0.875rem;
  opacity: 0.7;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.newsletter-form {
  display: flex;
  gap: 1rem;
}

.newsletter-form input {
  flex: 1;
  background: var(--color-white);
  padding: 0.75rem 1rem;
  border: none;
  font-size: 0.875rem;
}

.btn-newsletter {
  background: var(--color-white);
  color: var(--color-black);
  padding: 0.75rem 2rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: opacity 0.3s ease;
  border: none;
}

.btn-newsletter:hover {
  opacity: 0.8;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 2rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.7;
}

.footer-socials {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.footer-socials img, .footer-socials svg {
  width: 24px;
  height: 24px;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: right;
}

.footer-links a {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .footer {
    padding: 2rem;
  }
  .footer-top {
    flex-direction: column;
    gap: 3rem;
  }
  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 2rem;
  }
  .footer-links {
    text-align: left;
  }
}
"""

with open('styles/main.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the previous footer block
content = re.sub(r'/\* Footer Reveal & New Footer Design \*/.*?(?=/\* Contact Page Design \*/)', css + '\n', content, flags=re.DOTALL)

with open('styles/main.css', 'w', encoding='utf-8') as f:
    f.write(content)
print('Restored original footer CSS')
