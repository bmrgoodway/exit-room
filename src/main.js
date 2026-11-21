import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import './style.css';
import { stages } from './game/stages/index.js';
import {
  state, save, startClock, tick, elapsed, clearStage, clearedCount, isCleared,
  totalHints, hintUsed, revealHint, finish, rankOf, resetAll, TOTAL,
} from './game/state.js';
import { sfx, setSound } from './game/audio.js';
import { $, esc, pad2, fmtClock, toast, shake, openSheet, closeSheet, armButton } from './game/ui.js';

const app = $('#app');
const replaying = new Set();
const shell = {
  time: $('#hud-time'),
  progress: $('#hud-progress'),
  hint: $('#hud-hint'),
};

/* ────────────────────────────── 화면 머리 · 설정 ────────────────────────────── */

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const btn = $('#btn-theme');
  const icon = $('#theme-icon');
  const night = theme === 'night';
  if (btn) {
    btn.setAttribute('aria-pressed', String(!night));
    btn.setAttribute('aria-label', night ? '낮 화면으로 바꾸기' : '밤 화면으로 바꾸기');
  }
  if (icon) icon.textContent = night ? '☾' : '☀';
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', night ? '#0b1020' : '#f5f0e3');
}

function applySound(on) {
  setSound(on);
  const btn = $('#btn-sound');
  const icon = $('#sound-icon');
  if (btn) {
    btn.setAttribute('aria-pressed', String(on));
    btn.setAttribute('aria-label', on ? '효과음 켜짐' : '효과음 꺼짐');
  }
  if (icon) icon.textContent = on ? '♪' : '✕';
}

function updateHud() {
  shell.time.textContent = fmtClock(elapsed());
  shell.progress.textContent = `${clearedCount()}/${TOTAL}`;
  shell.hint.textContent = String(totalHints());
}

function toggleTheme() {
  state.settings.theme = state.settings.theme === 'night' ? 'day' : 'night';
  applyTheme(state.settings.theme);
  save();
  sfx.tap();
}

function toggleSound() {
  state.settings.sound = !state.settings.sound;
  applySound(state.settings.sound);
  save();
  if (state.settings.sound) sfx.ok();
}

/* ────────────────────────────── 홈 ────────────────────────────── */

