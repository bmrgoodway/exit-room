// STAGE 9 · 중등 과학실 실험대 — 시약 색상 혼합 패턴 퍼즐
const REAGENTS = [
  { id: 'R', name: '빨강', css: '#ff614a' },
  { id: 'Y', name: '노랑', css: '#ffdc1a' },
  { id: 'B', name: '파랑', css: '#0abbee' },
  { id: 'W', name: '흰색', css: '#f2f0e6' },
];
const MIX = {
  'R+Y': { id: 'orange', name: '주황', css: '#ff8a3d' },
  'Y+B': { id: 'green', name: '초록', css: '#02c245' },
  'R+B': { id: 'purple', name: '보라', css: '#7e65c1' },
  'R+W': { id: 'pink', name: '분홍', css: '#ff9fb0' },
  'Y+W': { id: 'lemon', name: '연노랑', css: '#fff3a0' },
  'B+W': { id: 'sky', name: '하늘', css: '#8fd8f0' },
};
const TARGETS = ['orange', 'green', 'purple', 'pink'];
const TARGET_NAMES = { orange: '주황', green: '초록', purple: '보라', pink: '분홍' };

function mixOf(a, b) {
  if (!a || !b) return null;
  if (a === b) {
    const r = REAGENTS.find((x) => x.id === a);
    return { id: `same-${a}`, name: r.name, css: r.css };
  }
  return MIX[`${a}+${b}`] || MIX[`${b}+${a}`] || null;
}

