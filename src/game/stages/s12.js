// STAGE 12 · ALTSIS 서버실 — 논리 게이트·이진 스위치 퍼즐
const SWITCHES = [
  { id: 'A', label: 'A · 입학', start: false },
  { id: 'B', label: 'B · 평가', start: true },
  { id: 'C', label: 'C · 기록', start: true },
  { id: 'D', label: 'D · 소통', start: true },
];
const TARGET = [1, 0, 1, 1]; // L1 켜짐, L2 꺼짐, L3 켜짐, L4 켜짐

function lamps(v) {
  return [
    v.A && v.B ? 1 : 0,
    v.C || v.D ? 1 : 0,
    v.A !== v.C ? 1 : 0,
    !(v.B && v.D) ? 1 : 0,
  ];
}

export default {
  n: 12,
  place: 'ALTSIS 서버실',
  title: '네 개의 스위치',
  tagline: '논리 게이트',
  intro:
    '별드림관 지하의 ALTSIS 서버실은 비상 전원으로 돌아가고 있다. 서버 랙 앞에는 네 개의 이진 스위치와 네 개의 상태 등이 있다. 벽면 도면에는 게이트가 그려져 있고, 옆에는 “네 등이 목표 배열이 되면 서버실 문이 열린다”는 문구가 있다. 서버는 조용히 마을의 기록을 지키고 있다.',
  clue: {
    title: '서버실 도면',
    text: 'L1 = A AND B, L2 = C OR D, L3 = A XOR C, L4 = NOT (B AND D). 목표 배열은 L1 켜짐 · L2 꺼짐 · L3 켜짐 · L4 켜짐 → A 켜짐, B 켜짐, C 꺼짐, D 꺼짐.',
  },
  fragment: '서버가 조용히 기억을 지키는 밤.',
  hints: [
    'AND는 둘 다 켜져야 켜지고, OR는 하나만 켜져도 켜집니다. XOR은 서로 다를 때만, NOT은 반대로 뒤집습니다.',
    'L1이 켜지려면 A와 B가 모두 켜져야 합니다. L2가 꺼지려면 C와 D가 모두 꺼져야 합니다. 그러면 L3은 A와 C가 다르므로 자동으로 켜지고, L4도 만족합니다.',
    '정답 — A 켜짐, B 켜짐, C 꺼짐, D 꺼짐.',
  ],
  art: () => `
    <svg viewBox="0 0 360 200" role="img" aria-label="ALTSIS 서버실의 서버 랙과 스위치">
      <rect width="360" height="200" fill="#0d1526"/>
      <g stroke="#0d1526" stroke-width="2">
        <rect x="26" y="34" width="70" height="132" fill="#1b2440"/>
        <rect x="108" y="34" width="70" height="132" fill="#1b2440"/>
      </g>
      <g fill="#0abbee" opacity="0.85">
        ${[0, 1, 2, 3, 4].map((i) => `<rect x="36" y="${46 + i * 22}" width="50" height="6"/>`).join('')}
        ${[0, 1, 2, 3, 4].map((i) => `<rect x="118" y="${46 + i * 22}" width="50" height="6"/>`).join('')}
      </g>
      <g fill="#02c245">
        ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<circle cx="${40 + i * 7}" cy="${152 - (i % 3) * 4}" r="2"/>`).join('')}
      </g>
      <rect x="196" y="40" width="140" height="126" fill="#141d33" stroke="#0d1526" stroke-width="3"/>
      <g stroke="#7e65c1" stroke-width="2" fill="none">
        <path d="M214 64 l30 0 l0 24 l30 0"/>
        <path d="M214 64 l30 0 l0 -14"/>
        <path d="M214 100 l20 0 l0 26 l30 0"/>
        <path d="M244 88 l20 0 l0 38 l30 0"/>
        <path d="M214 136 l30 0 l0 -10"/>
      </g>
      <g fill="#ffdc1a">
        <rect x="206" y="58" width="12" height="12"/><rect x="272" y="82" width="12" height="12"/>
        <rect x="272" y="120" width="12" height="12"/><rect x="206" y="130" width="12" height="12"/>
      </g>
      <g fill="#ff614a"><circle cx="300" cy="52" r="4"/><circle cx="318" cy="52" r="4"/></g>
      <g fill="#02c245"><circle cx="300" cy="146" r="4"/></g>
      <path d="M186 96 L178 96" stroke="#ffdc1a" stroke-width="3"/>
      <g fill="#fff8d6"><circle cx="86" cy="20" r="1.1"/><circle cx="250" cy="16" r="1.3"/></g>
    </svg>`,
  mount(root, api) {
    const v = { A: SWITCHES[0].start, B: SWITCHES[1].start, C: SWITCHES[2].start, D: SWITCHES[3].start };
    let solved = false;

    root.innerHTML = `
      <div class="server">
        <div class="lamp-target">
          <span class="lt-label">목표 배열</span>
          ${TARGET.map((t, i) => `<span class="lt-lamp${t ? ' on' : ''}">L${i + 1}</span>`).join('')}
        </div>
        <div class="switch-row" role="group" aria-label="네 개의 스위치">
          ${SWITCHES.map((s) => `
            <button type="button" class="switch" data-sw="${s.id}" aria-pressed="${v[s.id]}">
              <span class="switch-name">${s.id}</span>
              <span class="switch-track"><span class="switch-knob"></span></span>
              <small>${s.label.split(' · ')[1]}</small>
            </button>`).join('')}
        </div>
        <div class="lamp-line" aria-live="polite">
          ${[1, 2, 3, 4].map((i) => `<span class="lamp-big" data-lamp="${i - 1}">L${i}</span>`).join('')}
        </div>
        <div class="gate-note" id="s12-note">·</div>
        <p class="hintline" id="s12-msg">스위치를 바꾸면 등이 즉시 바뀝니다.</p>
      </div>`;

    const msg = root.querySelector('#s12-msg');

    function paint() {
      const out = lamps(v);
      root.querySelectorAll('.switch').forEach((el) => {
        const on = v[el.dataset.sw];
        el.classList.toggle('on', on);
        el.setAttribute('aria-pressed', String(on));
      });
      root.querySelectorAll('.lamp-big').forEach((el, i) => {
        el.classList.toggle('on', !!out[i]);
        el.textContent = `L${i + 1}`;
      });
      if (!solved && out.every((x, i) => x === TARGET[i])) {
        solved = true;
        msg.textContent = '네 등이 목표 배열에 맞춰졌습니다. 서버실 문이 열립니다.';
        api.sfx.unlock();
        setTimeout(() => api.solve(), 400);
      }
      return out;
    }

    root.querySelector('.switch-row').addEventListener('click', (e) => {
      const btn = e.target.closest('.switch');
      if (!btn) return;
      const id = btn.dataset.sw;
      v[id] = !v[id];
      api.sfx.tap();
      paint();
    });

    paint();
  },
};
