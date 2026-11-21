// STAGE 15 · 별드림관 옥상 별자리 전망대 — 별자리 연결 피날레
const STARS = [
  { n: 1, x: 58, y: 70 },
  { n: 2, x: 96, y: 46 },
  { n: 3, x: 132, y: 76 },
  { n: 4, x: 104, y: 108 },
  { n: 5, x: 142, y: 124 },
  { n: 6, x: 176, y: 152 },
  { n: 7, x: 210, y: 136 },
  { n: 8, x: 196, y: 178 },
];
const DECOYS = [
  { x: 36, y: 152 }, { x: 250, y: 60 }, { x: 286, y: 176 }, { x: 238, y: 96 }, { x: 66, y: 186 },
];

export default {
  n: 15,
  place: '별드림관 옥상 · 별자리 전망대',
  title: '별빛 열쇠',
  tagline: '별자리 연결',
  intro:
    '옥상으로 통하는 문이 열리고, 금산의 밤하늘이 쏟아진다. 망원경 옆 난간에 마지막 봉인이 놓여 있다. 여덟 개의 별에 1부터 8까지 숫자가 희미하게 새겨져 있고, 그 사이로 열쇠 모양의 별자리가 점선으로 떠 있다. 숫자 순서대로 별을 이으면, 15개의 봉인이 마지막으로 풀린다.',
  clue: {
    title: '옥상의 마지막 봉인',
    text: '숫자가 새겨진 별 여덟 개를 1→8 순서로 이으면 별빛 열쇠가 완성된다. 작고 흐린 별은 장식이므로 누르면 처음부터 다시 그려야 한다.',
  },
  fragment: '그래서 별무리는 오늘도 여기에 있습니다.',
  hints: [
    '가장 작고 흐린 별은 장식입니다. 숫자가 새겨진 여덟 개의 별만, 1번부터 차례로 누르세요.',
    '1번은 왼쪽 위, 8번은 오른쪽 아래입니다. 별을 이을수록 열쇠의 손잡이와 날이 드러납니다.',
    '정답 — 1(왼쪽 위) → 2 → 3 → 4 → 5 → 6 → 7 → 8 순서. 화면의 별을 왼쪽 위에서 오른쪽 아래로 따라가면 됩니다.',
  ],
  art: () => `
    <svg viewBox="0 0 360 200" role="img" aria-label="별드림관 옥상의 망원경과 밤하늘">
      <rect width="360" height="200" fill="#0b1222"/>
      <g fill="#ffdc1a">
        <circle cx="30" cy="20" r="1.2"/><circle cx="76" cy="34" r="1"/><circle cx="130" cy="16" r="1.4"/>
        <circle cx="200" cy="28" r="1.1"/><circle cx="262" cy="14" r="1.3"/><circle cx="330" cy="30" r="1.5"/>
        <circle cx="300" cy="62" r="1"/><circle cx="44" cy="62" r="1"/>
      </g>
      <circle cx="312" cy="40" r="13" fill="#fff8d6"/>
      <circle cx="306" cy="35" r="12" fill="#0b1222"/>
      <path d="M0 150 L60 122 L120 150 L180 118 L240 150 L300 126 L360 150 L360 200 L0 200 Z" fill="#121a2c"/>
      <g stroke="#0d1526" stroke-width="2" fill="#1b2440">
        <rect x="0" y="150" width="360" height="10"/>
      </g>
      <g stroke="#c9b9a0" stroke-width="4">
        <path d="M96 176 l30 -44"/>
      </g>
      <circle cx="96" cy="176" r="8" fill="#3a4a5a" stroke="#0d1526" stroke-width="2"/>
      <path d="M126 132 l26 -14 l6 12 l-26 14 z" fill="#0abbee" stroke="#0d1526" stroke-width="2"/>
      <g stroke="#ffdc1a" stroke-width="1.6" opacity="0.85">
        <path d="M160 60 l30 -16 l34 26 l-26 30 l36 22 l32 -18 l-16 40" fill="none" stroke-dasharray="4 4"/>
      </g>
      <g fill="#ffdc1a">
        <circle cx="160" cy="60" r="3.5"/><circle cx="190" cy="44" r="3.5"/><circle cx="224" cy="70" r="3.5"/>
        <circle cx="198" cy="100" r="3.5"/><circle cx="234" cy="122" r="3.5"/><circle cx="266" cy="104" r="3.5"/>
      </g>
    </svg>`,
  mount(root, api) {
    let at = 0;
    let done = false;

    root.innerHTML = `
      <div class="constellation">
        <div class="sky-wrap">
          <svg class="sky" viewBox="0 0 320 210" role="img" aria-label="숫자가 새겨진 여덟 개의 별">
            <rect width="320" height="210" fill="#0a1220"/>
            <g class="sky-grid" stroke="#1b2740" stroke-width="0.7">
              ${Array.from({ length: 7 }, (_, i) => `<line x1="${20 + i * 45}" y1="10" x2="${20 + i * 45}" y2="200"/>`).join('')}
              ${Array.from({ length: 5 }, (_, i) => `<line x1="10" y1="${20 + i * 42}" x2="310" y2="${20 + i * 42}"/>`).join('')}
            </g>
            <g class="sky-lines"></g>
            <g class="sky-decoys">
              ${DECOYS.map((d) => `<circle cx="${d.x}" cy="${d.y}" r="2" fill="#5a6a8a"/>`).join('')}
            </g>
            <g class="sky-stars">
              ${STARS.map((s) => `
                <g class="star" data-star="${s.n}" transform="translate(${s.x},${s.y})" role="button" tabindex="0" aria-label="${s.n}번 별">
                  <circle r="9" class="star-halo"/>
                  <path d="M0 -8 L2.2 -2.2 L8 0 L2.2 2.2 L0 8 L-2.2 2.2 L-8 0 L-2.2 -2.2 Z" class="star-body"/>
                  <text y="16" class="star-num">${s.n}</text>
                </g>`).join('')}
            </g>
          </svg>
          <div class="sky-legend"><span class="sky-dot"></span>숫자를 따라 별을 이으세요 · 장식 별은 누르지 마세요</div>
        </div>
        <div class="board-actions">
          <button type="button" class="btn ghost" id="s15-reset">별자리 지우기</button>
        </div>
        <p class="hintline" id="s15-msg">1번 별을 눌러 별빛 열쇠를 그리기 시작하세요.</p>
      </div>`;

    const svg = root.querySelector('.sky');
    const lines = root.querySelector('.sky-lines');
    const msg = root.querySelector('#s15-msg');
    const title = '별빛 열쇠';

    function reset(why) {
      at = 0;
      lines.innerHTML = '';
      root.querySelectorAll('.star').forEach((el) => el.classList.remove('lit'));
      if (why) {
        msg.textContent = why;
        api.wrong('별자리가 흐려졌습니다. 다시 1번부터.', false);
      }
    }

    function clickNum(n) {
      if (done) return;
      if (n !== at + 1) {
        reset(n === 1 ? '1번 별부터 다시 시작합니다.' : '순서가 어긋났습니다. 별자리가 흐려집니다.');
        return;
      }
      const prev = at > 0 ? STARS[at - 1] : null;
      const cur = STARS[at];
      if (prev) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', String(prev.x));
        line.setAttribute('y1', String(prev.y));
        line.setAttribute('x2', String(cur.x));
        line.setAttribute('y2', String(cur.y));
        line.setAttribute('class', 'sky-line');
        lines.appendChild(line);
      }
      root.querySelector(`.star[data-star="${n}"]`).classList.add('lit');
      at += 1;
      api.sfx.bell(392 + n * 40);
      msg.textContent = `${n}번 별이 이어졌습니다. (${at}/8)`;
      if (at === 8) {
        done = true;
        root.querySelector('.sky').classList.add('complete');
        msg.textContent = `${title}가 완성되었습니다.`;
        api.sfx.clear();
        setTimeout(() => api.solve(), 500);
        return;
      }
      root.querySelector('.sky').classList.remove('complete');
    }

    svg.addEventListener('click', (e) => {
      const star = e.target.closest('.star');
      if (star) { clickNum(Number(star.dataset.star)); return; }
      const hit = e.target.closest('.sky-decoys circle');
      if (hit) reset('장식 별을 눌렀습니다. 별자리가 흐려집니다.');
    });

    svg.addEventListener('keydown', (e) => {
      const star = e.target.closest?.('.star');
      if (!star) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); clickNum(Number(star.dataset.star)); }
    });

    root.querySelector('#s15-reset').addEventListener('click', () => {
      reset('별자리를 지웠습니다.');
      api.sfx.tap();
    });

    msg.textContent = '1번 별을 눌러 별빛 열쇠를 그리기 시작하세요.';
  },
};
