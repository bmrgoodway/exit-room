// STAGE 11 · 어드바이저실 회복적 서클 방 — 서클 좌석 배치 조건 추리
const PEOPLE = [
  { id: 'hanbit', name: '조한빛', role: '진행자' },
  { id: 'isak', name: '김이삭', role: '교사' },
  { id: 'eunhye', name: '신은혜', role: '교사' },
  { id: 'eunchae', name: '유은채', role: '학생' },
  { id: 'sihun', name: '이시훈', role: '학생' },
  { id: 'hyobin', name: '국효빈', role: '학생' },
];
const SOLUTION = ['hanbit', 'hyobin', 'isak', 'eunchae', 'sihun', 'eunhye']; // 0~5번 자리

export default {
  n: 11,
  place: '어드바이저실 · 회복적 서클',
  title: '여섯 개의 의자',
  tagline: '좌석 조건 추리',
  intro:
    '어드바이저실에는 원형으로 놓인 의자 여섯 개와, 칠판에 남은 서클 진행 메모가 있다. 오늘 밤의 서클은 “이야기를 듣는 자리”였다. 각자 앉아야 할 자리가 조건으로 적혀 있지만 이름표는 모두 바닥에 떨어져 있다. 의자를 맞게 채워야 서클의 촛불이 켜진다.',
  clue: {
    title: '서클 진행 메모',
    text: '0번 출입문 옆, 3번 창가. 조한빛 0번, 김이삭 2번, 신은혜 5번, 유은채 3번, 이시훈은 유은채 옆 4번, 국효빈은 이시훈 맞은편 1번.',
  },
  fragment: '원 안에 앉아 서로의 이야기를 듣는 시간.',
  hints: [
    '자리는 출입문 옆 0번부터 시계방향으로 0·1·2·3·4·5입니다. 맞은편은 3칸 건너(0↔3, 1↔4, 2↔5)입니다.',
    '조한빛 0번, 김이삭 2번, 신은혜 5번, 유은채 3번은 바로 정해집니다. 남은 1·4번에 이시훈과 국효빈을 넣는데, 이시훈은 유은채(3번) 바로 옆이어야 합니다.',
    '정답 — 0번 조한빛, 1번 국효빈, 2번 김이삭, 3번 유은채, 4번 이시훈, 5번 신은혜.',
  ],
  art: () => `
    <svg viewBox="0 0 360 200" role="img" aria-label="촛불이 놓인 회복적 서클의 둥근 의자">
      <rect width="360" height="200" fill="#0d1526"/>
      <ellipse cx="180" cy="108" rx="96" ry="66" fill="#1b2440" stroke="#ffdc1a" stroke-width="2" opacity="0.75"/>
      <ellipse cx="180" cy="108" rx="62" ry="40" fill="#141d33"/>
      <g fill="#c9b9a0" stroke="#0d1526" stroke-width="2">
        <circle cx="180" cy="42" r="9"/><circle cx="238" cy="66" r="9"/><circle cx="238" cy="132" r="9"/>
        <circle cx="180" cy="160" r="9"/><circle cx="122" cy="132" r="9"/><circle cx="122" cy="66" r="9"/>
      </g>
      <g fill="#ffdc1a">
        <circle cx="180" cy="108" r="3"/><circle cx="192" cy="112" r="2"/><circle cx="168" cy="112" r="2"/>
      </g>
      <path d="M180 108 q0 -10 6 -14" stroke="#ffdc1a" stroke-width="1.4" fill="none"/>
      <g fill="#0d1526" font-family="sans-serif" font-size="8" text-anchor="middle" font-weight="700">
        <text x="180" y="30">0</text><text x="256" y="64">1</text><text x="256" y="140">2</text>
        <text x="180" y="178">3</text><text x="104" y="140">4</text><text x="104" y="64">5</text>
      </g>
      <g fill="#fff8d6"><circle cx="34" cy="26" r="1.2"/><circle cx="330" cy="22" r="1.3"/></g>
      <rect x="20" y="150" width="34" height="34" fill="#8a6b45" stroke="#0d1526" stroke-width="2"/>
      <path d="M20 150 l34 0" stroke="#0d1526" stroke-width="2"/>
    </svg>`,
  mount(root, api) {
    const seats = [null, null, null, null, null, null];
    let sel = 0;
    const byId = Object.fromEntries(PEOPLE.map((p) => [p.id, p]));

    root.innerHTML = `
      <div class="circle-wrap">
        <div class="circle-room">
          <span class="circle-center">회복적<br>서클</span>
          ${[0, 1, 2, 3, 4, 5].map((i) => `
            <button type="button" class="seat" data-seat="${i}" aria-label="${i}번 자리">
              <span class="seat-no">${i}</span>
              <span class="seat-name"></span>
            </button>`).join('')}
        </div>
        <div class="people-list" role="group" aria-label="이름표">
          ${PEOPLE.map((p) => `<button type="button" class="person-chip" data-person="${p.id}">
            <b>${p.name}</b><small>${p.role}</small></button>`).join('')}
        </div>
        <div class="board-actions">
          <button type="button" class="btn primary" id="s11-check">서클 시작</button>
          <button type="button" class="btn ghost" id="s11-reset">이름표 거두기</button>
        </div>
        <p class="hintline" id="s11-msg">자리를 누르고, 그 자리에 앉힐 이름표를 누르세요.</p>
        <div class="clue-list">
          ${[
            '조한빛은 출입문 바로 옆 0번 자리에 앉는다.',
            '김이삭은 조한빛에서 시계방향으로 두 자리 건너 2번에 앉는다.',
            '신은혜는 김이삭의 맞은편 5번에 앉는다.',
            '유은채는 창가 쪽 3번에 앉는다.',
            '이시훈은 유은채의 바로 옆자리에 앉는다.',
            '국효빈은 이시훈과 마주 본다.',
          ].map((t, i) => `<p class="clue-line"><b>${i + 1}</b>${t}</p>`).join('')}
        </div>
      </div>`;

    const msg = root.querySelector('#s11-msg');

    function paint() {
      root.querySelectorAll('.seat').forEach((el, i) => {
        el.classList.toggle('sel', sel === i);
        el.classList.toggle('filled', !!seats[i]);
        el.querySelector('.seat-name').textContent = seats[i] ? byId[seats[i]].name : '';
        el.setAttribute('aria-label', `${i}번 자리 ${seats[i] ? byId[seats[i]].name : '비어 있음'}`);
      });
      root.querySelectorAll('.person-chip').forEach((el) => {
        el.classList.toggle('used', seats.includes(el.dataset.person));
        el.classList.toggle('sel', false);
      });
    }

    root.querySelector('.circle-room').addEventListener('click', (e) => {
      const seat = e.target.closest('.seat');
      if (!seat) return;
      sel = Number(seat.dataset.seat);
      api.sfx.tap();
      paint();
      msg.textContent = `${sel}번 자리를 골랐습니다. 앉힐 이름표를 누르세요.`;
    });

    root.querySelector('.people-list').addEventListener('click', (e) => {
      const chip = e.target.closest('.person-chip');
      if (!chip) return;
      const id = chip.dataset.person;
      const at = seats.indexOf(id);
      if (at >= 0) seats[at] = null;
      seats[sel] = id;
      api.sfx.click();
      paint();
      msg.textContent = `${byId[id].name} → ${sel}번 자리.`;
    });

    root.querySelector('#s11-reset').addEventListener('click', () => {
      seats.fill(null);
      sel = 0;
      paint();
      msg.textContent = '이름표를 모두 거두었습니다.';
      api.sfx.tap();
    });

    root.querySelector('#s11-check').addEventListener('click', () => {
      if (seats.some((s) => !s)) { api.wrong('여섯 자리를 모두 채워야 합니다.'); return; }
      const right = seats.filter((id, i) => id === SOLUTION[i]).length;
      if (right === 6) {
        msg.textContent = '여섯 개의 촛불이 한 번에 켜졌습니다. 서클이 시작됩니다.';
        api.solve();
      } else {
        api.wrong(`여섯 자리 중 ${right}자리가 맞습니다.`);
      }
    });

    paint();
  },
};
