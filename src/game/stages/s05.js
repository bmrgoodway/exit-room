// STAGE 5 · 이든 베이커리 주방 — 계량 저울·재료 비율 퍼즐
const TARGET = { flour: 360, butter: 240, sugar: 120 };
const TOTAL = 720;
const ITEMS = [
  { id: 'flour', name: '밀가루', color: '#f2f0e6', start: 200 },
  { id: 'butter', name: '버터', color: '#ffdc1a', start: 150 },
  { id: 'sugar', name: '설탕', color: '#0abbee', start: 90 },
];

export default {
  n: 5,
  place: '이든 베이커리 주방',
  title: '새벽 반죽의 비율',
  tagline: '계량과 비율',
  intro:
    '이든 베이커리 주방은 아직 따뜻하다. 식빵 반죽이 덜 부풀어 오른 채 놓여 있고, 벽에는 찢어진 레시피가 붙어 있다. “오늘의 식빵 12개 — 밀가루 3 : 버터 2 : 설탕 1, 총 반죽 720g.” 저울의 바늘이 기울어 있다. 세 재료를 정확히 계량해야 오븐의 잠금이 풀린다.',
  clue: {
    title: '찢어진 레시피',
    text: '식빵 12개 = 밀가루 3 : 버터 2 : 설탕 1, 총 반죽 720g. 한 몫은 120g.',
  },
  fragment: '새벽 반죽이 부풀어 오르는 소리.',
  hints: [
    '비율 3 : 2 : 1을 더하면 6몫입니다. 총 720g을 6으로 나누면 한 몫의 무게가 나옵니다.',
    '한 몫은 120g입니다. 밀가루는 3몫, 버터는 2몫, 설탕은 1몫.',
    '정답 — 밀가루 360g, 버터 240g, 설탕 120g (합계 720g).',
  ],
  art: () => `
    <svg viewBox="0 0 360 200" role="img" aria-label="따뜻한 베이커리 주방의 저울과 식빵">
      <rect width="360" height="200" fill="#0d1526"/>
      <rect x="0" y="150" width="360" height="50" fill="#2a2136"/>
      <g stroke="#0d1526" stroke-width="2">
        <rect x="30" y="96" width="90" height="54" fill="#3a2c2a"/>
        <rect x="42" y="108" width="66" height="10" fill="#ffdc1a"/>
        <rect x="42" y="126" width="66" height="10" fill="#ff614a"/>
      </g>
      <path d="M270 150 q0 -34 30 -34 q30 0 30 34 z" fill="#ffdc1a" stroke="#0d1526" stroke-width="2"/>
      <g stroke="#0d1526" stroke-width="2">
        <rect x="150" y="66" width="60" height="84" fill="#f2f0e6"/>
        <path d="M150 66 q30 -16 60 0" fill="#f2f0e6"/>
        <rect x="140" y="150" width="80" height="8" fill="#8a6b45"/>
      </g>
      <circle cx="180" cy="92" r="18" fill="#ffdc1a" stroke="#0d1526" stroke-width="2"/>
      <path d="M180 92 L188 80" stroke="#0d1526" stroke-width="3"/>
      <g fill="#0d1526"><circle cx="180" cy="92" r="2.4"/></g>
      <g stroke="#0d1526" stroke-width="2">
        <rect x="152" y="112" width="56" height="22" fill="#0abbee" opacity="0.7"/>
        <path d="M160 112 l0 22 M176 112 l0 22 M192 112 l0 22" stroke="#0d1526" stroke-width="1"/>
      </g>
      <g fill="#fff8d6"><circle cx="60" cy="24" r="1.3"/><circle cx="300" cy="28" r="1.1"/><circle cx="228" cy="18" r="1.2"/></g>
      <path d="M96 200 l0 -22 M120 200 l0 -16 M76 200 l0 -14" stroke="#8a6b45" stroke-width="3"/>
    </svg>`,
  mount(root, api) {
    const grams = { flour: ITEMS[0].start, butter: ITEMS[1].start, sugar: ITEMS[2].start };

    root.innerHTML = `
      <div class="bakery">
        <div class="scale-box">
          <div class="scale-dial">
            <span class="scale-needle" id="s5-needle"></span>
            <span class="scale-center"></span>
          </div>
          <div class="scale-read">
            <span class="scale-total" id="s5-total">0</span><small>g / 720g</small>
          </div>
          <div class="ratio-line" id="s5-ratio">비율 —</div>
        </div>
        <div class="ing-list">
          ${ITEMS.map((it) => `
            <div class="ing-row" data-ing="${it.id}">
              <span class="ing-name"><i class="dot" data-c="${it.id}"></i>${it.name}</span>
              <span class="ing-grams"><b data-grams="${it.id}">${grams[it.id]}</b>g</span>
              <span class="steppers">
                <button type="button" class="step" data-step="-50" data-ing="${it.id}" aria-label="${it.name} 50그램 빼기">−50</button>
                <button type="button" class="step" data-step="-10" data-ing="${it.id}" aria-label="${it.name} 10그램 빼기">−10</button>
                <button type="button" class="step" data-step="10" data-ing="${it.id}" aria-label="${it.name} 10그램 더하기">+10</button>
                <button type="button" class="step" data-step="50" data-ing="${it.id}" aria-label="${it.name} 50그램 더하기">+50</button>
              </span>
            </div>`).join('')}
        </div>
        <div class="board-actions">
          <button type="button" class="btn primary" id="s5-check">저울 확인</button>
          <button type="button" class="btn ghost" id="s5-reset">계량 초기화</button>
        </div>
        <p class="hintline" id="s5-msg">찢어진 레시피의 비율을 총 무게에 맞춰 보세요.</p>
        <div class="recipe-card">
          <b>오늘의 식빵 · 12개</b>
          <span>밀가루 3 : 버터 2 : 설탕 1</span>
          <span>총 반죽 720g</span>
        </div>
      </div>`;

    const totalEl = root.querySelector('#s5-total');
    const ratioEl = root.querySelector('#s5-ratio');
    const needle = root.querySelector('#s5-needle');
    const msg = root.querySelector('#s5-msg');

    const gcd = (a, b) => (b ? gcd(b, a % b) : a);
    function paint() {
      const total = grams.flour + grams.butter + grams.sugar;
      totalEl.textContent = String(total);
      for (const it of ITEMS) root.querySelector(`[data-grams="${it.id}"]`).textContent = String(grams[it.id]);
      const g1 = gcd(gcd(grams.flour, grams.butter), grams.sugar || 1) || 1;
      ratioEl.textContent = grams.sugar
        ? `비율 ${grams.flour / g1} : ${grams.butter / g1} : ${grams.sugar / g1}`
        : '비율 —';
      const pct = Math.max(0, Math.min(100, (total / TOTAL) * 100));
      needle.style.setProperty('--needle', String(-60 + pct * 1.2));
      root.querySelector('.scale-dial').classList.toggle('balanced', total === TOTAL);
    }

    root.querySelector('.ing-list').addEventListener('click', (e) => {
      const btn = e.target.closest('.step');
      if (!btn) return;
      const id = btn.dataset.ing;
      const delta = Number(btn.dataset.step);
      grams[id] = Math.max(0, Math.min(720, grams[id] + delta));
      api.sfx.tap();
      paint();
      msg.textContent = '저울이 흔들립니다.';
    });

    root.querySelector('#s5-reset').addEventListener('click', () => {
      ITEMS.forEach((it) => { grams[it.id] = it.start; });
      paint();
      msg.textContent = '계량을 처음 상태로 되돌렸습니다.';
      api.sfx.tap();
    });

    root.querySelector('#s5-check').addEventListener('click', () => {
      const ok = ITEMS.every((it) => grams[it.id] === TARGET[it.id]);
      if (ok) {
        msg.textContent = '저울의 바늘이 가운데에 멈췄습니다. 오븐 잠금이 풀립니다.';
        api.solve();
      } else {
        const total = grams.flour + grams.butter + grams.sugar;
        api.wrong(`아직 비율이 맞지 않습니다. (합계 ${total}g)`);
      }
    });

    paint();
  },
};
