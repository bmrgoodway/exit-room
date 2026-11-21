// STAGE 13 · 별드림관 도서관 비밀 서고 — 4대 핵심가치 암호 휠
const WHEELS = [
  { id: 0, words: ['제자도', '공동체', '샬롬', '소명', '비전'], start: 1 },
  { id: 1, words: ['공동체', '제자도', '샬롬', '소명', '책임'], start: 3 },
  { id: 2, words: ['소명', '샬롬', '공동체', '제자도', '배움'], start: 1 },
  { id: 3, words: ['샬롬', '소명', '제자도', '공동체', '평화'], start: 2 },
];
const TARGET = ['제자도', '공동체', '소명', '샬롬'];
const SYMBOLS = [
  { key: '길', meaning: '제자도', desc: '따라 걷는 삶' },
  { key: '별', meaning: '공동체', desc: '함께 있는 우리' },
  { key: '등불', meaning: '소명', desc: '부르심의 빛' },
  { key: '비둘기', meaning: '샬롬', desc: '평화' },
];
const PLATE = ['길', '별', '등불', '비둘기'];

export default {
  n: 13,
  place: '별드림관 도서관 · 비밀 서고',
  title: '네 단어의 청동판',
  tagline: '암호 휠',
  intro:
    '도서관 가장 안쪽, 서가가 벽처럼 열리며 비밀 서고가 나타난다. 문에는 네 개의 청동 휠과, 그 위에 네 문양이 새겨진 판이 있다. 판 옆에는 학교의 표어가 작게 새겨져 있다. “하나님 나라를 위한 책임 있는 그리스도의 제자.” 휠에는 학교의 핵심가치 후보 단어들이 나란히 새겨져 있다. 문양의 뜻을 읽어 네 단어를 맞추면 서고가 열린다.',
  clue: {
    title: '청동판의 문양',
    text: '판의 순서는 길 → 별 → 등불 → 비둘기. 길=제자도, 별=공동체, 등불=소명, 비둘기=샬롬. → 휠 정답 제자도·공동체·소명·샬롬.',
  },
  fragment: '네 단어로 남은 약속 — 공동체, 제자도, 샬롬, 소명.',
  hints: [
    '휠 하나가 핵심가치 한 단어를 가리킵니다. 청동판의 네 문양을, 아래 문양 설명과 하나씩 맞춰 보세요.',
    '길은 따라 걷는 삶이므로 제자도, 별은 함께 있는 우리이므로 공동체, 등불은 부르심이므로 소명, 비둘기는 평화이므로 샬롬입니다.',
    '정답 — 1번 휠 제자도, 2번 휠 공동체, 3번 휠 소명, 4번 휠 샬롬.',
  ],
  art: () => `
    <svg viewBox="0 0 360 200" role="img" aria-label="비밀 서고의 청동판과 네 개의 암호 휠">
      <rect width="360" height="200" fill="#0d1526"/>
      <rect x="26" y="18" width="308" height="164" fill="#241b1c" stroke="#0d1526" stroke-width="3"/>
      <rect x="44" y="34" width="272" height="40" fill="#3a2c2a" stroke="#0d1526" stroke-width="2"/>
      <g fill="#ffdc1a" font-family="sans-serif" font-size="12" font-weight="700" text-anchor="middle">
        <text x="80" y="60">길</text><text x="146" y="60">별</text><text x="212" y="60">등불</text><text x="278" y="60">비둘기</text>
      </g>
      <g stroke="#0d1526" stroke-width="2">
        <circle cx="80" cy="96" r="20" fill="#8a6b45"/><circle cx="80" cy="96" r="8" fill="#241b1c"/>
        <circle cx="146" cy="96" r="20" fill="#8a6b45"/><circle cx="146" cy="96" r="8" fill="#241b1c"/>
        <circle cx="212" cy="96" r="20" fill="#8a6b45"/><circle cx="212" cy="96" r="8" fill="#241b1c"/>
        <circle cx="278" cy="96" r="20" fill="#8a6b45"/><circle cx="278" cy="96" r="8" fill="#241b1c"/>
      </g>
      <g fill="#0abbee" font-family="sans-serif" font-size="10" text-anchor="middle">
        <text x="80" y="140">? ?</text><text x="146" y="140">? ?</text><text x="212" y="140">? ?</text><text x="278" y="140">? ?</text>
      </g>
      <g fill="#ffdc1a" opacity="0.5">
        <rect x="44" y="152" width="272" height="3"/><rect x="44" y="164" width="200" height="3"/>
      </g>
      <g fill="#fff8d6"><circle cx="18" cy="12" r="1.2"/><circle cx="340" cy="10" r="1.2"/><circle cx="300" cy="188" r="1.1"/></g>
    </svg>`,
  mount(root, api) {
    const pos = WHEELS.map((w) => w.start);

    root.innerHTML = `
      <div class="archive">
        <div class="plate">
          <span class="plate-label">청동판의 순서</span>
          ${PLATE.map((s, i) => `<span class="plate-symbol">${s}<small>${i + 1}</small></span>`).join('')}
        </div>
        <div class="wheels" role="group" aria-label="네 개의 암호 휠">
          ${WHEELS.map((w, i) => `
            <div class="wheel" data-wheel="${i}">
              <button type="button" class="wheel-btn" data-move="-1" data-wheel="${i}" aria-label="${i + 1}번 휠 위로">▲</button>
              <div class="wheel-win">
                <span class="w-prev"></span>
                <span class="w-now"></span>
                <span class="w-next"></span>
              </div>
              <button type="button" class="wheel-btn" data-move="1" data-wheel="${i}" aria-label="${i + 1}번 휠 아래로">▼</button>
              <span class="wheel-no">${i + 1}</span>
            </div>`).join('')}
        </div>
        <div class="board-actions">
          <button type="button" class="btn primary" id="s13-check">서고 열기</button>
          <button type="button" class="btn ghost" id="s13-reset">휠 초기화</button>
        </div>
        <p class="hintline" id="s13-msg">네 휠을 돌려 문양의 뜻에 맞는 단어를 세우세요.</p>
        <div class="legend-card">
          <b>문양 설명</b>
          ${SYMBOLS.map((s) => `<span><i>${s.key}</i>${s.desc} = ${s.meaning}</span>`).join('')}
        </div>
      </div>`;

    const msg = root.querySelector('#s13-msg');

    function paint() {
      WHEELS.forEach((w, i) => {
        const el = root.querySelector(`.wheel[data-wheel="${i}"]`);
        const p = pos[i];
        el.querySelector('.w-prev').textContent = w.words[(p - 1 + w.words.length) % w.words.length];
        el.querySelector('.w-now').textContent = w.words[p];
        el.querySelector('.w-next').textContent = w.words[(p + 1) % w.words.length];
        el.setAttribute('aria-label', `${i + 1}번 휠 ${w.words[p]}`);
      });
    }

    root.querySelector('.wheels').addEventListener('click', (e) => {
      const btn = e.target.closest('.wheel-btn');
      if (!btn) return;
      const i = Number(btn.dataset.wheel);
      const dir = Number(btn.dataset.move);
      pos[i] = (pos[i] + dir + WHEELS[i].words.length) % WHEELS[i].words.length;
      api.sfx.tap();
      paint();
    });

    root.querySelector('#s13-reset').addEventListener('click', () => {
      WHEELS.forEach((w, i) => { pos[i] = w.start; });
      paint();
      msg.textContent = '휠을 처음 상태로 되돌렸습니다.';
      api.sfx.tap();
    });

    root.querySelector('#s13-check').addEventListener('click', () => {
      const words = pos.map((p, i) => WHEELS[i].words[p]);
      if (words.every((w, i) => w === TARGET[i])) {
        msg.textContent = '청동 휠이 돌아가며 서고의 벽이 열립니다.';
        api.solve();
      } else {
        const right = words.filter((w, i) => w === TARGET[i]).length;
        api.wrong(`네 휠 중 ${right}개가 맞습니다.`);
      }
    });

    paint();
  },
};
