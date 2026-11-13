/* Stonix landing: hero height, Our work slider, FAQ accordion, quote modal, forms (validation, attachments). */
(() => {
  const root = document.documentElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  /* --fixed-vh: set in <head>; updated only when the width changes, so mobile toolbars do not make the hero jump */
  let lastWidth = innerWidth;
  addEventListener('resize', () => {
    if (innerWidth === lastWidth) return;
    lastWidth = innerWidth;
    root.style.setProperty('--fixed-vh', innerHeight + 'px');
  });

  /* ---------- Our work slider (node 41:154) ----------
     Native horizontal scroll with snap (touch, trackpad, keyboard). Arrows step one card;
     a mouse can drag the track. Arrows are disabled at either end. */
  const viewport = document.querySelector('[data-work-viewport]');
  if (viewport) {
    const prev = document.querySelector('[data-work-prev]');
    const next = document.querySelector('[data-work-next]');
    const cards = [...viewport.querySelectorAll('.work-card')];
    const edge = () => parseFloat(getComputedStyle(viewport).paddingLeft) || 0;
    const maxScroll = () => viewport.scrollWidth - viewport.clientWidth;
    // Snap positions of the cards; positions close to the end merge into the end itself
    const targets = () => {
      const max = maxScroll();
      const near = 120;
      return [...new Set(cards.map((card) => {
        const t = card.offsetLeft - edge();
        return max - t < near ? max : t;
      }))];
    };
    const behavior = () => (reducedMotion.matches ? 'auto' : 'smooth');

    const update = () => {
      prev.disabled = viewport.scrollLeft <= 2;
      next.disabled = viewport.scrollLeft >= maxScroll() - 2;
    };
    const step = (dir) => {
      const x = viewport.scrollLeft;
      const list = targets();
      const left = dir > 0 ? list.find((t) => t > x + 2) : [...list].reverse().find((t) => t < x - 2);
      viewport.scrollTo({ left: left ?? (dir > 0 ? maxScroll() : 0), behavior: behavior() });
    };
    prev.addEventListener('click', () => step(-1));
    next.addEventListener('click', () => step(1));
    viewport.addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();

    // Mouse drag (touch and pens use native scrolling)
    let drag = null;
    viewport.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      drag = { x: e.clientX, left: viewport.scrollLeft, moved: false, id: e.pointerId };
    });
    viewport.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) < 4) return;
      if (!drag.moved) {
        drag.moved = true;
        viewport.classList.add('is-dragging');
        viewport.setPointerCapture(drag.id);
      }
      viewport.scrollLeft = drag.left - dx;
    });
    const endDrag = () => {
      if (!drag) return;
      const moved = drag.moved;
      drag = null;
      if (!moved) return;
      // Settle on the nearest card, then hand control back to scroll snap
      const x = viewport.scrollLeft;
      const nearest = targets().reduce((a, b) => (Math.abs(b - x) < Math.abs(a - x) ? b : a));
      viewport.scrollTo({ left: nearest, behavior: behavior() });
      setTimeout(() => viewport.classList.remove('is-dragging'), reducedMotion.matches ? 0 : 450);
    };
    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);
    viewport.addEventListener('dragstart', (e) => e.preventDefault());
  }

  /* ---------- FAQ accordion (node 11:95): one item open at a time ---------- */
  const accordion = document.querySelector('[data-accordion]');
  if (accordion) {
    const items = [...accordion.querySelectorAll('.faq-item')];
    const setOpen = (item, open) => {
      item.classList.toggle('is-open', open);
      item.querySelector('.faq-item__btn').setAttribute('aria-expanded', String(open));
    };
    items.forEach((item) => {
      item.querySelector('.faq-item__btn').addEventListener('click', () => {
        const open = !item.classList.contains('is-open');
        items.forEach((other) => other !== item && setOpen(other, false));
        setOpen(item, open);
      });
    });
  }

  /* ---------- Quote modal (nodes 13:154 form, 13:219 sent): native <dialog> ---------- */
  const modal = document.querySelector('[data-modal]');
  let returnFocus = null;
  let closeTimer = 0;

  const setView = (name) => {
    modal.querySelectorAll('[data-modal-view]').forEach((view) => {
      view.hidden = view.dataset.modalView !== name;
    });
    modal.setAttribute('aria-labelledby', name === 'sent' ? 'modal-sent-title' : 'modal-title');
  };

  const openModal = (view = 'form', trigger = document.activeElement) => {
    if (!modal) return;
    clearTimeout(closeTimer);
    setView(view);
    if (!modal.open) {
      returnFocus = trigger;
      modal.showModal();
      root.classList.add('is-locked');
      requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('is-open')));
    }
    const focusTarget = view === 'sent' ? modal.querySelector('#modal-sent-title') : modal.querySelector('#m-name');
    focusTarget?.focus({ preventScroll: true });
  };

  const closeModal = () => {
    if (!modal?.open) return;
    modal.classList.remove('is-open');
    const finish = () => {
      modal.close();
      root.classList.remove('is-locked');
      setView('form');
      resetForm(modal.querySelector('[data-form]'));
      returnFocus?.focus?.({ preventScroll: true });
    };
    closeTimer = setTimeout(finish, reducedMotion.matches ? 0 : 350);
  };

  if (modal) {
    document.addEventListener('click', (e) => {
      const opener = e.target.closest('[data-modal-open]');
      if (opener) {
        e.preventDefault();
        openModal('form', opener);
      }
    });
    modal.querySelectorAll('[data-modal-close]').forEach((btn) => btn.addEventListener('click', closeModal));
    // Esc: animate out instead of the instant native close
    modal.addEventListener('cancel', (e) => {
      e.preventDefault();
      closeModal();
    });
    // Click on the backdrop (outside the panel's box) closes
    modal.addEventListener('pointerdown', (e) => {
      if (e.target !== modal) return;
      const r = modal.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) closeModal();
    });
  }

  /* ---------- Forms: inline quote form (node 8:122) and the modal form ----------
     No backend yet: a valid submit shows the modal's "sent" view. */
  const VALIDATORS = {
    required: (v) => (v.trim() ? '' : 'Please fill this in.'),
    phone: (v) => (v.replace(/\D/g, '').length >= 10 ? '' : 'Enter a phone number with area code.'),
    email: (v) => (!v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter a valid email.'),
    zip: (v) => (!v.trim() || /^\d{5}(-\d{4})?$/.test(v.trim()) ? '' : 'Enter a 5-digit ZIP code.'),
  };
  const MAX_BYTES = 10 * 1024 * 1024;

  const check = (input) => {
    const message = VALIDATORS[input.dataset.validate](input.value);
    const error = document.getElementById(input.getAttribute('aria-describedby'));
    input.setAttribute('aria-invalid', String(Boolean(message)));
    if (error) error.textContent = message;
    return !message;
  };

  function resetForm(form) {
    if (!form) return;
    form.reset();
    form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
    form.querySelectorAll('.field__error').forEach((el) => (el.textContent = ''));
    const hint = form.querySelector('[data-attach-hint]');
    if (hint) hint.textContent = hint.dataset.default;
  }

  document.querySelectorAll('[data-form]').forEach((form) => {
    const fields = [...form.querySelectorAll('[data-validate]')];
    fields.forEach((input) => {
      input.addEventListener('blur', () => input.value && check(input));
      input.addEventListener('input', () => input.getAttribute('aria-invalid') === 'true' && check(input));
    });

    // Attachments: PDF, JPG or PNG up to 10 MB each; the hint shows what was picked
    const attach = form.querySelector('[data-attach]');
    const hint = form.querySelector('[data-attach-hint]');
    attach?.addEventListener('change', () => {
      const files = [...attach.files];
      const tooBig = files.find((f) => f.size > MAX_BYTES);
      if (tooBig) {
        attach.value = '';
        hint.textContent = `${tooBig.name} is larger than 10 MB`;
        return;
      }
      hint.textContent = files.length ? files.map((f) => f.name).join(', ') : hint.dataset.default;
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const invalid = fields.filter((input) => !check(input));
      if (invalid.length) {
        invalid[0].focus();
        return;
      }
      // TODO: send to the endpoint in form.getAttribute('action') once the backend exists
      resetForm(form);
      openModal('sent', form.querySelector('[type="submit"]'));
    });
  });
})();
