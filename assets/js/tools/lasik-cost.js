/* LASIK vs glasses and contacts cost calculator */
(function () {
  'use strict';
  var Y = window.YE, root = document.getElementById('tool');
  if (!Y || !root) return;
  var F = [
    ['age', 'Your age', 30, 18, 70, 1],
    ['glasses', 'Yearly spend on glasses ($)', 250, 0, 3000, 10],
    ['contacts', 'Yearly spend on contacts and solution ($)', 400, 0, 3000, 10],
    ['price', 'LASIK price per eye ($)', 2200, 500, 6000, 50],
    ['until', 'Compare costs until age', 60, 30, 85, 1],
    ['months', 'Financing months (0 = pay upfront)', 24, 0, 60, 6],
    ['apr', 'Financing APR (%)', 0, 0, 30, 0.5]
  ];
  root.innerHTML = '<div class="grid g3">' + F.map(function (f) {
    return '<div class="field"><label for="c_' + f[0] + '">' + f[1] + '</label><input type="number" id="c_' + f[0] + '" value="' + f[2] + '" min="' + f[3] + '" max="' + f[4] + '" step="' + f[5] + '"></div>';
  }).join('') + '<div class="field"><label class="check" style="margin-top:34px"><input type="checkbox" id="c_both" checked> Both eyes</label></div></div><div id="out"></div>';
  function v(k) { var n = parseFloat(Y.$('#c_' + k).value); return isNaN(n) ? 0 : n; }
  function money(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  function calc() {
    var yrs = Math.max(0, v('until') - v('age')), yearly = v('glasses') + v('contacts');
    var lasik = v('price') * (Y.$('#c_both').checked ? 2 : 1);
    var correction = yearly * yrs;
    var n = v('months'), r = v('apr') / 1200, pay = 0, financed = lasik;
    if (n > 0) { pay = r ? lasik * r / (1 - Math.pow(1 + r, -n)) : lasik / n; financed = pay * n; }
    var be = yearly ? financed / yearly : Infinity;
    var max = Math.max(correction, financed, 1), diff = correction - financed;
    Y.$('#out').innerHTML = '<div class="result ' + (diff > 0 ? 'good' : 'warn') + '"><h3>' + (diff > 0 ? 'LASIK could save about ' + money(diff) + ' by age ' + v('until') : 'Glasses and contacts cost less over this period') + '</h3>' +
      '<div class="bar-chart"><div class="b"><span>Glasses and contacts</span><i style="width:' + (correction / max * 100) + '%"></i><strong>' + money(correction) + '</strong></div><div class="b alt"><span>LASIK' + (n ? ' (financed)' : '') + '</span><i style="width:' + (financed / max * 100) + '%"></i><strong>' + money(financed) + '</strong></div></div>' +
      '<dl class="kv"><dt>Break-even</dt><dd>' + (isFinite(be) ? 'about ' + be.toFixed(1) + ' years (around age ' + Math.round(v('age') + be) + ')' : 'no ongoing costs entered') + '</dd>' + (n ? '<dt>Monthly payment</dt><dd>' + money(pay) + ' for ' + n + ' months</dd>' : '') + '</dl>' +
      '<p class="fine">Typical US prices run about $1,500 to $3,000 per eye. Most people still need reading glasses from their mid-40s whether or not they had LASIK, so this compares distance correction only. Some practices include enhancements; ask what is covered. FSA and HSA funds can usually be used.</p></div>' +
      Y.cta('lasik', 'Get real prices from surgeons near you', 'Consultations are usually free. We match you with up to three local refractive surgery centers so you can compare quotes.');
  }
  root.addEventListener('input', calc);
  root.addEventListener('change', calc);
  calc();
})();
