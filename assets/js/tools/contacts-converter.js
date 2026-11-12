/* Glasses to contact lens power (vertex distance) converter */
(function () {
  'use strict';
  var Y = window.YE, root = document.getElementById('tool');
  if (!Y || !root) return;
  function row(e, n) {
    return '<tr><th>' + n + '</th>' + ['sph', 'cyl', 'axis'].map(function (k) { return '<td><label class="sr" for="' + e + k + '">' + n + ' ' + k + '</label><input id="' + e + k + '" inputmode="decimal" placeholder="' + { sph: '-5.00', cyl: '-1.00', axis: '180' }[k] + '"></td>'; }).join('') + '</tr>';
  }
  root.innerHTML = '<p class="t-step">Enter your glasses prescription</p><div style="overflow-x:auto"><table class="rx-table"><thead><tr><th></th><th>SPH</th><th>CYL</th><th>AXIS</th></tr></thead><tbody>' + row('od', 'Right (OD)') + row('os', 'Left (OS)') + '</tbody></table></div>' +
    '<div class="row2 mt1"><div><label for="vd">Vertex distance (mm)</label><input id="vd" inputmode="decimal" value="12"><p class="fine">Distance from the back of the glasses lens to the eye. 12 mm is the usual default.</p></div><div style="align-self:center"><button class="btn btn-amber" id="go" type="button">Convert</button></div></div><div id="out"></div>';
  function val(id) { var v = parseFloat((Y.$('#' + id).value || '0').replace(',', '.')); return isNaN(v) ? 0 : v; }
  function conv(F, d) { return F / (1 - d * F); }
  function rnd(F) { var step = Math.abs(F) > 6 ? 0.5 : 0.25; return Math.round(F / step) * step; }
  function f(n) { return (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n).toFixed(2); }
  function eye(e, n, d) {
    var s = val(e + 'sph'), c = val(e + 'cyl'), a = val(e + 'axis');
    var m1 = conv(s, d), m2 = conv(s + c, d), cs = rnd(m1), cc = rnd(m2 - m1);
    var se = rnd(conv(s + c / 2, d));
    var note = Math.abs(s) < 4 && Math.abs(s + c) < 4 ? 'Below ±4.00 the change is negligible, so contact power is usually the same as glasses.' : 'Above ±4.00 the power at the eye differs from the glasses lens, which is why contact prescriptions differ.';
    var tor = Math.abs(c) > 0.75 ? 'Toric (astigmatism) lens: about <strong>' + f(cs) + ' / ' + f(cc) + ' × ' + (a || '?') + '</strong>.' : (c ? 'With low astigmatism a spherical lens of about <strong>' + f(se) + '</strong> often works.' : '');
    return '<tr><th>' + n + '</th><td>' + f(s) + (c ? ' / ' + f(c) + ' × ' + a : '') + '</td><td><strong>' + f(cs) + '</strong>' + (c ? ' / ' + f(cc) : '') + '</td><td>' + tor + ' ' + note + '</td></tr>';
  }
  Y.$('#go').onclick = function () {
    var d = val('vd') / 1000 || 0.012;
    Y.$('#out').innerHTML = '<div class="result"><h3>Approximate contact lens powers</h3><div style="overflow-x:auto"><table class="rx-table"><thead><tr><th>Eye</th><th>Glasses</th><th>At the eye</th><th>Notes</th></tr></thead><tbody>' + eye('od', 'Right', d) + eye('os', 'Left', d) + '</tbody></table></div>' +
      '<p class="mt1">Contact lenses also need a base curve, diameter and brand that fit your eye, which only a contact lens fitting can determine. In the US, sellers must verify a valid contact lens prescription.</p></div>' +
      Y.cta('contacts', 'Get fitted for contact lenses', 'A contact lens exam measures your eye surface and checks how lenses sit. We match you with local optometrists for free.');
  };
})();
