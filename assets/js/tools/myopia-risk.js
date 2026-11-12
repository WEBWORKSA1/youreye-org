/* Child myopia risk check (for parents) */
(function () {
  'use strict';
  var Y = window.YE, root = document.getElementById('tool');
  if (!Y || !root) return;
  var Q = [
    ['How old is your child?', [['Under 6', 6], ['6 to 8', 10], ['9 to 12', 6], ['13 to 17', 2]], 'Myopia that starts young tends to progress further, so younger children benefit most from early checks.'],
    ['How many parents are nearsighted?', [['Neither', 0], ['One', 12], ['Both', 24]], 'Children with nearsighted parents are more likely to become nearsighted.'],
    ['Time outdoors on a typical day (school days included)', [['Under 1 hour', 20], ['1 to 2 hours', 10], ['2 hours or more', 0]], 'Aim for about two hours outdoors a day. Daylight is linked to a lower risk of myopia starting.'],
    ['Close-up time outside school (reading, tablets, phones, games)', [['Under 2 hours', 0], ['2 to 4 hours', 10], ['More than 4 hours', 18]], 'Break up close work with the 20-20-20 rule and keep books and screens at least 30 cm away.'],
    ['Does your child already wear glasses for distance?', [['No', 0], ['Yes', 12], ['Yes, and they get stronger every year', 22]], 'If glasses keep getting stronger, ask about myopia-control treatments, which can slow progression.'],
    ['Do you notice squinting, sitting close to screens, or headaches?', [['No', 0], ['Sometimes', 6], ['Often', 12]], 'Squinting and sitting close are common signs a child cannot see distance clearly. Book an exam.']
  ];
  function form() {
    root.innerHTML = '<form id="f">' + Q.map(function (q, i) {
      return '<fieldset class="q"><legend style="font-weight:600;margin-bottom:8px">' + (i + 1) + '. ' + q[0] + '</legend><div class="opts">' + q[1].map(function (o, k) {
        return '<label><input type="radio" name="q' + i + '" value="' + k + '" required><span>' + o[0] + '</span></label>';
      }).join('') + '</div></fieldset>';
    }).join('') + '<button class="btn btn-amber btn-lg" type="submit">See the risk level</button></form>';
    Y.$('#f').addEventListener('submit', function (e) {
      e.preventDefault(); var s = 0, tips = [];
      for (var i = 0; i < Q.length; i++) {
        var c = Y.$('input[name=q' + i + ']:checked'); if (!c) { Y.$('input[name=q' + i + ']').focus(); return; }
        var p = Q[i][1][+c.value][1]; s += p; if (p >= 10) tips.push(Q[i][2]);
      }
      result(Math.min(100, s), tips);
    });
  }
  function result(s, tips) {
    var cls = s < 30 ? 'good' : s < 55 ? 'warn' : 'bad', lab = s < 30 ? 'Lower risk' : s < 55 ? 'Moderate risk' : 'Higher risk';
    root.innerHTML = '<div class="result ' + cls + '"><h3>' + lab + ' of nearsightedness developing or progressing</h3><div class="meter" aria-hidden="true"><i style="left:' + s + '%"></i></div>' +
      (tips.length ? '<h4>What would help most</h4><ul>' + tips.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' : '<p>Your child\'s habits are protective. Keep up outdoor time and regular eye exams.</p>') +
      '<h4>Myopia control options to ask about</h4><p>Low-dose atropine eye drops, myopia-control spectacle lenses, myopia-control soft contact lenses and orthokeratology (overnight lenses) can slow progression in children. An eye doctor can say which suits your child.</p>' +
      '<p class="fine">This check rates known risk factors; it cannot tell whether your child is nearsighted. Only an eye exam can.</p></div>' +
      '<div class="btn-row"><button class="btn btn-ghost" id="again" type="button">Retake</button><a class="btn btn-ghost" href="guides/kids-vision-and-myopia.html">Children\'s vision guide</a></div>' +
      Y.cta('child', 'Book your child\'s eye exam', 'We connect you with local optometrists and pediatric eye doctors, including clinics that offer myopia control. Free, no obligation.');
    Y.$('#again').onclick = form;
  }
  form();
})();