function heroArt() {
  return `
  <svg viewBox="0 0 420 300" role="img" aria-label="별이 쏟아지는 별무리 마을의 밤 풍경">
    <rect width="420" height="300" fill="#0a1020"/>
    <g fill="#ffdc1a">
      <circle cx="24" cy="30" r="1.5"/><circle cx="70" cy="18" r="1.1"/><circle cx="120" cy="40" r="1.6"/>
      <circle cx="170" cy="20" r="1.1"/><circle cx="228" cy="34" r="1.3"/><circle cx="286" cy="16" r="1.5"/>
      <circle cx="342" cy="42" r="1.2"/><circle cx="396" cy="24" r="1.4"/><circle cx="52" cy="70" r="1"/>
      <circle cx="250" cy="66" r="1"/><circle cx="392" cy="80" r="1.1"/><circle cx="140" cy="84" r="1"/>
    </g>
    <circle cx="352" cy="58" r="24" fill="#fff8d6"/>
    <circle cx="342" cy="50" r="21" fill="#0a1020"/>
    <path d="M0 210 L46 186 L92 210 L138 178 L184 210 L230 182 L276 210 L322 180 L368 210 L420 186 L420 300 L0 300 Z" fill="#121a2c"/>
    <g fill="#1b2440" stroke="#0a1020" stroke-width="2">
      <path d="M24 236 l18 -16 l18 16 z"/><rect x="28" y="236" width="28" height="24"/>
      <path d="M70 236 l18 -16 l18 16 z"/><rect x="74" y="236" width="28" height="24"/>
      <path d="M116 236 l18 -16 l18 16 z"/><rect x="120" y="236" width="28" height="24"/>
      <path d="M162 236 l18 -16 l18 16 z"/><rect x="166" y="236" width="28" height="24"/>
    </g>
    <g fill="#ffdc1a" opacity="0.8">
      <rect x="36" y="244" width="6" height="7"/><rect x="82" y="244" width="6" height="7"/>
      <rect x="128" y="244" width="6" height="7"/><rect x="174" y="244" width="6" height="7"/>
    </g>
    <path d="M214 260 L214 176 L246 148 L278 176 L278 260 Z" fill="#1b2440" stroke="#0a1020" stroke-width="2"/>
    <path d="M246 148 L246 126" stroke="#c9b9a0" stroke-width="3"/>
    <path d="M236 126 L256 126" stroke="#c9b9a0" stroke-width="3"/>
    <rect x="238" y="186" width="16" height="24" fill="#ffdc1a" opacity="0.85"/>
    <path d="M298 260 L298 196 L420 196 L420 260 Z" fill="#1b2440" stroke="#0a1020" stroke-width="2"/>
    <g fill="#0abbee" opacity="0.7">
      <rect x="310" y="208" width="14" height="12"/><rect x="332" y="208" width="14" height="12"/><rect x="354" y="208" width="14" height="12"/>
      <rect x="376" y="208" width="14" height="12"/><rect x="310" y="230" width="14" height="12"/><rect x="354" y="230" width="14" height="12"/>
    </g>
    <path d="M392 196 L392 168 L404 168 L404 196" fill="#0abbee" opacity="0.35" stroke="#0abbee" stroke-width="2"/>
    <path d="M0 290 L420 290" stroke="#0a1020" stroke-width="2"/>
    <g fill="#2b3550">
      <rect x="0" y="286" width="420" height="14"/>
    </g>
    <g stroke="#ffdc1a" stroke-width="1.4" opacity="0.5" fill="none">
      <path d="M264 96 l22 12 l24 -16 l18 22"/>
    </g>
    <g fill="#ffdc1a"><circle cx="264" cy="96" r="2.4"/><circle cx="286" cy="108" r="2.4"/><circle cx="310" cy="92" r="2.4"/><circle cx="328" cy="114" r="2.4"/></g>
    <text x="96" y="152" fill="#ffdc1a" font-family="sans-serif" font-size="11" font-weight="700" opacity="0.75">별무리 마을 · 33채</text>
  </svg>`;
}

