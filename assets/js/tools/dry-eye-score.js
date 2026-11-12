/* Dry eye symptom score (original 10-question screening, not a validated clinical instrument) */
(function () {
  'use strict';
  var Y = window.YE, root = document.getElementById('tool');
  if (!Y || !root) return;
  var Q = ['My eyes feel gritty or sandy', 'My eyes burn or sting', 'My eyes water for no reason', 'My vision blurs, then clears when I blink',
    'Bright light bothers my eyes', 'My eyes feel tired by the end of the day', 'My eyes are uncomfortable when I use screens or read',
    'Wind, air conditioning or heating bothers my eyes', 'My eyes look red', 'My contact lenses get uncomfortable (choose Never if you don\'t wear them)'];
  var O = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'];
  function form() {
    root.innerHTML = '<p class="t-step">Over the past week, how often…</p><form id="f">' + Q.map(function (q, i) {
      return '<fieldset class="q"><legend style="font-weight:600;margin-bottom:8px">' + (i + 1) + '. ' + q + '</legend><div class="opts">' + O.map(function (o, v) {
        return '<label><input type="radio" name="q' + i + '" value="' + v + '" required><span>' + o + '</span></label>';
      }).join('') + '</div></fieldset>';
    }).join('') + '<button class="btn btn-amber btn-lg" type="submit">See my score</button></form>';
    Y.$('#f').addEventListener('submit', function (e) {
      e.preventDefault();
      var s = 0;
      for (var i = 0; i < Q.length; i++) { var c = Y.$('input[name=q' + i + ']:checked'); if (!c) { Y.$('input[name=q' + i + ']').focus(); return; } s += +c.value; }
      result(s);
    });
  }
  function result(s) {
    var band = s <= 7 ? ['good', 'Minimal symptoms'] : s <= 15 ? ['warn', 'Mild symptoms'] : s <= 25 ? ['warn', 'Moderate symptoms'] : ['bad', 'Marked symptoms'];
    var tips = s <= 7 ? ['Keep blinking fully during screen work.', 'Take 20-20-20 breaks.', 'Stay hydrated.']
      : ['Use preservative-free artificial tears up to four times a day.', 'Apply a warm compress to closed lids for 5 to 10 minutes, then gently massage the lid edges.', 'Point fans and car vents away from your face and use a humidifier in dry rooms.', 'Follow the 20-20-20 rule and blink fully during screen work.', 'If you wear contact lenses, ask your eye doctor about lens types and shorter wear times.'];
    root.innerHTML = '<div class="result ' + band[0] + '"><h3>' + band[1] + '</h3><p class="big-num">' + s + ' <small style="font-size:1rem">out of 40</small></p><div class="meter" aria-hidden="true"><i style="left:' + (s / 40 * 100) + '%"></i></div>' +
      '<p>' + (s <= 7 ? 'Your answers suggest dryness is not a big issue for you right now.' : s <= 15 ? 'Your answers suggest mild dry eye symptoms. Simple habits often help.' : s <= 25 ? 'Your answers suggest dry eye is affecting your comfort regularly. An eye doctor can find the cause and recommend treatment.' : 'Your answers suggest dry eye symptoms are affecting you most of the time. Prescription treatments and in-office therapies can help; see an eye doctor.') + '</p>' +
      '<h4>What usually helps</h4><ul>' + tips.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' +
      '<p class="fine">See a doctor promptly for eye pain, light sensitivity with a red eye, or sudden vision change; these are not typical dry eye symptoms.</p></div>' +
      '<div class="btn-row"><button class="btn btn-ghost" id="again" type="button">Retake</button><a class="btn btn-ghost" href="conditions/dry-eye.html">About dry eye</a></div>' +
      Y.cta('dryeye', s > 15 ? 'Get dry eye treated properly' : 'Talk to a dry eye specialist', 'Many clinics now offer dry eye evaluations and treatments beyond eye drops. We connect you with one near you for free.');
    Y.$('#again').onclick = form;
    Y.store.set('dryeye_last', { s: s, t: Date.now() });
  }
  form();
})();
