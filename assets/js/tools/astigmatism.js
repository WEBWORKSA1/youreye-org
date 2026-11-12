/* Astigmatism clock dial */
(function () {
  'use strict';
  var Y = window.YE, root = document.getElementById('tool');
  if (!Y || !root) return;
  var ans = {};

  function dial() {
    var s = '<svg viewBox="0 0 340 340" width="340" height="340" role="img" aria-label="Clock dial of lines"><rect width="340" height="340" fill="#fff"/>';
    for (var h = 1; h <= 12; h++) {
      var a = (h * 30 - 90) * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), px = -sa, py = ca;
      [-5, 0, 5].forEach(function (o) {
        var x1 = 170 + ca * 34 + px * o, y1 = 170 + sa * 34 + py * o, x2 = 170 + ca * 138 + px * o, y2 = 170 + sa * 138 + py * o;
        s += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="#111" stroke-width="2.2"/>';
      });
      s += '<text x="' + (170 + ca * 156).toFixed(1) + '" y="' + (170 + sa * 156 + 6).toFixed(1) + '" font-size="16" font-family="Arial" text-anchor="middle" fill="#333">' + h + '</text>';
    }
    return s + '<circle cx="170" cy="170" r="4" fill="#111"/></svg>';
  }

  function step(eye) {
    var other = eye === 'right' ? 'left' : 'right';
    root.innerHTML = '<p class="t-step">' + (eye === 'right' ? 'Right eye' : 'Left eye') + '</p><h2 class="h3">Cover your ' + other + ' eye. Do all the lines look equally dark?</h2>' +
      '<p>Sit about 50 cm (20 in) from the screen, without glasses first if you can. Look at the center dot and compare the line groups.</p>' +
      '<div class="stage dark">' + dial() + '</div>' +
      '<div class="q"><p>What do you notice?</p><div class="opts" id="o1"><label><input type="radio" name="a" value="same"><span>All lines look the same</span></label><label><input type="radio" name="a" value="diff"><span>Some lines look darker or sharper</span></label></div></div>' +
      '<div class="q" id="hrs" hidden><p>Which clock numbers have the darkest lines? (Pick the lower number of the pair.)</p><div class="opts">' +
      [1, 2, 3, 4, 5, 6].map(function (h) { return '<label><input type="radio" name="h" value="' + h + '"><span>' + h + ' and ' + (h + 6) + '</span></label>'; }).join('') + '</div></div>' +
      '<button class="btn btn-amber" id="nx" type="button">' + (eye === 'right' ? 'Next: left eye' : 'See my result') + '</button>';
    Y.$('#o1').addEventListener('change', function (e) { Y.$('#hrs').hidden = e.target.value !== 'diff'; });
    Y.$('#nx').onclick = function () {
      var a = Y.$('input[name=a]:checked');
      if (!a) { Y.$('#o1 input').focus(); return; }
      var h = Y.$('input[name=h]:checked');
      ans[eye] = { diff: a.value === 'diff', h: h ? +h.value : null };
      if (eye === 'right') step('left'); else result();
    };
  }

  function line(r) {
    if (!r.diff) return 'Lines looked even';
    return 'Some lines darker' + (r.h ? ' (around ' + r.h + ' and ' + (r.h + 6) + ' o\'clock, a rough axis of ' + r.h * 30 + '°)' : '');
  }

  function result() {
    var any = ans.right.diff || ans.left.diff;
    root.innerHTML = '<div class="result ' + (any ? 'warn' : 'good') + '"><h3>' + (any ? 'Possible astigmatism' : 'No sign of astigmatism on this chart') + '</h3>' +
      '<dl class="kv"><dt>Right eye</dt><dd>' + line(ans.right) + '</dd><dt>Left eye</dt><dd>' + line(ans.left) + '</dd></dl>' +
      '<p>' + (any ? 'When one direction of lines looks darker or sharper, the eye may focus unevenly in different directions. That is astigmatism, which is very common and easily corrected with glasses, toric contact lenses or refractive surgery. Only an eye exam can measure the amount.'
        : 'All lines looked even. Small amounts of astigmatism may not show on a screen chart, so an eye exam is still the way to know for sure.') + '</p>' +
      '<p class="fine">The axis estimate uses the "rule of 30" (lower clock number × 30) and is only a rough guide.</p></div>' +
      '<div class="btn-row"><button class="btn btn-ghost" id="again" type="button">Check again</button><a class="btn btn-ghost" href="conditions/astigmatism.html">About astigmatism</a></div>' +
      Y.cta(any ? 'glasses' : 'exam', any ? 'Get astigmatism measured and corrected' : 'Keep your prescription up to date', 'We match you with local optometrists who can measure astigmatism and fit glasses or toric lenses.');
    Y.$('#again').onclick = function () { ans = {}; step('right'); };
  }

  step('right');
})();