export default {
  n: 9,
  place: '중등 과학실 실험대',
  title: '네 가지 저녁빛',
  tagline: '색 혼합',
  intro:
    '과학실 창문은 깨져 있고, 실험대 위에 네 개의 빈 접시와 시약병 네 개가 놓여 있다. 칠판에는 실험 노트가 남아 있다. “오늘 밤의 네 가지 빛 — 주황, 초록, 보라, 분홍. 두 시약씩만 사용할 것.” 혼합표는 절반이 지워져 있다.',
  clue: {
    title: '실험 노트',
    text: '목표 색은 주황·초록·보라·분홍. 두 시약만 섞을 수 있다. 빨강+노랑=주황, 노랑+파랑=초록, 빨강+파랑=보라, 빨강+흰색=분홍.',
  },
  fragment: '섞이면 다른 빛이 되는 액체처럼.',
  hints: [
    '목표 색 네 가지는 주황·초록·보라·분홍입니다. 혼합표의 지워진 칸을 두 색의 조합으로 채워 보세요.',
    '주황 = 빨강+노랑, 초록 = 노랑+파랑, 보라는 빨강+파랑, 분홍은 빨강+흰색입니다. 흰색은 색을 옅게 만듭니다.',
    '정답 — 1번 접시 빨강+노랑, 2번 접시 노랑+파랑, 3번 접시 빨강+파랑, 4번 접시 빨강+흰색.',
  ],
  art: () => `
    <svg viewBox="0 0 360 200" role="img" aria-label="어두운 과학실 실험대의 시약병과 접시">
      <rect width="360" height="200" fill="#0d1526"/>
      <rect x="0" y="140" width="360" height="60" fill="#1b2a3a"/>
      <rect x="0" y="134" width="360" height="8" fill="#3a4a5a"/>
      <g stroke="#0d1526" stroke-width="2">
        <path d="M46 118 l0 -30 l16 0 l0 30 z" fill="#ff614a" opacity="0.85"/>
        <path d="M44 118 l20 0 l-3 10 l-14 0 z" fill="#ff614a"/>
        <path d="M96 118 l0 -34 l16 0 l0 34 z" fill="#ffdc1a" opacity="0.85"/>
        <path d="M94 118 l20 0 l-3 10 l-14 0 z" fill="#ffdc1a"/>
        <path d="M146 118 l0 -26 l16 0 l0 26 z" fill="#0abbee" opacity="0.85"/>
        <path d="M144 118 l20 0 l-3 10 l-14 0 z" fill="#0abbee"/>
        <path d="M196 118 l0 -20 l16 0 l0 20 z" fill="#f2f0e6" opacity="0.9"/>
        <path d="M194 118 l20 0 l-3 10 l-14 0 z" fill="#f2f0e6"/>
      </g>
      <g stroke="#0d1526" stroke-width="2" fill="#0d1526" opacity="0.5">
        <rect x="240" y="112" width="34" height="8" fill="#f2f0e6"/><rect x="288" y="112" width="34" height="8" fill="#f2f0e6"/>
      </g>
      <g fill="#0d1526" font-family="sans-serif" font-size="8" text-anchor="middle">
        <text x="54" y="142">R</text><text x="104" y="142">Y</text><text x="154" y="142">B</text><text x="204" y="142">W</text>
      </g>
      <path d="M240 60 l40 0 l-6 40 l-28 0 z" fill="#0abbee" opacity="0.25" stroke="#0abbee" stroke-width="2"/>
      <path d="M252 60 l0 -16 l16 0 l0 16" fill="none" stroke="#c9b9a0" stroke-width="3"/>
      <path d="M288 60 l40 0 l-6 40 l-28 0 z" fill="#ffdc1a" opacity="0.2" stroke="#ffdc1a" stroke-width="2"/>
      <g fill="#fff8d6"><circle cx="26" cy="22" r="1.2"/><circle cx="330" cy="28" r="1.3"/></g>
    </svg>`,
  mount(root, api) {
    const results = [null, null, null, null];
    let slot = 0;
    let picked = [];

    root.innerHTML = `
      <div class="lab">
        <div class="targets" role="group" aria-label="네 개의 접시">
          ${TARGETS.map((t, i) => `
            <button type="button" class="target-slot" data-slot="${i}" aria-label="${i + 1}번 접시">
              <span class="slot-no">${i + 1}</span>
              <span class="slot-color" data-target="${t}"></span>
              <span class="slot-name">${TARGET_NAMES[t]}</span>
            </button>`).join('')}
        </div>
        <div class="mix-now">
          <span class="mix-label">지금 섞는 접시 <b id="s9-slot">1</b>번</span>
          <span class="mix-cup" id="s9-cup"><i></i><i></i></span>
          <span class="mix-result" id="s9-result">—</span>
        </div>
        <div class="reagents" role="group" aria-label="시약 네 병">
          ${REAGENTS.map((r) => `<button type="button" class="reagent" data-reagent="${r.id}"><i class="flask" data-c="${r.id}"></i><span>${r.name}</span></button>`).join('')}
        </div>
        <div class="board-actions">
          <button type="button" class="btn primary" id="s9-mix">섞기</button>
          <button type="button" class="btn ghost" id="s9-reset">실험대 비우기</button>
        </div>
        <p class="hintline" id="s9-msg">접시를 고르고, 시약 두 개를 골라 ‘섞기’를 누르세요.</p>
      </div>`;

    const msg = root.querySelector('#s9-msg');
    const cup = root.querySelector('#s9-cup');
    const resultEl = root.querySelector('#s9-result');

    function paint() {
      root.querySelectorAll('.target-slot').forEach((el, i) => {
        el.classList.toggle('sel', slot === i);
        el.dataset.result = results[i] ? results[i].id : '';
        el.querySelector('.slot-color').dataset.got = results[i] ? results[i].id : '';
        el.setAttribute('aria-label', `${i + 1}번 접시 — ${results[i] ? `현재 ${results[i].name}` : '비어 있음'}`);
      });
      root.querySelector('#s9-slot').textContent = String(slot + 1);
      cup.innerHTML = picked.map((id) => `<i data-c="${id}"></i>`).join('');
      const m = picked.length === 2 ? mixOf(picked[0], picked[1]) : null;
      resultEl.textContent = picked.length === 2 ? (m ? m.name : '섞이지 않음') : (picked.length ? '한 가지 더' : '—');
      root.querySelectorAll('.reagent').forEach((el) => el.classList.toggle('sel', picked.includes(el.dataset.reagent)));
    }

    root.querySelector('.targets').addEventListener('click', (e) => {
      const btn = e.target.closest('.target-slot');
      if (!btn) return;
      slot = Number(btn.dataset.slot);
      picked = [];
      api.sfx.tap();
      paint();
    });

    root.querySelector('.reagents').addEventListener('click', (e) => {
      const btn = e.target.closest('.reagent');
      if (!btn) return;
      const id = btn.dataset.reagent;
      if (picked.includes(id)) picked = picked.filter((p) => p !== id);
      else if (picked.length < 2) picked.push(id);
      else picked = [picked[1], id];
      api.sfx.tap();
      paint();
    });

    root.querySelector('#s9-mix').addEventListener('click', () => {
      if (picked.length < 2) { api.wrong('시약 두 개를 골라야 합니다.'); return; }
      const m = mixOf(picked[0], picked[1]);
      results[slot] = { id: TARGETS.includes(m?.id) ? m.id : (m?.id || 'none'), name: m?.name || '무색', css: m?.css || '#333' };
      api.sfx.water();
      paint();
      msg.textContent = `${slot + 1}번 접시 — ${results[slot].name}`;
      picked = [];
      paint();
      if (results.every((r, i) => r && r.id === TARGETS[i])) {
        msg.textContent = '네 접시가 모두 목표한 저녁빛이 되었습니다.';
        setTimeout(() => api.solve(), 300);
      }
    });

    root.querySelector('#s9-reset').addEventListener('click', () => {
      results.fill(null);
      picked = [];
      slot = 0;
      paint();
      msg.textContent = '실험대를 비웠습니다.';
      api.sfx.tap();
    });

    paint();
  },
};
