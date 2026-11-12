/* YourEye.org core script */
(function () {
  'use strict';
  var C = window.YE_CONFIG || {};
  var doc = document, html = doc.documentElement;
  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('ye_' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('ye_' + k, JSON.stringify(v)); } catch (e) { } }
  };
  var sess = {
    get: function (k) { try { return JSON.parse(sessionStorage.getItem('ye_' + k)); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem('ye_' + k, JSON.stringify(v)); } catch (e) { } }
  };
  var params = new URLSearchParams(location.search);
  function abs(rel) { return new URL(rel, doc.baseURI).href; }

  /* Shared helpers for tool scripts */
  window.YE = {
    $: $, $$: $$, esc: esc, store: store, params: params, abs: abs,
    cta: function (need, title, text) {
      return '<div class="lead-cta lead-inline"><div><p class="eyebrow">Free matching service</p><h3>' + esc(title) + '</h3><p>' + esc(text || 'Tell us what you need and we connect you with up to three local providers. Free, no obligation.') + '</p></div><a class="btn btn-amber" href="find-care.html?need=' + encodeURIComponent(need || 'exam') + '">Get matched free</a></div>';
    },
    pxPerMm: function () { return store.get('pxmm', null); },
    shuffle: function (a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  };

  /* In-page anchors (the page uses <base href>, so plain #links would jump to the home page) */
  doc.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (a) {
      var id = a.getAttribute('href').slice(1);
      e.preventDefault();
      if (!id) return;
      var t = doc.getElementById(id);
      if (t) {
        t.scrollIntoView({ behavior: html.classList.contains('rm') ? 'auto' : 'smooth', block: 'start' });
        if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1');
        t.focus({ preventScroll: true });
        try { history.replaceState(null, '', location.pathname + location.search + '#' + id); } catch (er) { }
      }
      return;
    }
    var y = e.target.closest && e.target.closest('.yt');
    if (y) {
      var f = doc.createElement('iframe');
      var list = y.getAttribute('data-list');
      f.src = 'https://www.youtube-nocookie.com/embed/' + (list ? 'videoseries?list=' + list + '&' : y.getAttribute('data-id') + '?') + 'autoplay=1&rel=0';
      f.title = y.getAttribute('aria-label') || 'Video';
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      f.allowFullscreen = true;
      y.parentNode.replaceChild(f, y);
    }
  });

  /* Navigation */
  var burger = $('#burger');
  if (burger) burger.addEventListener('click', function () {
    var open = doc.body.classList.toggle('nav-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  var here = location.pathname.replace(/index\.html$/, '');
  $$('#nav a').forEach(function (a) {
    var p = new URL(a.getAttribute('href'), doc.baseURI).pathname.replace(/index\.html$/, '');
    if (p.length > 1 && here.indexOf(p) === 0 && !/find-care/.test(p)) a.setAttribute('aria-current', 'page');
  });

  /* Display options */
  var prefs = store.get('a11y', { size: 0, contrast: false, motion: false });
  function applyPrefs() {
    html.style.fontSize = prefs.size ? (100 + prefs.size * 10) + '%' : '';
    html.classList.toggle('hc', !!prefs.contrast);
    html.classList.toggle('rm', !!prefs.motion);
    store.set('a11y', prefs);
  }
  var a11yBtn = $('#a11yBtn'), a11yPanel = $('#a11yPanel');
  if (a11yBtn && a11yPanel) a11yBtn.addEventListener('click', function () {
    a11yPanel.hidden = !a11yPanel.hidden;
    a11yBtn.setAttribute('aria-expanded', a11yPanel.hidden ? 'false' : 'true');
  });
  $$('[data-a11y]').forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.getAttribute('data-a11y');
      if (k === 'up') prefs.size = Math.min((prefs.size || 0) + 1, 4);
      if (k === 'down') prefs.size = Math.max((prefs.size || 0) - 1, -1);
      if (k === 'reset') prefs = { size: 0, contrast: false, motion: false };
      if (k === 'contrast') prefs.contrast = !prefs.contrast;
      if (k === 'motion') prefs.motion = !prefs.motion;
      applyPrefs();
    });
  });

  /* Self-updating content: awareness month, daily tip, dates */
  var AW = [
    ['January is Glaucoma Awareness Month', 'conditions/glaucoma.html', 'Glaucoma has no early symptoms. A dilated eye exam is the only way to catch it.'],
    ['February is AMD and Low Vision Awareness Month', 'tools/amsler.html', 'Check your central vision with the Amsler grid in two minutes.'],
    ['March is Workplace Eye Wellness Month', 'tools/screen-strain.html', 'Score your screen setup and fix the three biggest strain triggers.'],
    ['April is Sports Eye Safety Month', 'guides/eye-emergencies.html', 'Most sports eye injuries are preventable with proper protective eyewear.'],
    ['May is Healthy Vision Month', 'tools/', 'Run a free check and book the exam you have been putting off.'],
    ['June is Cataract Awareness Month', 'conditions/cataract.html', 'Cloudy or dim vision and glare at night are common early signs.'],
    ['July is UV Safety Month', 'guides/sunglasses-and-uv.html', 'Pick sunglasses that block 100% of UVA and UVB, for kids too.'],
    ["August is Children's Eye Health and Safety Month", 'guides/kids-vision-and-myopia.html', 'Two hours outdoors a day is linked to less nearsightedness in children.'],
    ['Back to school: time for eye checks', 'tools/exam-schedule.html', 'Children should have an eye exam before first grade and regularly after.'],
    ['October is Eye Injury Prevention Month', 'guides/eye-emergencies.html', 'World Sight Day falls on the second Thursday of October.'],
    ['November is Diabetic Eye Disease Month', 'conditions/diabetic-retinopathy.html', 'People with diabetes need a dilated eye exam at least once a year.'],
    ['December is Safe Toys and Gifts Month', 'guides/eye-emergencies.html', 'Skip projectile toys and laser pointers for young children.']
  ];
  var now = new Date();
  var aw = $('#aware');
  if (aw) {
    var m = AW[now.getMonth()];
    aw.innerHTML = '<div class="wrap"><strong>' + esc(m[0]) + '.</strong> ' + esc(m[2]) + ' <a href="' + m[1] + '">Learn more</a></div>';
    aw.hidden = false;
  }
  var TIPS = [
    'Every 20 minutes of screen time, look about 20 feet (6 m) away for 20 seconds.',
    'Wear sunglasses that block 100% of UVA and UVB rays, even on cloudy days.',
    'Never sleep in contact lenses unless your eye doctor prescribed lenses for it.',
    'Keep screens about an arm\'s length away and slightly below eye level.',
    'Glaucoma usually has no early symptoms. Regular dilated exams are how it is caught.',
    'Children who spend about two hours a day outdoors are less likely to become nearsighted.',
    'Sudden flashes, a shower of floaters or a curtain over your vision is an emergency.',
    'Do not rub your eyes. It can worsen allergies and is linked to keratoconus.',
    'Leafy greens, fish and colorful fruit support a diet linked to healthy eyes.',
    'Smoking raises your risk of cataract and macular degeneration.',
    'If you have diabetes, get a dilated eye exam at least once a year.',
    'Replace eye makeup every three months and never share it.',
    'Wear safety glasses for yard work, DIY projects and racquet sports.',
    'Blink fully. Screen users blink less, which dries the eyes.',
    'Wash your hands before touching your eyes or handling contact lenses.',
    'Never use tap water or saliva on contact lenses.',
    'Reading glasses from a store are fine for many people, but they do not replace an eye exam.',
    'A child who squints, sits close to the TV or covers one eye may need an eye exam.',
    'Turn down screen brightness to match the room, and reduce glare from windows.',
    'Use a humidifier in dry rooms if your eyes feel gritty in winter.',
    'Fireworks cause thousands of eye injuries each year. Leave them to professionals.',
    'Never look directly at the sun, including during an eclipse, without certified eclipse glasses.',
    'Red, painful eyes with light sensitivity need same-day care.',
    'Keep a copy of your glasses prescription and your pupillary distance (PD).',
    'Check your near vision in good light. Dim light makes small print harder for everyone.',
    'Store lens cases upside down to air-dry and replace them every three months.',
    'High blood pressure can damage the retina. Keep it controlled.',
    'Know your family history. Glaucoma and macular degeneration run in families.',
    'Swim goggles protect your eyes from chlorine and germs. Do not swim in contact lenses.',
    'Give your eyes a break on long drives: stop every two hours.'
  ];
  var day = Math.floor((now.getTime() - now.getTimezoneOffset() * 6e4) / 864e5);
  $$('[data-daily-tip]').forEach(function (el) { el.textContent = TIPS[day % TIPS.length]; });
  $$('[data-year]').forEach(function (el) { el.textContent = now.getFullYear(); });
  $$('[data-month]').forEach(function (el) { el.textContent = now.toLocaleString('en-US', { month: 'long', year: 'numeric' }); });
  $$('[data-config]').forEach(function (el) {
    var v = el.getAttribute('data-config').split('.').reduce(function (o, k) { return o && o[k]; }, C);
    if (v) el.textContent = v;
  });
  $$('[data-countdown]').forEach(function (el) {
    function tick() {
      var n = new Date(), end = new Date(n.getFullYear(), n.getMonth() + 1, 1), ms = end - n;
      el.textContent = Math.floor(ms / 864e5) + 'd ' + (Math.floor(ms / 36e5) % 24) + 'h ' + (Math.floor(ms / 6e4) % 60) + 'm';
    }
    tick(); setInterval(tick, 30000);
  });

  /* Ad slots: filled only when slot IDs are set in config.js and the AdSense script is on the page */
  var slots = C.adSlots || {};
  if (doc.querySelector('script[src*="adsbygoogle"]')) {
    $$('.ad-slot').forEach(function (s) {
      var id = slots[s.getAttribute('data-slot')];
      if (!id) return;
      s.innerHTML = '<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-6620975821265271" data-ad-slot="' + esc(id) + '" data-ad-format="auto" data-full-width-responsive="true"></ins>';
      s.classList.add('on');
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) { }
    });
  }

  /* First-touch attribution for leads */
  if (!sess.get('src')) {
    var utm = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'].forEach(function (k) { if (params.get(k)) utm[k] = params.get(k); });
    sess.set('src', { landing: location.pathname + location.search, ref: doc.referrer || '', utm: utm });
  }

  /* Forms: FormSubmit with an encoded inbox */
  function inbox() {
    return String.fromCharCode.apply(null, (C.inbox || []).slice().reverse().map(function (c) { return c ^ 23; }));
  }
  function collect(form) {
    var o = {};
    new FormData(form).forEach(function (v, k) {
      if (k === '_honey' || v === '') return;
      o[k] = o[k] ? o[k] + ', ' + v : v;
    });
    return o;
  }
  function scoreLead(form) {
    var s = 0;
    $$('input[data-score]:checked, option[data-score]:checked', form).forEach(function (el) { s += parseInt(el.getAttribute('data-score'), 10) || 0; });
    var ph = form.querySelector('[name=phone]');
    if (ph && ph.value.replace(/\D/g, '').length >= 7) s += 10;
    return Math.max(0, Math.min(100, s));
  }
  function send(form) {
    var type = form.getAttribute('data-form') || 'form';
    var data = collect(form), src = sess.get('src') || {};
    if (form.hasAttribute('data-score')) data.lead_score = scoreLead(form);
    data._subject = 'YourEye.org: ' + (form.getAttribute('data-subject') || type) + (data.need ? ' (' + data.need + ')' : '') + (data.lead_score != null ? ' score ' + data.lead_score : '');
    data._template = 'table';
    data.form_type = type;
    data.page = location.href;
    data.landing_page = src.landing || '';
    data.referrer = src.ref || '';
    data.campaign = JSON.stringify(src.utm || {});
    data.submitted_at = new Date().toString();
    var btn = form.querySelector('[type=submit]');
    if (btn) { btn.disabled = true; btn.setAttribute('data-label', btn.textContent); btn.textContent = 'Sending…'; }
    function done() {
      sess.set('last_form', type);
      var msg = form.getAttribute('data-inline');
      if (msg) {
        form.innerHTML = '<div class="success" role="status"><h3>Thank you!</h3><p>' + esc(msg) + '</p></div>';
      } else {
        location.href = abs('thank-you.html?f=' + encodeURIComponent(type));
      }
    }
    function fallback() {
      var f = doc.createElement('form');
      f.method = 'POST';
      f.action = 'https://formsubmit.co/' + inbox();
      f.style.display = 'none';
      data._next = abs('thank-you.html?f=' + encodeURIComponent(type));
      data._captcha = 'false';
      Object.keys(data).forEach(function (k) {
        var i = doc.createElement('input'); i.type = 'hidden'; i.name = k; i.value = data[k]; f.appendChild(i);
      });
      doc.body.appendChild(f);
      f.submit();
    }
    fetch((C.formEndpoint || 'https://formsubmit.co/ajax/') + inbox(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (r.ok && String(j.success) !== 'false') done(); else fallback();
      });
    }).catch(fallback);
  }

  /* Pre-fill from the URL, e.g. find-care.html?need=lasik */
  params.forEach(function (v, k) {
    if (!/^[a-z_]{2,20}$/.test(k)) return;
    $$('form [name="' + k + '"]').forEach(function (el) {
      if (el.type === 'radio' || el.type === 'checkbox') { if (el.value === v) el.checked = true; }
      else if (el.type !== 'hidden' || !el.value) { if (!el.value) el.value = v; }
    });
  });

  /* Multi-step forms */
  $$('form[data-steps]').forEach(function (form) {
    var steps = $$('.step', form), i = 0;
    var bar = $('.progress span', form), lab = $('.progress-label', form);
    function show(n) {
      steps.forEach(function (s, k) { s.hidden = k !== n; });
      i = n;
      if (bar) bar.style.width = Math.round((n + 1) / steps.length * 100) + '%';
      if (lab) lab.textContent = 'Step ' + (n + 1) + ' of ' + steps.length;
    }
    function valid(s) {
      var els = $$('input,select,textarea', s);
      for (var k = 0; k < els.length; k++) { if (!els[k].checkValidity()) { els[k].reportValidity(); return false; } }
      return true;
    }
    form._stepper = {
      last: function () { return i === steps.length - 1; },
      next: function () { if (valid(steps[i])) { show(Math.min(i + 1, steps.length - 1)); form.scrollIntoView({ block: 'start', behavior: 'smooth' }); } }
    };
    form.addEventListener('click', function (e) {
      var b = e.target.closest('[data-next],[data-prev]');
      if (!b) return;
      e.preventDefault();
      if (b.hasAttribute('data-next')) form._stepper.next();
      else { show(Math.max(i - 1, 0)); form.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
    });
    form.addEventListener('change', function (e) {
      var st = steps[i];
      if (st && st.hasAttribute('data-auto') && e.target.type === 'radio') setTimeout(function () { form._stepper.next(); }, 180);
    });
    show(0);
  });

  $$('form[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form._stepper && !form._stepper.last()) { form._stepper.next(); return; }
      var hp = form.querySelector('[name=_honey]');
      if (hp && hp.value) { form.innerHTML = '<div class="success"><h3>Thank you!</h3></div>'; return; }
      if (!form.reportValidity()) return;
      send(form);
    });
  });

  /* Support page: amount picker */
  var dz = $('#donate');
  if (dz) {
    var amt = 15, freq = 'one-time';
    var D = C.donate || {};
    function sync() {
      $$('[data-amt]', dz).forEach(function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-amt') === amt)); });
      $$('[data-freq]', dz).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-freq') === freq)); });
      var out = $('#donateSummary'); if (out) out.textContent = '$' + amt + (freq === 'monthly' ? ' a month' : ' one time');
      var pa = $('#pledgeAmount'); if (pa) pa.value = amt + ' ' + freq;
      var link = freq === 'monthly' ? (D.stripeMonthly || D.paypal || D.bmc) : (D.stripe || D.paypal || D.bmc);
      var go = $('#donateGo');
      if (go) { if (link) { go.href = link; go.target = '_blank'; go.rel = 'noopener'; go.textContent = 'Continue to secure payment'; } else { go.href = '#pledge'; go.removeAttribute('target'); go.textContent = 'Pledge this amount'; } }
    }
    dz.addEventListener('click', function (e) {
      var b = e.target.closest('[data-amt],[data-freq]');
      if (!b) return;
      if (b.hasAttribute('data-amt')) amt = +b.getAttribute('data-amt');
      if (b.hasAttribute('data-freq')) freq = b.getAttribute('data-freq');
      sync();
    });
    var custom = $('#customAmt', dz);
    if (custom) custom.addEventListener('input', function () { var v = Math.round(+custom.value); if (v > 0) { amt = v; sync(); } });
    sync();
  }

  /* Affiliate links from config */
  $$('[data-aff]').forEach(function (a) {
    var u = (C.affiliates || {})[a.getAttribute('data-aff')];
    if (u) { a.href = u; a.target = '_blank'; a.rel = 'sponsored noopener'; }
  });

  /* Thank-you page message */
  var ty = $('#tyMsg');
  if (ty) {
    var f = params.get('f') || '';
    var MSG = {
      lead: 'Your request is in. A member of our team or a matched provider will contact you within one to two business days. Check your email, including spam.',
      provider: 'Thanks for applying. We will email you about lead pricing and coverage in your area within two business days.',
      pledge: 'Thank you for supporting YourEye.org. We will email you a secure payment link within one business day.',
      contest: 'You are entered. Winners are drawn after the month closes and contacted by email.',
      careers: 'Application received. If there is a fit, we will reply within a week.',
      advertise: 'Thanks. We will send our media kit and availability within two business days.'
    };
    if (MSG[f]) ty.textContent = MSG[f];
  }

  /* Site search */
  var sBox = $('#searchInput');
  if (sBox) {
    fetch(abs('search.json')).then(function (r) { return r.json(); }).then(function (idx) {
      var out = $('#searchResults');
      function run() {
        var q = sBox.value.trim().toLowerCase();
        if (!q) { out.innerHTML = ''; return; }
        var terms = q.split(/\s+/);
        var res = idx.filter(function (p) {
          var h = (p.t + ' ' + p.d + ' ' + p.k).toLowerCase();
          return terms.every(function (t) { return h.indexOf(t) > -1; });
        }).slice(0, 40);
        out.innerHTML = res.length ? res.map(function (r) { return '<li><a href="' + esc(r.u) + '">' + esc(r.t) + '</a><p>' + esc(r.d) + '</p></li>'; }).join('') : '<li>No matches. Try "dry eye", "LASIK" or "glaucoma".</li>';
      }
      sBox.addEventListener('input', run);
      if (params.get('q')) { sBox.value = params.get('q'); run(); }
    }).catch(function () { });
  }

  /* Cookie notice */
  if (C.cookieNotice !== false && !store.get('cookie_ok', false)) {
    var cb = doc.createElement('div');
    cb.className = 'cookie';
    cb.setAttribute('role', 'region');
    cb.setAttribute('aria-label', 'Cookie notice');
    cb.innerHTML = '<p>We use cookies for ads (Google AdSense), embedded videos and your display settings. <a href="privacy.html">Privacy policy</a></p><button class="btn btn-amber btn-sm" type="button">OK</button>';
    doc.body.appendChild(cb);
    cb.querySelector('button').addEventListener('click', function () { store.set('cookie_ok', true); cb.parentNode.removeChild(cb); });
  }
})();
