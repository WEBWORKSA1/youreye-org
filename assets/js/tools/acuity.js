/* Visual acuity screener: tumbling E, screen calibration, per-eye result */
(function () {
  'use strict';
  var Y = window.YE, root = document.getElementById('tool');
  if (!Y || !root) return;
  var CARD_MM = 85.6;
  var LEVELS = [1.0, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.0, -0.1];
  var SNELL = [200, 125, 100, 80, 63, 50, 40, 32, 25, 20, 16];
  var METRIC = [60, 38, 30, 24, 19, 15, 12, 9.5, 7.5, 6, 4.8];
  var DIRS = ['right', 'down', 'left', 'up'], ROT = { right: 0, down: 90, left: 180, up: 270 };
  var ARW = { up: '↑', down: '↓', left: '←', right: '→' };
  var pxmm = Y.pxPerMm(), calibrated = !!pxmm, dist = Y.store.get('acuity_dist', 1.5), res = {}, eye = 'right';

  function calib() {
    var w = pxmm ? Math.round(pxmm * CARD_MM) : 320;
    root.innerHTML = '<p class="t-step">Step 1 of 3 · Calibrate your screen</p><h2 class="h3">Match the box to a bank card</h2>' +
      '<p>Hold any standard bank, credit or ID card flat against the screen. Move the slider until the box is exactly as wide as the card. This lets us draw letters at their true size.</p>' +
      '<div class="stage"><div id="cardBox" style="width:' + w + 'px;max-width:100%;aspect-ratio:85.6/53.98;border-radius:12px;background:linear-gradient(135deg,#0E8F8A,#0B1F33)"></div></div>' +
      '<label for="cardRange">Box width</label><input type="range" id="cardRange" min="150" max="700" value="' + w + '">' +
      '<div class="btn-row mt1"><button class="btn btn-amber" id="calOk" type="button">The box matches my card</button><button class="btn btn-ghost" id="calSkip" type="button">I don\'t have a card</button></div>';
    var box = Y.$('#cardBox'), r = Y.$('#cardRange');
    r.addEventListener('input', function () { box.style.width = r.value + 'px'; });
    Y.$('#calOk').onclick = function () { pxmm = r.value / CARD_MM; calibrated = true; Y.store.set('pxmm', pxmm); setup(); };
    Y.$('#calSkip').onclick = function () { pxmm = 96 / 25.4; calibrated = false; setup(); };
  }

  function setup() {
    root.innerHTML = '<p class="t-step">Step 2 of 3 · Distance</p><h2 class="h3">How far from the screen will you be?</h2>' +
      (calibrated ? '' : '<p class="note">Without calibration, letter sizes are estimates for a typical screen, so results are less accurate.</p>') +
      '<p>Measure from your eyes to the screen. Farther is more accurate. At 2 or 3 metres, ask someone to press the arrow you call out, or use a wireless keyboard.</p>' +
      '<div class="opts" id="dists">' + [1, 1.5, 2, 3].map(function (d) {
        return '<label><input type="radio" name="dist" value="' + d + '"' + (d == dist ? ' checked' : '') + '><span>' + d + ' m (' + Math.round(d * 3.281) + ' ft)</span></label>';
      }).join('') + '</div>' +
      '<p class="mt1">Wear your distance glasses or contacts if you have them. Use good room light and full screen brightness.</p>' +
      '<button class="btn btn-amber" id="go" type="button">Start with the right eye</button>';
    Y.$('#go').onclick = function () {
      var c = Y.$('#dists input:checked'); dist = c ? +c.value : 1.5; Y.store.set('acuity_dist', dist);
      eye = 'right'; res = {}; run();
    };
  }

  function sizePx(L) { return dist * 1000 * Math.tan(5 / 60 * Math.PI / 180) * Math.pow(10, L) * pxmm; }

  function run() {
    var maxPx = Math.min(root.clientWidth - 80, 360), dpr = window.devicePixelRatio || 1;
    var start = 0;
    while (start < LEVELS.length - 1 && sizePx(LEVELS[start]) > maxPx) start++;
    var li = start, ok = 0, bad = 0, passed = null, cur;
    var other = eye === 'right' ? 'left' : 'right';
    root.innerHTML = '<p class="t-step">Step 3 of 3 · ' + (eye === 'right' ? 'Right eye' : 'Left eye') + '</p><h2 class="h3">Cover your ' + other + ' eye</h2>' +
      '<p>Which way do the arms of the E point? Use the buttons or your arrow keys. Guess if you are not sure.</p>' +
      '<div class="stage dark" id="st" style="min-height:' + Math.round(Math.min(maxPx + 40, 400)) + 'px"></div>' +
      '<div class="arrows">' + [['u', 'up'], ['l', 'left'], ['r', 'right'], ['d', 'down']].map(function (k) {
        return '<button type="button" class="' + k[0] + '" data-d="' + k[1] + '" aria-label="' + k[1] + '">' + ARW[k[1]] + '</button>';
      }).join('') + '<button type="button" class="x" data-d="none">Can\'t tell</button></div><p class="meta center mt1" id="lvl"></p>';
    var st = Y.$('#st'), lvl = Y.$('#lvl');
    function show() {
      var px = sizePx(LEVELS[li]);
      cur = DIRS[Math.floor(Math.random() * 4)];
      st.innerHTML = '<svg width="' + px.toFixed(2) + '" height="' + px.toFixed(2) + '" viewBox="0 0 5 5" role="img" aria-label="Letter E" style="transform:rotate(' + ROT[cur] + 'deg)"><path d="M0 0h5v1H1v1h4v1H1v1h4v1H0z" fill="#000"/></svg>';
      lvl.textContent = 'Line ' + (li - start + 1) + ' · about 20/' + SNELL[li];
    }
    function finish(limit) {
      document.removeEventListener('keydown', key);
      res[eye] = { i: passed, limit: limit };
      if (eye === 'right') { eye = 'left'; between(); } else results();
    }
    function answer(d) {
      if (d === cur) ok++; else bad++;
      if (ok >= 2) {
        passed = li; ok = 0; bad = 0; li++;
        if (li >= LEVELS.length) return finish(false);
        if (sizePx(LEVELS[li]) * dpr < 5) return finish(true);
      } else if (bad >= 2) return finish(false);
      show();
    }
    function key(e) {
      var m = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' }[e.key];
      if (m) { e.preventDefault(); answer(m); }
    }
    document.addEventListener('keydown', key);
    root.querySelector('.arrows').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (b) answer(b.getAttribute('data-d'));
    });
    show();
  }

  function between() {
    root.innerHTML = '<div class="result"><h3>Right eye done</h3><p>Now uncover your left eye and cover your right eye. Stay at the same distance.</p></div><button class="btn btn-amber" id="go2" type="button">Start the left eye</button>';
    Y.$('#go2').onclick = run;
  }

  function txt(r) {
    if (!r || r.i === null) return { s: 'Worse than 20/200', m: 'worse than 6/60', c: 'bad', L: 1.1 };
    var L = LEVELS[r.i];
    return { s: '20/' + SNELL[r.i], m: '6/' + METRIC[r.i], c: L <= 0 ? 'good' : (L <= 0.2 ? 'warn' : 'bad'), L: L };
  }

  function results() {
    var R = txt(res.right), Lf = txt(res.left);
    var worst = (R.c === 'bad' || Lf.c === 'bad') ? 'bad' : ((R.c === 'warn' || Lf.c === 'warn') ? 'warn' : 'good');
    var diff = Math.abs(R.L - Lf.L);
    var msg = {
      good: 'Both eyes read the 20/20 line or better on this screening. That is typical healthy distance vision. A screening cannot check eye health, so keep up regular eye exams.',
      warn: 'At least one eye read slightly below the 20/20 line. That is common and may mean a small prescription change. Consider an eye exam, especially if you drive at night or find yourself squinting.',
      bad: 'At least one eye read 20/40 or worse on this screening. 20/40 is the minimum for an unrestricted driving licence in many places. Book an eye exam soon.'
    }[worst];
    var limit = (res.right && res.right.limit) || (res.left && res.left.limit);
    root.innerHTML = '<div class="result ' + worst + '"><h3>Your screening result</h3><dl class="kv"><dt>Right eye</dt><dd><strong>' + R.s + '</strong> (' + R.m + ')</dd><dt>Left eye</dt><dd><strong>' + Lf.s + '</strong> (' + Lf.m + ')</dd><dt>Setup</dt><dd>' + dist + ' m, ' + (calibrated ? 'calibrated screen' : 'estimated screen size') + '</dd></dl><p>' + msg + '</p>' +
      (diff >= 0.2 ? '<p><strong>Your eyes differed by two or more lines.</strong> A difference between the eyes is worth having checked.</p>' : '') +
      (limit ? '<p class="fine">The smallest letters reached your screen\'s resolution limit. Repeat from farther away for a finer result.</p>' : '') +
      '</div><div class="btn-row"><button class="btn btn-ghost" id="again" type="button">Test again</button><a class="btn btn-ghost" href="tools/contrast.html">Next: contrast check</a></div>' +
      Y.cta('exam', 'Book a full eye exam near you', 'An optometrist can measure your exact prescription and check the health of your eyes. We match you with local practices for free.');
    Y.$('#again').onclick = calib;
    Y.store.set('acuity_last', { r: R.s, l: Lf.s, t: Date.now() });
  }

  calib();
})();
