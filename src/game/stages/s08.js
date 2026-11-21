// STAGE 8 · 독립 서점 서가 — 분류기호·책등 색 스왑 정렬
const RAINBOW = { red: 0, orange: 1, yellow: 2, green: 3, blue: 4, purple: 5 };
const BOOKS = [
  { id: 'a', title: '별빛 아래 우리', call: 811.2, color: 'red', cname: '빨강' },
  { id: 'b', title: '마을의 33채', call: 813.4, color: 'green', cname: '초록' },
  { id: 'c', title: '정전의 밤', call: 811.2, color: 'yellow', cname: '노랑' },
  { id: 'd', title: '텃밭 일기', call: 818.0, color: 'blue', cname: '파랑' },
  { id: 'e', title: '종탑의 노래', call: 813.4, color: 'purple', cname: '보라' },
  { id: 'f', title: '옥상 별자리', call: 825.1, color: 'orange', cname: '주황' },
];
const GOAL = ['a', 'c', 'b', 'e', 'd', 'f'];
const START = ['c', 'f', 'a', 'e', 'b', 'd'];

export default {
  n: 8,
  place: '독립 서점 서가',
  title: '무지개 순서의 책등',
  tagline: '정렬 스왑',
  intro:
    '독립 서점의 문에는 “주인 없음, 책은 제자리에”라는 팻말이 걸려 있다. 서가의 책 여섯 권이 누군가 일부러 어질러 놓았다. 카운터의 대출 규칙 카드에는 정리 방식이 적혀 있다. 책 두 권을 바꿔 끼워 서가를 바로 세우면 계산대 아래 봉인이 풀린다.',
  clue: {
    title: '서점의 정리 규칙',
    text: '분류기호가 작은 책부터 왼쪽에, 같은 번호면 책등 색을 무지개 순서(빨주노초파남보)로. 811.2 빨강→노랑, 813.4 초록→보라, 818.0 파랑, 825.1 주황.',
  },
  fragment: '책등 색이 다른 책들이 같은 선반에 서는 일.',
  hints: [
    '규칙은 두 단계입니다. 먼저 분류기호(811.2, 813.4, 818.0, 825.1)를 작은 순서로 늘어놓으세요.',
    '같은 분류기호가 두 권씩 있습니다. 811.2는 빨강이 노랑보다 앞, 813.4는 초록이 보라보다 앞입니다.',
    '정답 순서 — 별빛 아래 우리(811.2 빨강) · 정전의 밤(811.2 노랑) · 마을의 33채(813.4 초록) · 종탑의 노래(813.4 보라) · 텃밭 일기(818.0 파랑) · 옥상 별자리(825.1 주황).',
  ],
  art: () => `
    <svg viewBox="0 0 360 200" role="img" aria-label="어질러진 독립 서점의 책장">
      <rect width="360" height="200" fill="#0d1526"/>
      <g stroke="#0d1526" stroke-width="3">
        <rect x="30" y="34" width="300" height="132" fill="#3a2c2a"/>
        <rect x="42" y="46" width="276" height="48" fill="#241b1c"/>
        <rect x="42" y="106" width="276" height="48" fill="#241b1c"/>
      </g>
      <g stroke="#0d1526" stroke-width="2">
        <rect x="52" y="58" width="16" height="36" fill="#ff614a" transform="rotate(-6 60 76)"/>
        <rect x="74" y="56" width="14" height="38" fill="#0abbee" transform="rotate(4 81 75)"/>
        <rect x="96" y="60" width="18" height="34" fill="#ffdc1a"/>
        <rect x="122" y="54" width="14" height="40" fill="#02c245" transform="rotate(-3 129 74)"/>
        <rect x="146" y="58" width="16" height="36" fill="#7e65c1"/>
        <rect x="176" y="62" width="20" height="32" fill="#f2f0e6" transform="rotate(5 186 78)"/>
        <rect x="212" y="56" width="14" height="38" fill="#ff614a"/>
        <rect x="232" y="58" width="16" height="36" fill="#7e65c1" transform="rotate(-4 240 76)"/>
        <rect x="264" y="60" width="18" height="34" fill="#02c245"/>
      </g>
      <g stroke="#0d1526" stroke-width="2">
        <rect x="56" y="116" width="18" height="38" fill="#ffdc1a"/>
        <rect x="82" y="112" width="14" height="42" fill="#7e65c1" transform="rotate(-5 89 133)"/>
        <rect x="104" y="118" width="16" height="36" fill="#ff614a"/>
        <rect x="128" y="114" width="20" height="40" fill="#0abbee" transform="rotate(3 138 134)"/>
        <rect x="160" y="118" width="14" height="36" fill="#02c245"/>
      </g>
      <g fill="#ffdc1a"><circle cx="24" cy="18" r="1.2"/><circle cx="336" cy="24" r="1.4"/><circle cx="180" cy="16" r="1"/></g>
      <path d="M292 150 l26 0 l0 16 l-26 0 z" fill="#c9b9a0" stroke="#0d1526" stroke-width="2"/>
      <path d="M296 154 l18 0 M296 160 l12 0" stroke="#3a2c2a" stroke-width="2"/>
    </svg>`,
  mount(root, api) {
    const order = [...START];
    let sel = null;
    const byId = Object.fromEntries(BOOKS.map((b) => [b.id, b]));

    root.innerHTML = `
      <div class="shop">
        <div class="shelf2" role="group" aria-label="책 여섯 권"></div>
        <div class="board-actions">
          <button type="button" class="btn primary" id="s8-check">서가 정리 확인</button>
          <button type="button" class="btn ghost" id="s8-reset">처음대로</button>
        </div>
        <p class="hintline" id="s8-msg">책을 하나 고르고 다른 책을 누르면 두 권이 자리를 바꿉니다.</p>
        <div class="rule-card">
          <b>대출 규칙 카드</b>
          <span>① 분류기호가 작은 책이 왼쪽</span>
          <span>② 같은 번호면 책등 색을 무지개 순서(빨주노초파남보)로</span>
        </div>
      </div>`;

    const shelf = root.querySelector('.shelf2');
    const msg = root.querySelector('#s8-msg');

    function paint() {
      shelf.innerHTML = order.map((id, i) => {
        const b = byId[id];
        return `<button type="button" class="book${sel === id ? ' sel' : ''}" data-book="${id}" aria-label="${i + 1}번째 책 ${b.title}, 분류 ${b.call}, ${b.cname}">
          <span class="spine" data-c="${b.color}"><span class="spine-title">${b.title}</span></span>
          <span class="book-meta">${b.call.toFixed(1)}</span>
        </button>`;
      }).join('');
    }

    shelf.addEventListener('click', (e) => {
      const btn = e.target.closest('.book');
      if (!btn) return;
      const id = btn.dataset.book;
      api.sfx.tap();
      if (!sel) { sel = id; paint(); msg.textContent = `${byId[id].title} — 바꿀 책을 하나 더 고르세요.`; return; }
      if (sel === id) { sel = null; paint(); msg.textContent = '선택을 풀었습니다.'; return; }
      const a = order.indexOf(sel), b = order.indexOf(id);
      [order[a], order[b]] = [order[b], order[a]];
      sel = null;
      paint();
      msg.textContent = '두 권의 자리를 바꿨습니다.';
    });

    root.querySelector('#s8-reset').addEventListener('click', () => {
      order.splice(0, order.length, ...START);
      sel = null;
      paint();
      msg.textContent = '서가를 처음 상태로 되돌렸습니다.';
      api.sfx.tap();
    });

    root.querySelector('#s8-check').addEventListener('click', () => {
      const ok = order.every((id, i) => id === GOAL[i]);
      const exact = order.filter((id, i) => id === GOAL[i]).length;
      if (ok) {
        msg.textContent = '책등의 색이 무지개처럼 정렬되었습니다. 계산대 아래 봉인이 풀립니다.';
        api.solve();
      } else {
        api.wrong(`여섯 자리 중 ${exact}자리가 맞습니다.`);
      }
    });

    paint();
  },
};
