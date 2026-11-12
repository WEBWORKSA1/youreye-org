/* Glasses prescription decoder */
(function () {
  'use strict';
  var Y = window.YE, root = document.getElementById('tool');
  if (!Y || !root) return;
  function cell(eye, k, ph) { return '<td><label class="sr" for="' + eye + k + '">' + eye.toUpperCase() + ' ' + k + '</label><input id="' + eye + k + '" inputmode="decimal" placeholder="' + ph + '" autocomplete="off"></td>'; }
  root.innerHTML = '<p class="t-step">Copy the numbers from your prescription</p><p>OD is your right eye and OS your left (sometimes written R and L). Leave a box empty if it is blank or says PL, DS or SPH.</p>' +
    '<div style="overflow-x:auto"><table class="rx-table"><thead><tr><th></th><th>SPH</th><th>CYL</th><th>AXIS</th><th>ADD</th></tr></thead><tbody>' +
    '<tr><th>OD (right)</th>' + cell('od', 'sph', '-2.25') + cell('od', 'cyl', '-0.75') + cell('od', 'axis', '180') + cell('od', 'add', '') + '</tr>' +
    '<tr><th>OS (left)</th>' + cell('os', 'sph', '-2.00') + cell('os', 'cyl', '-0.50') + cell('os', 'axis', '170') + cell('os', 'add', '') + '</tr></tbody></table></div>' +
    '<div class="row2 mt1"><div><label for="pd">PD (pupillary distance, mm)</label><input id="pd" inputmode="decimal" placeholder="e.g. 63 or 31.5/31.5"></div><div style="align-self:end"><div class="btn-row"><button class="btn btn-amber" id="go" type="button">Explain my prescription</button><button class="btn btn-ghost" id="ex" type="button">Try an example</button></div></div></div><div id="out"></div>';
  function num(id) {
    var v = (Y.$('#' + id).value || '').trim().toUpperCase().replace(',', '.');
    if (!v || /^(PL|PLANO|DS|SPH|INFINITY|∞)$/.test(v)) return 0;
    var n = parseFloat(v.replace(/[^0-9.+-]/g, ''));
    return isNaN(n) ? null : n;
  }
  function f(n) { return (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n).toFixed(2); }
  function grade(s) {
    if (s < 0) return 'nearsighted (myopia), ' + (s >= -3 ? 'mild' : s >= -6 ? 'moderate' : 'high');
    if (s > 0) return 'farsighted (hyperopia), ' + (s <= 2 ? 'mild' : s <= 5 ? 'moderate' : 'high');
    return 'no nearsightedness or farsightedness';
  }
  function eye(e, name) {
    var s = num(e + 'sph'), c = num(e + 'cyl'), a = num(e + 'axis'), ad = num(e + 'add');
    if ([s, c, a, ad].some(function (x) { return x === null; }) || Math.abs(s) > 25 || Math.abs(c) > 10 || (c && (a < 1 || a > 180)) || ad < 0 || ad > 4) {
      return '<div class="q"><h4>' + name + '</h4><p>Some numbers look unusual. SPH is usually between −20 and +20, CYL between −6 and +6, AXIS from 1 to 180 and ADD from +0.75 to +3.50.</p></div>';
    }
    var se = s + c / 2, hi = Math.max(Math.abs(s), Math.abs(s + c));
    var mat = hi <= 2 ? 'standard plastic (1.50) or polycarbonate' : hi <= 4 ? 'polycarbonate or 1.60 high-index' : hi <= 6 ? '1.67 high-index' : '1.67 or 1.74 high-index';
    var out = '<div class="q"><h4>' + name + '</h4><ul>' +
      '<li><strong>SPH ' + f(s) + ':</strong> ' + grade(s) + '.</li>' +
      (c ? '<li><strong>CYL ' + f(c) + ' at AXIS ' + a + '°:</strong> ' + (Math.abs(c) <= 1 ? 'mild' : Math.abs(c) <= 2 ? 'moderate' : 'high') + ' astigmatism. The axis (' + a + '°) is the direction of the lens correction, not a measure of how strong it is.</li>' +
        '<li><strong>Same prescription in the other notation:</strong> ' + f(s + c) + ' / ' + f(-c) + ' × ' + (a > 90 ? a - 90 : a + 90) + '. Optometrists often write minus cylinder; ophthalmologists sometimes write plus.</li>' : '<li>No CYL means no astigmatism correction.</li>') +
      (ad ? '<li><strong>ADD ' + f(ad) + ':</strong> extra reading power for close work (presbyopia). Used for readers, bifocals or progressives.</li>' : '') +
      '<li><strong>Spherical equivalent:</strong> ' + f(Math.round(se * 4) / 4) + '. A one-number summary of the prescription.</li>' +
      '<li><strong>Lens material that keeps lenses thin:</strong> ' + mat + '.</li></ul></div>';
    return out;
  }
  function run() {
    var pdv = (Y.$('#pd').value || '').trim(), pdTxt = '';
    if (pdv) {
      var parts = pdv.split(/[\/ ]+/).map(parseFloat).filter(function (x) { return !isNaN(x); });
      var tot = parts.length === 2 ? parts[0] + parts[1] : parts[0];
      pdTxt = '<p><strong>PD ' + pdv + ' mm:</strong> the distance between your pupils' + (parts.length === 2 ? ' (measured for each eye from the nose bridge, total ' + tot + ' mm)' : '') + '. ' + (tot >= 50 && tot <= 76 ? 'That is in the usual adult range of about 54 to 74 mm.' : 'That is outside the usual adult range, so double-check it.') + ' Online stores need it to center your lenses.</p>';
    }
    Y.$('#out').innerHTML = '<div class="result"><h3>Your prescription in plain English</h3>' + eye('od', 'Right eye (OD)') + eye('os', 'Left eye (OS)') + pdTxt +
      '<p class="fine">A glasses prescription is not a contact lens prescription. Contacts need a separate fitting. This explanation does not replace advice from your eye doctor.</p></div>' +
      '<div class="btn-row"><a class="btn btn-ghost" data-aff="glasses" href="guides/buying-glasses-online.html">Buying glasses online</a><a class="btn btn-ghost" href="tools/contacts-converter.html">Convert to contact lens power</a></div>' +
      Y.cta('glasses', 'Prescription out of date?', 'Most adults should have an eye exam every one to two years. We connect you with optometrists near you for free.');
    Y.$$('[data-aff]').forEach(function (a) { var u = ((window.YE_CONFIG || {}).affiliates || {})[a.getAttribute('data-aff')]; if (u) { a.href = u; a.target = '_blank'; a.rel = 'sponsored noopener'; } });
  }
  Y.$('#go').onclick = run;
  Y.$('#ex').onclick = function () {
    var ex = { odsph: '-2.25', odcyl: '-0.75', odaxis: '180', odadd: '', ossph: '-2.00', oscyl: '-0.50', osaxis: '170', osadd: '', pd: '63' };
    Object.keys(ex).forEach(function (k) { Y.$('#' + k).value = ex[k]; });
    run();
  };
})();
