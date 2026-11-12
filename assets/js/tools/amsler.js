/* Amsler grid: per-eye check with tap-to-mark */
(function () {
  'use strict';
  var Y = window.YE, root = document.getElementById('tool');
  if (!Y || !root) return;
  var ans = {};

  function grid(eye) {
    var other = eye === 'right' ? 'left' : 'right';
    root.innerHTML = '<p class="t-step">' + (eye === 'right' ? 'Right eye' : 'Left eye') + '</p><h2 class="h3">Cover your ' + other + ' eye and look only at the center dot</h2>' +
      '<p>Hold the screen at your usual reading distance (30 to 40 cm) and wear your reading glasses if you use them. Keep looking at the dot. Tap any area that looks wavy, blurred or missing.</p>' +
      '<div class="stage dark"><canvas id="ag" width="400" height="400" style="width:min(100%,400px);height:auto;touch-action:manipulation;cursor:crosshair" aria-label="Amsler grid. Tap areas that look distorted."></canvas></div>' +
      '<div class="q"><p>While looking at the dot:</p>' +
      '<label class="check"><input type="checkbox" id="q1"> Some lines look wavy, bent or broken</label>' +
      '<label class="check"><input type="checkbox" id="q2"> Some squares look blurry, dark or missing</label>' +
      '<label class="check"><input type="checkbox" id="q3"> I cannot see all four corners and sides of the grid</label></div>' +
      '<div class="btn-row"><button class="btn btn-amber" id="nx" type="button">' + (eye === 'right' ? 'Next: left eye' : 'See my result') + '</button><button class="btn btn-ghost" id="clr" type="button">Clear marks</button></div>';
    var c = Y.$('#ag'), x = c.getContext('2d'), marks = [];
    function draw() {
      x.fillStyle = '#fff'; x.fillRect(0, 0, 400, 400);
      x.strokeStyle = '#111'; x.lineWidth = 1;
      for (var i = 0; i <= 20; i++) {
        var p = Math.min(i * 20 + 0.5, 399.5);
        x.beginPath(); x.moveTo(p, 0); x.lineTo(p, 400); x.stroke();
        x.beginPath(); x.moveTo(0, p); x.lineTo(400, p); x.stroke();
      }
      x.fillStyle = '#111'; x.beginPath(); x.arc(200, 200, 5, 0, Math.PI * 2); x.fill();
      x.strokeStyle = 'rgba(194,65,12,.9)'; x.lineWidth = 3;
      marks.forEach(function (m) { x.beginPath(); x.arc(m[0], m[1], 14, 0, Math.PI * 2); x.stroke(); });
    }
    c.addEventListener('click', function (e) {
      var r = c.getBoundingClientRect();
      marks.push([(e.clientX - r.left) * 400 / r.width, (e.clientY - r.top) * 400 / r.height]);
      draw();
    });
    Y.$('#clr').onclick = function () { marks = []; draw(); };
    draw();
    Y.$('#nx').onclick = function () {
      ans[eye] = { a: Y.$('#q1').checked || Y.$('#q2').checked || Y.$('#q3').checked || marks.length > 0, n: marks.length };
      if (eye === 'right') grid('left'); else result();
    };
  }

  function result() {
    var r = ans.right.a, l = ans.left.a, bad = r || l;
    root.innerHTML = '<div class="result ' + (bad ? 'bad' : 'good') + '"><h3>' + (bad ? 'You noticed changes on the grid' : 'No changes noticed') + '</h3>' +
      '<dl class="kv"><dt>Right eye</dt><dd>' + (r ? 'Changes noticed' : 'Grid looked normal') + '</dd><dt>Left eye</dt><dd>' + (l ? 'Changes noticed' : 'Grid looked normal') + '</dd></dl>' +
      '<p>' + (bad ? 'Wavy, blurred or missing areas can be a sign of a problem with the macula, such as age-related macular degeneration, a macular hole or swelling of the retina. <strong>If this is new or getting worse, contact an eye doctor promptly, and the same day if it came on suddenly.</strong>'
        : 'The lines looked straight and complete to you. If you are over 50, have AMD in your family or have diabetes, repeat this check weekly and keep up dilated eye exams. The grid does not replace them.') + '</p></div>' +
      '<div class="btn-row"><button class="btn btn-ghost" id="again" type="button">Check again</button><a class="btn btn-ghost" href="conditions/macular-degeneration.html">About macular degeneration</a></div>' +
      Y.cta(bad ? 'specialist' : 'exam', bad ? 'Get your macula checked soon' : 'Keep up regular dilated exams', bad ? 'We can connect you with an ophthalmologist or optometrist near you who can examine your retina.' : 'Find an eye doctor near you for a full dilated eye exam.');
    Y.$('#again').onclick = function () { ans = {}; grid('right'); };
    Y.store.set('amsler_last', { r: r, l: l, t: Date.now() });
  }

  grid('right');
})();
