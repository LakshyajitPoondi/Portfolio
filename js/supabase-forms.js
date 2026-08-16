/**
 * Supabase Form Handlers
 * 
 * Handles newsletter subscriptions and contact/inquiry form submissions.
 * Requires supabase-js v2 loaded via CDN and supabase-config.js loaded first.
 * 
 * No database requests are made on page load — only on form submission.
 */

(function () {
  'use strict';

  // ── Supabase Client (singleton) ────────────────────────────────────────────
  let _supabaseClient = null;

  function getSupabaseClient() {
    if (_supabaseClient) return _supabaseClient;

    if (typeof supabase === 'undefined' || typeof supabase.createClient !== 'function') {
      console.error('[Supabase] supabase-js library not loaded.');
      return null;
    }
    if (typeof SUPABASE_URL === 'undefined' || typeof SUPABASE_KEY === 'undefined' ||
        SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_KEY === 'YOUR_SUPABASE_PUBLISHABLE_KEY') {
      console.warn('[Supabase] Credentials not configured. Update js/supabase-config.js with your project values.');
      return null;
    }

    _supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    return _supabaseClient;
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  function isValidEmail(email) {
    // Simple but effective email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Show a temporary feedback message next to a form element.
   * Uses a small <p> inserted after the reference element.
   */
  function showFeedback(referenceEl, message, isError) {
    // Remove any existing feedback from this form context
    const parent = referenceEl.closest('form') || referenceEl.parentElement;
    const existing = parent.querySelector('.supabase-feedback');
    if (existing) existing.remove();

    const p = document.createElement('p');
    p.className = 'supabase-feedback';
    p.textContent = message;
    p.style.cssText = [
      'margin-top: 0.75rem',
      'font-size: 0.85rem',
      'font-weight: 500',
      'transition: opacity 0.3s ease',
      isError ? 'color: #e74c3c' : 'color: #27ae60',
    ].join(';');

    referenceEl.insertAdjacentElement('afterend', p);

    // Auto-remove after 6 seconds
    setTimeout(() => {
      p.style.opacity = '0';
      setTimeout(() => p.remove(), 300);
    }, 6000);
  }

  function setButtonLoading(btn, loading) {
    if (loading) {
      btn.dataset.originalText = btn.textContent;
      btn.textContent = 'Submitting…';
      btn.disabled = true;
      btn.style.opacity = '0.6';
      btn.style.cursor = 'not-allowed';
    } else {
      btn.textContent = btn.dataset.originalText || btn.textContent;
      btn.disabled = false;
      btn.style.opacity = '';
      btn.style.cursor = '';
    }
  }

  // ── Newsletter Form Handler ────────────────────────────────────────────────

  async function handleNewsletterSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const emailInput = form.querySelector('input[type="email"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    const email = emailInput ? emailInput.value.trim() : '';

    if (!email) {
      showFeedback(submitBtn, 'Please enter your email address.', true);
      return;
    }
    if (!isValidEmail(email)) {
      showFeedback(submitBtn, 'Please enter a valid email address.', true);
      return;
    }

    const client = getSupabaseClient();
    if (!client) {
      showFeedback(submitBtn, 'Newsletter signup is not available right now.', true);
      return;
    }

    setButtonLoading(submitBtn, true);

    try {
      const { error } = await client
        .from('newsletter_subscribers')
        .insert({ email: email });

      if (error) {
        // Unique constraint violation — duplicate email
        if (error.code === '23505') {
          showFeedback(submitBtn, "You're already subscribed!", false);
        } else {
          console.error('[Supabase] Newsletter error:', error);
          showFeedback(submitBtn, 'Something went wrong. Please try again.', true);
        }
      } else {
        showFeedback(submitBtn, 'Thank you for subscribing!', false);
        form.reset();
      }
    } catch (err) {
      console.error('[Supabase] Newsletter network error:', err);
      showFeedback(submitBtn, 'Network error. Please check your connection.', true);
    } finally {
      setButtonLoading(submitBtn, false);
    }
  }

  // ── Contact / Inquiry Form Handler ─────────────────────────────────────────

  /**
   * Creates a submit handler for a contact/inquiry form.
   * @param {Object} fieldSelectors - Maps field names to their CSS selectors or IDs
   */
  function createContactHandler(fieldSelectors) {
    return async function handleContactSubmit(e) {
      e.preventDefault();

      const form = e.target;
      const submitBtn = form.querySelector('button[type="submit"]');

      // Read and trim fields
      const firstName = (form.querySelector(fieldSelectors.firstName)?.value || '').trim();
      const lastName = (form.querySelector(fieldSelectors.lastName)?.value || '').trim();
      const email = (form.querySelector(fieldSelectors.email)?.value || '').trim();
      const subject = (form.querySelector(fieldSelectors.subject)?.value || '').trim();
      const message = (form.querySelector(fieldSelectors.message)?.value || '').trim();
      const newsletterCheckbox = form.querySelector(fieldSelectors.newsletter);
      const wantsNewsletter = newsletterCheckbox ? newsletterCheckbox.checked : false;

      // Validation
      if (!firstName) {
        showFeedback(submitBtn, 'Please enter your first name.', true);
        return;
      }
      if (!lastName) {
        showFeedback(submitBtn, 'Please enter your last name.', true);
        return;
      }
      if (!email) {
        showFeedback(submitBtn, 'Please enter your email address.', true);
        return;
      }
      if (!isValidEmail(email)) {
        showFeedback(submitBtn, 'Please enter a valid email address.', true);
        return;
      }
      if (!message) {
        showFeedback(submitBtn, 'Please enter your message.', true);
        return;
      }

      const client = getSupabaseClient();
      if (!client) {
        showFeedback(submitBtn, 'Form submission is not available right now.', true);
        return;
      }

      setButtonLoading(submitBtn, true);

      try {
        // Submit the inquiry
        const { error: inquiryError } = await client
          .from('inquiries')
          .insert({
            first_name: firstName,
            last_name: lastName,
            email: email,
            subject: subject || null,
            message: message,
          });

        if (inquiryError) {
          console.error('[Supabase] Inquiry error:', inquiryError);
          showFeedback(submitBtn, 'Something went wrong. Please try again.', true);
          return;
        }

        // If newsletter checkbox is checked, also subscribe to newsletter
        if (wantsNewsletter) {
          try {
            const { error: nlError } = await client
              .from('newsletter_subscribers')
              .insert({ email: email });

            // Silently handle duplicate — inquiry already succeeded
            if (nlError && nlError.code !== '23505') {
              console.warn('[Supabase] Newsletter signup alongside inquiry failed:', nlError);
            }
          } catch (nlErr) {
            // Don't let newsletter failure block the inquiry success
            console.warn('[Supabase] Newsletter signup network error:', nlErr);
          }
        }

        showFeedback(submitBtn, 'Your inquiry has been submitted. Thank you!', false);
        form.reset();
      } catch (err) {
        console.error('[Supabase] Inquiry network error:', err);
        showFeedback(submitBtn, 'Network error. Please check your connection.', true);
      } finally {
        setButtonLoading(submitBtn, false);
      }
    };
  }

  // ── Initialization (on DOMContentLoaded) ───────────────────────────────────

  document.addEventListener('DOMContentLoaded', () => {

    // Attach newsletter handlers to ALL newsletter forms (present in every page footer)
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
      form.addEventListener('submit', handleNewsletterSubmit);
    });

    // index.html contact form — uses id-based selectors
    const indexContactForm = document.getElementById('index-contact-form');
    if (indexContactForm) {
      indexContactForm.addEventListener('submit', createContactHandler({
        firstName: '#first-name',
        lastName: '#last-name',
        email: '#email',
        subject: '#subject',
        message: '#message',
        newsletter: '#newsletter-signup',
      }));
    }

    // contact.html editorial contact form — uses id-based selectors (ids added to the HTML)
    const editorialContactForm = document.querySelector('.contact-form-editorial');
    if (editorialContactForm) {
      editorialContactForm.addEventListener('submit', createContactHandler({
        firstName: '#contact-first-name',
        lastName: '#contact-last-name',
        email: '#contact-email',
        subject: '#contact-subject',
        message: '#contact-message',
        newsletter: '#newsletter',
      }));
    }
  });

})();
