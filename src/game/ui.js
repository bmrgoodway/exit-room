// 화면 공통 도우미
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const pad2 = (n) => String(n).padStart(2, '0');
export const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
export const sum = (arr) => arr.reduce((a, b) => a + b, 0);

export function fmtClock(ms) {
  const t = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  return h > 0 ? `${h}:${pad2(m)}:${pad2(s)}` : `${pad2(m)}:${pad2(s)}`;
}

/** 짧은 HTML 조각을 요소로 */
export function h(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export function svgEl(tag, attrs = {}) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
}

let toastTimer = null;
export function toast(msg, kind = '') {
  const el = $('#toast');
  if (!el) return;
  el.textContent = msg;
  el.className = `toast ${kind ? `toast-${kind}` : ''}`;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 2600);
}

export function shake(el) {
  if (!el) return;
  el.classList.remove('shake');
  // 같은 애니메이션을 다시 시작하려면 리플로우가 필요합니다.
  void el.offsetWidth;
  el.classList.add('shake');
  setTimeout(() => el.classList.remove('shake'), 460);
}

export function openSheet(title, html) {
  const sheet = $('#sheet');
  if (!sheet) return;
  $('#sheet-title').textContent = title;
  const body = $('#sheet-body');
  body.innerHTML = html;
  sheet.hidden = false;
  sheet.setAttribute('aria-hidden', 'false');
  document.body.classList.add('sheet-open');
  const close = $('#sheet-close');
  if (close) close.focus();
}

export function closeSheet() {
  const sheet = $('#sheet');
  if (!sheet) return;
  sheet.hidden = true;
  sheet.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('sheet-open');
}

/** 확인 대화상자 대신 두 번 누르는 버튼 (되돌리기 어려운 일은 확인 후 실행) */
export function armButton(btn, label, fn, ms = 3500) {
  if (!btn) return;
  const original = btn.textContent;
  let armed = false;
  let timer = null;
  btn.addEventListener('click', () => {
    if (!armed) {
      armed = true;
      btn.textContent = label;
      btn.classList.add('armed');
      timer = setTimeout(() => {
        armed = false;
        btn.textContent = original;
        btn.classList.remove('armed');
      }, ms);
      return;
    }
    clearTimeout(timer);
    armed = false;
    btn.textContent = original;
    btn.classList.remove('armed');
    fn();
  });
}
