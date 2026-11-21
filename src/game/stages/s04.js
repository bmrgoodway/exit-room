// STAGE 4 · 노작 텃밭과 햇빛 온실 — 관 회전 연결 퍼즐
const COLS = 6;
const ROWS = 5;
const N = 1, E = 2, S = 4, W = 8;
// 정답 물길: A3 → A4 → B4 → C4 → C3 → D3 → D2 → E2 → F2 → F3
const PATH = [
  [0, 2, W | S], [0, 3, N | E], [1, 3, W | E], [2, 3, N | W], [2, 2, S | E],
  [3, 2, W | N], [3, 1, S | E], [4, 1, W | E], [5, 1, S | W], [5, 2, N | E],
];
const DECOY = [5, 10, 3, 7, 15, 6, 12, 9, 5, 3, 10, 6, 12, 9, 5, 3, 15, 10, 6, 12];

function cw(mask) {
  return ((mask << 1) & 15) | (mask >> 3);
}

export default {
  n: 4,
  place: '노작 텃밭 · 햇빛 온실',
  title: '마른 흙에 물길을',
  tagline: '관 회전',
  intro:
    '텃밭을 지나 온실로 들어서자 유리벽 너머로 별이 보인다. 정전으로 물 펌프가 멈췄고, 온실의 관이 모두 제멋대로 돌아가 있다. 수원은 왼쪽 아래, 물통은 오른쪽 아래. 관을 90도씩 돌려 물길을 이어야 텃밭의 새싹이 밤을 넘긴다.',
  clue: {
    title: '온실 배관도',
    text: '물길은 A3에서 남쪽으로 내려가 A4, B4, C4를 지나 C3에서 북쪽으로 꺾인다. D3에서 D2로 올라가 E2, F2를 지나 F3의 물통으로 떨어진다.',
  },
  fragment: '마른 흙에 물길을 내는 손.',
  hints: [
    '관을 누르면 시계방향으로 90도씩 돌아갑니다. 수원(왼쪽 3행)에서 물이 들어오는 첫 관부터 맞추세요.',
    '물길은 지그재그입니다. A3은 서쪽(수원)과 남쪽이 열려야 하고, A4와 B4는 남북이 아니라 동서로 이어집니다. C4에서 위로 꺾입니다.',
    '정답 경로 — A3 → A4 → B4 → C4 → C3 → D3 → D2 → E2 → F2 → F3. 모두 10칸이며, 꺾이는 곳은 A3·A4·C4·C3·D3·D2·F2·F3입니다.',
  ],
  art: () => `
    <svg viewBox="0 0 360 200" role="img" aria-label="별이 보이는 유리 온실과 물길">
      <rect width="360" height="200" fill="#0d1526"/>
      <g fill="#fff8d6"><circle cx="48" cy="26" r="1.4"/><circle cx="120" cy="18" r="1"/><circle cx="210" cy="24" r="1.6"/><circle cx="300" cy="16" r="1.2"/><circle cx="336" cy="40" r="1"/></g>
      <path d="M40 150 L40 84 L180 36 L320 84 L320 150 Z" fill="#0abbee" opacity="0.1"/>
      <g stroke="#0abbee" stroke-width="2" fill="none" opacity="0.8">
        <path d="M40 150 L40 84 L180 36 L320 84 L320 150"/>
        <path d="M110 60 L110 150 M180 36 L180 150 M250 60 L250 150"/>
        <path d="M40 110 L320 110"/>
      </g>
      <rect x="26" y="150" width="308" height="14" fill="#2a3a2a" stroke="#0d1526" stroke-width="2"/>
      <g stroke="#02c245" stroke-width="3" fill="none">
        <path d="M84 150 q0 -18 10 -26"/><path d="M150 150 q0 -22 -12 -30"/><path d="M230 150 q0 -18 12 -26"/><path d="M292 150 q0 -20 -8 -28"/>
      </g>
      <g fill="#02c245"><circle cx="94" cy="122" r="4"/><circle cx="138" cy="118" r="4"/><circle cx="242" cy="122" r="4"/><circle cx="284" cy="120" r="4"/></g>
      <g stroke="#0abbee" stroke-width="5" fill="none" opacity="0.85">
        <path d="M56 166 L56 182 L150 182 L150 168"/>
        <path d="M206 168 L206 182 L300 182 L300 166"/>
      </g>
      <circle cx="56" cy="166" r="5" fill="#0abbee" stroke="#0d1526" stroke-width="2"/>
      <rect x="294" y="158" width="16" height="12" fill="#0abbee" stroke="#0d1526" stroke-width="2"/>
    </svg>`,
  mount(root, api) {
    // 셀 구성: 정답 물길 + 장식용 관
    const cells = Array.from({ length: COLS * ROWS }, (_, i) => {
      const x = i % COLS, y = Math.floor(i / COLS);
      const onPath = PATH.find(([px, py]) => px === x && py === y);
      if (onPath) return { x, y, mask: onPath[2], start: onPath[2], wet: false, path: true };
      return { x, y, mask: DECOY[(x * 3 + y * 5) % DECOY.length], start: 0, wet: false, path: false };
    });
    const at = (x, y) => cells[y * COLS + x];

    // 처음 상태: 정답 칸을 모두 한두 칸 돌려 둔다 (아직 물이 통하지 않게)
    for (const c of cells) {
      if (c.path) {
        const turns = ((c.x + c.y * 2) % 3) + 1;
        for (let i = 0; i < turns; i += 1) c.mask = cw(c.mask);
      } else {
        const turns = (c.x * 2 + c.y) % 4;
        for (let i = 0; i < turns; i += 1) c.mask = cw(c.mask);
      }
    }

    root.innerHTML = `
      <div class="pipe-wrap">
        <div class="pipe-legend"><span class="legend-drop">수원</span> → <span class="legend-tank">물통</span> · 관을 누르면 90° 회전</div>
        <div class="pipe-grid" role="group" aria-label="온실 관 퍼즐"></div>
        <div class="board-actions">
          <button type="button" class="btn ghost" id="s4-reset">배관 처음대로</button>
        </div>
        <p class="hintline" id="s4-msg">왼쪽 3행의 수원에서 물이 들어옵니다.</p>
      </div>`;

    const grid = root.querySelector('.pipe-grid');
    grid.style.setProperty('--cols', String(COLS));
    const msg = root.querySelector('#s4-msg');

    function flow() {
      for (const c of cells) c.wet = false;
      const seen = new Set();
      const q = [];
      const start = at(0, 2);
      if (start.mask & W) { start.wet = true; q.push(start); seen.add(start); }
      while (q.length) {
        const c = q.shift();
        const links = [
          [c.mask & N, 0, -1, S], [c.mask & E, 1, 0, W], [c.mask & S, 0, 1, N], [c.mask & W, -1, 0, E],
        ];
        for (const [open, dx, dy, back] of links) {
          if (!open) continue;
          const nx = c.x + dx, ny = c.y + dy;
          if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) continue;
          const nb = at(nx, ny);
          if (!(nb.mask & back) || seen.has(nb)) continue;
          nb.wet = true;
          seen.add(nb);
          q.push(nb);
        }
      }
      const sink = at(COLS - 1, 2);
      return sink.wet && !!(sink.mask & E);
    }

    function paint() {
      grid.innerHTML = cells.map((c) => {
        const cls = `pipe-cell${c.wet ? ' wet' : ''}`;
        const seg = [N, E, S, W].filter((b) => c.mask & b).map((b) => {
          const to = b === N ? '20,0' : b === E ? '40,20' : b === S ? '20,40' : '0,20';
          return `<line x1="20" y1="20" x2="${to.split(',')[0]}" y2="${to.split(',')[1]}"/>`;
        }).join('');
        return `<button type="button" class="${cls}" data-cell="${c.x},${c.y}" data-mask="${c.mask}" aria-label="${c.x + 1}열 ${c.y + 1}행 관 돌리기">
          <svg viewBox="0 0 40 40" aria-hidden="true">
            <rect width="40" height="40" fill="none"/>
            <g class="pipe-line">${seg}</g>
            <circle cx="20" cy="20" r="5" class="pipe-hub"/>
          </svg>
        </button>`;
      }).join('');
      root.querySelector('.pipe-grid').classList.toggle('flowing', flow());
    }

    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('.pipe-cell');
      if (!btn) return;
      const [x, y] = btn.dataset.cell.split(',').map(Number);
      const c = at(x, y);
      c.mask = cw(c.mask);
      api.sfx.tap();
      paint();
      if (flow()) {
        msg.textContent = '물이 온실 끝 물통까지 이어졌습니다. 텃밭의 새싹이 고개를 듭니다.';
        api.sfx.water();
        setTimeout(() => api.solve(), 350);
      } else {
        const wetCount = cells.filter((c2) => c2.wet).length;
        msg.textContent = wetCount > 1 ? `물이 ${wetCount}칸까지 흘렀습니다.` : '아직 물이 흐르지 않습니다.';
      }
    });

    root.querySelector('#s4-reset').addEventListener('click', () => {
      for (const c of cells) {
        c.mask = c.start;
        if (c.path) {
          const turns = ((c.x + c.y * 2) % 3) + 1;
          for (let i = 0; i < turns; i += 1) c.mask = cw(c.mask);
        } else {
          const turns = (c.x * 2 + c.y) % 4;
          for (let i = 0; i < turns; i += 1) c.mask = cw(c.mask);
        }
      }
      paint();
      msg.textContent = '배관을 처음 상태로 되돌렸습니다.';
      api.sfx.tap();
    });

    paint();
    // 시작 상태가 이미 연결되어 있으면(이론상 없음) 한 칸 돌려 깨뜨린다
    if (flow()) {
      at(0, 2).mask = cw(at(0, 2).mask);
      paint();
    }
  },
};
