/* Alves Renovation — site interactions & lead capture */
(function () {
  'use strict';

  var BUSINESS_PHONE = '+12676160381';

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
  });
  if (nav) nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', false); }
  });

  /* ---------- Hero photo slider ---------- */
  var hero = document.getElementById('heroSlider');
  if (hero) {
    var hSlides = hero.querySelectorAll('.hero-slide');
    var hDotsWrap = hero.querySelector('.hero-slider__dots');
    var hIdx = 0, hTimer;
    hSlides.forEach(function (_, i) {
      var d = document.createElement('button');
      d.addEventListener('click', function () { hShow(i); hRestart(); });
      hDotsWrap.appendChild(d);
    });
    var hDots = hDotsWrap.children;
    function hShow(i) {
      hIdx = (i + hSlides.length) % hSlides.length;
      for (var k = 0; k < hSlides.length; k++) {
        hSlides[k].classList.toggle('is-active', k === hIdx);
        hDots[k].classList.toggle('is-active', k === hIdx);
      }
      var next = hSlides[(hIdx + 1) % hSlides.length].querySelector('img');
      if (next && next.loading === 'lazy') next.loading = 'eager';
    }
    function hRestart() { clearInterval(hTimer); hTimer = setInterval(function () { hShow(hIdx + 1); }, 4500); }
    hero.querySelector('.hero-slider__btn--prev').addEventListener('click', function () { hShow(hIdx - 1); hRestart(); });
    hero.querySelector('.hero-slider__btn--next').addEventListener('click', function () { hShow(hIdx + 1); hRestart(); });
    var hx = null;
    hero.addEventListener('touchstart', function (e) { hx = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', function (e) {
      if (hx === null) return;
      var dx = e.changedTouches[0].clientX - hx; hx = null;
      if (Math.abs(dx) > 40) { hShow(hIdx + (dx < 0 ? 1 : -1)); hRestart(); }
    });
    if (hSlides.length) { hShow(0); hRestart(); }
  }

  /* ---------- Before / After slider ---------- */
  function initBA(ba) {
    var range = ba.querySelector('.ba__range');
    function setPos(v) {
      v = Math.max(0, Math.min(100, +v));
      ba.style.setProperty('--pos', v + '%');
      range.value = v;
      ba.classList.toggle('is-full-before', v >= 97);
      ba.classList.toggle('is-full-after', v <= 3);
    }
    range.addEventListener('input', function () { setPos(range.value); });
    var dragging = false;
    function posFromEvent(e) {
      var r = ba.getBoundingClientRect();
      return ((e.clientX - r.left) / r.width) * 100;
    }
    ba.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.ba__label')) return;
      dragging = true; ba.classList.add('is-dragging');
      ba.setPointerCapture(e.pointerId);
      setPos(posFromEvent(e));
    });
    ba.addEventListener('pointermove', function (e) { if (dragging) setPos(posFromEvent(e)); });
    ['pointerup', 'pointercancel'].forEach(function (ev) {
      ba.addEventListener(ev, function () { dragging = false; ba.classList.remove('is-dragging'); });
    });
    function animateTo(target) {
      var start = parseFloat(range.value), t0 = null;
      function step(ts) {
        if (!t0) t0 = ts;
        var k = Math.min(1, (ts - t0) / 450), ease = 1 - Math.pow(1 - k, 3);
        setPos(start + (target - start) * ease);
        if (k < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    ba.querySelector('.ba__label--before').addEventListener('click', function () { animateTo(100); });
    ba.querySelector('.ba__label--after').addEventListener('click', function () { animateTo(0); });
    setPos(50);
    ba.setPos = setPos;
  }
  document.querySelectorAll('.ba').forEach(initBA);

  var ba = document.getElementById('ba');
  var baTabs = document.querySelectorAll('.ba-tab');
  if (ba && baTabs.length) {
    var imgBefore = ba.querySelector('.ba__before');
    var imgAfter = ba.querySelector('.ba__after');
    var baTitle = document.getElementById('baTitle');
    var baText = document.getElementById('baText');
    baTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        baTabs.forEach(function (t) { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
        tab.classList.add('is-active'); tab.setAttribute('aria-selected', 'true');
        var d = tab.dataset;
        ba.classList.add('is-fading');
        setTimeout(function () {
          imgBefore.src = d.before;
          imgAfter.src = d.after;
          imgBefore.alt = 'Before: ' + d.title;
          imgAfter.alt = 'After: ' + d.title;
          baTitle.textContent = d.title;
          baText.textContent = d.text;
          ba.setPos(50);
          ba.classList.remove('is-fading');
        }, 220);
      });
    });
    baTabs.forEach(function (t) { new Image().src = t.dataset.before; new Image().src = t.dataset.after; });
  }

  /* ---------- Gallery carousel ---------- */
  var carousel = document.getElementById('carousel');
  if (carousel) {
    var track = carousel.querySelector('.carousel__track');
    var slides = Array.prototype.slice.call(track.children);
    var dotsWrap = carousel.querySelector('.carousel__dots');
    slides.forEach(function (_, i) {
      var d = document.createElement('button');
      d.addEventListener('click', function () { goTo(i); });
      dotsWrap.appendChild(d);
    });
    var dots = dotsWrap.children;
    var stepWidth = function () { return slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth; };
    var current = function () { return Math.round(track.scrollLeft / stepWidth()); };
    var goTo = function (i) {
      var max = track.scrollWidth - track.clientWidth;
      track.scrollTo({ left: Math.min(i * stepWidth(), max) });
    };
    var updateDots = function () {
      var c = current();
      var atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
      for (var i = 0; i < dots.length; i++) dots[i].classList.toggle('is-active', atEnd ? i === dots.length - 1 : i === c);
    };
    track.addEventListener('scroll', function () { window.requestAnimationFrame(updateDots); });
    carousel.querySelector('.carousel__btn--prev').addEventListener('click', function () { goTo(Math.max(0, current() - 1)); });
    carousel.querySelector('.carousel__btn--next').addEventListener('click', function () {
      var atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
      goTo(atEnd ? 0 : current() + 1);
    });
    updateDots();
    var autoplay = setInterval(function () { carousel.querySelector('.carousel__btn--next').click(); }, 4500);
    ['mouseenter', 'touchstart', 'focusin'].forEach(function (ev) {
      carousel.addEventListener(ev, function () { clearInterval(autoplay); }, { passive: true, once: true });
    });
  }

  /* ---------- Show flooring-type question only for flooring ---------- */
  var flooringField = document.getElementById('flooringField');
  if (flooringField) {
    var qf = flooringField.closest('form');
    var syncFlooring = function () {
      var sv = qf.elements['contact[Service]']; var v = sv ? sv.value : '';
      flooringField.hidden = !(v === '' || /flooring/i.test(v));
    };
    qf.addEventListener('change', syncFlooring);
    syncFlooring();
  }

  /* ---------- Reveal on scroll ---------- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('.service, .offer, .ba-stage, .slide, .why__photo, .why__copy, .quote__form, .quote__copy, .sp-block, .sp-gallery figure, .sp-ba').forEach(function (el) {
      el.classList.add('reveal'); io.observe(el);
    });
  }

  /* ---------- Lead forms (Shopify contact form) ---------- */
  var modal = document.getElementById('thanks');
  if (modal) {
    modal.addEventListener('click', function (e) { if (e.target === modal || e.target.hasAttribute('data-close')) modal.hidden = true; });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') modal.hidden = true; });
    if (document.querySelector('.form-success')) { modal.hidden = false; }
  }

  function field(form, name) { return form.querySelector('[name="contact[' + name + ']"]'); }

  function validate(form) {
    var errors = [];
    form.querySelectorAll('.is-invalid').forEach(function (el) { el.classList.remove('is-invalid'); });
    function bad(el, msg) { if (el) el.classList.add('is-invalid'); errors.push(msg); }
    var name = field(form, 'name'), phone = field(form, 'phone'), zip = field(form, 'ZIP'), email = field(form, 'email');
    if (name && !name.value.trim()) bad(name, 'name');
    if (phone && phone.value.replace(/\D/g, '').length < 10) bad(phone, 'a valid phone number');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) bad(email, 'a valid email');
    if (zip && !/^\d{5}(-\d{4})?$/.test(zip.value.trim())) bad(zip, 'a valid ZIP code');
    var radios = form.querySelectorAll('input[type="radio"][name="contact[Service]"]');
    if (radios.length && !form.querySelector('input[name="contact[Service]"]:checked')) bad(radios[0].closest('.chips'), 'the service you need');
    return errors;
  }

  function utm() {
    var p = new URLSearchParams(location.search), out = [];
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'fbclid', 'gclid'].forEach(function (k) { if (p.get(k)) out.push(k + '=' + p.get(k)); });
    return out.join(' ');
  }

  document.querySelectorAll('.js-lead-form').forEach(function (form) {
    var status = form.querySelector('.form-status');
    var btn = form.querySelector('button[type="submit"]');
    var phone = field(form, 'phone');
    if (phone) phone.addEventListener('input', function (e) {
      var d = e.target.value.replace(/\D/g, '').replace(/^1/, '').slice(0, 10);
      e.target.value = d.length > 6 ? '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6)
        : d.length > 3 ? '(' + d.slice(0, 3) + ') ' + d.slice(3) : d;
    });
    var src = form.querySelector('[name="contact[Source]"]');
    if (src) src.value = (location.pathname || '/') + (utm() ? ' ' + utm() : '');
    form.addEventListener('submit', function (e) {
      status.className = 'form-status'; status.textContent = '';
      var errors = validate(form);
      if (errors.length) {
        e.preventDefault();
        status.classList.add('is-error');
        status.textContent = 'Please enter ' + errors.join(', ') + '.';
        return;
      }
      btn.disabled = true; btn.textContent = 'Sending...';
      if (window.fbq) window.fbq('track', 'Lead');
      if (window.gtag) window.gtag('event', 'generate_lead');
    });
  });
})();
/* Quote buttons on pages without a form go to the home page form */
(function () {
  if (!document.getElementById('quote')) {
    document.querySelectorAll('a[href="#quote"]').forEach(function (a) { a.setAttribute('href', '/#quote'); });
  }
})();
/* Online payment: invoice amount + optional tip, fresh cart, then checkout */
(function () {
  function money(n) { return '$' + n.toLocaleString('en-US'); }
  document.querySelectorAll('.js-pay-form').forEach(function (form) {
    var status = form.querySelector('.form-status');
    var btn = form.querySelector('button[type="submit"]');
    var amt = form.querySelector('#pay-amount');
    var tipBox = form.querySelector('.pay__tip');
    var tipCustomWrap = form.querySelector('.pay__tip-custom');
    var tipCustom = form.querySelector('#pay-tip-custom');
    var sumAmount = form.querySelector('[data-sum-amount]'), sumTip = form.querySelector('[data-sum-tip]'), sumTotal = form.querySelector('[data-sum-total]');

    function amount() { var n = parseInt(amt.value, 10); return n > 0 ? n : 0; }
    function tip() {
      if (!tipBox) return 0;
      var c = form.querySelector('input[name="tip_choice"]:checked');
      if (!c || c.value === '0') return 0;
      if (c.value === 'custom') { var t = parseInt(tipCustom.value, 10); return t > 0 ? t : 0; }
      return Math.round(amount() * parseFloat(c.value) / 100);
    }
    function update() {
      if (tipBox) {
        var c = form.querySelector('input[name="tip_choice"]:checked');
        tipCustomWrap.hidden = !(c && c.value === 'custom');
      }
      var a = amount(), t = tip();
      if (sumAmount) sumAmount.textContent = money(a);
      if (sumTip) sumTip.textContent = money(t);
      if (sumTotal) sumTotal.textContent = money(a + t);
    }
    form.addEventListener('input', update);
    form.addEventListener('change', update);
    update();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'form-status'; status.textContent = '';
      form.querySelectorAll('.is-invalid').forEach(function (el) { el.classList.remove('is-invalid'); });
      var name = form.querySelector('#pay-name'), inv = form.querySelector('#pay-invoice');
      var errs = [];
      if (!name.value.trim()) { name.classList.add('is-invalid'); errs.push('your name'); }
      if (!inv.value.trim()) { inv.classList.add('is-invalid'); errs.push('the invoice or estimate number'); }
      var n = parseInt(amt.value, 10);
      if (!n || n < 1 || String(n) !== amt.value.trim()) { amt.closest('.pay__amount').classList.add('is-invalid'); errs.push('an amount in whole dollars'); }
      var c = tipBox && form.querySelector('input[name="tip_choice"]:checked');
      if (c && c.value === 'custom' && !(parseInt(tipCustom.value, 10) > 0)) { tipCustomWrap.classList.add('is-invalid'); errs.push('a tip amount (or choose No tip)'); }
      if (errs.length) { status.classList.add('is-error'); status.textContent = 'Please enter ' + errs.join(', ') + '.'; return; }

      var props = {};
      form.querySelectorAll('[name^="properties["]').forEach(function (el) {
        if (el.value.trim()) props[el.name.slice(11, -1)] = el.value.trim();
      });
      var items = [{ id: parseInt(form.querySelector('input[name="id"]').value, 10), quantity: n, properties: props }];
      var t = tip();
      if (t > 0) items.push({ id: parseInt(tipBox.dataset.tipVariant, 10), quantity: t, properties: { 'Invoice / estimate #': props['Invoice / estimate #'] || '', 'Name': props['Name'] || '' } });

      btn.disabled = true; btn.textContent = 'Opening secure checkout...';
      var root = (window.Shopify && Shopify.routes && Shopify.routes.root) || '/';
      fetch(root + 'cart/clear.js', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
        .then(function () {
          return fetch(root + 'cart/add.js', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: items }) });
        })
        .then(function (r) { if (!r.ok) throw new Error('add'); window.location.href = root + 'checkout'; })
        .catch(function () { form.submit(); });
    });
  });
})();
/* Pay Online button: ask the amount, then go straight to Shopify checkout (no extra page) */
(function () {
  var PAY_VARIANT = 68161604518173; /* "Invoice Payment" item, $1.00 each */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href="#pay-online"], a[href="/pages/pay"]');
    if (!a) return;
    e.preventDefault();
    var raw = window.prompt('Alves Renovation — Pay Online\n\nAmount to pay in US dollars (whole dollars, e.g. 1250):');
    if (raw === null) return;
    var n = parseInt(String(raw).replace(/[^0-9.]/g, ''), 10);
    if (!n || n < 1) { window.alert('Please enter a valid amount in whole dollars.'); return; }
    var inv = window.prompt('Invoice or estimate number (optional):') || '';
    var root = (window.Shopify && Shopify.routes && Shopify.routes.root) || '/';
    var url = root + 'cart/' + PAY_VARIANT + ':' + n;
    if (inv.trim()) url += '?attributes[Invoice / estimate %23]=' + encodeURIComponent(inv.trim());
    window.location.href = url;
  });
})();
