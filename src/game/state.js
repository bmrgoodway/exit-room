// 진행 상황 저장 — 이 브라우저(localStorage)에만 남습니다. 이름표는 store.js 가 붙여 줍니다('exit-room:').
import { local } from '../store.js';

export const TOTAL = 15;
const KEY = 'save';

const empty = () => ({
  v: 1,
  startedAt: null,
  finishedAt: null,
  activeMs: 0,
  lastTick: null,
  stage: 1, // 지금까지 도달한 방 (가장 멀리 연 방)
  cleared: {}, // { "3": { at, ms, hints } }
  hintLevel: {}, // { "3": 0~3 }
  notes: '',
  settings: { theme: 'night', sound: true },
});

function sanitize(raw) {
  const s = empty();
  if (!raw || typeof raw !== 'object') return s;
  s.startedAt = Number(raw.startedAt) || null;
  s.finishedAt = Number(raw.finishedAt) || null;
  s.activeMs = Math.max(0, Number(raw.activeMs) || 0);
  s.stage = Math.min(TOTAL, Math.max(1, Number(raw.stage) || 1));
  if (raw.cleared && typeof raw.cleared === 'object') {
    for (const [k, v] of Object.entries(raw.cleared)) {
      const n = Number(k);
      if (!Number.isInteger(n) || n < 1 || n > TOTAL) continue;
      s.cleared[n] = { at: Number(v?.at) || Date.now(), ms: Number(v?.ms) || 0, hints: Number(v?.hints) || 0 };
    }
  }
  if (raw.hintLevel && typeof raw.hintLevel === 'object') {
    for (const [k, v] of Object.entries(raw.hintLevel)) {
      const n = Number(k);
      if (n >= 1 && n <= TOTAL) s.hintLevel[n] = Math.min(3, Math.max(0, Number(v) || 0));
    }
  }
  if (typeof raw.notes === 'string') s.notes = raw.notes.slice(0, 20000);
  if (raw.settings) {
    s.settings.theme = raw.settings.theme === 'day' ? 'day' : 'night';
    s.settings.sound = raw.settings.sound !== false;
  }
  return s;
}

export const state = sanitize(local.get(KEY, null));

export function save() {
  local.set(KEY, state);
}

export function startClock() {
  if (!state.startedAt) {
    state.startedAt = Date.now();
    state.lastTick = Date.now();
    save();
  }
}

/** 화면이 보이는 동안만 시간을 셉니다. */
export function tick(persist = false) {
  if (!state.startedAt || state.finishedAt) return;
  const now = Date.now();
  if (!state.lastTick) state.lastTick = now;
  if (document.visibilityState === 'visible') {
    const delta = now - state.lastTick;
    if (delta > 0 && delta < 120000) state.activeMs += delta;
  }
  state.lastTick = now;
  if (persist) save();
}

export function elapsed() {
  return state.activeMs;
}

export function clearStage(n, ms) {
  const already = state.cleared[n];
  if (!already) state.cleared[n] = { at: Date.now(), ms: Math.max(0, Math.round(ms || 0)), hints: hintUsed(n) };
  if (n >= state.stage) state.stage = Math.min(TOTAL, n + 1);
  save();
}

export function clearedCount() {
  return Object.keys(state.cleared).length;
}

export function isCleared(n) {
  return !!state.cleared[n];
}

export function hintUsed(n) {
  return state.hintLevel[n] || 0;
}

export function totalHints() {
  return Object.values(state.hintLevel).reduce((a, b) => a + (Number(b) || 0), 0);
}

export function revealHint(n) {
  const cur = hintUsed(n);
  if (cur >= 3) return 3;
  state.hintLevel[n] = cur + 1;
  save();
  return state.hintLevel[n];
}

export function finish() {
  if (!state.finishedAt) state.finishedAt = Date.now();
  save();
}

export function rankOf(ms, hints) {
  const min = ms / 60000;
  if (min <= 45 && hints <= 8) return { grade: 'S', title: '별빛 열쇠의 주인', note: '완벽한 추리, 단서가 스스로 길을 밝혔습니다.' };
  if (min <= 75 && hints <= 20) return { grade: 'A', title: '마을의 기록자', note: '차분하게 끝까지 따라간 훌륭한 플레이입니다.' };
  if (min <= 130) return { grade: 'B', title: '야간 순찰자', note: '한 방 한 방의 수수께끼를 모두 풀어냈습니다.' };
  return { grade: 'C', title: '끈질긴 탐험가', note: '포기하지 않고 15개의 봉인을 모두 열었습니다.' };
}

export function resetAll() {
  const theme = state.settings.theme;
  const sound = state.settings.sound;
  Object.assign(state, empty());
  state.settings = { theme, sound };
  save();
}
