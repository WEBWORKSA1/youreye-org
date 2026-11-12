/* Screen eye-strain risk calculator */
(function () {
  'use strict';
  var Y = window.YE, root = document.getElementById('tool');
  if (!Y || !root) return;
  var Q = [
    { q: 'Hours on screens per day (work and personal)', o: [['Under 2', 0], ['2 to 4', 8], ['4 to 8', 16], ['More than 8', 24]], f: 'Break up long screen days: batch tasks, take calls away from the screen, and stand up hourly.' },
    { q: 'How often do you take a real break from the screen?', o: [['Every 20 to 30 min', 0], ['About hourly', 6], ['Rarely', 14]], f: 'Use the 20-20-20 rule: every 20 minutes, look 20 feet (6 m) away for 20 seconds. Our timer can remind you.' },
    { q: 'Distance from your eyes to the main screen', o: [['Arm\'s length (50 to 75 cm)', 0], ['40 to 50 cm', 6], ['Closer than 40 cm', 12]], f: 'Move the screen back to about arm\'s length and enlarge the text instead of leaning in.' },
    { q: 'Top of the screen compared with your eyes', o: [['Slightly below', 0], ['Level', 4], ['Above eye level', 8]], f: 'Lower the screen so the top is at or just below eye level. Looking slightly down exposes less of the eye and reduces dryness.' },
    { q: 'Screen brightness compared with the room', o: [['About the same', 0], ['Much brighter (dark room)', 8], ['Dimmer than the room', 8]], f: 'Match screen brightness to the room and avoid using a bright screen in a dark room.' },
    { q: 'Glare from windows or overhead lights on the screen', o: [['None', 0], ['Some', 4], ['A lot', 8]], f: 'Turn the screen side-on to windows, use blinds, and try a matte screen filter.' },
    { q: 'Your glasses or contacts for screen distance', o: [['Up to date, or I don\'t need any', 0], ['Not sure or over 2 years old', 8], ['I need them but don\'t wear them', 12]], f: 'Get your eyes checked. Many people need a separate prescription or computer glasses for screen distance, especially after 40.' },
    { q: 'Air around you', o: [['Normal', 0], ['Dry, or a fan or vent blows on me', 6]], f: 'Point fans and vents away from your face and add a humidifier. Use preservative-free lubricating drops if needed.' },
    { q: 'Do you squint or lean in to read text?', o: [['No', 0], ['Sometimes', 4], ['Often', 8]], f: 'Increase text size (Ctrl/Cmd and +) and use high-contrast dark text on a light background.' }
  ];
  function form() {
    root.innerHTML = '<form id="f">' + Q.map(function (x, i) {
      return '<fieldset class="q"><legend style="font-weight:600;margin-bottom:8px">' + (i + 1) + '. ' + x.q + '</legend><div class="opts">' + x.o.map(function (o, k) {
        return '<label><input type="radio" name="q' + i + '" value="' + k + '"' + (k === 0 ? '' : '') + ' required><span>' + o[0] + '</span></label>';
      }).join('') + '</div></fieldset>';
    }).join('') + '<button class="btn btn-amber btn-lg" type="submit">Calculate my risk</button></form>';
    Y.$('#f').addEventListener('submit', function (e) {
      e.preventDefault();
      var s = 0, hits = [];
      for (var i = 0; i < Q.length; i++) {
        var c = Y.$('input[name=q' + i + ']:checked'); if (!c) { Y.$('input[name=q' + i + ']').focus(); return; }
        var p = Q[i].o[+c.value][1]; s += p; if (p > 0) hits.push([p, Q[i].f]);
      }
      hits.sort(function (a, b) { return b[0] - a[0]; });
      result(s, hits.slice(0, 3));
    });
  }
  function result(s, fixes) {
    var cls = s < 25 ? 'good' : s < 50 ? 'warn' : 'bad', lab = s < 25 ? 'Low risk' : s < 50 ? 'Moderate risk' : 'High risk';
    root.innerHTML = '<div class="result ' + cls + '"><h3>' + lab + ' of digital eye strain</h3><p class="big-num">' + s + ' <small style="font-size:1rem">/ 100</small></p><div class="meter" aria-hidden="true"><i style="left:' + s + '%"></i></div>' +
      (fixes.length ? '<h4>Your top ' + fixes.length + ' fixes</h4><ol>' + fixes.map(function (f) { return '<li>' + f[1] + '</li>'; }).join('') + '</ol>' : '<p>Your setup and habits are already eye-friendly. Keep it up.</p>') +
      '<p class="fine">Digital eye strain causes discomfort but there is no evidence it permanently damages the eyes. Blue-light glasses are not recommended by the American Academy of Ophthalmology for eye strain.</p></div>' +
      '<div class="btn-row"><button class="btn btn-ghost" id="again" type="button">Retake</button><a class="btn btn-ghost" href="tools/screen-break-timer.html">Start the 20-20-20 timer</a></div>' +
      Y.cta('exam', 'Ask about computer glasses', 'An eye exam can show whether a screen-distance prescription would make your workday more comfortable. We match you with local optometrists for free.');
    Y.$('#again').onclick = form;
  }
  form();
})();
