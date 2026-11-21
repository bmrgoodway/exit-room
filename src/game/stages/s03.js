// STAGE 3 · 별무리교회 예배당 종탑 — Web Audio 음계 순서 퍼즐
const BELLS = [
  { id: 'do', name: '도', freq: 261.63, color: '#ffdc1a' },
  { id: 're', name: '레', freq: 293.66, color: '#ff614a' },
  { id: 'mi', name: '미', freq: 329.63, color: '#02c245' },
  { id: 'pa', name: '파', freq: 349.23, color: '#0abbee' },
  { id: 'sol', name: '솔', freq: 392.0, color: '#7e65c1' },
  { id: 'ra', name: '라', freq: 440.0, color: '#f2f0e6' },
];
const SEQUENCE = ['mi', 'sol', 'ra', 'sol', 'mi', 're', 'do'];

export default {
  n: 3,
  place: '별무리교회 종탑',
  title: '일곱 조각의 저녁 종',
  tagline: '음계 순서',
  intro:
    '교회 예배당의 문은 잠겨 있었지만 종탑 계단은 열려 있었다. 종탑 꼭대기, 스테인드글라스 창이 달빛을 받아 일곱 조각으로 빛난다. 종을 매다는 밧줄에는 “저녁 예배를 부르던 그 순서대로”라는 쪽지가 매달려 있다. 종은 여섯 개, 조각은 일곱 개다.',
  clue: {
    title: '스테인드글라스의 일곱 조각',
    text: '왼쪽부터 미 · 솔 · 라 · 솔 · 미 · 레 · 도. 같은 음이 두 번 울리는 자리가 있다.',
  },
  fragment: '종소리가 끝난 자리에 남는 여운.',
  hints: [
    '창문 조각은 왼쪽에서 오른쪽으로 울리는 순서입니다. 조각의 색과 같은 색의 종을 누르면 됩니다.',
    '첫 세 조각은 미 → 솔 → 라. 그다음은 다시 낮아지며 솔 → 미 → 레 → 도로 내려옵니다.',
    '정답 순서 — 미, 솔, 라, 솔, 미, 레, 도. (초록 → 보라 → 흰색 → 보라 → 초록 → 빨강 → 노랑)',
  ],
  art: () => `
    <svg viewBox="0 0 360 200" role="img" aria-label="달빛을 받은 종탑의 스테인드글라스 창과 종">
      <rect width="360" height="200" fill="#0d1526"/>
      <g fill="#ffdc1a"><circle cx="30" cy="20" r="1.3"/><circle cx="322" cy="26" r="1.5"/><circle cx="70" cy="12" r="1"/></g>
      <path d="M120 200 L120 82 L180 34 L240 82 L240 200 Z" fill="#1a2440" stroke="#0d1526" stroke-width="3"/>
      <path d="M180 34 L180 12" stroke="#8a6b45" stroke-width="4"/>
      <path d="M166 12 L194 12" stroke="#8a6b45" stroke-width="4"/>
      <path d="M144 96 Q180 62 216 96 L216 150 L144 150 Z" fill="#0abbee" opacity="0.18" stroke="#ffdc1a" stroke-width="2"/>
      <g stroke="#0d1526" stroke-width="1.6">
        <rect x="150" y="104" width="10" height="16" fill="#02c245"/>
        <rect x="163" y="98" width="10" height="16" fill="#7e65c1"/>
        <rect x="176" y="92" width="10" height="16" fill="#f2f0e6"/>
        <rect x="189" y="98" width="10" height="16" fill="#7e65c1"/>
        <rect x="202" y="104" width="10" height="16" fill="#02c245"/>
        <rect x="161" y="120" width="10" height="16" fill="#ff614a"/>
        <rect x="190" y="120" width="10" height="16" fill="#ffdc1a"/>
      </g>
      <g stroke="#0d1526" stroke-width="2.4">
        <path d="M168 158 q12 -10 24 0" fill="none" stroke="#ffdc1a"/>
        <path d="M163 168 l34 0 l-5 12 l-24 0 z" fill="#ffdc1a"/>
        <path d="M180 180 l0 8" stroke="#ffdc1a"/>
      </g>
      <g fill="#141d33" stroke="#0d1526" stroke-width="2">
        <rect x="16" y="150" width="70" height="50"/><rect x="274" y="142" width="74" height="58"/>
      </g>
      <g fill="#ffdc1a" opacity="0.7"><rect x="34" y="162" width="10" height="12"/><rect x="296" y="156" width="10" height="12"/></g>
    </svg>`,
  mount(root, api) {
    let input = [];
    const byId = Object.fromEntries(BELLS.map((b) => [b.id, b]));

    root.innerHTML = `
      <div class="tower">
        <div class="panes" role="img" aria-label="왼쪽부터 미, 솔, 라, 솔, 미, 레, 도">
          ${SEQUENCE.map((id, i) => `<span class="pane" data-note="${byId[id].name}" data-c="${id}"><b>${i + 1}</b></span>`).join('')}
        </div>
        <div class="bell-row" role="group" aria-label="여섯 개의 종">
          ${BELLS.map((b) => `
            <button type="button" class="bell" data-bell="${b.id}" aria-label="${b.name} 음 종">
              <span class="bell-body" data-c="${b.id}"></span>
              <span class="bell-name">${b.name}</span>
            </button>`).join('')}
        </div>
        <div class="melody" id="s3-melody" aria-live="polite">
          <span class="melody-label">지금 울린 순서</span>
          <span class="melody-notes" id="s3-notes">—</span>
        </div>
        <p class="hintline" id="s3-msg">조각의 색과 같은 종을, 왼쪽 조각부터 차례로 울리세요.</p>
        <div class="board-actions">
          <button type="button" class="btn ghost" id="s3-reset">처음부터</button>
        </div>
      </div>`;

    const notes = root.querySelector('#s3-notes');
    const msg = root.querySelector('#s3-msg');

    function paint() {
      notes.textContent = input.length ? input.map((id) => byId[id].name).join(' · ') : '—';
      root.querySelectorAll('.pane').forEach((p, i) => p.classList.toggle('ring', i < input.length));
    }

    root.querySelector('.bell-row').addEventListener('click', (e) => {
      const btn = e.target.closest('.bell');
      if (!btn) return;
      const id = btn.dataset.bell;
      api.sfx.bell(byId[id].freq);
      btn.classList.remove('struck');
      void btn.offsetWidth;
      btn.classList.add('struck');

      if (id !== SEQUENCE[input.length]) {
        input = [];
        paint();
        msg.textContent = '종소리가 어긋났습니다. 첫 조각부터 다시.';
        api.wrong('어긋난 종소리가 종탑에 울려 퍼집니다.', false);
        return;
      }
      input.push(id);
      paint();
      if (input.length === SEQUENCE.length) {
        msg.textContent = '일곱 조각이 하나의 저녁 종소리로 이어졌습니다.';
        api.solve();
      }
    });

    root.querySelector('#s3-reset').addEventListener('click', () => {
      input = [];
      paint();
      msg.textContent = '조각을 처음부터 다시 읽습니다.';
      api.sfx.tap();
    });

    paint();
  },
};
