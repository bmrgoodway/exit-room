// STAGE 2 · 33채 전원주택 홈스테이 골목 — 집 색·문패 논리 추리
const COLORS = [
  { id: 'red', name: '빨강', css: '#ff614a' },
  { id: 'yellow', name: '노랑', css: '#ffdc1a' },
  { id: 'green', name: '초록', css: '#02c245' },
  { id: 'blue', name: '파랑', css: '#0abbee' },
];
const NAMES = ['조한빛', '김이삭', '신은혜', '강윤민'];
const SOLUTION = [
  { color: 'yellow', name: '신은혜' },
  { color: 'green', name: '김이삭' },
  { color: 'blue', name: '조한빛' },
  { color: 'red', name: '강윤민' },
];

export default {
  n: 2,
  place: '홈스테이 골목',
  title: '서른세 채의 문패',
  tagline: '집 색과 이름',
  intro:
    '골목으로 들어서자 서른세 채의 집이 모두 같은 모양으로 어둠에 잠겨 있다. 그런데 네 집만 현관 등이 켜져 있고, 문패의 이름과 지붕 색이 서로 뒤섞여 있다. 문패를 바로잡아야 다음 골목으로 가는 철문이 열린다. 마을 교사들이 남긴 메모가 우편함에 꽂혀 있다.',
  clue: {
    title: '우편함의 메모',
    text: '조한빛은 파란 집, 파란 집은 빨간 집 바로 왼쪽, 노란 집은 맨 왼쪽. 김이삭은 맨 오른쪽이 아니고, 신은혜는 초록 집 옆, 강윤민은 파란 집 옆.',
  },
  fragment: '문패에 적힌 이름, 문 앞에 놓인 신발.',
  hints: [
    '네 집의 위치를 1·2·3·4라고 두고, 먼저 색부터 확정하세요. 노란 집의 자리가 가장 강한 단서입니다.',
    '노란 집이 1번. 파란 집이 빨간 집 바로 왼쪽이려면 (2,3) 아니면 (3,4)입니다. 두 경우 중 김이삭이 맨 오른쪽이 아니라는 조건을 통과하는 쪽을 고르세요.',
    '정답 — 1번 노랑·신은혜, 2번 초록·김이삭, 3번 파랑·조한빛, 4번 빨강·강윤민.',
  ],
  art: () => `
    <svg viewBox="0 0 360 200" role="img" aria-label="현관 등이 켜진 홈스테이 골목의 네 집">
      <rect width="360" height="200" fill="#0d1526"/>
      <g fill="#ffdc1a"><circle cx="26" cy="24" r="1.4"/><circle cx="96" cy="16" r="1.1"/><circle cx="168" cy="28" r="1.5"/>
        <circle cx="250" cy="18" r="1.2"/><circle cx="318" cy="30" r="1.6"/><circle cx="344" cy="12" r="1"/></g>
      <path d="M0 168 L360 168 L360 200 L0 200 Z" fill="#141d33"/>
      <g stroke="#0d1526" stroke-width="3">
        <path d="M18 120 L58 88 L98 120 Z" fill="#ff614a"/>
        <rect x="24" y="120" width="68" height="48" fill="#f2eee2"/>
        <rect x="44" y="134" width="16" height="18" fill="#ffdc1a"/>
        <path d="M104 116 L144 84 L184 116 Z" fill="#02c245"/>
        <rect x="110" y="116" width="68" height="52" fill="#f2eee2"/>
        <rect x="130" y="132" width="16" height="18" fill="#0abbee"/>
        <path d="M190 124 L230 92 L270 124 Z" fill="#0abbee"/>
        <rect x="196" y="124" width="68" height="44" fill="#f2eee2"/>
        <rect x="216" y="138" width="16" height="16" fill="#ff614a"/>
        <path d="M276 112 L316 80 L356 112 Z" fill="#ffdc1a"/>
        <rect x="282" y="112" width="68" height="56" fill="#f2eee2"/>
        <rect x="302" y="130" width="16" height="18" fill="#02c245"/>
      </g>
      <g fill="#0d1526" font-family="sans-serif" font-size="9" font-weight="700" text-anchor="middle">
        <text x="58" y="164">1</text><text x="144" y="164">2</text><text x="230" y="164">3</text><text x="316" y="164">4</text>
      </g>
      <g fill="#ffdc1a" opacity="0.9">
        <circle cx="58" cy="84" r="3"/><circle cx="144" cy="80" r="3"/><circle cx="230" cy="88" r="3"/><circle cx="316" cy="76" r="3"/>
      </g>
      <ellipse cx="58" cy="170" rx="26" ry="4" fill="#ffdc1a" opacity="0.16"/>
      <ellipse cx="144" cy="170" rx="26" ry="4" fill="#ffdc1a" opacity="0.16"/>
      <ellipse cx="230" cy="170" rx="26" ry="4" fill="#ffdc1a" opacity="0.16"/>
      <ellipse cx="316" cy="170" rx="26" ry="4" fill="#ffdc1a" opacity="0.16"/>
    </svg>`,
  mount(root, api) {
    const houses = [
      { color: 'blue', name: '조한빛' },
      { color: 'red', name: '강윤민' },
      { color: 'yellow', name: '신은혜' },
      { color: 'green', name: '김이삭' },
    ];
    const colorOf = (id) => COLORS.find((c) => c.id === id);

    root.innerHTML = `
      <div class="houses" role="group" aria-label="네 채의 집">
        ${houses.map((_, i) => `
          <div class="house" data-house="${i}">
            <span class="house-no">${i + 1}호</span>
            <button type="button" class="house-roof" data-act="color" data-house="${i}" aria-label="${i + 1}호 지붕 색 바꾸기">
              <span class="roof-shape"></span>
            </button>
            <button type="button" class="house-plate" data-act="name" data-house="${i}" aria-label="${i + 1}호 문패 바꾸기">
              <span class="plate-name"></span><span class="plate-sub">선생님</span>
            </button>
          </div>`).join('')}
      </div>
      <p class="hintline" id="s2-msg">지붕을 누르면 색이, 문패를 누르면 이름이 바뀝니다.</p>
      <div class="board-actions">
        <button type="button" class="btn primary" id="s2-check">문패 바로잡기</button>
        <button type="button" class="btn ghost" id="s2-reset">처음대로</button>
      </div>
      <div class="clue-list">
        ${[
          '조한빛 선생님의 집은 파란색이다.',
          '파란 집은 빨간 집의 바로 왼쪽에 있다.',
          '노란 집은 맨 왼쪽 첫 집이다.',
          '김이삭 선생님의 집은 맨 오른쪽 집이 아니다.',
          '신은혜 선생님의 집은 초록 집과 바로 이웃해 있다.',
          '강윤민 선생님의 집은 파란 집과 바로 이웃해 있다.',
        ].map((t, i) => `<p class="clue-line"><b>${i + 1}</b>${t}</p>`).join('')}
      </div>`;

    const msg = root.querySelector('#s2-msg');

    function paint() {
      houses.forEach((hs, i) => {
        const card = root.querySelector(`.house[data-house="${i}"]`);
        const c = colorOf(hs.color);
        card.dataset.color = hs.color;
        card.querySelector('.plate-name').textContent = hs.name;
        card.querySelector('.roof-shape').dataset.c = hs.color;
        card.querySelector('.house-plate').setAttribute('aria-label', `${i + 1}호 문패 ${hs.name}, 지붕 ${c.name}`);
      });
    }

    root.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-act]');
      if (!btn) return;
      const i = Number(btn.dataset.house);
      if (btn.dataset.act === 'color') {
        const at = COLORS.findIndex((c) => c.id === houses[i].color);
        houses[i].color = COLORS[(at + 1) % COLORS.length].id;
      } else {
        const at = NAMES.indexOf(houses[i].name);
        houses[i].name = NAMES[(at + 1) % NAMES.length];
      }
      api.sfx.tap();
      paint();
    });

    root.querySelector('#s2-reset').addEventListener('click', () => {
      houses[0] = { color: 'blue', name: '조한빛' };
      houses[1] = { color: 'red', name: '강윤민' };
      houses[2] = { color: 'yellow', name: '신은혜' };
      houses[3] = { color: 'green', name: '김이삭' };
      paint();
      msg.textContent = '문패와 지붕을 처음 상태로 되돌렸습니다.';
      api.sfx.tap();
    });

    root.querySelector('#s2-check').addEventListener('click', () => {
      const right = houses.filter((hs, i) => hs.color === SOLUTION[i].color && hs.name === SOLUTION[i].name).length;
      if (right === 4) {
        msg.textContent = '네 집의 현관 등이 같은 색으로 깜빡이고, 골목 철문이 열렸습니다.';
        api.solve();
      } else {
        api.wrong(`네 채 중 ${right}채가 맞습니다. 문패가 아직 어긋나 있습니다.`);
      }
    });

    paint();
  },
};
