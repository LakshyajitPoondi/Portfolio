import os

css = """
/* Footer Reveal & New Footer Design */
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
  background-color: var(--color-black);
  color: var(--color-white);
  padding: 6rem 2rem 4rem 2rem;
  width: 100%;
}
.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
}
.footer-brand .logo {
  color: var(--color-white);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  display: block;
}
.footer-brand p {
  color: var(--color-text-muted);
  font-size: 0.85rem;
}
.footer-editorial .footer-desc {
  font-size: 1.2rem;
  line-height: 1.4;
  margin-bottom: 1.5rem;
}
.footer-editorial .footer-subdesc {
  color: var(--color-text-muted);
  margin-bottom: 3rem;
}
.footer-newsletter h4 {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  margin-bottom: 1rem;
  font-weight: 400;
}
.footer-newsletter .newsletter-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.footer-newsletter input {
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--color-white);
  padding: 0.5rem 0;
  font-size: 1rem;
  font-family: inherit;
}
.footer-newsletter input:focus {
  outline: none;
  border-bottom-color: var(--color-white);
}
.footer-newsletter .btn-newsletter {
  align-self: flex-start;
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  font-size: 0.85rem;
  padding: 0;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: color 0.3s ease;
}
.footer-newsletter .btn-newsletter:hover {
  color: var(--color-white);
}

@media (max-width: 768px) {
  .footer-container {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}

/* Contact Page Design */
.contact-page-wrapper {
  padding-top: calc(var(--header-height) + 4rem);
  padding-bottom: 6rem;
  min-height: 100vh;
  background-color: var(--color-off-white);
}
.contact-page-container {
  display: grid;
  grid-template-columns: 200px 1fr;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  gap: 2rem;
}
.contact-sidebar .sub-text {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.contact-form-editorial {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 900px;
}
.form-group-editorial label {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}
.form-group-editorial input[type="text"],
.form-group-editorial input[type="email"],
.form-group-editorial textarea {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--color-text-muted);
  padding: 0.5rem 0;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s ease;
}
.form-group-editorial input:focus,
.form-group-editorial textarea:focus {
  outline: none;
  border-bottom-color: var(--color-black);
}
.form-group-editorial textarea {
  resize: vertical;
}
.form-row-editorial {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
.checkbox-group-editorial {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: -0.5rem;
}
.checkbox-group-editorial input {
  margin: 0;
}
.checkbox-group-editorial label {
  margin: 0;
  font-weight: 400;
  color: var(--color-text-muted);
}
.btn-outline-editorial {
  margin-top: 1.5rem;
  background: transparent;
  border: 1px solid var(--color-black);
  color: var(--color-black);
  padding: 1rem;
  width: 100%;
  text-align: center;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}
.btn-outline-editorial:hover {
  background-color: var(--color-black);
  color: var(--color-white);
}

@media (max-width: 768px) {
  .contact-page-container {
    grid-template-columns: 1fr;
  }
  .contact-sidebar {
    margin-bottom: 2rem;
  }
  .form-row-editorial {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
"""
with open('styles/main.css', 'a', encoding='utf-8') as f:
    f.write(css)
print('Appended styles to main.css')
