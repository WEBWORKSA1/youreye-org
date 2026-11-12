/* Near vision reading card (N-point sizes) */
(function () {
  'use strict';
  var Y = window.YE, root = document.getElementById('tool');
  if (!Y || !root) return;
  var SIZES = [24, 18, 14, 12, 10, 8, 6, 5];
  var TXT = [
    'Bright light helps tired eyes read.',
    'A pair of reading glasses can make small print clear again.',
    'Most people notice close-up focus getting harder in their forties.',
    'Hold the page a little farther away and the words may sharpen for a moment.',
    'Regular eye exams check both your prescription and the health of your eyes.',
    'Medicine labels, menus and phone screens often use print this size or smaller.',
    'The fine print on a contract or a pill bottle is usually set at about this size.',
    'Very small print like this is a demanding test even for young, healthy eyes.'
  ];
  var pxmm = Y.pxPerMm() || 96 / 25.4, cal = !!Y.pxPerMm();
  function card() {
    root.innerHTML = '<p class="t-step">Reading card</p><h2 class="h3">Hold the screen 40 cm (16 in) away</h2><p>That is a normal reading distance, about the length from your elbow to your fingertips. Wear your usual reading glasses if you have them. Tap the <strong>smallest line you can read comfortably</strong>.</p>' +
      (cal ? '' : '<p class="note">For true print sizes, calibrate your screen first in the <a href="tools/acuity.html">acuity check</a> (step 1). Without it, sizes are estimated.</p>') +
      '<div id="lines">' + SIZES.map(function (n, i) {
        var px = n * 0.3528 * pxmm;
        return '<button type="button" class="q" data-i="' + i + '" style="display:block;width:100%;text-align:left;cursor:pointer;font-family:Georgia,\'Times New Roman\',serif;font-size:' + px.toFixed(2) + 'px;line-height:1.35"><span class="pill" style="font:600 12px var(--f);margin-right:8px">N' + n + '</span>' + TXT[i] + '</button>';
      }).join('') + '</div><button class="btn btn-ghost mt1" id="none" type="button">I can\'t read any line comfortably</button>';
    Y.$('#lines').addEventListener('click', function (e) { var b = e.target.closest('[data-i]'); if (b) result(+b.getAttribute('data-i')); });
    Y.$('#none').onclick = function () { result(-1); };
  }
  function result(i) {
    var n = i < 0 ? null : SIZES[i];
    var cls = n !== null && n <= 6 ? 'good' : n !== null && n <= 10 ? 'warn' : 'bad';
    var msg = n === null ? 'You could not read even the largest line comfortably. Please book an eye exam soon, and sooner if this is a sudden change.'
      : n <= 6 ? 'You read very small print at a normal distance. That is excellent near vision.'
        : n <= 8 ? 'N8 is about newspaper print, so your near vision is in the normal working range. If you strain in dim light or need to hold things farther away, early presbyopia may be starting.'
          : n <= 10 ? 'You read normal print, but not the smaller lines. That is a common early sign of presbyopia (after 40) or an out-of-date prescription.'
            : 'Print of everyday size was hard to read. Reading glasses or an updated prescription would probably help a lot.';
    root.innerHTML = '<div class="result ' + cls + '"><h3>Smallest comfortable line: ' + (n ? 'N' + n : 'none') + '</h3><p>' + msg + '</p>' +
      '<details><summary><strong>Rough reading-glasses strength by age</strong></summary><p>If your distance vision is good and the only problem is close-up, over-the-counter readers are often about: <strong>+0.75 to +1.25</strong> in your early to mid 40s, <strong>+1.25 to +1.75</strong> around 45 to 50, <strong>+1.75 to +2.25</strong> around 50 to 60, and <strong>+2.25 to +2.75</strong> over 60. Choose the weakest that makes print clear at your usual distance. Readers do not replace an eye exam, which also checks for eye disease.</p></details></div>' +
      '<div class="btn-row"><button class="btn btn-ghost" id="again" type="button">Check again</button><a class="btn btn-ghost" href="conditions/presbyopia.html">About presbyopia</a></div>' +
      Y.cta('glasses', 'Get the right reading prescription', 'An optometrist can prescribe readers, bifocals or progressives that fit how you read and work. We match you for free.');
    Y.$('#again').onclick = card;
  }
  card();
})();
