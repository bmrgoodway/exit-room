// 효과음 — 외부 오디오 파일 없이 Web Audio API 로만 만듭니다.
// 처음 사용자 동작(클릭) 때 AudioContext 를 만들어 브라우저 정책 경고를 피합니다.
let ctx = null;
let master = null;
let enabled = true;

function ensure() {
  if (!enabled) return null;
  if (ctx) {
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  }
  try {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    ctx = new C();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
  } catch {
    ctx = null;
  }
  return ctx;
}

export function setSound(on) {
  enabled = !!on;
  if (!enabled && ctx) {
    try { ctx.suspend(); } catch { /* 무시 */ }
  }
}

export function soundOn() {
  return enabled;
}

/** 기본 삑 소리 */
function blip(freq, dur, type, vol, when = 0) {
  const a = ensure();
  if (!a || !master) return;
  const t0 = a.currentTime + when;
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g);
  g.connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.03);
}

/** 종소리 — 배음 두 개를 겹쳐 맑게 */
function bellTone(freq, dur = 0.9, vol = 0.09, when = 0) {
  const a = ensure();
  if (!a || !master) return;
  const t0 = a.currentTime + when;
  for (const [mult, amp] of [[1, vol], [2.02, vol * 0.35], [3.01, vol * 0.16]]) {
    const osc = a.createOscillator();
    const g = a.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * mult, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, amp), t0 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }
}

export const sfx = {
  unlockAudio() { ensure(); },
  click() { blip(520, 0.06, 'square', 0.05); },
  tap() { blip(320, 0.05, 'triangle', 0.05); },
  type() { blip(660, 0.04, 'square', 0.035); },
  ok() { blip(660, 0.09, 'triangle', 0.07); blip(990, 0.12, 'triangle', 0.05, 0.07); },
  wrong() { blip(180, 0.16, 'sawtooth', 0.05); blip(130, 0.22, 'sawtooth', 0.045, 0.1); },
  unlock() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => blip(f, 0.28, 'triangle', 0.07, i * 0.11));
  },
  clear() {
    [392, 523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => blip(f, 0.5, 'sine', 0.075, i * 0.16));
  },
  bell(freq) { bellTone(freq, 0.95, 0.1); },
  water() { blip(240, 0.18, 'sine', 0.05); blip(300, 0.2, 'sine', 0.04, 0.06); },
  light() { blip(880, 0.05, 'square', 0.04); },
  step() { blip(440, 0.05, 'triangle', 0.04); },
};
