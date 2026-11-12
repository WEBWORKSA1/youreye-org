/* Guided 2-minute focus and blink break */
(function () {
  'use strict';
  var Y = window.YE, root = document.getElementById('tool');
  if (!Y || !root) return;
  var STEPS = [
    { t: 'Palming', s: 20, d: 'Rub your palms together until warm. Close your eyes and cup your hands over them without pressing. Breathe slowly.', a: 'rest' },
    { t: 'Full blinks', s: 20, d: 'Blink fully each time the circle pulses: close gently, pause, open. Screen use halves how often we blink.', a: 'blink' },
    { t: 'Near and far', s: 40, d: 'Hold a thumb about 25 cm from your face. When the circle is small, focus on your thumb. When it is large, focus on something across the room.', a: 'nearfar' },
    { t: 'Follow the dot', s: 25, d: 'Keep your head still and follow the dot with your eyes only. Stop if you feel dizzy.', a: 'eight' },
    { t: 'Rest', s: 15, d: 'Close your eyes and relax your face, jaw and shoulders.', a: 'rest' }
  ];
  var raf = null, timer = null;
  function intro() {
    root.innerHTML = '<p class="t-step">Two minutes, five steps</p><h2 class="h3">A short break for tired eyes</h2><ol>' + STEPS.map(function (s) { return '<li><strong>' + s.t + '</strong> (' + s.s + ' s)</li>'; }).join('') + '</ol><p class="note">These steps ease eye fatigue. They do not change your prescription or cure nearsightedness, astigmatism or other conditions.</p><button class="btn btn-amber btn-lg" id="go" type="button">Begin</button>';
    Y.$('#go').onclick = function () { run(0); };
  }
  function run(i) {
    cancelAnimationFrame(raf); clearInterval(timer);
    if (i >= STEPS.length) return done();
    var st = STEPS[i], left = st.s, t0 = performance.now();
    root.innerHTML = '<p class="t-step">Step ' + (i + 1) + ' of ' + STEPS.length + '</p><h2 class="h3">' + st.t + '</h2><p>' + st.d + '</p>' +
      '<div class="stage" style="position:relative;height:260px"><div id="dot" style="position:absolute;left:50%;top:50%;width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#5fd0c9,#0E8F8A 60%,#0B1F33)"></div><span id="lbl" style="position:absolute;bottom:10px;left:0;right:0;text-align:center;font-weight:700;color:var(--teal-d)"></span></div>' +
      '<div class="progress"><span id="pg"></span></div><div class="btn-row"><span class="big-num" id="left">' + left + '</span><button class="btn btn-ghost" id="skip" type="button">Skip step</button><button class="btn btn-ghost" id="stop" type="button">Stop</button></div>';
    var dot = Y.$('#dot'), lbl = Y.$('#lbl'), stage = dot.parentNode;
    function frame(now) {
      var e = (now - t0) / 1000, w = stage.clientWidth, h = stage.clientHeight, sc = 1, x = 0, y = 0;
      if (st.a === 'blink') { sc = 1 + 0.6 * Math.max(0, Math.sin(e * Math.PI / 2)); lbl.textContent = Math.sin(e * Math.PI / 2) > 0.7 ? 'Blink' : ''; }
      if (st.a === 'nearfar') { var near = Math.floor(e / 4) % 2 === 0; sc = near ? 0.5 : 2.2; lbl.textContent = near ? 'Focus near (thumb)' : 'Focus far (across the room)'; }
      if (st.a === 'eight') { x = Math.sin(e * 0.9) * (w / 2 - 40); y = Math.sin(e * 1.8) * (h / 2 - 40) / 1.2; }
      if (st.a === 'rest') { sc = 1 + 0.15 * Math.sin(e * 1.2); lbl.textContent = 'Breathe slowly'; }
      dot.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) scale(' + sc.toFixed(2) + ')';
      dot.style.transition = st.a === 'nearfar' ? 'transform .6s' : 'none';
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    timer = setInterval(function () {
      left--; Y.$('#left').textContent = Math.max(left, 0);
      Y.$('#pg').style.width = ((st.s - left) / st.s * 100) + '%';
      if (left <= 0) run(i + 1);
    }, 1000);
    Y.$('#skip').onclick = function () { run(i + 1); };
    Y.$('#stop').onclick = function () { cancelAnimationFrame(raf); clearInterval(timer); intro(); };
  }
  function done() {
    var n = Y.store.get('focus_count', 0) + 1; Y.store.set('focus_count', n);
    root.innerHTML = '<div class="result good"><h3>Break complete</h3><p>That was break number ' + n + ' on this device. Try one every couple of hours of screen time, and use the <a href="tools/screen-break-timer.html">20-20-20 timer</a> in between.</p><p>If your eyes still feel tired, dry or blurry after breaks, you may have dry eye or need a new prescription for screen distance.</p></div><div class="btn-row"><button class="btn btn-ghost" id="again" type="button">Do it again</button><a class="btn btn-ghost" href="tools/dry-eye-score.html">Check dry eye symptoms</a></div>' +
      Y.cta('exam', 'Still tired eyes after screens?', 'An optometrist can check for dry eye and prescribe computer glasses if you need them. We match you for free.');
    Y.$('#again').onclick = intro;
  }
  intro();
})();
