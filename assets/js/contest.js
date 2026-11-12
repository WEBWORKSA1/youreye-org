/* Monthly Eye-Q quiz: 10 questions picked by month, plus creative contest theme */
(function () {
  'use strict';
  var Y = window.YE, box = document.getElementById('quiz');
  if (!Y || !box) return;
  var BANK = [
    ['What does 20/20 vision describe?', ['Normal distance sharpness', 'Perfect eye health', 'Twenty percent better vision', 'Color vision'], 0],
    ['Which condition usually has no early symptoms?', ['Pink eye', 'Open-angle glaucoma', 'A stye', 'Allergic conjunctivitis'], 1],
    ['The 20-20-20 rule means every 20 minutes you look how far away?', ['20 inches', '20 metres', 'About 20 feet', '2 feet'], 2],
    ['Presbyopia usually becomes noticeable around which age?', ['10', '25', '40 to 45', '70'], 2],
    ['What part of the eye does a cataract cloud?', ['Cornea', 'Lens', 'Retina', 'Optic nerve'], 1],
    ['A sudden shower of floaters with flashes can signal what?', ['Dry eye', 'A retinal tear or detachment', 'Allergies', 'Tired eyes'], 1],
    ['Which habit is linked to less nearsightedness in children?', ['More time outdoors', 'Reading in the dark', 'Sitting close to screens', 'Skipping glasses'], 0],
    ['What does UV400 on sunglasses mean?', ['Blocks 400 colors', 'Blocks 100% of UVA and UVB', '400% darker', 'Polarized'], 1],
    ['What is the macula?', ['The colored part of the eye', 'The center of the retina for sharp vision', 'A tear gland', 'The eyelid edge'], 1],
    ['Which is NOT safe for contact lenses?', ['Fresh solution', 'Tap water', 'Clean dry hands', 'Replacing the case'], 1],
    ['People with diabetes should have a dilated eye exam how often?', ['Every 10 years', 'Only if vision changes', 'At least yearly', 'Never'], 2],
    ['Astigmatism is usually caused by what?', ['An unevenly curved cornea or lens', 'Too much screen time', 'Eye infections', 'Low light'], 0],
    ['Red-green color deficiency is most common in whom?', ['Women', 'Men', 'Children only', 'Older adults only'], 1],
    ['Amblyopia is also called what?', ['Pink eye', 'Lazy eye', 'Dry eye', 'Floaters'], 1],
    ['Which test helps people with AMD spot changes at home?', ['Snellen chart', 'Amsler grid', 'Color plates', 'Blood pressure'], 1],
    ['What should you do first after a chemical splash in the eye?', ['Rub it', 'Flush with clean water for 15+ minutes', 'Wait and see', 'Apply a bandage'], 1],
    ['Keratoconus affects which part of the eye?', ['Cornea', 'Lens', 'Retina', 'Iris'], 0],
    ['What does OD mean on a prescription?', ['Left eye', 'Right eye', 'Both eyes', 'Over-the-counter'], 1],
    ['A minus SPH number on a prescription corrects what?', ['Farsightedness', 'Nearsightedness', 'Color blindness', 'Glaucoma'], 1],
    ['Which lens material is most impact resistant for kids?', ['Glass', 'Polycarbonate', 'Standard 1.50 plastic', 'Crystal'], 1],
    ['Darker sunglasses always block more UV. True or false?', ['True', 'False'], 1],
    ['Which procedure places a lens inside the eye to correct high myopia?', ['PRK', 'ICL', 'LASIK', 'SMILE'], 1],
    ['People blink less when looking at screens. True or false?', ['True', 'False'], 0],
    ['What is the leading cause of vision loss in older adults according to NEI?', ['AMD', 'Myopia', 'Pink eye', 'Styes'], 0],
    ['Glasses make myopia worse in children. True or false?', ['True', 'False'], 1],
    ['What does PD stand for on a glasses order?', ['Prescription date', 'Pupillary distance', 'Power diopter', 'Primary doctor'], 1],
    ['Which group should get a yearly eye exam according to the AOA?', ['Adults 65 and older', 'Only children under 2', 'Only people with glasses', 'Nobody'], 0],
    ['Looking at a solar eclipse is safe with regular sunglasses. True or false?', ['True', 'False'], 1],
    ['Which eye drops are best for frequent dry eye use?', ['Preservative-free artificial tears', 'Redness-relief drops', 'Leftover antibiotic drops', 'Saline from a nasal spray'], 0],
    ['What is the clear dome at the front of the eye called?', ['Sclera', 'Cornea', 'Pupil', 'Lens'], 1]
  ];
  var THEMES = ['Eyes in nature', 'Through the window', 'Reflections', 'Glasses with character', 'Spring colors', 'Light and shadow', 'Summer sun safety', 'Back to school', 'Autumn hues', 'Night lights', 'Gratitude: people who help us see', 'Winter sparkle'];
  var now = new Date(), seed = now.getFullYear() * 12 + now.getMonth();
  function rand() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
  var order = BANK.map(function (q, i) { return [rand(), i]; }).sort(function (a, b) { return a[0] - b[0]; }).slice(0, 10).map(function (x) { return BANK[x[1]]; });
  var th = document.getElementById('theme'); if (th) th.textContent = THEMES[now.getMonth()];
  box.innerHTML = '<form id="qf">' + order.map(function (q, i) {
    return '<fieldset class="q"><legend style="font-weight:600;margin-bottom:8px">' + (i + 1) + '. ' + Y.esc(q[0]) + '</legend><div class="opts">' + q[1].map(function (o, k) {
      return '<label><input type="radio" name="q' + i + '" value="' + k + '" required><span>' + Y.esc(o) + '</span></label>';
    }).join('') + '</div></fieldset>';
  }).join('') + '<button class="btn btn-amber btn-lg" type="submit">Check my score</button></form>';
  document.getElementById('qf').addEventListener('submit', function (e) {
    e.preventDefault();
    var s = 0;
    for (var i = 0; i < order.length; i++) {
      var c = box.querySelector('input[name=q' + i + ']:checked');
      if (!c) { box.querySelector('input[name=q' + i + ']').focus(); return; }
      var ok = +c.value === order[i][2];
      if (ok) s++;
      c.closest('fieldset').style.borderColor = ok ? '#3bb273' : '#eb5757';
    }
    var res = document.createElement('div');
    res.className = 'result ' + (s >= 7 ? 'good' : 'warn');
    res.innerHTML = '<h3>You scored ' + s + ' out of 10</h3><p>' + (s >= 7 ? 'You qualify for this month\'s prize draw. Enter below.' : 'Score 7 or more to enter the prize draw. Read a few guides and try again; you can retake the quiz.') + '</p>';
    var old = box.querySelector('.result'); if (old) old.parentNode.removeChild(old);
    box.appendChild(res);
    var sc = document.getElementById('quizScore'); if (sc) sc.value = s + '/10';
    var entry = document.getElementById('entry'); if (entry) entry.hidden = s < 7;
    res.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
})();
