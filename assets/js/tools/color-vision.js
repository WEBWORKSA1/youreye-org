/* Color vision screener: original dot plates generated in the browser (not Ishihara images) */
(function () {
  'use strict';
  var Y = window.YE, root = document.getElementById('tool');
  if (!Y || !root) return;
  var PAL = {
    demo: [['#4a4a4a', '#5b5b5b', '#3c3c3c'], ['#c9c9c9', '#d8d8d8', '#bcbcbc']],
    rg1: [['#e08a3c', '#d97a36', '#e8a04f'], ['#9aae5b', '#8ea353', '#a8ba66']],
    rg2: [['#cc6e6e', '#d67a78', '#c26464'], ['#8f9a76', '#99a480', '#86916d']],
    rg3: [['#7fae5a', '#8ab865', '#74a451'], ['#c98a5e', '#d39669', '#bf8156']],
    by1: [['#6f86d6', '#7b91de', '#657ccc'], ['#73ad8c', '#7db795', '#69a383']],
    by2: [['#c7a640', '#d1b04c', '#bd9c38'], ['#9a8fc4', '#a499cd', '#9085ba']]
  };
  var PLAN = ['demo', 'rg1', 'rg2', 'rg3', 'rg1', 'rg2', 'rg3', 'by1', 'by2'];
  var plates = [], idx = 0, answers = [];

  function num() { var n; do { n = 2 + Math.floor(Math.random() * 97); } while (n === 11 || n % 10 === 0 && n < 20); return n; }

  function drawPlate(canvas, n, pal) {
    var S = 360, x = canvas.getContext('2d');
    var m = document.createElement('canvas'); m.width = m.height = S;
    var mx = m.getContext('2d');
    mx.fillStyle = '#000'; mx.fillRect(0, 0, S, S);
    mx.fillStyle = '#fff'; mx.textAlign = 'center'; mx.textBaseline = 'middle';
    mx.font = 'bold ' + (String(n).length > 1 ? 170 : 210) + 'px Arial, Helvetica, sans-serif';
    mx.fillText(String(n), S / 2, S / 2 + 8);
    var mask = mx.getImageData(0, 0, S, S).data;
    x.clearRect(0, 0, S, S);
    x.fillStyle = '#fff'; x.fillRect(0, 0, S, S);
    var cell = 10, gw = Math.ceil(S / cell), grid = {}, placed = 0, tries = 0;
    function near(px, py, r) {
      var gx = Math.floor(px / cell), gy = Math.floor(py / cell);
      for (var i = gx - 2; i <= gx + 2; i++) for (var j = gy - 2; j <= gy + 2; j++) {
        var arr = grid[i + j * gw]; if (!arr) continue;
        for (var k = 0; k < arr.length; k++) { var d = arr[k], dx = d[0] - px, dy = d[1] - py; if (dx * dx + dy * dy < (d[2] + r + 1.2) * (d[2] + r + 1.2)) return true; }
      }
      return false;
    }
    while (tries < 9000 && placed < 1500) {
      tries++;
      var r = 3 + Math.random() * 7.5, a = Math.random() * Math.PI * 2, rad = Math.sqrt(Math.random()) * (S / 2 - 12 - r);
      var px = S / 2 + Math.cos(a) * rad, py = S / 2 + Math.sin(a) * rad;
      if (near(px, py, r)) continue;
      var key = Math.floor(px / cell) + Math.floor(py / cell) * gw;
      (grid[key] = grid[key] || []).push([px, py, r]);
      var inFig = mask[(Math.round(py) * S + Math.round(px)) * 4] > 128;
      var set = inFig ? pal[0] : pal[1];
      x.fillStyle = set[Math.floor(Math.random() * set.length)];
      x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.fill();
      placed++;
    }
  }

  function start() {
    plates = PLAN.map(function (t) { return { t: t, n: num() }; });
    idx = 0; answers = [];
    root.innerHTML = '<p class="t-step">Before you start</p><h2 class="h3">Nine plates, about two minutes</h2><p>Use full screen brightness in normal room light, without night mode, blue-light filters or color filters. Keep both eyes open and wear your usual glasses. Type the number you see in each circle, or choose "I see no number".</p><button class="btn btn-amber" id="go" type="button">Show the first plate</button>';
    Y.$('#go').onclick = plate;
  }

  function plate() {
    var p = plates[idx];
    root.innerHTML = '<p class="t-step">Plate ' + (idx + 1) + ' of ' + plates.length + '</p><h2 class="h3">What number do you see?</h2>' +
      '<div class="stage dark"><canvas id="pl" width="360" height="360" style="width:min(100%,360px);height:auto;border-radius:50%" aria-label="Color dot plate"></canvas></div>' +
      '<form id="pf" class="btn-row"><label class="sr" for="pn">Number</label><input id="pn" type="number" inputmode="numeric" min="0" max="99" style="max-width:140px" placeholder="e.g. 27"><button class="btn btn-amber" type="submit">Next</button><button class="btn btn-ghost" id="none" type="button">I see no number</button></form>';
    drawPlate(Y.$('#pl'), p.n, PAL[p.t]);
    var f = Y.$('#pf'), inp = Y.$('#pn');
    inp.focus({ preventScroll: true });
    function next(v) { answers.push({ t: p.t, n: p.n, a: v }); idx++; if (idx < plates.length) plate(); else result(); }
    f.addEventListener('submit', function (e) { e.preventDefault(); next(inp.value === '' ? null : +inp.value); });
    Y.$('#none').onclick = function () { next(null); };
  }

  function result() {
    var demoOk = answers[0].a === answers[0].n;
    var rg = answers.filter(function (a) { return a.t.indexOf('rg') === 0; }), by = answers.filter(function (a) { return a.t.indexOf('by') === 0; });
    var rgMiss = rg.filter(function (a) { return a.a !== a.n; }).length, byMiss = by.filter(function (a) { return a.a !== a.n; }).length;
    var cls = 'good', title = 'No sign of a color vision problem on this screen', body = 'You read the red-green and blue-yellow plates correctly. That is a reassuring result, though screens vary and this is not a clinical test.';
    if (!demoOk) { cls = 'warn'; title = 'Let\'s try that again'; body = 'The first plate is one almost everyone can read. Check your brightness and color settings, make the window larger and repeat the screening.'; }
    else if (rgMiss >= 2 || byMiss >= 1) {
      cls = 'warn'; title = 'You may have a color vision difference';
      body = (rgMiss >= 2 ? 'You missed ' + rgMiss + ' of ' + rg.length + ' red-green plates, a pattern seen in red-green color deficiency, the most common type (about 1 in 12 men and 1 in 200 women of Northern European descent). ' : '') +
        (byMiss >= 1 ? 'You missed ' + byMiss + ' of ' + by.length + ' blue-yellow plates. Blue-yellow deficiency is rare and can be inherited or caused by eye conditions, so a new change should be checked. ' : '') +
        'An eye care professional can confirm the type with standardized tests.';
    }
    root.innerHTML = '<div class="result ' + cls + '"><h3>' + title + '</h3><p>' + body + '</p><table class="rx-table"><thead><tr><th>Plate</th><th>Number shown</th><th>Your answer</th></tr></thead><tbody>' +
      answers.map(function (a, i) { return '<tr><td>' + (i + 1) + '</td><td>' + a.n + '</td><td>' + (a.a === null ? 'none' : a.a) + (a.a === a.n ? ' ✓' : '') + '</td></tr>'; }).join('') +
      '</tbody></table></div><div class="btn-row"><button class="btn btn-ghost" id="again" type="button">New set of plates</button><a class="btn btn-ghost" href="conditions/color-vision-deficiency.html">About color vision deficiency</a></div>' +
      Y.cta('exam', 'Confirm it with an eye exam', 'Color vision matters for some jobs and licences. An optometrist can test it properly. We match you with one near you for free.');
    Y.$('#again').onclick = start;
  }

  start();
})();
