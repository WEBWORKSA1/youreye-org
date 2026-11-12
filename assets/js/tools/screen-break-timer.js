/* 20-20-20 break timer with sound and notifications */
(function () {
  'use strict';
  var Y = window.YE, root = document.getElementById('tool');
  if (!Y || !root) return;
  var mins = Y.store.get('timer_mins', 20), sound = Y.store.get('timer_sound', true);
  var mode = 'idle', endAt = 0, left = mins * 60, tick = null, baseTitle = document.title;
  var today = new Date().toDateString(), log = Y.store.get('timer_log', {});
  if (log.d !== today) log = { d: today, n: 0 };

  root.innerHTML = '<p class="t-step" id="phase">Ready</p><div class="timer-face" id="face" role="timer" aria-live="off"></div><p class="center" id="say">Press start and keep working. We will tell you when to look away.</p>' +
    '<div class="btn-row" style="justify-content:center"><button class="btn btn-amber btn-lg" id="ss" type="button">Start</button><button class="btn btn-ghost" id="rs" type="button">Reset</button></div>' +
    '<div class="grid g3 mt2"><div><label for="iv">Remind me every</label><select id="iv">' + [10, 15, 20, 25, 30, 45, 60].map(function (m) { return '<option value="' + m + '"' + (m === mins ? ' selected' : '') + '>' + m + ' minutes</option>'; }).join('') + '</select></div>' +
    '<div><label>Alerts</label><label class="check"><input type="checkbox" id="snd"' + (sound ? ' checked' : '') + '> Play a soft chime</label><button class="btn btn-ghost btn-sm mt1" id="nt" type="button">Allow desktop notifications</button></div>' +
    '<div><label>Today</label><p class="big-num" id="cnt">0</p><p class="meta">eye breaks taken</p></div></div>';
  var face = Y.$('#face'), phase = Y.$('#phase'), say = Y.$('#say'), ss = Y.$('#ss');

  function fmt(s) { var m = Math.floor(s / 60), r = s % 60; return m + ':' + (r < 10 ? '0' : '') + r; }
  function render() { face.textContent = fmt(Math.max(0, left)); Y.$('#cnt').textContent = log.n; }
  function chime() {
    if (!sound) return;
    try {
      var A = window.AudioContext || window.webkitAudioContext, ctx = new A();
      [660, 880].forEach(function (f, i) {
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.frequency.value = f; o.connect(g); g.connect(ctx.destination);
        var t = ctx.currentTime + i * 0.25;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.2, t + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
        o.start(t); o.stop(t + 0.55);
      });
    } catch (e) { }
  }
  function notify(msg) {
    try { if ('Notification' in window && Notification.permission === 'granted') new Notification('YourEye.org', { body: msg, icon: Y.abs('assets/img/favicon.svg') }); } catch (e) { }
  }
  function begin(m, secs) { mode = m; endAt = Date.now() + secs * 1000; left = secs; loop(); }
  function loop() {
    clearInterval(tick);
    tick = setInterval(function () {
      left = Math.round((endAt - Date.now()) / 1000);
      if (left <= 0) {
        if (mode === 'work') {
          chime(); notify('Time for an eye break: look about 20 feet (6 m) away for 20 seconds.');
          phase.textContent = 'Eye break'; say.innerHTML = '<strong>Look at something about 20 feet (6 m) away</strong> and blink slowly. Back to work in 20 seconds.';
          document.title = '● Eye break! ' + baseTitle;
          begin('break', 20);
        } else {
          log.n++; Y.store.set('timer_log', log); chime();
          phase.textContent = 'Working'; say.textContent = 'Nice. Next break in ' + mins + ' minutes.'; document.title = baseTitle;
          begin('work', mins * 60);
        }
      }
      render();
    }, 500);
  }
  ss.onclick = function () {
    if (mode === 'idle' || mode === 'paused') {
      var resume = mode === 'paused' ? left : mins * 60;
      phase.textContent = 'Working'; say.textContent = 'Keep working. We will tell you when to look away.';
      begin(this._m || 'work', resume); ss.textContent = 'Pause';
    } else {
      clearInterval(tick); this._m = mode; mode = 'paused'; ss.textContent = 'Resume'; phase.textContent = 'Paused';
    }
  };
  Y.$('#rs').onclick = function () { clearInterval(tick); mode = 'idle'; ss._m = null; left = mins * 60; ss.textContent = 'Start'; phase.textContent = 'Ready'; document.title = baseTitle; render(); };
  Y.$('#iv').onchange = function () { mins = +this.value; Y.store.set('timer_mins', mins); if (mode === 'idle') { left = mins * 60; render(); } };
  Y.$('#snd').onchange = function () { sound = this.checked; Y.store.set('timer_sound', sound); };
  Y.$('#nt').onclick = function () {
    var b = this;
    if (!('Notification' in window)) { b.textContent = 'Not supported in this browser'; return; }
    Notification.requestPermission().then(function (p) { b.textContent = p === 'granted' ? 'Notifications on' : 'Notifications blocked'; });
  };
  render();
})();
