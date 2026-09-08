document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
function closeMenu(restoreFocus = false) {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.textContent = 'Menu +';
  if (restoreFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('is-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.textContent = open ? 'Close −' : 'Menu +';
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
matchMedia('(min-width: 801px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

const clock = document.querySelector('#chennai-time');
function updateClock() {
  const now = new Date();
  if (clock) {
    clock.dateTime = now.toISOString();
    clock.textContent = new Intl.DateTimeFormat('en-GB', {timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit'}).format(now);
  }
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Intl.DateTimeFormat('en', {timeZone:'Asia/Kolkata',year:'numeric'}).format(now);
  });
}
updateClock();
setInterval(updateClock, 60000);

document.querySelectorAll('.photo-link img').forEach(img => {
  const failed = () => img.closest('.photo-link').classList.add('image-error');
  img.addEventListener('error', failed);
  if (img.complete && !img.naturalWidth) failed();
});

// Native dialog provides focus containment, Escape handling, and inert background.
const dialog = document.querySelector('#lightbox');
if (dialog && typeof dialog.showModal === 'function') {
  const stage = document.querySelector('#lightbox-stage');
  const status = document.querySelector('#lightbox-status');
  const caption = document.querySelector('#lightbox-caption');
  const count = document.querySelector('#lightbox-count');
  const previous = document.querySelector('#lightbox-prev');
  const next = document.querySelector('#lightbox-next');
  let items = [];
  let index = 0;
  let trigger = null;
  let generation = 0;

  const render = () => {
    const version = ++generation;
    const source = items[index];
    const thumbnail = source.querySelector('img');
    stage.querySelector('img')?.remove();
    status.hidden = false;
    status.textContent = 'Loading photograph…';
    caption.textContent = thumbnail.alt;
    count.textContent = 'FRAME ' + String(index + 1).padStart(2,'0') + ' / ' + String(items.length).padStart(2,'0');
    previous.disabled = index === 0;
    next.disabled = index === items.length - 1;
    const image = new Image();
    image.alt = thumbnail.alt;
    image.decoding = 'async';
    image.onload = () => {
      if (version === generation) status.hidden = true;
    };
    image.onerror = () => {
      if (version !== generation) return;
      image.hidden = true;
      status.textContent = 'This photograph could not load. ';
      const retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'button';
      retry.textContent = 'Retry';
      retry.addEventListener('click', render);
      status.append(retry);
    };
    stage.prepend(image);
    // href is the largest existing optimized variant, never the original.
    image.src = source.href;
  };
  document.querySelectorAll('[data-lightbox]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      items = [...link.closest('[data-gallery]').querySelectorAll('[data-lightbox]')];
      index = items.indexOf(link);
      trigger = link;
      dialog.showModal();
      document.body.classList.add('modal-open');
      render();
    });
  });
  const move = direction => {
    const candidate = index + direction;
    if (candidate >= 0 && candidate < items.length) { index = candidate; render(); }
  };
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  document.querySelector('#lightbox-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Tab') {
      const controls = [...dialog.querySelectorAll('button:not(:disabled), a[href]')].filter(el => !el.hidden);
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  dialog.addEventListener('close', () => {
    generation++;
    document.body.classList.remove('modal-open');
    stage.querySelector('img')?.remove();
    trigger?.focus({preventScroll:true});
  });
}

const form = document.querySelector('#contact-form');
if (form) {
  const status = document.querySelector('#form-status');
  const submit = form.querySelector('[type="submit"]');
  const originalLabel = submit.innerHTML;
  let pending = false;
  let requestId = null;
  let lastPayload = '';
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending || !form.reportValidity()) return;
    const payload = Object.fromEntries(new FormData(form));
    const serialized = JSON.stringify(payload);
    if (serialized !== lastPayload || !requestId) {
      requestId = crypto.randomUUID();
      lastPayload = serialized;
    }
    pending = true;
    submit.disabled = true;
    form.setAttribute('aria-busy', 'true');
    submit.textContent = 'Sending…';
    status.textContent = 'Sending your enquiry…';
    try {
      const response = await fetch('/api/contact', {
        method:'POST',
        headers:{'Content-Type':'application/json','Idempotency-Key':requestId},
        body:serialized,
        signal:AbortSignal.timeout(15000)
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) throw new Error(result?.message || 'Your enquiry could not be sent. Please try again or contact me on Instagram.');
      status.textContent = result.message;
      form.reset();
      requestId = null;
    } catch (error) {
      status.textContent = error.name === 'TimeoutError' || error.name === 'AbortError'
        ? 'The request timed out. Your details are still here; retry, or contact me on Instagram.'
        : error instanceof TypeError
          ? 'Could not connect. Your details are still here; try again or contact me on Instagram.'
          : error.message;
    } finally {
      pending = false;
      submit.disabled = false;
      submit.innerHTML = originalLabel;
      form.removeAttribute('aria-busy');
      status.focus({preventScroll:true});
    }
  });
}