function renderHome() {
  const started = clearedCount() > 0 || !!state.startedAt;
  const done = !!state.finishedAt;
  const next = Math.min(TOTAL, state.stage);
  app.innerHTML = `
    <section class="home">
      <div class="hero panel">
        <div class="hero-copy">
          <span class="kicker">GOODWAY APPS · 스토리 퍼즐 방탈출</span>
          <h1>정전의 밤,<br><em>15개의 봉인</em></h1>
          <p class="lede">충남 금산 별무리 마을의 가로등이 한꺼번에 꺼진 밤. 누군가 ‘비전 2020’의 기억을 담아 마을 입구부터 별드림관 옥상까지 열다섯 개의 봉인을 남겼다. 일지를 따라 단서를 모아, 마을의 기억을 되찾아라.</p>
          <div class="home-actions">
            ${done
              ? `<a class="btn primary big" href="#/clear">결과 카드 보기</a>
                 <a class="btn ghost big" href="#/map">지도 열기</a>`
              : started
                ? `<a class="btn primary big" href="#/stage/${next}">이어서 하기 · ${next}번 방</a>
                   <a class="btn ghost big" href="#/map">지도 열기</a>`
                : `<button type="button" class="btn primary big" id="home-start">플레이 시작</button>
                   <a class="btn ghost big" href="#/map">지도 보기</a>`}
          </div>
          <ul class="home-stats">
            <li><b>${clearedCount()}</b><span>/ 15 봉인 해제</span></li>
            <li><b>${fmtClock(elapsed())}</b><span>플레이 시간</span></li>
            <li><b>${totalHints()}</b><span>사용한 힌트</span></li>
          </ul>
          ${started && !done ? '<p class="home-save">진행 상황은 이 브라우저에 자동으로 저장됩니다. 창을 닫아도 이어서 할 수 있어요.</p>' : ''}
        </div>
        <div class="hero-art">${heroArt()}</div>
      </div>

      <div class="feat-grid">
        <article class="feat panel"><span class="feat-no">15</span><b>방마다 다른 퍼즐</b><p>표지판·종탑·온실·서가·서클·서버실… 열다섯 방이 모두 다른 방식의 수수께끼입니다.</p></article>
        <article class="feat panel"><span class="feat-no">3</span><b>단계별 힌트</b><p>가벼운 힌트부터 정답까지. 막히면 일지와 단서를 다시 펼쳐 보세요.</p></article>
        <article class="feat panel"><span class="feat-no">◐</span><b>밤과 낮 화면</b><p>효과음은 Web Audio 로 직접 만들고, 밤 화면과 낮 화면을 오갈 수 있습니다.</p></article>
        <article class="feat panel"><span class="feat-no">✓</span><b>자동 저장</b><p>로그인 없이 접속 즉시 플레이. 진행도·메모는 이 브라우저에만 저장됩니다.</p></article>
      </div>

      <section class="panel room-list">
        <header class="row-list-head">
          <h2>열다섯 개의 문</h2>
          <a class="btn ghost sm" href="#/map">지도로</a>
        </header>
        <ol class="room-chips">
          ${stages.map((s) => {
            const open = s.n <= state.stage || isCleared(s.n);
            return `<li class="room-chip${isCleared(s.n) ? ' clear' : ''}${open ? '' : ' locked'}">
              <a href="${open ? `#/stage/${s.n}` : '#/map'}" ${open ? '' : 'tabindex="-1" aria-disabled="true"'}>
                <span class="rc-no">${pad2(s.n)}</span>
                <span class="rc-title">${esc(s.title)}</span>
                <span class="rc-place">${esc(s.place)}</span>
              </a>
            </li>`;
          }).join('')}
        </ol>
        ${started ? '<p class="room-reset"><button type="button" class="btn ghost sm" id="home-reset">처음부터 다시 시작</button></p>' : ''}
      </section>
    </section>`;

  const start = $('#home-start');
  if (start) {
    start.addEventListener('click', () => {
      sfx.unlockAudio();
      startClock();
      save();
      location.hash = '#/stage/1';
    });
  }
  const reset = $('#home-reset');
  if (reset) armButton(reset, '한 번 더 누르면 모두 지웁니다', () => { resetAll(); toast('진행 상황을 지웠습니다.'); renderHome(); updateHud(); });
}

/* ────────────────────────────── 지도 ────────────────────────────── */

function renderMap() {
  const cleared = clearedCount();
  app.innerHTML = `
    <section class="map-screen">
      <header class="map-head panel">
        <div>
          <p class="eyebrow">정전의 밤 · 마을 지도</p>
          <h1>열다섯 개의 봉인</h1>
          <p class="map-sub">입구에서 옥상까지, 한 방씩 수수께끼를 풀어 마을의 기억을 되찾으세요.</p>
        </div>
        <div class="map-progress">
          <div class="mp-num"><b>${cleared}</b><span>/ 15</span></div>
          <div class="bar-track"><i data-w="${Math.round((cleared / TOTAL) * 100)}"></i></div>
          <span class="mp-time">${fmtClock(elapsed())}</span>
        </div>
      </header>
      <div class="room-grid">
        ${stages.map((s) => {
          const open = s.n <= state.stage || isCleared(s.n);
          const cls = isCleared(s.n) ? 'clear' : (s.n === state.stage ? 'current' : '');
          return `<${open ? 'a' : 'div'} class="room-card ${cls}${open ? '' : ' locked'}" ${open ? `href="#/stage/${s.n}"` : 'aria-disabled="true"'}>
            <span class="room-no">${pad2(s.n)}</span>
            <b class="room-title">${esc(s.title)}</b>
            <span class="room-place">${esc(s.place)}</span>
            <span class="room-state">${isCleared(s.n) ? '열림' : open ? '도전' : '잠김'}</span>
          </${open ? 'a' : 'div'}>`;
        }).join('')}
      </div>
      <p class="map-foot">막힌 방은 힌트를 세 단계까지 볼 수 있습니다. 클리어한 방은 다시 들어가 볼 수 있어요.</p>
    </section>`;

  const bar = app.querySelector('.bar-track i');
  if (bar) bar.style.setProperty('width', `${bar.dataset.w}%`);
}

