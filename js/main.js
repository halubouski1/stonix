/* Stonix landing: hero height, FAQ accordion, quote form (validation, attachments). */
(() => {
  const root = document.documentElement;

  /* --fixed-vh: set in <head>; updated only when the width changes, so mobile toolbars do not make the hero jump */
  let lastWidth = innerWidth;
  addEventListener('resize', () => {
    if (innerWidth === lastWidth) return;
    lastWidth = innerWidth;
    root.style.setProperty('--fixed-vh', innerHeight + 'px');
  });

  /* FAQ accordion (node 11:95): one item open at a time */
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

  /* Quote form (node 8:122). No backend yet: on a valid submit it only shows the status line. */
  const form = document.querySelector('[data-form]');
  if (!form) return;

  const VALIDATORS = {
    required: (v) => (v.trim() ? '' : 'Please fill this in.'),
    phone: (v) => (v.replace(/\D/g, '').length >= 10 ? '' : 'Enter a phone number with area code.'),
    email: (v) => (!v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter a valid email.'),
    zip: (v) => (!v.trim() || /^\d{5}(-\d{4})?$/.test(v.trim()) ? '' : 'Enter a 5-digit ZIP code.'),
  };
  const fields = [...form.querySelectorAll('[data-validate]')];
  const check = (input) => {
    const message = VALIDATORS[input.dataset.validate](input.value);
    const error = document.getElementById(input.getAttribute('aria-describedby'));
    input.setAttribute('aria-invalid', String(Boolean(message)));
    if (error) error.textContent = message;
    return !message;
  };
  fields.forEach((input) => {
    input.addEventListener('blur', () => input.value && check(input));
    input.addEventListener('input', () => input.getAttribute('aria-invalid') === 'true' && check(input));
  });

  /* Attachments: PDF, JPG or PNG up to 10 MB each; the hint shows what was picked */
  const MAX_BYTES = 10 * 1024 * 1024;
  const attach = form.querySelector('[data-attach]');
  const hint = form.querySelector('[data-attach-hint]');
  attach?.addEventListener('change', () => {
    const files = [...attach.files];
    const tooBig = files.filter((f) => f.size > MAX_BYTES);
    if (tooBig.length) {
      attach.value = '';
      hint.textContent = `${tooBig[0].name} is larger than 10 MB`;
      return;
    }
    hint.textContent = files.length ? files.map((f) => f.name).join(', ') : hint.dataset.default;
  });

  const status = form.querySelector('[data-form-status]');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const invalid = fields.filter((input) => !check(input));
    if (invalid.length) {
      invalid[0].focus();
      status.textContent = '';
      return;
    }
    // TODO: send to the endpoint in form.getAttribute('action') once the backend exists
    status.textContent = 'Thank you! We will reply with a price and a date for templating.';
    form.reset();
    if (hint) hint.textContent = hint.dataset.default;
  });
})();
