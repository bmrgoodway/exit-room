// STAGE 14 · 별무리 교육연구소 기획실 — 2002→2007→2012→2024 연표 정렬
const EVENTS = [
  { id: 'vision', title: '「비전 2020」 선포', year: 2002, note: '꿈을 문서로 남긴 날' },
  { id: 'village', title: '별무리 마을 33채 조성', year: 2007, note: '교사 주택과 홈스테이' },
  { id: 'school', title: '별무리학교 개교', year: 2012, note: '마을이 학교가 되다' },
  { id: 'altsis', title: 'ALTSIS(BLMS) 도입', year: 2016, note: '맞춤형 교육과정 기록' },
  { id: 'dream', title: '별드림관 준공', year: 2024, note: '신관, 도서관, 옥상' },
  { id: 'lab', title: '별무리 교육연구소 준비', year: 2026, note: '다음 20년의 설계' },
];
const ORDER = ['vision', 'village', 'school', 'altsis', 'dream', 'lab'];
const POOL_START = ['school', 'lab', 'vision', 'altsis', 'village', 'dream'];

export default {
  n: 14,
  place: '별무리 교육연구소 기획실',
  title: '스물네 해의 연표',
  tagline: '연표 정렬',
  intro:
    '교육연구소 기획실 벽에는 긴 연표가 걸려 있지만, 카드 여섯 장이 바닥에 흩어져 있다. 파일에는 “비전 2020은 2002년”이라는 메모와, 각 사건 사이의 간격만 남아 있다. 카드를 연대순으로 되돌려야 연구소의 다음 계획서가 출력된다.',
  clue: {
    title: '기획 파일의 메모',
    text: '2002 비전 2020 → 5년 뒤 마을 → 5년 뒤 개교 → 4년 뒤 ALTSIS → 12년 뒤 별드림관 → 2년 뒤 교육연구소 준비.',
  },
  fragment: '2002년의 꿈이 2026년의 우리에게 닿은 길.',
  hints: [
    '기준점은 2002년 「비전 2020」 선포입니다. 모든 사건은 앞 사건에서 몇 년 뒤인지로 이어집니다.',
    '2002 비전 → +5 마을(2007) → +5 개교(2012) → +4 ALTSIS(2016) → +12 별드림관(2024) → +2 교육연구소 준비(2026).',
    '정답 순서 — 비전 2020(2002) · 마을 33채(2007) · 개교(2012) · ALTSIS(2016) · 별드림관(2024) · 교육연구소 준비(2026).',
  ],
  art: () => `
    <svg viewBox="0 0 360 200" role="img" aria-label="교육연구소 벽의 긴 연표와 흩어진 카드">
      <rect width="360" height="200" fill="#0d1526"/>
      <rect x="20" y="24" width="320" height="130" fill="#141d33" stroke="#0d1526" stroke-width="3"/>
      <path d="M40 92 L320 92" stroke="#ffdc1a" stroke-width="3"/>
      ${[0, 1, 2, 3, 4, 5].map((i) => `
        <circle cx="${52 + i * 52}" cy="92" r="6" fill="${i < 4 ? '#0abbee' : '#2b3550'}" stroke="#0d1526" stroke-width="2"/>
        <rect x="${40 + i * 52}" y="${i % 2 ? 110 : 52}" width="24" height="16" fill="#c9b9a0" stroke="#0d1526" stroke-width="1.5"/>`).join('')}
      <g fill="#3a2c2a"><rect x="40" y="164" width="60" height="20"/><rect x="112" y="168" width="48" height="16"/><rect x="172" y="162" width="56" height="22"/></g>
      <g fill="#ffdc1a"><circle cx="330" cy="14" r="1.2"/><circle cx="24" cy="12" r="1"/></g>
    </svg>`,
  mount(root, api) {
    const pool = [...POOL_START];
    const slots = [null, null, null, null, null, null];
    let picked = null;
    const byId = Object.fromEntries(EVENTS.map((e) => [e.id, e]));

    root.innerHTML = `
      <div class="timeline">
        <div class="tl-slots" role="group" aria-label="연대순 여섯 칸">
          ${slots.map((_, i) => `
            <button type="button" class="tl-slot" data-slot="${i}" aria-label="${i + 1}번째 칸">
              <span class="tl-no">${i + 1}</span>
              <span class="tl-card-slot"></span>
            </button>`).join('')}
        </div>
        <div class="tl-pool" role="group" aria-label="남은 카드"></div>
        <div class="board-actions">
          <button type="button" class="btn primary" id="s14-check">연표 확정</button>
          <button type="button" class="btn ghost" id="s14-reset">카드 섞기</button>
        </div>
        <p class="hintline" id="s14-msg">카드를 골라 1번 칸부터 차례로 놓으세요.</p>
        <div class="file-card">
          <b>기획 파일 메모</b>
          <span>「비전 2020」은 2002년에 선포되었다.</span>
          <span>마을은 비전 선포 5년 뒤, 학교는 마을이 선 뒤 5년 뒤.</span>
          <span>ALTSIS는 개교 4년 뒤, 별드림관은 개교 12년 뒤.</span>
          <span>교육연구소 준비는 별드림관 준공 2년 뒤 시작되었다.</span>
        </div>
      </div>`;

    const poolEl = root.querySelector('.tl-pool');
    const msg = root.querySelector('#s14-msg');

    function paint() {
      poolEl.innerHTML = pool.length
        ? pool.map((id) => `<button type="button" class="tl-card${picked === id ? ' sel' : ''}" data-card="${id}">
            <b>${byId[id].title}</b><small>${byId[id].note}</small></button>`).join('')
        : '<span class="tl-empty">카드를 모두 놓았습니다.</span>';
      root.querySelectorAll('.tl-slot').forEach((el, i) => {
        const id = slots[i];
        const box = el.querySelector('.tl-card-slot');
        el.classList.toggle('filled', !!id);
        el.classList.toggle('sel', picked && !id);
        box.innerHTML = id ? `<span class="tl-filled"><b>${byId[id].title}</b></span>` : '';
        el.setAttribute('aria-label', `${i + 1}번째 칸 ${id ? byId[id].title : '비어 있음'}`);
      });
    }

    poolEl.addEventListener('click', (e) => {
      const card = e.target.closest('.tl-card');
      if (!card) return;
      picked = picked === card.dataset.card ? null : card.dataset.card;
      api.sfx.tap();
      paint();
      msg.textContent = picked ? `${byId[picked].title} — 놓을 칸을 고르세요.` : '선택을 풀었습니다.';
    });

    root.querySelector('.tl-slots').addEventListener('click', (e) => {
      const slot = e.target.closest('.tl-slot');
      if (!slot) return;
      const i = Number(slot.dataset.slot);
      if (slots[i]) {
        pool.push(slots[i]);
        slots[i] = null;
        api.sfx.tap();
        paint();
        msg.textContent = '카드를 되돌렸습니다.';
        return;
      }
      if (!picked) { msg.textContent = '먼저 아래 카드를 고르세요.'; return; }
      slots[i] = picked;
      pool.splice(pool.indexOf(picked), 1);
      picked = null;
      api.sfx.click();
      paint();
    });

    root.querySelector('#s14-reset').addEventListener('click', () => {
      pool.splice(0, pool.length, ...POOL_START);
      slots.fill(null);
      picked = null;
      paint();
      msg.textContent = '카드를 다시 섞었습니다.';
      api.sfx.tap();
    });

    root.querySelector('#s14-check').addEventListener('click', () => {
      if (slots.some((s) => !s)) { api.wrong('여섯 칸을 모두 채워야 합니다.'); return; }
      const right = slots.filter((id, i) => id === ORDER[i]).length;
      if (right === 6) {
        msg.textContent = '연표가 완성되었습니다. 스물네 해의 길이 한 줄로 이어집니다.';
        api.solve();
      } else {
        api.wrong(`여섯 칸 중 ${right}칸이 맞습니다.`);
      }
    });

    paint();
  },
};
