// STAGE 10 · 고등부 기숙사 사감실 — 조명 토글 매트릭스 퍼즐
const SIZE = 4;
const SCRAMBLE = [[0, 0], [1, 1], [2, 2], [3, 3]]; // 정답과 같은 네 모서리

export default {
  n: 10,
  place: '고등부 기숙사 사감실',
  title: '대각선의 불',
  tagline: '조명 토글',
  intro:
    '별드림관 2층 사감실. 벽면에는 기숙사 복도 조명을 켜고 끄는 작은 스위치 판이 있다. 정전 뒤 복도 등이 반쯤만 켜져 있고, 판 옆에는 사감 선생님의 메모가 붙어 있다. “한 칸을 누르면 그 칸과 위아래옆이 함께 바뀐다. 모든 등이 켜지면 사감실 문이 열린다.”',
  clue: {
    title: '사감실 스위치 판',
    text: '한 칸을 누르면 그 칸과 상하좌우가 함께 켜지거나 꺼진다. 지금은 대각선 네 칸만 꺼져 있다. 그 네 칸을 차례로 누르면 모두 켜진다.'
  },
  fragment: '어두운 방에서 서로의 얼굴을 확인하는 일.',
  hints: [
    '한 곳을 누르면 그 자리와 상하좌우가 함께 바뀝니다. 같은 곳을 두 번 누르면 원래대로 돌아옵니다.',
    '지금 꺼진 등은 대각선 네 칸뿐입니다. 한 칸을 누르면 그 옆 칸들이 함께 바뀌지만, 네 칸을 모두 누르고 나면 정확히 처음과 반대가 됩니다.',
    '정답 — 1행 1열, 2행 2열, 3행 3열, 4행 4열(대각선 네 칸)을 차례로 누르세요.',
  ],
  art: () => `
    <svg viewBox="0 0 360 200" role="img" aria-label="기숙사 복도의 조명 스위치 판">
      <rect width="360" height="200" fill="#0d1526"/>
      <rect x="24" y="28" width="312" height="144" fill="#1b2440" stroke="#0d1526" stroke-width="3"/>
      <g stroke="#0d1526" stroke-width="3">
        ${[0, 1, 2, 3].map((r) => [0, 1, 2, 3].map((c) => {
          const on = r !== c;
          return `<rect x="${58 + c * 56}" y="${46 + r * 30}" width="40" height="20" fill="${on ? '#ffdc1a' : '#2b3550'}"/>`;
        }).join('')).join('')}
      </g>
      <rect x="300" y="40" width="26" height="36" fill="#f2eee2" stroke="#0d1526" stroke-width="2"/>
      <g fill="#3a2c2a"><rect x="304" y="46" width="18" height="2.5"/><rect x="304" y="52" width="14" height="2.5"/><rect x="304" y="58" width="16" height="2.5"/><rect x="304" y="64" width="10" height="2.5"/></g>
      <g fill="#fff8d6"><circle cx="316" cy="14" r="1.2"/><circle cx="40" cy="14" r="1"/></g>
    </svg>`,
  mount(root, api) {
    const lit = Array.from({ length: SIZE * SIZE }, () => true);
    const idx = (x, y) => y * SIZE + x;
    const toggle = (x, y) => {
      for (const [dx, dy] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < SIZE && ny < SIZE) lit[idx(nx, ny)] = !lit[idx(nx, ny)];
      }
    };
    for (const [x, y] of SCRAMBLE) toggle(x, y);

    root.innerHTML = `
      <div class="lights-wrap">
        <div class="light-board" role="group" aria-label="4 곱하기 4 조명 스위치"></div>
        <div class="board-actions">
          <button type="button" class="btn ghost" id="s10-reset">처음 상태로</button>
        </div>
        <p class="hintline" id="s10-msg">모든 등이 켜지면 사감실 문이 열립니다.</p>
        <div class="light-legend"><span class="lamp on"></span> 켜짐 <span class="lamp off"></span> 꺼짐</div>
      </div>`;

    const board = root.querySelector('.light-board');
    const msg = root.querySelector('#s10-msg');

    function paint() {
      board.innerHTML = Array.from({ length: SIZE * SIZE }, (_, i) => {
        const x = i % SIZE, y = Math.floor(i / SIZE);
        return `<button type="button" class="light${lit[i] ? ' on' : ' off'}" data-light="${i}"
          aria-label="${y + 1}행 ${x + 1}열 ${lit[i] ? '켜짐' : '꺼짐'}" aria-pressed="${lit[i]}"><span></span></button>`;
      }).join('');
      const onCount = lit.filter(Boolean).length;
      root.querySelector('.light-board').dataset.on = String(onCount);
      return onCount === SIZE * SIZE;
    }

    board.addEventListener('click', (e) => {
      const btn = e.target.closest('.light');
      if (!btn) return;
      const i = Number(btn.dataset.light);
      toggle(i % SIZE, Math.floor(i / SIZE));
      api.sfx.light();
      const allOn = paint();
      const onCount = lit.filter(Boolean).length;
      msg.textContent = allOn ? '복도의 모든 등이 켜졌습니다.' : `켜진 등 ${onCount} / 16`;
      if (allOn) setTimeout(() => api.solve(), 300);
    });

    root.querySelector('#s10-reset').addEventListener('click', () => {
      lit.fill(true);
      for (const [x, y] of SCRAMBLE) toggle(x, y);
      paint();
      msg.textContent = '스위치 판을 처음 상태로 되돌렸습니다.';
      api.sfx.tap();
    });

    paint();
  },
};
