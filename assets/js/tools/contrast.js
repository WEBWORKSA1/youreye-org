/* Contrast check: one letter at a time, fading contrast */
(function () {
  'use strict';
  var Y = window.YE, root = document.getElementById('tool');
  if (!Y || !root) return;
  var LET = 'CDHKNORSVZ'.split('');
  var LV = [100, 50, 25, 12.5, 6.3, 3.2, 1.6, 0.8];
  function shade(c) {
    var lin = 1 - c / 100;
    var s = lin <= 0.0031308 ? 12.92 * lin : 1.055 * Math.pow(lin, 1 / 2.4) - 0.055;
    var v = Math.max(0, Math.min(254, Math.round(s * 255)));
    return 'rgb(' + v + ',' + v + ',' + v + ')';
  }
  function intro() {
    root.innerHTML = '<p class="t-step">Before you start</p><h2 class="h3">Both eyes open, normal distance</h2><p>Sit at a normal distance (about 60 cm) in a well-lit room. Set screen brightness to maximum and turn off night mode. Each letter gets fainter. Pick the letter you see, or "Not sure" when you can\'t tell.</p><button class="btn btn-amber" id="go" type="button">Start</button>';
    Y.$('#go').onclick = run;
  }
  function run() {
    var li = 0, ok = 0, bad = 0, passed = -1, cur;
    root.innerHTML = '<p class="t-step" id="lab"></p><div class="stage dark" style="min-height:220px"><div id="let" style="font:700 120px/1 Arial, Helvetica, sans-serif;letter-spacing:.05em"></div></div><div class="btn-row" id="ch" style="justify-content:center"></div>';
    function show() {
      cur = LET[Math.floor(Math.random() * LET.length)];
      var opts = Y.shuffle(LET.filter(function (l) { return l !== cur; })).slice(0, 3).concat(cur);
      Y.shuffle(opts);
      Y.$('#let').textContent = cur;
      Y.$('#let').style.color = shade(LV[li]);
      Y.$('#lab').textContent = 'Level ' + (li + 1) + ' of ' + LV.length;
      Y.$('#ch').innerHTML = opts.map(function (o) { return '<button class="btn btn-ghost" type="button" data-l="' + o + '" style="min-width:64px;font-size:1.3rem">' + o + '</button>'; }).join('') + '<button class="btn btn-ghost" type="button" data-l="?">Not sure</button>';
    }
    Y.$('#ch').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.getAttribute('data-l') === cur) ok++; else bad++;
      if (ok >= 2) { passed = li; ok = bad = 0; li++; if (li >= LV.length) return done(passed); }
      else if (bad >= 2) return done(passed);
      show();
    });
    show();
  }
  function done(p) {
    var c = p < 0 ? null : LV[p], logcs = c ? Math.log10(100 / c) : 0;
    var cls = logcs >= 1.5 ? 'good' : logcs >= 1.2 ? 'warn' : 'bad';
    var msg = cls === 'good' ? 'You picked out letters down to very low contrast. That is in the normal range for this kind of screen check.'
      : cls === 'warn' ? 'Your contrast vision was a little below what most adults reach on this check. Glare, a dirty screen or a dim room can lower it. If faded or washed-out vision bothers you, mention it at your next exam.'
        : 'You needed fairly high contrast to read the letters. Reduced contrast vision can come from cataract, glaucoma, macular or retinal problems, or an out-of-date prescription. Book an eye exam.';
    root.innerHTML = '<div class="result ' + cls + '"><h3>Faintest letter you read: ' + (c ? c + '% contrast' : 'none') + '</h3><p class="big-num">' + logcs.toFixed(2) + ' <small style="font-size:1rem">log contrast sensitivity (approx.)</small></p><p>' + msg + '</p><p class="fine">Screens cannot display very low contrast precisely, so treat this as a rough screening.</p></div>' +
      '<div class="btn-row"><button class="btn btn-ghost" id="again" type="button">Check again</button><a class="btn btn-ghost" href="conditions/cataract.html">About cataract</a></div>' +
      Y.cta(cls === 'good' ? 'exam' : 'specialist', cls === 'good' ? 'Book your routine eye exam' : 'Have your contrast vision checked', 'We match you with local optometrists and ophthalmologists. Free, no obligation.');
    Y.$('#again').onclick = intro;
  }
  intro();
})();
