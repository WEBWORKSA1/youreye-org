/* Eye exam schedule by age and risk, with .ics reminder */
(function () {
  'use strict';
  var Y = window.YE, root = document.getElementById('tool');
  if (!Y || !root) return;
  var R = [['diabetes', 'Diabetes (type 1 or 2)'], ['family', 'Family history of glaucoma or macular degeneration'], ['myopia', 'High nearsightedness (−6 or stronger)'], ['contacts', 'Wears contact lenses'], ['bp', 'High blood pressure'], ['steroids', 'Long-term steroid medicine'], ['surgery', 'Past eye surgery or serious eye injury']];
  root.innerHTML = '<div class="row2"><div class="field"><label for="age">Age (years)</label><input type="number" id="age" min="0" max="110" step="0.5" placeholder="e.g. 42"></div><div class="field"><label for="last">Date of last eye exam (optional)</label><input type="date" id="last"></div></div>' +
    '<fieldset class="q"><legend style="font-weight:600;margin-bottom:8px">Tick anything that applies</legend>' + R.map(function (r) { return '<label class="check"><input type="checkbox" value="' + r[0] + '"> ' + r[1] + '</label>'; }).join('') + '</fieldset>' +
    '<button class="btn btn-amber" id="go" type="button">Show my schedule</button><div id="out"></div>';
  function plan(age, risk) {
    var has = function (k) { return risk.indexOf(k) > -1; }, atRisk = risk.length > 0;
    if (age < 1) return [6, 'A first comprehensive eye exam between 6 and 12 months of age.'];
    if (age < 3) return [12, 'At least one eye exam between ages 3 and 5. See an eye doctor sooner if you notice an eye turn, squinting or a white pupil in photos.'];
    if (age < 6) return [12, 'At least one exam between 3 and 5, and another before first grade.'];
    if (age < 18) return [12, 'Every year during school age' + (has('contacts') ? ', and yearly contact lens checks' : '') + '.'];
    if (has('diabetes')) return [12, 'A dilated eye exam at least once a year because of diabetes, or more often if your eye doctor advises.'];
    if (age >= 65) return [12, 'Every year from age 65.'];
    if (atRisk) return [12, 'Every year because of your risk factors, or as your eye doctor recommends.'];
    if (age >= 40) return [24, 'At least every two years, and a baseline exam around 40 if you haven\'t had one, when early disease signs and vision changes often begin.'];
    return [24, 'At least every two years.'];
  }
  function ymd(d) { return d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0'); }
  Y.$('#go').onclick = function () {
    var age = parseFloat(Y.$('#age').value);
    if (isNaN(age)) { Y.$('#age').focus(); return; }
    var risk = Y.$$('fieldset input:checked', root).map(function (c) { return c.value; });
    var p = plan(age, risk), last = Y.$('#last').value ? new Date(Y.$('#last').value + 'T12:00:00') : null;
    var due = last ? new Date(last.getFullYear(), last.getMonth() + p[0], last.getDate()) : null, now = new Date();
    var status = due ? (due < now ? '<strong>Your next exam is overdue</strong> (was due ' + due.toLocaleDateString() + ').' : 'Next exam due around <strong>' + due.toLocaleDateString() + '</strong>.') : 'Add the date of your last exam to see when the next one is due.';
    Y.$('#out').innerHTML = '<div class="result ' + (due && due < now ? 'warn' : 'good') + '"><h3>Recommended: every ' + (p[0] === 24 ? '2 years' : p[0] === 6 ? '6 to 12 months' : 'year') + '</h3><p>' + p[1] + '</p><p>' + status + '</p>' +
      '<p class="fine">Based on American Optometric Association and American Academy of Ophthalmology guidance. Your eye doctor may advise a different schedule. Do not wait for a scheduled exam if your vision changes or your eye hurts.</p>' +
      '<button class="btn btn-ghost btn-sm" id="ics" type="button">Add a reminder to my calendar</button></div>' +
      Y.cta(age < 18 ? 'child' : 'exam', due && due < now ? 'Book your overdue eye exam' : 'Book your next eye exam', 'We match you with local optometrists and ophthalmologists. Free, no obligation.');
    Y.$('#ics').onclick = function () {
      var d = due && due > now ? due : new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14);
      var end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
      var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//YourEye.org//Exam reminder//EN', 'BEGIN:VEVENT', 'UID:' + Date.now() + '@youreye.org', 'DTSTAMP:' + ymd(now) + 'T000000Z', 'DTSTART;VALUE=DATE:' + ymd(d), 'DTEND;VALUE=DATE:' + ymd(end), 'SUMMARY:Book an eye exam', 'DESCRIPTION:Reminder from YourEye.org: time to book your eye exam.', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
      a.download = 'eye-exam-reminder.ics';
      document.body.appendChild(a); a.click(); a.parentNode.removeChild(a);
    };
  };
})();