/* ────────────────────────────── 방(스테이지) ────────────────────────────── */

function solvedPanel(n) {
  const stage = stages[n - 1];
  const rec = state.cleared[n];
  const isLast = n === TOTAL;
  return `
    <div class="solved">
      <span class="stamp">SEAL OPEN</span>
      <h3>봉인이 풀렸습니다</h3>
      <p class="solved-frag">“${esc(stage.fragment)}”</p>
      <div class="solved-stats">
        <span><b>${rec ? fmtClock(rec.ms) : '—'}</b>이 방에서</span>
        <span><b>${hintUsed(n)}</b>힌트</span>
      </div>
      <p class="solved-clue"><b>단서 일지에 기록</b> ${esc(stage.clue.text)}</p>
      <div class="solved-actions">
        ${isLast
          ? '<a class="btn primary" href="#/clear">결과 카드 보기</a>'
          : `<a class="btn primary" href="#/stage/${n + 1}">다음 방 · ${pad2(n + 1)}</a>`}
        <a class="btn ghost" href="#/map">지도로</a>
        <button type="button" class="btn ghost" id="replay-btn" data-stage="${n}">이 방 다시 풀기</button>
      </div>
    </div>`;
}

function mountStage(n) {
  const stage = stages[n - 1];
  const puzzle = $('#puzzle');
  if (!puzzle) return;

  let finishedHere = false;
  const api = {
    sfx,
    solve() {
      if (finishedHere) return;
      finishedHere = true;
      const first = !isCleared(n);
      if (first) {
        tick(false);
        clearStage(n, elapsed());
        save();
      }
      updateHud();
      const box = $('#puzzle');
      if (box) box.innerHTML = solvedPanel(n);
      const stateEl = $('#puzzle-state');
      if (stateEl) stateEl.textContent = '열림';
      const stageEl = $('.stage-screen');
      if (stageEl) stageEl.classList.add('is-solved');
      if (first) sfx.unlock();
      if (n === TOTAL) {
        finish();
        updateHud();
        setTimeout(() => { location.hash = '#/clear'; }, 1400);
      } else {
        toast('봉인이 풀렸습니다. 일지에 단서가 기록되었습니다.', 'good');
      }
    },
    wrong(msg, sound = true) {
      toast(msg, 'bad');
      const box = $('#puzzle');
      if (box) shake(box);
      if (sound) sfx.wrong();
    },
    ok(msg) { toast(msg, 'good'); sfx.ok(); },
  };

  try {
    stage.mount(puzzle, api);
  } catch (err) {
    console.error(err);
    puzzle.innerHTML = '<p class="notice-strong">이 방을 여는 중 문제가 생겼습니다. 지도로 돌아가 다시 들어와 주세요.</p>';
  }
}

