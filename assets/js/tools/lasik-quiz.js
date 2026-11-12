/* LASIK candidacy quiz */
(function () {
  'use strict';
  var Y = window.YE, root = document.getElementById('tool');
  if (!Y || !root) return;
  var Q = [
    ['age', 'How old are you?', ['Under 18', '18 to 21', '22 to 40', '41 to 55', 'Over 55']],
    ['stable', 'Has your glasses or contacts prescription changed in the last 12 months?', ['No', 'A little', 'Yes, quite a lot', 'Not sure']],
    ['rx', 'Roughly what is your prescription?', ['Nearsighted up to −6', 'Nearsighted −6 to −10', 'Nearsighted beyond −10', 'Farsighted (plus numbers)', 'Not sure']],
    ['astig', 'Do you have astigmatism?', ['None or mild', 'Moderate', 'High (over 3 diopters)', 'Not sure']],
    ['dry', 'How often do your eyes feel dry or gritty?', ['Rarely', 'Sometimes', 'Often or severely']],
    ['preg', 'Are you pregnant or breastfeeding?', ['No', 'Yes']],
    ['health', 'Do any of these apply to you?', ['None of these', 'Autoimmune disease (e.g. lupus, rheumatoid arthritis)', 'Diabetes that is not well controlled', 'Medicines that slow healing (e.g. isotretinoin)']],
    ['eye', 'Have you been told you have any of these?', ['None of these', 'Keratoconus or thin corneas', 'Cataract', 'Glaucoma', 'Past eye herpes or serious eye infection']],
    ['life', 'Do you do contact sports, martial arts, or work in the military or policing?', ['No', 'Yes']],
    ['goal', 'What do you want most?', ['Clear distance vision without glasses', 'Clear distance and reading vision', 'Not sure yet']]
  ];
  function form() {
    root.innerHTML = '<form id="f">' + Q.map(function (q, i) {
      return '<fieldset class="q"><legend style="font-weight:600;margin-bottom:8px">' + (i + 1) + '. ' + q[1] + '</legend><div class="opts">' + q[2].map(function (o, k) {
        return '<label><input type="radio" name="' + q[0] + '" value="' + k + '" required><span>' + o + '</span></label>';
      }).join('') + '</div></fieldset>';
    }).join('') + '<button class="btn btn-amber btn-lg" type="submit">See my options</button></form>';
    Y.$('#f').addEventListener('submit', function (e) {
      e.preventDefault(); var a = {};
      for (var i = 0; i < Q.length; i++) { var c = Y.$('input[name=' + Q[i][0] + ']:checked'); if (!c) { Y.$('input[name=' + Q[i][0] + ']').focus(); return; } a[Q[i][0]] = +c.value; }
      result(a);
    });
  }
  function result(a) {
    var notes = [], level = 0, opts = ['LASIK', 'SMILE'];
    function add(l, t) { notes.push(t); level = Math.max(level, l); }
    if (a.age === 0) add(3, 'Laser vision correction is not approved for people under 18. The eyes are still changing.');
    if (a.age === 1) add(1, 'Under 21, prescriptions often keep changing. Surgeons usually want a year or two of stability.');
    if (a.stable === 2) add(2, 'A prescription that is still changing should settle (usually 12 months stable) before surgery.');
    if (a.stable === 3) add(1, 'Bring your last two prescriptions to the consultation so stability can be checked.');
    if (a.rx === 1) add(1, 'Moderate to high nearsightedness may still suit LASIK or SMILE if your corneas are thick enough; an implantable lens (ICL) is another option.');
    if (a.rx === 2) { add(1, 'Very high nearsightedness is often better treated with an implantable collamer lens (ICL) than with corneal laser.'); opts = ['ICL', 'PRK']; }
    if (a.rx === 3) add(1, 'Farsighted corrections are possible with laser but over about +3 to +4, lens-based options are often considered.');
    if (a.astig === 2) add(1, 'High astigmatism may need toric ICL or a staged approach.');
    if (a.dry === 2) add(2, 'Significant dry eye should be treated first, as LASIK can make dryness worse for months. PRK or SMILE may be gentler.');
    if (a.preg === 1) add(2, 'Hormones change the eye during pregnancy and breastfeeding. Most surgeons wait until a few months after.');
    if (a.health === 1) add(2, 'Autoimmune disease can affect healing. Some people still qualify after a specialist review.');
    if (a.health === 2) add(2, 'Diabetes needs to be well controlled before elective eye surgery.');
    if (a.health === 3) add(2, 'Some medicines (such as isotretinoin) need to be stopped for a period before surgery.');
    if (a.eye === 1) { add(3, 'Keratoconus or thin corneas usually rule out LASIK. Corneal cross-linking, special contact lenses or ICL may be options.'); opts = ['ICL', 'Corneal cross-linking']; }
    if (a.eye === 2) { add(2, 'If you have a cataract, cataract surgery with a lens implant can also correct your prescription.'); opts = ['Cataract surgery with premium lens']; }
    if (a.eye === 3) add(2, 'Glaucoma needs careful evaluation; laser surgery is sometimes possible but needs specialist input.');
    if (a.eye === 4) add(2, 'A history of eye herpes or serious infection needs specialist review before surgery.');
    if (a.life === 1) { add(0, 'For contact sports and high-impact jobs, flap-free procedures like PRK or SMILE are often preferred.'); if (opts[0] === 'LASIK') opts = ['PRK', 'SMILE', 'LASIK']; }
    if (a.age >= 3 && a.goal === 1) { add(1, 'After about 45, reading vision fades (presbyopia). Options include monovision LASIK or refractive lens exchange.'); if (a.age === 4) opts = ['Refractive lens exchange', 'Monovision LASIK']; }
    if (a.age === 4 && a.eye !== 2) add(1, 'Over 55, early lens changes are common, so refractive lens exchange is often discussed alongside laser.');
    var L = [['good', 'You look like a good candidate to explore laser vision correction'], ['warn', 'You may be a candidate, with a few things to check'], ['warn', 'Not right now, or a different procedure may suit you'], ['bad', 'Laser correction is unlikely to be right for you at the moment']][level];
    root.innerHTML = '<div class="result ' + L[0] + '"><h3>' + L[1] + '</h3><p><strong>Procedures to ask about:</strong> ' + opts.join(', ') + '</p>' +
      (notes.length ? '<ul>' + notes.map(function (n) { return '<li>' + n + '</li>'; }).join('') + '</ul>' : '<p>None of your answers raised a common reason to wait. A consultation measures corneal thickness and shape, pupil size, tear film and eye health to confirm.</p>') +
      '<p class="fine">This quiz reflects general criteria surgeons use. Only an in-person consultation with corneal mapping can confirm candidacy.</p></div>' +
      '<div class="btn-row"><button class="btn btn-ghost" id="again" type="button">Retake</button><a class="btn btn-ghost" href="guides/lasik-smile-prk-icl.html">Compare LASIK, SMILE, PRK and ICL</a><a class="btn btn-ghost" href="tools/lasik-cost.html">LASIK cost calculator</a></div>' +
      '<div class="lead-cta lead-inline"><div><p class="eyebrow">Free consultation matching</p><h3>Get a free LASIK consultation near you</h3><p>We send your answers to up to three local refractive surgery centers so they can tell you exactly which procedure fits. No cost, no obligation.</p></div><a class="btn btn-amber" href="find-care.html?need=' + (opts[0] === 'Cataract surgery with premium lens' ? 'cataract' : 'lasik') + '&quiz=' + encodeURIComponent(L[1] + ' | ' + opts.join(', ')) + '">Match me with a surgeon</a></div>';
    Y.$('#again').onclick = form;
  }
  form();
})();
