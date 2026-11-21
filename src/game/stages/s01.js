// STAGE 1 · 별무리마을 입구 표지판 — 방향·거리 조합 퍼즐
const PLACES = [
  { id: 'school', name: '별무리학교', short: '학교', color: 'var(--cyan)', cell: [2, 1] },
  { id: 'church', name: '별무리교회', short: '교회', color: 'var(--yellow)', cell: [0, 1] },
  { id: 'cafe', name: '이든 카페', short: '카페', color: 'var(--coral)', cell: [0, 2] },
  { id: 'dream', name: '별드림관', short: '별드림관', color: 'var(--purple)', cell: [3, 1] },
];

export default {
  n: 1,
  place: '마을 입구 · 신동리',
  title: '세 갈래 표지판',
  tagline: '방향과 거리',
  intro:
    '밤 11시 47분, 별무리 마을의 가로등이 한꺼번에 꺼졌다. 손전등을 켜자 입구 표지판 위에 낯선 봉인이 붙어 있다. “비전 2020의 기억을 따라라. 첫 번째 문은 네 갈래 길에서 열린다.” 화살표는 모두 헛돌고, 이정표에는 네 곳의 이름만 남아 있다. 한 블록은 300미터. 표지판을 바로 세워야 길이 열린다.',
  clue: {
    title: '표지판의 네 방향',
    text: '입구에서 북쪽 한 블록이 학교, 학교에서 서쪽 두 블록이 교회, 교회에서 남쪽 한 블록이 이든 카페, 학교에서 동쪽 한 블록이 별드림관. 한 블록은 300미터.',
  },
  fragment: '정전이 내려도 사라지지 않는 것이 있습니다.',
  hints: [
    '모든 방향은 가운데 ‘마을 입구’에서 이어집니다. 단서를 읽는 순서대로 손가락으로 칸을 세어 보세요.',
    '학교는 입구에서 북쪽 1칸. 교회는 학교에서 서쪽 2칸, 카페는 교회에서 남쪽 1칸, 별드림관은 학교에서 동쪽 1칸.',
    '정답 — 입구 바로 위 칸이 학교, 학교에서 왼쪽 두 칸이 교회, 교회 바로 아래 칸이 카페, 학교에서 오른쪽 한 칸이 별드림관.',
  ],
  art: () => `
    <svg viewBox="0 0 360 200" role="img" aria-label="별이 뜬 밤, 별무리 마을 입구의 이정표">
      <rect width="360" height="200" fill="#0d1526"/>
      <circle cx="300" cy="38" r="15" fill="#fff8d6"/>
      <circle cx="294" cy="33" r="13" fill="#0d1526"/>
      <g fill="#ffdc1a">
        <circle cx="40" cy="26" r="1.6"/><circle cx="84" cy="44" r="1.2"/><circle cx="132" cy="20" r="1.4"/>
        <circle cx="196" cy="34" r="1.1"/><circle cx="238" cy="18" r="1.7"/><circle cx="330" cy="70" r="1.2"/>
        <circle cx="66" cy="70" r="1"/><circle cx="160" cy="58" r="1.3"/>
      </g>
      <path d="M0 150 L30 132 L58 150 L88 128 L120 150 L150 134 L182 150 L214 130 L248 150 L280 133 L312 150 L360 136 L360 200 L0 200 Z" fill="#121c33"/>
      <g fill="#243252">
        <rect x="26" y="140" width="26" height="20"/><rect x="62" y="144" width="20" height="16"/>
        <rect x="120" y="138" width="30" height="22"/><rect x="206" y="142" width="24" height="18"/>
        <rect x="262" y="140" width="30" height="20"/><rect x="308" y="144" width="22" height="16"/>
      </g>
      <g fill="#ffdc1a" opacity="0.85">
        <rect x="36" y="148" width="5" height="6"/><rect x="128" y="146" width="5" height="6"/>
        <rect x="214" y="150" width="5" height="6"/><rect x="272" y="148" width="5" height="6"/>
      </g>
      <rect x="174" y="86" width="10" height="90" fill="#8a6b45" stroke="#0d1526" stroke-width="2"/>
      <g stroke="#0d1526" stroke-width="3">
        <path d="M120 96 L184 96 L184 78 L120 78 Z" fill="#0abbee"/>
        <path d="M184 112 L248 112 L248 94 L184 94 Z" fill="#ff614a"/>
        <path d="M130 130 L184 130 L184 112 L130 112 Z" fill="#ffdc1a"/>
      </g>
      <g fill="#0d1526" font-family="sans-serif" font-weight="700" font-size="11" text-anchor="middle">
        <text x="152" y="90">학교 →</text>
        <text x="216" y="106">← 카페</text>
        <text x="157" y="124">교회</text>
      </g>
      <rect x="166" y="70" width="26" height="10" fill="#7e65c1" stroke="#0d1526" stroke-width="2"/>
      <path d="M170 70 l8 -12 l8 12 z" fill="#ffdc1a" stroke="#0d1526" stroke-width="2"/>
    </svg>`,
  mount(root, api) {
    const size = 5;
    let selected = null;
    const placed = new Map(); // "x,y" -> place id
    const byId = Object.fromEntries(PLACES.map((p) => [p.id, p]));

    root.innerHTML = `
      <div class="board">
        <div class="board-head">
          <span class="board-title">마을 지도 · 5 × 5 블록</span>
          <span class="board-sub">가운데가 입구, 한 칸이 300m</span>
        </div>
        <div class="compass-row"><span>북 ↑</span><span>서 ← · → 동</span><span>남 ↓</span></div>
        <div class="grid5" role="grid" aria-label="5 곱하기 5 마을 지도">
          ${Array.from({ length: size * size }, (_, i) => {
            const x = i % size, y = Math.floor(i / size);
            const here = x === 2 && y === 2;
            return `<button type="button" class="gcell${here ? ' here' : ''}" data-cell="${x},${y}" role="gridcell"
              aria-label="${x + 1}열 ${y + 1}행${here ? ' 마을 입구' : ''}">
              <span class="gcell-tag">${here ? '마을 입구' : ''}</span>
            </button>`;
          }).join('')}
        </div>
        <div class="chipbar" role="group" aria-label="놓을 장소 고르기">
          ${PLACES.map((p) => `<button type="button" class="place-chip" data-place="${p.id}"><i class="dot" data-c="${p.id}"></i>${p.short}</button>`).join('')}
        </div>
        <div class="board-actions">
          <button type="button" class="btn primary" id="s1-check">표지판 바로 세우기</button>
          <button type="button" class="btn ghost" id="s1-clear">놓은 것 지우기</button>
        </div>
        <p class="hintline" id="s1-msg">장소를 고르고 지도 칸을 누르세요. 놓은 칸을 다시 누르면 회수됩니다.</p>
      </div>
      <div class="clue-list">
        ${[
          '입구에서 북쪽으로 한 블록, 담장 너머에 학교 정문이 있다.',
          '학교에서 서쪽으로 두 블록 걸으면 교회 종탑이 보인다.',
          '교회에서 남쪽으로 한 블록, 골목 끝이 이든 카페다.',
          '학교에서 동쪽으로 한 블록, 별드림관의 옥상이 보인다.',
        ].map((t, i) => `<p class="clue-line"><b>${i + 1}</b>${t}</p>`).join('')}
      </div>`;

    const grid = root.querySelector('.grid5');
    const msg = root.querySelector('#s1-msg');

    function paint() {
      for (const cell of grid.querySelectorAll('.gcell')) {
        const key = cell.dataset.cell;
        const id = placed.get(key);
        const old = cell.querySelector('.gcell-place');
        if (old) old.remove();
        cell.classList.toggle('filled', !!id);
        if (id) {
          const p = byId[id];
          const tag = document.createElement('span');
          tag.className = 'gcell-place';
          tag.dataset.c = id;
          tag.textContent = p.short;
          cell.appendChild(tag);
        }
      }
      for (const chip of root.querySelectorAll('.place-chip')) {
        chip.classList.toggle('sel', chip.dataset.place === selected);
        chip.disabled = [...placed.values()].includes(chip.dataset.place);
      }
    }

    grid.addEventListener('click', (e) => {
      const cell = e.target.closest('.gcell');
      if (!cell) return;
      const key = cell.dataset.cell;
      if (placed.has(key)) {
        placed.delete(key);
        api.sfx.tap();
        paint();
        return;
      }
      if (!selected) { msg.textContent = '먼저 아래에서 놓을 장소를 고르세요.'; api.sfx.tap(); return; }
      for (const [k, v] of placed) if (v === selected) placed.delete(k);
      placed.set(key, selected);
      selected = null;
      api.sfx.click();
      msg.textContent = '한 곳 더 놓아 보세요.';
      paint();
    });

    root.querySelector('.chipbar').addEventListener('click', (e) => {
      const chip = e.target.closest('.place-chip');
      if (!chip || chip.disabled) return;
      selected = selected === chip.dataset.place ? null : chip.dataset.place;
      api.sfx.tap();
      paint();
    });

    root.querySelector('#s1-clear').addEventListener('click', () => {
      placed.clear();
      selected = null;
      paint();
      api.sfx.tap();
      msg.textContent = '지도를 비웠습니다.';
    });

    root.querySelector('#s1-check').addEventListener('click', () => {
      if (placed.size < 4) {
        api.wrong('네 곳을 모두 지도에 놓아야 표지판이 돌아갑니다.');
        return;
      }
      let right = 0;
      for (const p of PLACES) {
        const [x, y] = p.cell;
        if (placed.get(`${x},${y}`) === p.id) right += 1;
      }
      if (right === 4) {
        msg.textContent = '표지판이 덜컥 돌아가며 네 방향이 정렬되었습니다.';
        api.solve();
      } else {
        api.wrong(`네 곳 중 ${right}곳이 맞습니다. 표지판이 삐걱거립니다.`);
      }
    });

    paint();
  },
};