function renderStage(n) {
  const stage = stages[n - 1];
  if (!stage) { location.hash = '#/map'; return; }
  const open = n <= state.stage || isCleared(n);
  if (!open) {
    toast('아직 잠긴 방입니다. 앞의 봉인부터 풀어 주세요.', 'bad');
    location.hash = '#/map';
    return;
  }
  startClock();
  const level = hintUsed(n);
  const solved = isCleared(n) && !replaying.has(n);

  app.innerHTML = `
    <section class="stage-screen${solved ? ' is-solved' : ''}">
      <div class="stage-bar">
        <a class="btn ghost sm" href="#/map">← 지도</a>
        <span class="stage-chip">STAGE ${pad2(n)} / ${TOTAL}</span>
        <span class="stage-place">${esc(stage.place)}</span>
        <span class="stage-tag">${esc(stage.tagline)}</span>
      </div>

      <div class="stage-grid">
        <article class="panel story">
          <p class="eyebrow">정전의 밤 · 일지 ${pad2(n)}</p>
          <h1>${esc(stage.title)}</h1>
          <p class="story-text">${esc(stage.intro)}</p>
          <figure class="art-frame">${stage.art()}</figure>
          <p class="story-note">힌트 없이 풀면 결과 카드의 등급이 올라갑니다. 막히면 오른쪽 <b>힌트</b>를 펼쳐 보세요.</p>
        </article>

        <article class="panel puzzle">
          <header class="puzzle-head">
            <h2>수수께끼</h2>
            <span class="puzzle-state" id="puzzle-state">${solved ? '열림' : '잠김'}</span>
          </header>
          <div class="puzzle-body" id="puzzle">${solved ? solvedPanel(n) : ''}</div>
          ${solved ? '' : `
          <footer class="puzzle-foot">
            <button type="button" class="btn hint-btn" id="hint-btn">${level >= 3 ? '힌트 모두 봄' : level === 0 ? '힌트 1 보기' : level === 1 ? '힌트 2 보기' : '정답 보기'}</button>
            <button type="button" class="btn ghost sm" id="puzzle-redo">이 방 새로 고침</button>
          </footer>
          <div class="hintbox" id="hintbox" ${level ? '' : 'hidden'}></div>`}
        </article>
      </div>
    </section>`;

  if (solved) return;
  mountStage(n);

  const hintBtn = $('#hint-btn');
  const hintBox = $('#hintbox');

  function paintHints() {
    const lv = hintUsed(n);
    hintBox.hidden = lv === 0;
    hintBox.innerHTML = stage.hints.slice(0, lv).map((t, i) => `
      <div class="hint lv${i + 1}">
        <b>${i === 0 ? '가벼운 힌트' : i === 1 ? '핵심 힌트' : '정답'}</b>
        <p>${esc(t)}</p>
      </div>`).join('');
    if (lv > 0) {
      hintBox.classList.remove('pop');
      void hintBox.offsetWidth;
      hintBox.classList.add('pop');
    }
    hintBtn.textContent = lv >= 3 ? '힌트 모두 봄' : lv === 0 ? '힌트 1 보기' : lv === 1 ? '힌트 2 보기' : '정답 보기';
    updateHud();
  }

  hintBtn.addEventListener('click', () => {
    const lv = revealHint(n);
    sfx.tap();
    paintHints();
    if (lv === 3) toast('정답까지 모두 열었습니다. 이제 직접 풀어 보세요.', 'good');
  });

  $('#puzzle-redo').addEventListener('click', () => {
    mountStage(n);
    sfx.tap();
    toast('이 방의 수수께끼를 처음 상태로 다시 열었습니다.');
  });

  if (hintUsed(n) > 0) paintHints();
}

/* ────────────────────────────── 클리어 결과 ────────────────────────────── */

function renderClear() {
  if (!state.finishedAt) {
    if (clearedCount() < TOTAL) { location.hash = '#/map'; return; }
    finish();
  }
  const ms = elapsed();
  const hints = totalHints();
  const rank = rankOf(ms, hints);
  const cleared = stages.filter((s) => isCleared(s.n)).length;
  app.innerHTML = `
    <section class="clear-screen">
      <div class="clear-card panel">
        <div class="clear-stars" aria-hidden="true">
          ${Array.from({ length: 18 }, (_, i) => `<i data-i="${(i * 7) % 18}"></i>`).join('')}
        </div>
        <p class="kicker">15 / 15 · 모든 봉인 해제</p>
        <h1>별무리 마을에<br>다시 불이 켜졌습니다</h1>
        <div class="rank-badge" data-rank="${rank.grade}">
          <span class="rank-grade">${rank.grade}</span>
          <span class="rank-title">${rank.title}</span>
        </div>
        <p class="rank-note">${rank.note}</p>
        <ul class="clear-stats">
          <li><b>${fmtClock(ms)}</b><span>총 플레이 시간</span></li>
          <li><b>${hints}</b><span>사용한 힌트</span></li>
          <li><b>${cleared}</b><span>연 방</span></li>
        </ul>
      </div>

      <article class="panel letter">
        <h2>비전 2020이 남긴 편지</h2>
        <ol class="letter-lines">
          ${stages.map((s) => `<li>${esc(s.fragment)}</li>`).join('')}
        </ol>
        <p class="letter-sign">— 2002년의 별무리에서, 2026년의 우리에게</p>
      </article>

      <div class="clear-actions">
        <a class="btn primary" href="#/map">지도 다시 보기</a>
        <a class="btn ghost" href="#/">처음 화면</a>
        <button type="button" class="btn ghost" id="clear-reset">처음부터 다시 도전</button>
      </div>
      <p class="clear-foot">결과는 이 브라우저에만 남습니다. 다시 도전하면 기록이 새로 시작됩니다.</p>
    </section>`;

  const reset = $('#clear-reset');
  if (reset) armButton(reset, '한 번 더 누르면 모두 지웁니다', () => {
    resetAll();
    toast('기록을 지우고 처음부터 시작합니다.');
    updateHud();
    location.hash = '#/';
  });
}

