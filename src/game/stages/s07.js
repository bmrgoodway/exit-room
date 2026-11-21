// STAGE 7 · 학교 매점 자물쇠 — 간식 가격 합산 4자리 다이얼
const ITEMS = [
  { name: '초코파이', price: 1200, qty: 2, note: '한 상자에 2개' },
  { name: '바나나맛 우유', price: 1300, qty: 1, note: '차갑게' },
  { name: '새우깡', price: 1500, qty: 2, note: '매운맛 아님' },
  { name: '아삭이', price: 900, qty: 1, note: '마지막 봉지' },
];
const TOTAL = ITEMS.reduce((a, it) => a + it.price * it.qty, 0); // 7600

export default {
  n: 7,
  place: '학교 매점',
  title: '장부와 자물쇠',
  tagline: '가격 합산',
  intro:
    '매점 셔터 옆 작은 창고에 자물쇠가 걸려 있다. 안쪽에는 다음 방의 열쇠가 있다는데, 번호는 어제 장부의 합계라고 적혀 있다. 진열대에는 급식실에서 가져온 듯한 간식이 가지런하고, 장부에는 두 줄의 가격이 지워져 있다. 진열대 가격표를 보고 합계를 구하자.',
  clue: {
    title: '매점 장부',
    text: '초코파이 1,200×2 + 바나나맛 우유 1,300×1 + 새우깡 1,500×2 + 아삭이 900×1 = 7,600원. 자물쇠 번호 7600.',
  },
  fragment: '500원짜리 과자 하나를 나눠 먹던 웃음.',
  hints: [
    '장부의 수량과 진열대의 가격을 곱해 네 줄을 모두 더하세요. 지워진 두 줄의 가격은 진열대 가격표에 있습니다.',
    '초코파이 1,200×2 = 2,400 / 우유 1,300×1 = 1,300 / 새우깡 1,500×2 = 3,000 / 아삭이 900×1 = 900.',
    '정답 — 합계 7,600원. 자물쇠에 7600을 입력하세요.',
  ],
  art: () => `
    <svg viewBox="0 0 360 200" role="img" aria-label="어두운 매점 진열대와 자물쇠">
      <rect width="360" height="200" fill="#0d1526"/>
      <g stroke="#0d1526" stroke-width="2">
        <rect x="18" y="40" width="250" height="130" fill="#243252"/>
        <rect x="30" y="56" width="226" height="30" fill="#141d33"/>
        <rect x="30" y="102" width="226" height="30" fill="#141d33"/>
        <rect x="30" y="140" width="226" height="22" fill="#141d33"/>
      </g>
      <g stroke="#0d1526" stroke-width="2">
        <rect x="40" y="64" width="18" height="20" fill="#ff614a"/><rect x="64" y="66" width="16" height="18" fill="#ffdc1a"/>
        <rect x="88" y="64" width="20" height="20" fill="#0abbee"/><rect x="116" y="66" width="16" height="18" fill="#02c245"/>
        <rect x="40" y="110" width="20" height="20" fill="#ffdc1a"/><rect x="68" y="112" width="16" height="18" fill="#ff614a"/>
        <rect x="96" y="110" width="22" height="20" fill="#f2f0e6"/><rect x="126" y="112" width="16" height="18" fill="#7e65c1"/>
      </g>
      <g fill="#c9b9a0" font-family="sans-serif" font-size="8">
        <text x="40" y="98">1,200</text><text x="64" y="98">1,300</text><text x="94" y="98">1,500</text><text x="122" y="98">900</text>
      </g>
      <g stroke="#0d1526" stroke-width="3">
        <path d="M286 96 l0 -20 a20 20 0 0 1 40 0 l0 20" fill="none" stroke="#ffdc1a"/>
        <rect x="274" y="96" width="64" height="56" fill="#ffdc1a"/>
      </g>
      <g fill="#0d1526"><circle cx="306" cy="118" r="5"/><rect x="303" y="120" width="6" height="16"/></g>
      <g fill="#ffdc1a" font-family="sans-serif" font-size="9" font-weight="700" text-anchor="middle">
        <text x="306" y="150">7 _ _ _</text>
      </g>
      <g fill="#fff8d6"><circle cx="24" cy="22" r="1.2"/><circle cx="342" cy="30" r="1.4"/></g>
    </svg>`,
  mount(root, api) {
    let entered = '';

    root.innerHTML = `
      <div class="shop">
        <div class="shop-cols">
          <section class="shelf" aria-label="진열대">
            ${ITEMS.map((it) => `
              <div class="item-card">
                <b>${it.name}</b>
                <span class="price">${it.price.toLocaleString('ko-KR')}원</span>
                <small>${it.note}</small>
              </div>`).join('')}
          </section>
          <section class="ledger" aria-label="매점 장부">
            <header><b>어제의 장부</b><span>수량</span></header>
            ${ITEMS.map((it, i) => `
              <p class="ledger-row${i >= 2 ? ' erased' : ''}">
                <span>${it.name}</span>
                <span class="ledger-price">${i >= 2 ? '???원' : `${it.price.toLocaleString('ko-KR')}원`}</span>
                <span class="ledger-qty">× ${it.qty}</span>
              </p>`).join('')}
            <footer>합계 <b>?</b> 원</footer>
          </section>
        </div>
        <div class="keypad-wrap">
          <div class="lock-display" id="s7-display" aria-live="polite">– – – –</div>
          <div class="keypad" role="group" aria-label="숫자 키패드">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => `<button type="button" class="key" data-key="${n}">${n}</button>`).join('')}
            <button type="button" class="key key-wide" data-key="clear">지움</button>
            <button type="button" class="key key-go" data-key="go">열기</button>
          </div>
        </div>
        <p class="hintline" id="s7-msg">자물쇠는 네 자리입니다. 장부의 합계를 입력하세요.</p>
      </div>`;

    const display = root.querySelector('#s7-display');
    const msg = root.querySelector('#s7-msg');

    function paint() {
      const chars = entered.padEnd(4, '–').split('');
      display.textContent = chars.join(' ');
      display.classList.toggle('full', entered.length === 4);
    }

    root.querySelector('.keypad').addEventListener('click', (e) => {
      const key = e.target.closest('.key');
      if (!key) return;
      const k = key.dataset.key;
      api.sfx.tap();
      if (k === 'clear') { entered = ''; paint(); msg.textContent = '입력을 지웠습니다.'; return; }
      if (k === 'go') {
        if (entered.length !== 4) { api.wrong('네 자리를 모두 채워야 합니다.'); return; }
        if (Number(entered) === TOTAL) {
          msg.textContent = '자물쇠가 열렸습니다. 창고 안쪽에 다음 방의 열쇠가 있습니다.';
          api.solve();
        } else {
          api.wrong('자물쇠가 꿈쩍하지 않습니다. 합계를 다시 확인하세요.');
          entered = '';
          paint();
        }
        return;
      }
      if (entered.length >= 4) return;
      entered += k;
      paint();
    });

    paint();
  },
};
