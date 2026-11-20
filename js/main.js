/* Alves Renovation — site interactions & lead capture */
(function () {
  'use strict';

  /* ==========================================================
     CONFIG — lead destination
     Leads are POSTed to your Google Apps Script web app, which
     appends them to a Google Sheet (same URL used by your
     previous form). See README for the Apps Script code.
     ========================================================== */
  var LEAD_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzz7dKqVolkLgmv5ea4tjSviIpFymTnECYXR3lXPasLw4Bojdopa4eu1qcdbIFxvi9BPg/exec';
  var BUSINESS_PHONE = '+12675180751';

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('nav');
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', false); }
  });

  /* ---------- Before / After slider ---------- */
  var projects = [
    { key: 'bedroom', title: 'Bedroom — LVP Installation', text: 'Old flooring removed, subfloor prepped and leveled, then new luxury vinyl plank installed with clean transitions and baseboards.' },
    { key: 'bathroom', title: 'Bathroom — Full Floor Remodel', text: 'Demolition down to the subfloor, then large-format marble-look porcelain tile, toilet reset and new trim.' },
    { key: 'living', title: 'Living Area — Wood-Look Vinyl', text: 'Underlayment and protection laid out, then a warm wood-look vinyl plank floor installed wall to wall.' },
    { key: 'stairs', title: 'Staircase — New Treads & Risers', text: 'Old stairs stripped and rebuilt with wood-look treads and crisp white risers to match the new floors.' },
    { key: 'hall', title: 'Hallway & Closet — Vinyl Plank', text: 'Bare subfloor turned into a finished space with durable, waterproof vinyl plank. Small spaces qualify for our $250 flat rate.' }
  ];
  var ba = document.getElementById('ba');
  var range = ba.querySelector('.ba__range');
  var imgBefore = ba.querySelector('.ba__before');
  var imgAfter = ba.querySelector('.ba__after');
  var baTitle = document.getElementById('baTitle');
  var baText = document.getElementById('baText');

  function setPos(v) { ba.style.setProperty('--pos', v + '%'); }
  range.addEventListener('input', function () { setPos(range.value); });
  setPos(range.value);

  document.querySelectorAll('.ba-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.ba-tab').forEach(function (t) { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('is-active'); tab.setAttribute('aria-selected', 'true');
      var p = projects[+tab.dataset.ba];
      ba.classList.add('is-fading');
      setTimeout(function () {
        imgBefore.src = 'assets/img/' + p.key + '-before.jpg';
        imgAfter.src = 'assets/img/' + p.key + '-after.jpg';
        imgBefore.alt = 'Before: ' + p.title;
        imgAfter.alt = 'After: ' + p.title;
        baTitle.textContent = p.title;
        baText.textContent = p.text;
        range.value = 50; setPos(50);
        ba.classList.remove('is-fading');
      }, 220);
    });
  });
  // Preload before/after images
  projects.forEach(function (p) { ['before', 'after'].forEach(function (s) { new Image().src = 'assets/img/' + p.key + '-' + s + '.jpg'; }); });

  /* ---------- Gallery carousel ---------- */
  var carousel = document.getElementById('carousel');
  var track = carousel.querySelector('.carousel__track');
  var slides = Array.prototype.slice.call(track.children);
  var dotsWrap = carousel.querySelector('.carousel__dots');
  slides.forEach(function (_, i) {
    var d = document.createElement('button');
    d.addEventListener('click', function () { goTo(i); });
    dotsWrap.appendChild(d);
  });
  var dots = dotsWrap.children;
  function stepWidth() { return slides[1].offsetLeft - slides[0].offsetLeft; }
  function current() { return Math.round(track.scrollLeft / stepWidth()); }
  function goTo(i) {
    var max = track.scrollWidth - track.clientWidth;
    track.scrollTo({ left: Math.min(i * stepWidth(), max) });
  }
  function updateDots() {
    var c = current();
    var atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
    for (var i = 0; i < dots.length; i++) dots[i].classList.toggle('is-active', atEnd ? i === dots.length - 1 : i === c);
  }
  track.addEventListener('scroll', function () { window.requestAnimationFrame(updateDots); });
  carousel.querySelector('.carousel__btn--prev').addEventListener('click', function () { goTo(Math.max(0, current() - 1)); });
  carousel.querySelector('.carousel__btn--next').addEventListener('click', function () {
    var atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
    goTo(atEnd ? 0 : current() + 1);
  });
  updateDots();
  // Autoplay (pauses on hover/touch)
  var autoplay = setInterval(function () { carousel.querySelector('.carousel__btn--next').click(); }, 4500);
  ['mouseenter', 'touchstart', 'focusin'].forEach(function (ev) {
    carousel.addEventListener(ev, function () { clearInterval(autoplay); }, { passive: true, once: true });
  });

  /* ---------- Reveal on scroll ---------- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('.service, .offer, .ba-stage, .slide, .why__photo, .why__copy, .quote__form, .quote__copy').forEach(function (el) {
      el.classList.add('reveal'); io.observe(el);
    });
  }

  /* ---------- Lead forms ---------- */
  var modal = document.getElementById('thanks');
  modal.addEventListener('click', function (e) { if (e.target === modal || e.target.hasAttribute('data-close')) modal.hidden = true; });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') modal.hidden = true; });

  function utm() {
    var p = new URLSearchParams(location.search), out = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'fbclid', 'gclid'].forEach(function (k) { if (p.get(k)) out[k] = p.get(k); });
    return out;
  }

  function validate(form) {
    var errors = [];
    form.querySelectorAll('.is-invalid').forEach(function (el) { el.classList.remove('is-invalid'); });
    function bad(el, msg) { el.classList.add('is-invalid'); errors.push(msg); }

    var name = form.elements.name, phone = form.elements.phone, zip = form.elements.zip, email = form.elements.email;
    if (!name.value.trim()) bad(name, 'name');
    if (phone.value.replace(/\D/g, '').length < 10) bad(phone, 'a valid phone number');
    if (!/^\d{5}(-\d{4})?$/.test(zip.value.trim())) bad(zip, 'a valid ZIP code');
    if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) bad(email, 'a valid email');

    var flooring = form.elements.flooring;
    if (flooring) {
      var val = flooring.value; // works for <select> and RadioNodeList
      if (!val) {
        var target = flooring.tagName === 'SELECT' ? flooring : form.querySelector('input[name="flooring"]').closest('.chips');
        bad(target, 'project type');
      }
    }
    return errors;
  }

  document.querySelectorAll('.js-lead-form').forEach(function (form) {
    var status = form.querySelector('.form-status');
    var btn = form.querySelector('button[type="submit"]');
    var btnText = btn.textContent;

    // Format US phone as user types
    form.elements.phone.addEventListener('input', function (e) {
      var d = e.target.value.replace(/\D/g, '').replace(/^1/, '').slice(0, 10);
      e.target.value = d.length > 6 ? '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6)
        : d.length > 3 ? '(' + d.slice(0, 3) + ') ' + d.slice(3) : d;
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'form-status'; status.textContent = '';
      if (form.elements.website.value) return; // honeypot (bots)

      var errors = validate(form);
      if (errors.length) {
        status.classList.add('is-error');
        status.textContent = 'Please enter ' + errors.join(', ') + '.';
        return;
      }

      var data = new FormData(form);
      data.delete('website');
      data.append('source', form.dataset.source);
      data.append('page', location.href.split('?')[0]);
      data.append('submitted_at', new Date().toISOString());
      var u = utm(); Object.keys(u).forEach(function (k) { data.append(k, u[k]); });

      btn.disabled = true; btn.textContent = 'Sending...';

      fetch(LEAD_ENDPOINT, { method: 'POST', body: data, mode: 'no-cors' })
        .then(function () {
          form.reset();
          modal.hidden = false;
          modal.querySelector('[data-close]').focus();
          if (window.fbq) window.fbq('track', 'Lead');
          if (window.gtag) window.gtag('event', 'generate_lead', { form: form.dataset.source });
        })
        .catch(function () {
          status.classList.add('is-error');
          var sms = 'sms:' + BUSINESS_PHONE + '?&body=' + encodeURIComponent('Hi Alves Renovation, I would like a quote. Name: ' + data.get('name') + ', ZIP: ' + data.get('zip') + ', Project: ' + (data.get('flooring') || ''));
          status.innerHTML = 'Something went wrong. Please <a href="' + sms + '">text us</a> or call (267) 518-0751.';
        })
        .finally(function () { btn.disabled = false; btn.textContent = btnText; });
    });
  });
})();
