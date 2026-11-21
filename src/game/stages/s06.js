// STAGE 6 · 이든 카페 카운터 — 영수증·로스팅 시간표 대조 암호
const ROAST = [
  { bean: '예가체프', origin: '에티오피아', min: 5, roast: '라이트' },
  { bean: '수프리모', origin: '콜롬비아', min: 7, roast: '미디엄' },
  { bean: '세하도', origin: '브라질', min: 9, roast: '다크' },
  { bean: '케냐AA', origin: '케냐', min: 4, roast: '시티' },
];
const SEATS = [
  { seat: 1, bean: '케냐AA', time: '21:41' },
  { seat: 2, bean: '세하도', time: '21:44' },
  { seat: 3, bean: '예가체프', time: '21:52' },
  { seat: 4, bean: '수프리모', time: '21:58' },
];
const CODE = [4, 9, 5, 7];

export default {
  n: 6,
  place: '이든 카페 카운터',
  title: '식은 커피의 영수증',
  tagline: '대조 암호',
  intro:
    '이든 카페의 셔터는 반쯤 내려가 있다. 카운터 위에 네 잔의 빈 컵과 영수증이 놓여 있고, 벽면 게시판에는 원두별 로스팅 시간표가 붙어 있다. 금전함은 네 자리 다이얼로 잠겨 있다. “오늘 밤의 손님 네 분 — 좌석 순서대로 원두의 로스팅 시간을 읽으세요.”',
  clue: {
    title: '영수증과 로스팅 표',
    text: '좌석 1 케냐AA(4분), 좌석 2 세하도(9분), 좌석 3 예가체프(5분), 좌석 4 수프리모(7분). 암호 4957.',
  },
  fragment: '식은 커피 위에 남은 온도.',
  hints: [
    '영수증의 좌석 번호 1번부터 4번까지, 각 좌석에 나간 원두를 찾아 로스팅 시간표의 분(分)을 읽으세요.',
    '좌석 1은 케냐AA, 좌석 2는 세하도, 좌석 3은 예가체프, 좌석 4는 수프리모입니다.',
    '정답 — 케냐AA 4분, 세하도 9분, 예가체프 5분, 수프리모 7분. 암호는 4957.',
  ],
  art: () => `
    <svg viewBox="0 0 360 200" role="img" aria-label="이든 카페 카운터의 빈 컵과 영수증">
      <rect width="360" height="200" fill="#0d1526"/>
      <rect x="0" y="140" width="360" height="60" fill="#2a2136"/>
      <rect x="0" y="132" width="360" height="10" fill="#8a6b45"/>
      <g stroke="#0d1526" stroke-width="2">
        <rect x="44" y="60" width="74" height="72" fill="#f2eee2"/>
        <path d="M52 132 l0 -10 M70 132 l0 -10 M88 132 l0 -10 M106 132 l0 -10" stroke="#8a6b45" stroke-width="3"/>
        <rect x="52" y="70" width="58" height="8" fill="#ffdc1a"/>
        <rect x="52" y="84" width="42" height="5" fill="#0d1526"/>
        <rect x="52" y="94" width="52" height="5" fill="#0d1526"/>
        <rect x="52" y="104" width="34" height="5" fill="#0d1526"/>
      </g>
      <g stroke="#0d1526" stroke-width="2">
        <path d="M170 140 l0 -26 l34 0 l0 26 z" fill="#f2f0e6"/>
        <path d="M170 114 l0 -6 l34 0 l0 6 z" fill="#ff614a"/>
        <path d="M208 120 l10 0 l0 12 l-10 0" fill="none" stroke="#f2f0e6" stroke-width="4"/>
        <path d="M240 140 l0 -30 l30 0 l0 30 z" fill="#f2f0e6"/>
        <path d="M240 110 l0 -6 l30 0 l0 6 z" fill="#0abbee"/>
        <path d="M274 116 l8 0 l0 12 l-8 0" fill="none" stroke="#f2f0e6" stroke-width="4"/>
      </g>
      <g fill="#c9b9a0"><rect x="300" y="66" width="40" height="66"/></g>
      <g fill="#3a2c2a"><rect x="304" y="72" width="32" height="4"/><rect x="304" y="82" width="26" height="3"/><rect x="304" y="90" width="30" height="3"/><rect x="304" y="98" width="18" height="3"/></g>
      <g fill="#ffdc1a"><circle cx="30" cy="24" r="1.4"/><circle cx="330" cy="20" r="1.2"/></g>
      <path d="M150 34 q6 -10 12 0 q6 -10 12 0" stroke="#c9b9a0" stroke-width="2" fill="none" opacity="0.7"/>
      <path d="M180 28 q6 -10 12 0 q6 -10 12 0" stroke="#c9b9a0" stroke-width="2" fill="none" opacity="0.5"/>
    </svg>`,
  mount(root, api) {
    const digits = [0, 0, 0, 0];
    let marked = null;

    root.innerHTML = `
      <div class="cafe-board">
        <div class="cafe-cols">
          <section class="receipt" aria-label="영수증">
            <header><b>이든 카페</b><span>영수증 · 2026.11.21</span></header>
            ${SEATS.map((s) => `
              <p class="receipt-row" data-seat="${s.seat}">
                <span class="seat-no">${s.seat}</span>
                <span class="seat-bean">${s.bean}</span>
                <span class="seat-time">${s.time}</span>
              </p>`).join('')}
            <footer>합계 4잔 · 결제 완료</footer>
          </section>
          <section class="roast" aria-label="로스팅 시간표">
            <header><b>오늘의 로스팅</b><span>분 단위</span></header>
            ${ROAST.map((r) => `
              <button type="button" class="roast-row" data-bean="${r.bean}" aria-label="${r.bean} 로스팅 ${r.min}분">
                <span class="roast-bean">${r.bean}<small>${r.origin}</small></span>
                <span class="roast-roast">${r.roast}</span>
                <span class="roast-min">${r.min}분</span>
              </button>`).join('')}
          </section>
        </div>
        <div class="dial4" role="group" aria-label="네 자리 다이얼">
          ${digits.map((_, i) => `
            <div class="digit" data-digit="${i}">
              <button type="button" class="digit-btn" data-move="1" data-digit="${i}" aria-label="${i + 1}번째 자리 올리기">▲</button>
              <span class="digit-val" data-val="${i}">0</span>
              <button type="button" class="digit-btn" data-move="-1" data-digit="${i}" aria-label="${i + 1}번째 자리 내리기">▼</button>
            </div>`).join('')}
        </div>
        <div class="board-actions">
          <button type="button" class="btn primary" id="s6-check">금전함 열기</button>
        </div>
        <p class="hintline" id="s6-msg">게시판의 원두를 눌러 시간을 확인하고, 좌석 순서대로 다이얼을 맞추세요.</p>
      </div>`;

    const msg = root.querySelector('#s6-msg');

    root.querySelector('.roast').addEventListener('click', (e) => {
      const row = e.target.closest('.roast-row');
      if (!row) return;
      const bean = row.dataset.bean;
      marked = marked === bean ? null : bean;
      root.querySelectorAll('.roast-row').forEach((r) => r.classList.toggle('marked', r.dataset.bean === marked));
      root.querySelectorAll('.receipt-row').forEach((r) => r.classList.toggle('marked', r.querySelector('.seat-bean').textContent === marked));
      api.sfx.tap();
      const item = ROAST.find((r) => r.bean === bean);
      msg.textContent = marked ? `${bean} — ${item.min}분 (${item.roast})` : '표시를 지웠습니다.';
    });

    root.querySelector('.dial4').addEventListener('click', (e) => {
      const btn = e.target.closest('.digit-btn');
      if (!btn) return;
      const i = Number(btn.dataset.digit);
      digits[i] = (digits[i] + Number(btn.dataset.move) + 10) % 10;
      root.querySelector(`[data-val="${i}"]`).textContent = String(digits[i]);
      api.sfx.tap();
    });

    root.querySelector('#s6-check').addEventListener('click', () => {
      if (digits.every((d, i) => d === CODE[i])) {
        msg.textContent = '금전함이 열렸습니다. 안쪽에는 마을 열쇠와 쪽지가 있습니다.';
        api.solve();
      } else {
        api.wrong('다이얼이 헛돕니다. 좌석 순서와 분을 다시 대조하세요.');
      }
    });
  },
};