/* ────────────────────────────── 일지 · 메모 ────────────────────────────── */

function openJournal() {
  const rows = stages.filter((s) => isCleared(s.n));
  const body = rows.length
    ? `
      <p class="sheet-lede">지금까지 ${rows.length}개의 봉인을 풀었습니다. 이 방에서 모은 단서와 기억의 조각입니다.</p>
      <ol class="journal-list">
        ${rows.map((s) => `
          <li>
            <div class="jl-head"><span class="jl-no">${pad2(s.n)}</span><b>${esc(s.title)}</b><span class="jl-place">${esc(s.place)}</span></div>
            <p class="jl-frag">“${esc(s.fragment)}”</p>
            <p class="jl-clue"><b>단서</b> ${esc(s.clue.text)}</p>
          </li>`).join('')}
      </ol>`
    : '<p class="sheet-lede">아직 기록이 없습니다. 첫 번째 방의 봉인을 풀면 이곳에 단서가 쌓입니다.</p>';
  openSheet('단서 일지', body);
}

function openNotes() {
  openSheet('메모장', `
    <p class="sheet-lede">추리 메모는 이 브라우저에 자동 저장됩니다. 직접 적은 내용은 결과 카드에 포함되지 않습니다.</p>
    <textarea class="notes-area" id="notes-area" aria-label="메모장" placeholder="예) 2번 방 — 노란 집이 1번, 파란 집은 빨간 집 왼쪽…">${esc(state.notes)}</textarea>
    <p class="notes-save" id="notes-save">자동 저장</p>`);
  const area = $('#notes-area');
  let timer = null;
  area.addEventListener('input', () => {
    state.notes = area.value.slice(0, 20000);
    clearTimeout(timer);
    timer = setTimeout(() => {
      save();
      const note = $('#notes-save');
      if (note) {
        const t = new Date();
        note.textContent = `저장됨 · ${pad2(t.getHours())}:${pad2(t.getMinutes())}`;
      }
    }, 400);
  });
  area.focus();
}

/* ────────────────────────────── 라우터 ────────────────────────────── */

function route() {
  const raw = location.hash.replace(/^#\/?/, '');
  closeSheet();
  window.scrollTo({ top: 0, behavior: 'auto' });
  if (raw.startsWith('stage/')) {
    const n = Number(raw.slice(6));
    if (Number.isInteger(n) && n >= 1 && n <= TOTAL) renderStage(n);
    else renderMap();
  } else if (raw === 'map') {
    renderMap();
  } else if (raw === 'clear') {
    renderClear();
  } else {
    renderHome();
  }
  updateHud();
}

/* ────────────────────────────── 시작 ────────────────────────────── */

applyTheme(state.settings.theme);
applySound(state.settings.sound);

$('#btn-theme').addEventListener('click', toggleTheme);
$('#btn-sound').addEventListener('click', toggleSound);
$('#btn-journal').addEventListener('click', openJournal);
$('#btn-notes').addEventListener('click', openNotes);
$('#sheet-close').addEventListener('click', closeSheet);
$('#sheet').addEventListener('click', (e) => { if (e.target.dataset.close === '1') closeSheet(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });

document.addEventListener('click', (e) => {
  const replay = e.target.closest('#replay-btn');
  if (!replay) return;
  const n = Number(replay.dataset.stage);
  if (!n) return;
  replaying.add(n);
  renderStage(n);
  toast('이 방의 수수께끼를 다시 열었습니다.');
});

window.addEventListener('hashchange', route);
document.addEventListener('visibilitychange', () => { tick(true); updateHud(); });
setInterval(() => { tick(false); updateHud(); }, 1000);
setInterval(() => { if (state.startedAt && !state.finishedAt) tick(true); }, 15000);

route();
