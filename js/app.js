'use strict';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const app = $('#app');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.floor(Math.random() * a.length)];

// ---------- İçerik ----------
const WORDS = [];
THEMES.forEach(t => t.words.forEach((w, i) => WORDS.push({ id: `${t.id}-${i}`, theme: t.id, fr: w[0], tr: w[1], ex: w[2], exTr: w[3], g: w[4] || '', note: w[5] || '' })));
const SENTS = SENTENCES.map((s, i) => ({ id: `s-${i}`, theme: 'sent', fr: s[0], tr: s[1] }));
const THEME = Object.fromEntries(THEMES.map(t => [t.id, t]));

// ---------- Kayıt (telefonda saklanır) ----------
const KEY = 'neslihan-fr-v1';
const fresh = () => ({ items: {}, log: [], days: {}, drafts: {}, done: {}, plan: {}, intro: '' });
let S;
try { S = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY)) || {}); } catch { S = fresh(); }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };

const today = () => { const d = new Date(); return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 864e5); };
const GOAL = 30;

// Aralıklı tekrar (Leitner): kutu 0–5, bildikçe tekrar aralığı uzar
const INTERVAL = [0, 1, 3, 7, 14, 30];
const st = id => S.items[id] || (S.items[id] = { b: 0, d: 0, r: 0, w: 0, n: 0 });

// ok: 1 doğru, 0.5 yarım doğru (aksan/artikel), 0 yanlış
function record(mode, id, ok) {
  const s = st(id), t = today();
  s.n++;
  if (ok === 1) { s.r++; s.b = Math.min(s.b + 1, 5); s.d = t + INTERVAL[s.b]; }
  else if (ok === 0) { s.w++; s.b = s.b > 2 ? 1 : 0; s.d = t; }
  else { s.d = t + 1; }
  S.log.push({ t: Date.now(), m: mode, id, ok });
  if (S.log.length > 3000) S.log = S.log.slice(-3000);
  S.days[t] = (S.days[t] || 0) + 1;
  save();
}

function queue(pool, n, newMax) {
  const t = today(), due = [], unseen = [], rest = [];
  pool.forEach(x => { const s = S.items[x.id]; if (!s || !s.n) unseen.push(x); else if (s.d <= t) due.push(x); else rest.push(x); });
  const I = x => S.items[x.id];
  due.sort((a, b) => I(a).d - I(b).d || I(a).b - I(b).b);
  rest.sort((a, b) => I(a).b - I(b).b || I(a).d - I(b).d);
  let q = due.slice(0, n);
  q = q.concat(unseen.slice(0, Math.max(0, Math.min(newMax, n - q.length))));
  q = q.concat(rest.slice(0, Math.max(0, n - q.length)));
  q = q.concat(unseen.slice(newMax, newMax + Math.max(0, n - q.length)));
  return shuffle(q);
}

function poolFor(arg) {
  if (arg === 'sent') return { pool: SENTS, newMax: 4, label: '💬 Cümleler' };
  if (THEME[arg]) return { pool: WORDS.filter(w => w.theme === arg), newMax: 20, label: THEME[arg].emoji + ' ' + THEME[arg].name };
  return { pool: WORDS, newMax: 5, label: '🧠 Akıllı Tekrar' };
}

const dueCount = () => { const t = today(); return WORDS.filter(w => { const s = S.items[w.id]; return s && s.n && s.d <= t; }).length; };
function streak() {
  let d = today(), c = 0;
  if (!S.days[d]) d--;
  while (S.days[d]) { c++; d--; }
  return c;
}

// ---------- Ses ----------
let frVoice = null;
function pickVoice() {
  const v = speechSynthesis.getVoices();
  frVoice = v.find(x => x.lang === 'fr-FR' && /premium|enhanced|amélie|thomas/i.test(x.name)) || v.find(x => x.lang === 'fr-FR') || v.find(x => /^fr/i.test(x.lang)) || null;
}
if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
function say(text, slow) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'fr-FR';
  if (frVoice) u.voice = frVoice;
  u.rate = slow ? 0.55 : 0.9;
  speechSynthesis.speak(u);
}

let ac;
function beep(ok) {
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    (ok ? [660, 880] : [330, 247]).forEach((f, i) => {
      const o = ac.createOscillator(), g = ac.createGain(), t0 = ac.currentTime + i * 0.11;
      o.type = ok ? 'sine' : 'triangle'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.2, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
      o.connect(g).connect(ac.destination); o.start(t0); o.stop(t0 + 0.2);
    });
  } catch {}
}

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

// ---------- Karşılaştırma ----------
const norm = s => s.normalize('NFC').toLowerCase().replace(/[’‘`´]/g, "'").replace(/[.,!?;:«»"()…]/g, ' ').replace(/'\s+/g, "'").replace(/\s+/g, ' ').trim();
const plain = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/œ/g, 'oe').replace(/æ/g, 'ae');
const noArt = s => s.replace(/^(le|la|les|un|une|des) /, '').replace(/^l'/, '');

function compare(input, target) {
  const a = norm(input), b = norm(target);
  if (!a) return { ok: 0 };
  if (a === b) return { ok: 1 };
  if (plain(a) === plain(b)) return { ok: 0.5, why: 'Aksanlara dikkat! (é, è, à, ç…)' };
  if (b.split(' ').length > 1 && (a === noArt(b) || plain(a) === plain(noArt(b)))) return { ok: 0.5, why: 'Artikeli unutma! (le / la / l’…)' };
  return { ok: 0 };
}

// Hedef cümlenin kelimelerini renklendirir: yeşil doğru, turuncu aksan hatası, kırmızı eksik/yanlış
function diffWords(input, target) {
  const T = target.split(/\s+/).map(raw => ({ raw, n: norm(raw) }));
  const C = T.filter(t => t.n);
  const A = norm(input).split(' ').filter(Boolean);
  const m = C.length, n = A.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--)
    dp[i][j] = plain(C[i].n) === plain(A[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  let i = 0, j = 0, hits = 0;
  while (i < m && j < n) {
    if (plain(C[i].n) === plain(A[j])) { C[i].cls = C[i].n === A[j] ? 'w-ok' : 'w-acc'; hits++; i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++;
  }
  const html = T.map(t => `<span class="${t.n ? (t.cls || 'w-bad') : ''}">${esc(t.raw)}</span>`).join(' ');
  return { html, score: m ? hits / m : 0 };
}

// ---------- Kedi ----------
function cat(mood = 'normal') {
  const eyes = {
    normal: `<g class="eyes"><circle cx="78" cy="96" r="14" fill="#fff"/><circle cx="122" cy="96" r="14" fill="#fff"/><circle cx="81" cy="98" r="8" fill="#24123F"/><circle cx="125" cy="98" r="8" fill="#24123F"/><circle cx="84" cy="94" r="3" fill="#fff"/><circle cx="128" cy="94" r="3" fill="#fff"/></g>`,
    happy: `<path d="M65 100 Q78 84 91 100 M109 100 Q122 84 135 100" stroke="#24123F" stroke-width="6" fill="none" stroke-linecap="round"/>`,
    sad: `<circle cx="78" cy="98" r="13" fill="#fff"/><circle cx="122" cy="98" r="13" fill="#fff"/><circle cx="78" cy="103" r="7" fill="#24123F"/><circle cx="122" cy="103" r="7" fill="#24123F"/><path d="M64 82 L90 74 M136 82 L110 74" stroke="#24123F" stroke-width="5" stroke-linecap="round"/>`,
  }[mood];
  const mouth = {
    normal: `<path d="M90 117 Q95 123 100 117 Q105 123 110 117" stroke="#24123F" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    happy: `<path d="M86 115 Q100 138 114 115 Z" fill="#24123F" stroke="#24123F" stroke-width="3" stroke-linejoin="round"/><path d="M93 125 Q100 120 107 125 Q100 133 93 125 Z" fill="#FF7A8A"/>`,
    sad: `<path d="M90 126 Q100 116 110 126" stroke="#24123F" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  }[mood];
  return `<svg class="cat cat-${mood}" viewBox="0 0 200 200" aria-hidden="true">
    <ellipse cx="100" cy="192" rx="58" ry="7" fill="#000" opacity=".22"/>
    <path class="tail" d="M146 170 C184 168 188 128 168 114 C158 107 149 116 157 124" stroke="#6A3FC8" stroke-width="15" fill="none" stroke-linecap="round"/>
    <ellipse cx="100" cy="154" rx="54" ry="38" fill="#6A3FC8"/>
    <ellipse cx="100" cy="162" rx="32" ry="24" fill="#B9A0F5"/>
    <ellipse cx="80" cy="188" rx="15" ry="9" fill="#8A5CE6"/><ellipse cx="120" cy="188" rx="15" ry="9" fill="#8A5CE6"/>
    <path d="M50 80 L48 28 L92 54 Z" fill="#8A5CE6" stroke="#8A5CE6" stroke-width="12" stroke-linejoin="round"/>
    <path d="M150 80 L152 28 L108 54 Z" fill="#8A5CE6" stroke="#8A5CE6" stroke-width="12" stroke-linejoin="round"/>
    <path d="M58 68 L57 42 L79 56 Z" fill="#FFA463" stroke="#FFA463" stroke-width="6" stroke-linejoin="round"/>
    <path d="M142 68 L143 42 L121 56 Z" fill="#FFA463" stroke="#FFA463" stroke-width="6" stroke-linejoin="round"/>
    <circle cx="100" cy="98" r="58" fill="#8A5CE6"/>
    <ellipse cx="66" cy="72" rx="12" ry="6" fill="#fff" opacity=".22" transform="rotate(-40 66 72)"/>
    <ellipse cx="104" cy="45" rx="36" ry="12" fill="#FF8C42" transform="rotate(-8 104 45)"/>
    <rect x="102" y="27" width="6" height="10" rx="3" fill="#FF8C42"/>
    <ellipse cx="62" cy="116" rx="11" ry="7" fill="#FF8C42" opacity=".55"/><ellipse cx="138" cy="116" rx="11" ry="7" fill="#FF8C42" opacity=".55"/>
    ${eyes}
    <path d="M94 108 Q100 105 106 108 Q100 116 94 108 Z" fill="#FF7A45"/>
    ${mouth}
    <path d="M44 106 L22 101 M44 114 L21 117 M156 106 L178 101 M156 114 L179 117" stroke="#5A35B0" stroke-width="3" stroke-linecap="round"/>
  </svg>`;
}

// ---------- Ortak parçalar ----------
const go = h => { location.hash = h; };
const topbar = (title, back = '#/menu') => `<header class="top"><a class="back" href="${back}" aria-label="Geri">‹</a><h2>${title}</h2></header>`;
const bar = (i, n) => `<div class="pbar"><div style="width:${Math.round(100 * i / n)}%"></div></div>`;
const gBadge = g => g ? `<span class="badge ${g}">${g === 'm' ? 'eril · le' : 'dişil · la'}</span>` : '';
const ACCENTS = ['é', 'è', 'ê', 'à', 'â', 'ç', 'ù', 'û', 'î', 'ï', 'ô', 'œ', 'ë', "'"];
const accentBar = () => `<div class="accents">${ACCENTS.map(a => `<button type="button" class="acc" data-a="${a}">${a}</button>`).join('')}</div>`;
function wireAccents(input) {
  $$('.acc').forEach(b => b.onclick = () => {
    const s = input.selectionStart ?? input.value.length, e = input.selectionEnd ?? s;
    input.value = input.value.slice(0, s) + b.dataset.a + input.value.slice(e);
    input.focus(); input.setSelectionRange(s + 1, s + 1);
    input.dispatchEvent(new Event('input'));
  });
}
const PRAISE = ['Bravo !', 'Super !', 'Très bien !', 'Parfait !', 'Excellent !'];
const CHEER = ['Pas grave !', 'Courage !', 'On continue !'];

function finish(title, right, total, again) {
  const pct = total ? Math.round(100 * right / total) : 0;
  const mood = pct >= 60 ? 'happy' : 'sad';
  app.innerHTML = `${topbar(title)}
    <section class="center pop">
      <div class="cat-wrap big">${cat(mood)}</div>
      <h1 class="score">${right} / ${total}</h1>
      <p class="lead">${pct >= 80 ? 'Harikasın Neslihan! 🎉' : pct >= 60 ? 'Çok iyi gidiyorsun! 💪' : 'Tekrar ettikçe kolaylaşacak 💜'}</p>
      <div class="stack">
        <button class="btn" id="again">🔁 Bir tur daha</button>
        <a class="btn purple" href="#/menu">🏠 Menü</a>
      </div>
    </section>`;
  if (pct >= 60) say(pick(PRAISE));
  $('#again').onclick = again;
}

// ---------- Ekranlar ----------
function splash() {
  app.innerHTML = `<section class="splash center">
    <div class="cat-wrap huge float">${cat('happy')}</div>
    <h1 class="title">Neslihan<br><span>Fransızca Öğreniyor</span></h1>
    <p class="subtitle">Neslihan apprend le français 🇫🇷</p>
    <button class="btn big" id="start">Allons-y ! · Başlayalım</button>
    <p class="hint">🔈 Ses gelmezse telefonun sessiz modunu kapat.<br>📲 Uygulama gibi kullanmak için: Paylaş ⬆️ → “Ana Ekrana Ekle”</p>
  </section>`;
  $('#start').onclick = () => { say('Bonjour Neslihan !'); go('#/menu'); };
}

const MODES = [
  { id: 'cards', emoji: '🃏', name: 'Kelime Kartları', sub: 'Öğren & tekrar et', color: 'c1' },
  { id: 'quiz', emoji: '✅', name: 'Kelime Testi', sub: 'Doğru anlamı seç', color: 'c2' },
  { id: 'gram', emoji: '📐', name: 'Gramer', sub: '7 konu', color: 'c3' },
  { id: 'oral', emoji: '🎤', name: 'Sözlü Sınav', sub: 'Tanıtma · monolog · diyalog', color: 'c4' },
  { id: 'listen', emoji: '🎧', name: 'Dinle & Yaz', sub: 'Yazım çalış', color: 'c3' },
  { id: 'speak', emoji: '🗣️', name: 'Dinle & Söyle', sub: 'Telaffuz çalış', color: 'c4' },
  { id: 'read', emoji: '📖', name: 'Okuma', sub: 'İlan, e-posta, mesaj', color: 'c1' },
  { id: 'write', emoji: '✍️', name: 'Yazma Atölyesi', sub: 'DELF yazılı', color: 'c2' },
  { id: 'order', emoji: '🧩', name: 'Cümle Kur', sub: 'Kelimeleri sırala', color: 'c2' },
  { id: 'plan', emoji: '🗓️', name: 'Programım', sub: 'Gün gün plan', color: 'c1' },
  { id: 'stats', emoji: '📊', name: 'İlerlemem', sub: 'Doğru / yanlış', color: 'c4' },
  { id: 'delf', emoji: '🎓', name: 'DELF A2 Nedir?', sub: 'Sınav rehberi', color: 'c3' },
];

// ---------- Çalışma programı ----------
const dayOf = s => { const [y, m, d] = s.split('-').map(Number); return Math.floor(Date.UTC(y, m - 1, d) / 864e5); };
const fmtDay = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' }); };
const daysLeft = () => dayOf(EXAM_DATE) - today();
const taskLink = ([label, href]) => !href ? `<span class="task">${label}</span>`
  : href.startsWith('#') ? `<a class="task" href="${href}">${label} <i>›</i></a>`
  : `<a class="task" href="${href}" target="_blank" rel="noopener">${label} <i>↗</i></a>`;

function dayCard(p, isToday) {
  const done = S.plan[p[0]];
  return `<div class="card day ${isToday ? 'today' : ''} ${done ? 'done' : ''}" id="d-${p[0]}">
    <div class="day-head"><small>${fmtDay(p[0])}${isToday ? ' · BUGÜN' : ''}</small><b>${p[1]}</b></div>
    <div class="tasks">${p[2].map(taskLink).join('')}</div>
    <button class="check-day" data-day="${p[0]}">${done ? '✅ Tamamlandı' : '⬜ Bugünü tamamladım'}</button>
  </div>`;
}
function wireDays(rerender) {
  $$('.check-day').forEach(b => b.onclick = () => {
    const d = b.dataset.day; S.plan[d] = !S.plan[d]; save();
    if (S.plan[d]) { beep(true); say('Bravo !'); }
    rerender();
  });
}

function plan() {
  app.innerHTML = `${topbar('🗓️ Programım')}
    <div class="countdown"><b>${Math.max(0, daysLeft())}</b><span>gün kaldı<br><small>Sınav: 3 Kasım</small></span></div>
    <div class="card tipcard"><b>Her gün ~75 dk:</b> 15 dk gramer · 15 dk dinleme · 15 dk okuma/yazma · 20 dk sesli konuşma · 10 dk kelime. Yorgun bir günde sadece 🎤 konuşma + 🧠 kelime yeterli. 💜</div>
    ${PLAN.map(p => dayCard(p, dayOf(p[0]) === today())).join('')}`;
  wireDays(plan);
  const el = $('.day.today'); if (el) el.scrollIntoView({ block: 'center' });
}

function menu() {
  const done = S.days[today()] || 0, due = dueCount(), str = streak();
  const pct = Math.min(100, Math.round(100 * done / GOAL));
  const tp = PLAN.find(p => dayOf(p[0]) === today()), left = daysLeft();
  app.innerHTML = `<section>
    <div class="hello">
      <div class="cat-wrap small">${cat(done >= GOAL ? 'happy' : 'normal')}</div>
      <div>
        <h1>Bonjour Neslihan !</h1>
        <p>🔥 ${str} gün seri · Bugün ${done}/${GOAL}</p>
        <div class="pbar light"><div style="width:${pct}%"></div></div>
      </div>
    </div>
    ${left >= 0 ? `<div class="countdown small-cd"><b>${left}</b><span>${left ? 'gün kaldı · DELF A2 · 3 Kasım' : 'Bugün sınav günü! Bonne chance ! 🍀'}</span></div>` : ''}
    ${tp ? dayCard(tp, true) : ''}
    <a class="banner" href="#/cards/smart">
      <span class="big-emoji">🧠</span>
      <span><b>${due ? `Bugün ${due} kelime seni bekliyor` : 'Akıllı kelime tekrarı'}</b><br><small>Unutmadan önce tekrar et</small></span>
      <span class="arrow">›</span>
    </a>
    <nav class="grid">
      ${MODES.map(m => `<a class="tile ${m.color}" href="${['cards', 'quiz', 'listen', 'speak'].includes(m.id) ? '#/pick/' + m.id : '#/' + m.id}">
        <span class="t-emoji">${m.emoji}</span><b>${m.name}</b><small>${m.sub}</small></a>`).join('')}
    </nav>
  </section>`;
  wireDays(menu);
}

function pickScreen(mode) {
  const m = MODES.find(x => x.id === mode) || MODES[0];
  const themeProg = t => {
    const ws = WORDS.filter(w => w.theme === t.id);
    return Math.round(100 * ws.filter(w => (S.items[w.id]?.b || 0) >= 3).length / ws.length);
  };
  const withSent = mode === 'listen' || mode === 'speak';
  app.innerHTML = `${topbar(m.emoji + ' ' + m.name)}
    <p class="lead">Ne çalışmak istersin?</p>
    <div class="list">
      ${withSent && mode === 'speak' ? `<a class="row hot" href="#/${mode}/sent"><span class="r-emoji">💬</span><span><b>Cümleler</b><small>Günlük hayat cümleleri</small></span></a>` : ''}
      <a class="row hot" href="#/${mode}/smart"><span class="r-emoji">🧠</span><span><b>Akıllı Tekrar</b><small>Sıradaki kelimeler + birkaç yeni kelime</small></span></a>
      ${withSent && mode === 'listen' ? `<a class="row hot" href="#/${mode}/sent"><span class="r-emoji">💬</span><span><b>Cümleler</b><small>Dikte: duyduğun cümleyi yaz</small></span></a>` : ''}
      ${THEMES.map(t => `<a class="row" href="#/${mode}/${t.id}"><span class="r-emoji">${t.emoji}</span>
        <span><b>${t.name}</b><small>${t.words.length} kelime · %${themeProg(t)} öğrenildi</small><span class="mini"><i style="width:${themeProg(t)}%"></i></span></span></a>`).join('')}
    </div>`;
}

// --- Kelime kartları ---
function cards(arg) {
  const P = poolFor(arg);
  let q = queue(P.pool, 10, P.newMax), i = 0, right = 0, total = 0;
  const again = {};
  const show = () => {
    if (i >= q.length) return finish('🃏 Kelime Kartları', right, total, () => cards(arg));
    const w = q[i], isNew = !S.items[w.id]?.n;
    app.innerHTML = `${topbar('🃏 ' + P.label, '#/pick/cards')}${bar(i, q.length)}
      <div class="card flash" id="card">
        <div class="meta">${THEME[w.theme].emoji} ${isNew ? '<span class="badge new">YENİ</span>' : ''} ${gBadge(w.g)}</div>
        <div class="fr">${esc(w.fr)}</div>
        <div class="sounds"><button class="round" data-say="${esc(w.fr)}">🔊</button><button class="round alt" data-slow="${esc(w.fr)}">🐢</button></div>
        <div class="back hidden" id="back">
          <div class="tr">${esc(w.tr)}</div>
          ${w.note ? `<div class="note">💡 ${esc(w.note)}</div>` : ''}
          <div class="ex"><button class="mini-say" data-say="${esc(w.ex)}">🔊</button> <span>${esc(w.ex)}</span><small>${esc(w.exTr)}</small></div>
        </div>
        <p class="tap" id="tap">👆 Anlamını görmek için dokun</p>
      </div>
      <div class="answer hidden" id="ans">
        <button class="btn red" id="no">😕 Bilemedim</button>
        <button class="btn green" id="yes">😊 Bildim</button>
      </div>`;
    wireSay();
    say(w.fr);
    const reveal = () => { $('#back').classList.remove('hidden'); $('#tap').remove(); $('#ans').classList.remove('hidden'); $('#card').onclick = null; };
    $('#card').onclick = e => { if (!e.target.closest('button')) reveal(); };
    $('#yes').onclick = () => { record('cards', w.id, 1); right++; total++; i++; show(); };
    $('#no').onclick = () => {
      record('cards', w.id, 0); total++;
      again[w.id] = (again[w.id] || 0) + 1;
      if (again[w.id] <= 2) q.push(w); // bilinmeyen kart tur sonunda tekrar gelir
      i++; show();
    };
  };
  show();
}

function wireSay() {
  $$('[data-say]').forEach(b => b.onclick = e => { e.stopPropagation(); say(b.dataset.say); });
  $$('[data-slow]').forEach(b => b.onclick = e => { e.stopPropagation(); say(b.dataset.slow, true); });
}

// --- Kelime testi ---
function quiz(arg) {
  const P = poolFor(arg);
  const q = queue(P.pool, 10, P.newMax);
  let i = 0, right = 0;
  const show = () => {
    if (i >= q.length) return finish('✅ Kelime Testi', right, q.length, () => quiz(arg));
    const w = q[i];
    const type = pick(['fr2tr', 'fr2tr', 'tr2fr', 'audio']);
    const field = type === 'tr2fr' ? 'fr' : 'tr';
    const same = shuffle(WORDS.filter(x => x.theme === w.theme && x.id !== w.id));
    const others = shuffle(WORDS.filter(x => x.theme !== w.theme));
    const opts = [w];
    for (const x of [...same, ...others]) { if (opts.length === 4) break; if (!opts.some(o => o[field] === x[field])) opts.push(x); }
    const prompt = type === 'fr2tr' ? `<div class="fr">${esc(w.fr)}</div><button class="round" data-say="${esc(w.fr)}">🔊</button><p class="q">Türkçesi ne?</p>`
      : type === 'tr2fr' ? `<div class="tr big">${esc(w.tr)}</div><p class="q">Fransızcası hangisi?</p>`
      : `<button class="round huge-btn" data-say="${esc(w.fr)}">🔊</button><p class="q">Dinle! Ne demek?</p><div class="fr hidden" id="reveal">${esc(w.fr)}</div>`;
    app.innerHTML = `${topbar('✅ ' + P.label, '#/pick/quiz')}${bar(i, q.length)}
      <div class="card center">${prompt}</div>
      <div class="opts">${shuffle(opts).map(o => `<button class="opt" data-id="${o.id}">${esc(o[field])}</button>`).join('')}</div>
      <div class="feedback" id="fb"></div>`;
    wireSay();
    if (type !== 'tr2fr') say(w.fr);
    $$('.opt').forEach(b => b.onclick = () => {
      const ok = b.dataset.id === w.id;
      $$('.opt').forEach(x => { x.disabled = true; if (x.dataset.id === w.id) x.classList.add('ok'); });
      if (!ok) b.classList.add('bad');
      $('#reveal')?.classList.remove('hidden');
      record('quiz', w.id, ok ? 1 : 0);
      beep(ok);
      if (ok) right++;
      $('#fb').innerHTML = `<div class="fb-row">${cat(ok ? 'happy' : 'sad')}<div><b>${ok ? pick(PRAISE) : pick(CHEER)}</b><br>${esc(w.fr)} = ${esc(w.tr)}</div></div>
        <button class="btn" id="next">Devam ›</button>`;
      setTimeout(() => say(w.fr), 250);
      $('#next').onclick = () => { i++; show(); };
    });
  };
  show();
}

// --- Dinle & Yaz (dikte) ---
function listen(arg) {
  const P = poolFor(arg);
  const q = queue(P.pool, 8, P.newMax);
  let i = 0, right = 0;
  const show = () => {
    if (i >= q.length) return finish('🎧 Dinle & Yaz', right, q.length, () => listen(arg));
    const w = q[i];
    app.innerHTML = `${topbar('🎧 ' + P.label, '#/pick/listen')}${bar(i, q.length)}
      <div class="card center">
        <p class="q">Dinle ve duyduğunu yaz</p>
        <div class="sounds"><button class="round huge-btn" data-say="${esc(w.fr)}">🔊</button><button class="round alt" data-slow="${esc(w.fr)}">🐢</button></div>
        <button class="link" id="hint">💡 İpucu: Türkçesi</button>
        <div class="tr hidden" id="hintTxt">${esc(w.tr)}</div>
      </div>
      <input class="field" id="inp" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Buraya yaz…">
      ${accentBar()}
      <button class="btn wide" id="check">Kontrol et</button>
      <div class="feedback" id="fb"></div>`;
    wireSay();
    const inp = $('#inp');
    wireAccents(inp);
    say(w.fr);
    $('#hint').onclick = () => $('#hintTxt').classList.remove('hidden');
    const check = () => {
      if (!inp.value.trim()) return inp.focus();
      const r = compare(inp.value, w.fr);
      record('listen', w.id, r.ok);
      beep(r.ok > 0);
      if (r.ok === 1) right++;
      inp.disabled = true; $('#check').remove(); $('.accents').remove();
      const d = diffWords(inp.value, w.fr);
      $('#fb').innerHTML = `<div class="fb-row">${cat(r.ok === 1 ? 'happy' : r.ok ? 'normal' : 'sad')}<div>
          <b>${r.ok === 1 ? pick(PRAISE) : r.ok ? 'Neredeyse!' : pick(CHEER)}</b>${r.why ? `<br>${r.why}` : ''}
          <div class="answer-line">${d.html}</div><small>${esc(w.tr)}</small></div></div>
        <button class="btn" id="next">Devam ›</button>`;
      say(w.fr);
      $('#next').onclick = () => { i++; show(); };
    };
    $('#check').onclick = check;
    inp.onkeydown = e => { if (e.key === 'Enter') check(); };
  };
  show();
}

// --- Dinle & Söyle (telaffuz) ---
function speak(arg) {
  const P = poolFor(arg || 'sent');
  const q = queue(P.pool, 6, P.newMax);
  let i = 0, right = 0;
  const show = () => {
    if (i >= q.length) return finish('🗣️ Dinle & Söyle', right, q.length, () => speak(arg));
    const w = q[i];
    app.innerHTML = `${topbar('🗣️ ' + P.label, '#/pick/speak')}${bar(i, q.length)}
      <div class="card center">
        <div class="fr">${esc(w.fr)}</div>
        <div class="tr">${esc(w.tr)}</div>
        <div class="sounds"><button class="round" data-say="${esc(w.fr)}">🔊</button><button class="round alt" data-slow="${esc(w.fr)}">🐢</button></div>
      </div>
      <p class="lead small">1️⃣ Dinle &nbsp; 2️⃣ Yüksek sesle tekrar et ${SR ? '&nbsp; 3️⃣ 🎤’a bas ve söyle' : ''}</p>
      ${SR ? `<button class="btn mic wide" id="mic">🎤 Söyle</button>` : ''}
      <div class="feedback" id="fb"></div>
      <div class="answer">
        <button class="btn red" id="no">🔁 Zorlandım</button>
        <button class="btn green" id="yes">👍 Söyledim</button>
      </div>`;
    wireSay();
    say(w.fr);
    const next = ok => { record('speak', w.id, ok); if (ok === 1) right++; i++; show(); };
    $('#yes').onclick = () => next(1);
    $('#no').onclick = () => next(0);
    if (SR) $('#mic').onclick = () => {
      speechSynthesis.cancel();
      const mic = $('#mic');
      mic.textContent = '👂 Dinliyorum…'; mic.classList.add('on');
      let got = false;
      try {
        const r = new SR();
        r.lang = 'fr-FR'; r.interimResults = false; r.maxAlternatives = 3;
        r.onresult = e => {
          got = true;
          const best = [...e.results[0]].map(a => ({ t: a.transcript, d: diffWords(a.transcript, w.fr) })).sort((a, b) => b.d.score - a.d.score)[0];
          const pct = Math.round(best.d.score * 100), ok = pct >= 80;
          beep(ok);
          $('#fb').innerHTML = `<div class="fb-row">${cat(ok ? 'happy' : pct >= 50 ? 'normal' : 'sad')}<div>
            <b>${ok ? pick(PRAISE) : pct >= 50 ? 'Güzel, biraz daha!' : 'Bir daha deneyelim!'} (%${pct})</b>
            <div class="answer-line">${best.d.html}</div><small>Duyduğum: “${esc(best.t)}”</small></div></div>`;
        };
        r.onerror = e => { $('#fb').innerHTML = `<p class="warn">Mikrofon çalışmadı (${esc(e.error)}). Yüksek sesle söyleyip 👍’a basabilirsin.</p>`; };
        r.onend = () => { mic.textContent = '🎤 Tekrar söyle'; mic.classList.remove('on'); if (!got && !$('#fb').innerHTML) $('#fb').innerHTML = '<p class="warn">Seni duyamadım, tekrar dener misin?</p>'; };
        r.start();
      } catch { mic.remove(); }
    };
  };
  show();
}

// --- Cümle kur ---
function order() {
  const q = queue(SENTS, 6, 4);
  let i = 0, right = 0;
  const show = () => {
    if (i >= q.length) return finish('🧩 Cümle Kur', right, q.length, order);
    const w = q[i];
    const end = (w.fr.match(/\s*[?!.]$/) || [''])[0];
    const words = w.fr.slice(0, w.fr.length - end.length).split(' ');
    let pool = shuffle(words.map((t, k) => ({ t, k })));
    if (words.length > 1) while (pool.map(p => p.t).join(' ') === words.join(' ')) pool = shuffle(pool);
    const chosen = [];
    app.innerHTML = `${topbar('🧩 Cümle Kur')}${bar(i, q.length)}
      <div class="card center"><p class="q">Bu cümleyi Fransızca kur:</p><div class="tr big">${esc(w.tr)}</div></div>
      <div class="built" id="built"></div>
      <div class="pool" id="pool"></div>
      <button class="btn wide" id="check" disabled>Kontrol et</button>
      <div class="feedback" id="fb"></div>`;
    const draw = () => {
      $('#built').innerHTML = chosen.map((p, k) => `<button class="chip on" data-k="${k}">${esc(p.t)}</button>`).join('') + (chosen.length ? `<span class="end">${esc(end.trim())}</span>` : '<span class="ph">Kelimelere sırayla dokun 👇</span>');
      $('#pool').innerHTML = pool.map((p, k) => `<button class="chip" data-k="${k}">${esc(p.t)}</button>`).join('');
      $$('#pool .chip').forEach(b => b.onclick = () => { chosen.push(pool.splice(+b.dataset.k, 1)[0]); draw(); });
      $$('#built .chip').forEach(b => b.onclick = () => { pool.push(chosen.splice(+b.dataset.k, 1)[0]); draw(); });
      $('#check').disabled = pool.length > 0;
    };
    draw();
    $('#check').onclick = () => {
      const ok = chosen.map(p => p.t).join(' ') === words.join(' ');
      record('order', w.id, ok ? 1 : 0);
      beep(ok);
      if (ok) right++;
      $$('#built .chip, #pool .chip').forEach(b => b.disabled = true);
      $('#built').classList.add(ok ? 'ok' : 'bad');
      $('#check').remove();
      $('#fb').innerHTML = `<div class="fb-row">${cat(ok ? 'happy' : 'sad')}<div><b>${ok ? pick(PRAISE) : 'Doğrusu:'}</b><div class="answer-line">${esc(w.fr)}</div></div></div>
        <button class="btn" id="next">Devam ›</button>`;
      say(w.fr);
      $('#next').onclick = () => { i++; show(); };
    };
  };
  show();
}

// --- Yazma atölyesi ---
const countWords = t => (t.match(/[A-Za-zÀ-ÿœŒ0-9]+(?:['’-][A-Za-zÀ-ÿœŒ0-9]+)*/g) || []).length;

function write(id) {
  if (!id) {
    app.innerHTML = `${topbar('✍️ Yazma Atölyesi')}
      <div class="card tipcard"><b>DELF A2 yazılı sınavı:</b> 2 kısa metin yazarsın (her biri 60–80 kelime). Biri bir olayı/deneyimi anlatmak, diğeri mesaj yazmak (davet etmek, kabul/ret, teşekkür, bilgi istemek). Selamlama ve vedalaşmayı unutma! 💜</div>
      <div class="list">${WRITING.map(w => `<a class="row" href="#/write/${w.id}"><span class="r-emoji">${w.emoji}</span>
        <span><b>${w.title}</b><small>${S.done[w.id] ? `✅ ${S.done[w.id]} kez yazıldı` : (S.drafts[w.id] ? '📝 Taslak var' : 'Henüz yazılmadı')}</small></span></a>`).join('')}</div>`;
    return;
  }
  const T = WRITING.find(w => w.id === id);
  if (!T) return go('#/write');
  app.innerHTML = `${topbar(T.emoji + ' ' + T.title, '#/write')}
    <div class="card">
      <p><b>Görev:</b> ${esc(T.tr)}</p>
      <p class="consigne"><button class="mini-say" data-say="${esc(T.fr)}">🔊</button> <i>${esc(T.fr)}</i></p>
    </div>
    <p class="lead small">Kullanışlı kalıplar (dokun → metne ekle):</p>
    <div class="phrases">${T.phrases.map((p, k) => `<button class="phrase" data-k="${k}"><b>${esc(p[0])}</b><small>${esc(p[1])}</small></button>`).join('')}</div>
    <textarea id="txt" class="field area" autocomplete="off" autocorrect="off" autocapitalize="sentences" spellcheck="false" placeholder="Buraya Fransızca yaz…">${esc(S.drafts[id] || '')}</textarea>
    ${accentBar()}
    <div class="wc" id="wc"></div>
    <ul class="checks" id="checks"></ul>
    <div class="stack">
      <button class="btn purple" id="read">🔊 Yazdığımı oku</button>
      <button class="btn" id="done">✅ Bitirdim</button>
      <button class="btn ghost" id="share">📤 Düzeltme için paylaş</button>
      <button class="btn ghost" id="model">👀 Örnek cevabı göster</button>
    </div>
    <div class="card hidden" id="modelTxt"><button class="mini-say" data-say="${esc(T.model)}">🔊</button><pre>${esc(T.model)}</pre></div>`;
  wireSay();
  const txt = $('#txt');
  wireAccents(txt);
  const update = () => {
    S.drafts[id] = txt.value; save();
    const v = txt.value.replace(/[’‘]/g, "'"), n = countWords(v);
    $('#wc').innerHTML = `<b class="${n < 60 ? 'low' : n > 80 ? 'high' : 'good'}">${n} kelime</b> · hedef 60–80`;
    $('#checks').innerHTML = T.checks.map(([label, re]) => `<li class="${re.test(v) ? 'yes' : ''}">${label}</li>`).join('')
      + `<li class="${n >= 60 && n <= 80 ? 'yes' : ''}">60–80 kelime</li>`;
  };
  txt.oninput = update; update();
  $$('.phrase').forEach(b => b.onclick = () => {
    const p = T.phrases[+b.dataset.k][0];
    txt.value += (txt.value && !/\s$/.test(txt.value) ? (/[,:]$/.test(p) ? '\n' : ' ') : '') + p + (/[,:]$/.test(p) ? '\n' : '');
    say(p); update();
  });
  $('#read').onclick = () => txt.value.trim() && say(txt.value);
  $('#model').onclick = () => $('#modelTxt').classList.toggle('hidden');
  $('#done').onclick = () => {
    if (countWords(txt.value) < 20) return alert('Biraz daha yaz 🙂 (en az 60 kelime hedefle)');
    S.done[id] = (S.done[id] || 0) + 1;
    S.log.push({ t: Date.now(), m: 'write', id, ok: 1, n: countWords(txt.value) });
    S.days[today()] = (S.days[today()] || 0) + 5;
    save(); beep(true); say('Bravo Neslihan !');
    alert('Bravo! 🎉 Metnin kaydedildi. Düzeltme için paylaşabilirsin.');
  };
  $('#share').onclick = () => share(`DELF A2 yazma çalışması: ${T.title}\n\nGörev: ${T.fr}\n\n${txt.value}\n\n(Lütfen hatalarımı düzeltir misin?)`);
}

async function share(text) {
  try { if (navigator.share) { await navigator.share({ text }); return; } } catch (e) { if (e.name === 'AbortError') return; }
  try { await navigator.clipboard.writeText(text); alert('Kopyalandı! WhatsApp’a yapıştırabilirsin.'); } catch { prompt('Kopyala:', text); }
}

// --- İlerleme ---
const MODE_NAMES = { cards: '🃏 Kartlar', quiz: '✅ Test', gram: '📐 Gramer', read: '📖 Okuma', listen: '🎧 Dinle & Yaz', speak: '🗣️ Söyle', order: '🧩 Cümle Kur' };

function stats() {
  const by = {};
  S.log.forEach(l => { if (!MODE_NAMES[l.m]) return; const b = by[l.m] || (by[l.m] = { r: 0, n: 0 }); b.n++; b.r += l.ok; });
  const total = Object.values(by).reduce((a, b) => a + b.n, 0);
  const corr = Object.values(by).reduce((a, b) => a + b.r, 0);
  const boxes = [0, 0, 0, 0];
  WORDS.forEach(w => { const s = S.items[w.id]; if (!s || !s.n) boxes[0]++; else if (s.b < 3) boxes[1]++; else if (s.b < 5) boxes[2]++; else boxes[3]++; });
  const hard = WORDS.filter(w => S.items[w.id]?.w).sort((a, b) => (S.items[b.id].w - S.items[b.id].r) - (S.items[a.id].w - S.items[a.id].r)).slice(0, 8);
  const last7 = Array.from({ length: 7 }, (_, k) => today() - 6 + k).map(d => S.days[d] || 0);
  const max7 = Math.max(GOAL, ...last7);
  const dayNames = ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'];
  const dn = k => dayNames[new Date(Date.now() - (6 - k) * 864e5).getDay()];
  app.innerHTML = `${topbar('📊 İlerlemem')}
    <div class="statrow">
      <div class="stat"><b>🔥 ${streak()}</b><small>gün seri</small></div>
      <div class="stat"><b>${total}</b><small>cevap</small></div>
      <div class="stat"><b>%${total ? Math.round(100 * corr / total) : 0}</b><small>doğru</small></div>
    </div>
    <div class="card"><h3>Son 7 gün</h3>
      <div class="week">${last7.map((v, k) => `<div><i style="height:${Math.round(100 * v / max7)}%"></i><small>${dn(k)}</small></div>`).join('')}</div>
    </div>
    <div class="card"><h3>Kelimelerim (${WORDS.length})</h3>
      <div class="boxes">
        <div><b>${boxes[0]}</b><small>⚪ Yeni</small></div><div><b>${boxes[1]}</b><small>🟠 Öğreniliyor</small></div>
        <div><b>${boxes[2]}</b><small>🟣 Öğrenildi</small></div><div><b>${boxes[3]}</b><small>⭐ Uzman</small></div>
      </div>
    </div>
    <div class="card"><h3>Bölümlere göre doğruluk</h3>
      ${Object.keys(MODE_NAMES).map(m => { const b = by[m]; const p = b ? Math.round(100 * b.r / b.n) : 0;
        return `<div class="mrow"><span>${MODE_NAMES[m]}</span><span class="mini"><i style="width:${p}%"></i></span><small>${b ? `%${p} · ${b.n}` : '—'}</small></div>`; }).join('')}
    </div>
    ${hard.length ? `<div class="card"><h3>Zorlandığın kelimeler</h3>
      ${hard.map(w => `<div class="hard"><button class="mini-say" data-say="${esc(w.fr)}">🔊</button><b>${esc(w.fr)}</b><span>${esc(w.tr)}</span><small>✗${S.items[w.id].w} ✓${S.items[w.id].r}</small></div>`).join('')}
    </div>` : ''}
    <div class="stack">
      <button class="btn" id="share">📤 İlerlememi paylaş</button>
      <button class="btn ghost" id="exp">💾 Yedek al</button>
      <button class="btn ghost" id="imp">📥 Yedeği geri yükle</button>
    </div>`;
  wireSay();
  $('#share').onclick = () => share(`🐱 Neslihan Fransızca Öğreniyor\n🔥 ${streak()} gün seri\n✍️ ${total} cevap, %${total ? Math.round(100 * corr / total) : 0} doğru\n📚 ${boxes[2] + boxes[3]}/${WORDS.length} kelime öğrenildi\n` +
    Object.keys(MODE_NAMES).filter(m => by[m]).map(m => `${MODE_NAMES[m]}: %${Math.round(100 * by[m].r / by[m].n)} (${by[m].n})`).join('\n') +
    (hard.length ? `\nZorlandıklarım: ${hard.slice(0, 5).map(w => w.fr).join(', ')}` : ''));
  $('#exp').onclick = () => share(JSON.stringify(S));
  $('#imp').onclick = () => {
    const t = prompt('Yedek metnini buraya yapıştır:');
    if (!t) return;
    try { S = Object.assign(fresh(), JSON.parse(t)); save(); alert('Yedek yüklendi ✅'); stats(); } catch { alert('Bu yedek okunamadı 😕'); }
  };
}

// --- DELF A2 rehberi ---
function delf() {
  app.innerHTML = `${topbar('🎓 DELF A2 Nedir?')}
    <div class="card"><p><b>DELF A2</b>, Fransız Eğitim Bakanlığı’nın temel seviye Fransızca diplomasıdır. Ömür boyu geçerlidir. Sınav 4 bölümdür; her bölüm <b>25 puan</b>, toplam <b>100 puan</b>.</p>
      <p class="pass">✅ Geçmek için: en az <b>50/100</b> ve her bölümden en az <b>5/25</b>.</p></div>
    <div class="exam">
      <div class="card"><h3>🎧 Dinlediğini anlama <small>~25 dk</small></h3><p>Kısa kayıtlar: anons, telesekreter mesajı, günlük konuşma. Her kayıt 2 kez çalınır.</p><p class="tip">💡 Önce soruları oku. Sayılara, saatlere, günlere dikkat!</p><a class="link" href="#/pick/listen">→ Dinle & Yaz ile çalış</a></div>
      <div class="card"><h3>📖 Okuduğunu anlama <small>30 dk</small></h3><p>Kısa metinler: tabela, ilan, e-posta, program, tarif.</p><p class="tip">💡 Her kelimeyi anlaman gerekmez; anahtar kelimeleri bul.</p><a class="link" href="#/read">→ Okuma alıştırmaları</a></div>
      <div class="card"><h3>✍️ Yazılı anlatım <small>45 dk</small></h3><p>2 kısa metin (her biri 60–80 kelime): bir olayı anlat + bir mesaj yaz (davet, kabul, ret, teşekkür).</p><p class="tip">💡 Selamla, vedalaş, geçmiş zaman (passé composé) kullan, bağlaçlar ekle: et, mais, parce que, puis.</p><a class="link" href="#/write">→ Yazma Atölyesi</a></div>
      <div class="card"><h3>🗣️ Sözlü anlatım <small>6–8 dk + 10 dk hazırlık</small></h3><p>3 aşama: 1) Kendini tanıt 2) Monolog: bir soruya 1–2 dk cevap (hafta sonun, evin, ailen, şehir mi kır mı…) 3) Diyalog: rol yapma (eczane, kütüphane, komşu, plan yapmak…).</p><p class="tip">💡 Kendini tanıtmayı ezberle. Anlamazsan: “Vous pouvez répéter, s’il vous plaît ?”</p><a class="link" href="#/oral">→ Sözlü Sınav provası</a></div>
    </div>
    <div class="card tipcard"><h3>📅 Her gün 15–20 dakika</h3><p>Her gün az ama düzenli çalışmak, haftada bir uzun çalışmaktan çok daha etkili. Akıllı tekrar, unutmak üzere olduğun kelimeleri tam zamanında karşına çıkarır. 🧠</p></div>`;
}

// --- Ses kaydı (sözlü prova) ---
let REC = null;
function stopRec() { try { if (REC && REC.state === 'recording') REC.stop(); } catch {} REC = null; }
const recorderHTML = () => `<div class="rec"><button class="btn mic wide" id="rec">⏺️ Kendimi kaydet</button><span id="recT"></span><audio id="recA" controls playsinline class="hidden"></audio></div>`;
function wireRecorder() {
  const btn = $('#rec');
  if (!btn) return;
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { btn.parentElement.innerHTML = '<p class="hint dark">Bu tarayıcıda kayıt yok — yüksek sesle söylemek de çok işe yarar! 🎤</p>'; return; }
  let chunks, timer;
  btn.onclick = async () => {
    if (REC && REC.state === 'recording') { REC.stop(); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      speechSynthesis.cancel();
      chunks = [];
      const mr = REC = new MediaRecorder(stream);
      mr.ondataavailable = e => chunks.push(e.data);
      mr.onstop = () => {
        stream.getTracks().forEach(t => t.stop()); clearInterval(timer);
        const a = $('#recA'); if (!a) return;
        a.src = URL.createObjectURL(new Blob(chunks, { type: mr.mimeType || 'audio/mp4' }));
        a.classList.remove('hidden');
        btn.textContent = '⏺️ Yeniden kaydet'; btn.classList.remove('on');
      };
      mr.start();
      const t0 = Date.now();
      btn.textContent = '⏹️ Durdur ve dinle'; btn.classList.add('on');
      timer = setInterval(() => { const t = $('#recT'); if (t) t.textContent = `⏱️ ${Math.floor((Date.now() - t0) / 1000)} sn`; }, 500);
    } catch { alert('Kayıt için mikrofon izni gerekli 🎤'); }
  };
}

// Cümleleri art arda okur (diyalog/monolog için)
function sayAll(texts, slow) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  texts.forEach(t => { const u = new SpeechSynthesisUtterance(t); u.lang = 'fr-FR'; if (frVoice) u.voice = frVoice; u.rate = slow ? 0.6 : 0.9; speechSynthesis.speak(u); });
}
const splitSent = t => t.split(/(?<=[.!?])\s+|\n+/).map(x => x.trim()).filter(Boolean);
const lineList = texts => `<div class="lines">${texts.map(t => `<button class="line" data-say="${esc(t)}"><span>🔊</span>${esc(t)}</button>`).join('')}</div>`;

// --- Gramer ---
const GQ = [];
GRAMMAR.forEach(g => g.qs.forEach((q, k) => GQ.push({ id: `g-${g.id}-${k}`, topic: g.id, s: q[0], opts: q[1], tr: q[2] })));

function gramAcc(topic) {
  const ids = new Set(GQ.filter(q => q.topic === topic).map(q => q.id));
  const l = S.log.filter(x => x.m === 'gram' && ids.has(x.id));
  return l.length ? Math.round(100 * l.reduce((a, b) => a + b.ok, 0) / l.length) : null;
}

function gram(id) {
  if (!id) {
    app.innerHTML = `${topbar('📐 Gramer')}
      <p class="lead">Sınav konuları + derste işlenenler. Önce kısa açıklamayı oku, sonra alıştırma yap.</p>
      <div class="list">
        <a class="row hot" href="#/gram/mix"><span class="r-emoji">🔀</span><span><b>Karışık tekrar</b><small>Tüm konulardan, en çok zorlandıkların önce</small></span></a>
        ${GRAMMAR.map(g => { const a = gramAcc(g.id); return `<a class="row" href="#/gram/${g.id}"><span class="r-emoji">${g.emoji}</span>
          <span><b>${g.name}</b><small>${g.sub}${a === null ? '' : ` · %${a} doğru`}</small>${a === null ? '' : `<span class="mini"><i style="width:${a}%"></i></span>`}</span></a>`; }).join('')}
      </div>`;
    return;
  }
  if (id === 'mix') return gramQuiz(queue(GQ, 10, 4), 'mix', '🔀 Karışık tekrar');
  const g = GRAMMAR.find(x => x.id === id);
  if (!g) return go('#/gram');
  app.innerHTML = `${topbar(g.emoji + ' ' + g.name, '#/gram')}
    <div class="card"><p class="when">🕐 <b>Ne zaman?</b> ${esc(g.when)}</p>
      ${g.forms.map(f => `<div class="form"><button class="mini-say" data-say="${esc(f[0])}">🔊</button><div><b>${esc(f[0])}</b><small>${esc(f[1])}</small></div></div>`).join('')}
    </div>
    <div class="card"><h3>Örnekler</h3>
      ${g.examples.map(e => `<div class="form"><button class="mini-say" data-say="${esc(e[0])}">🔊</button><div><b>${esc(e[0])}</b><small>${esc(e[1])}</small></div></div>`).join('')}
    </div>
    <button class="btn wide" id="go">✏️ Alıştırmaya başla (${g.qs.length} soru)</button>`;
  wireSay();
  $('#go').onclick = () => gramQuiz(shuffle(GQ.filter(q => q.topic === id)), id, g.emoji + ' ' + g.name);
}

function gramQuiz(q, id, label) {
  let i = 0, right = 0, total = 0;
  const seen = {};
  const show = () => {
    if (i >= q.length) return finish('📐 Gramer', right, total, () => id === 'mix' ? gram('mix') : gramQuiz(shuffle(GQ.filter(g => g.topic === id)), id, label));
    const x = q[i];
    const [a, b] = x.s.split('___');
    app.innerHTML = `${topbar(label, '#/gram')}${bar(i, q.length)}
      <div class="card center"><p class="q">Boşluğa ne gelmeli?</p>
        <div class="gsent">${esc(a)}<span class="blank" id="blank">___</span>${esc(b)}</div>
        <small class="trs">${esc(x.tr)}</small></div>
      <div class="opts">${shuffle(x.opts).map(o => `<button class="opt" data-o="${esc(o)}">${esc(o)}</button>`).join('')}</div>
      <div class="feedback" id="fb"></div>`;
    $$('.opt').forEach(btn => btn.onclick = () => {
      const ok = btn.dataset.o === x.opts[0];
      $$('.opt').forEach(o => { o.disabled = true; if (o.dataset.o === x.opts[0]) o.classList.add('ok'); });
      if (!ok) btn.classList.add('bad');
      $('#blank').textContent = x.opts[0]; $('#blank').classList.add('filled');
      record('gram', x.id, ok ? 1 : 0); total++;
      if (ok) right++;
      else if (!seen[x.id]) { seen[x.id] = 1; q.push(x); }
      beep(ok);
      const full = a + x.opts[0] + b;
      setTimeout(() => say(full), 250);
      $('#fb').innerHTML = `<div class="fb-row">${cat(ok ? 'happy' : 'sad')}<div><b>${ok ? pick(PRAISE) : 'Doğrusu: ' + esc(x.opts[0])}</b><br>${esc(full)}</div></div>
        <button class="btn" id="next">Devam ›</button>`;
      $('#next').onclick = () => { i++; show(); };
    });
  };
  show();
}

// --- Okuma ---
function read(id) {
  if (!id) {
    app.innerHTML = `${topbar('📖 Okuma')}
      <div class="card tipcard">💡 <b>Sınav taktiği:</b> Önce soruları oku, sonra metinde cevabı ara. Her kelimeyi anlaman gerekmez — sayılara, saatlere, günlere ve yerlere dikkat!</div>
      <div class="list">${READING.map(r => { const ids = r.qs.map((_, k) => `r-${r.id}-${k}`); const l = S.log.filter(x => x.m === 'read' && ids.includes(x.id));
        return `<a class="row" href="#/read/${r.id}"><span class="r-emoji">${r.emoji}</span><span><b>${r.title}</b><small>${l.length ? `%${Math.round(100 * l.reduce((a, b) => a + b.ok, 0) / l.length)} doğru` : `${r.qs.length} soru`}</small></span></a>`; }).join('')}</div>`;
    return;
  }
  const r = READING.find(x => x.id === id);
  if (!r) return go('#/read');
  let answered = 0, right = 0;
  app.innerHTML = `${topbar(r.emoji + ' ' + r.title, '#/read')}
    <div class="card doc"><pre>${esc(r.text)}</pre><button class="link" data-say="${esc(r.text.replace(/\n/g, '. '))}">🔊 Metni dinle</button></div>
    ${r.qs.map((q, k) => `<div class="card rq" data-k="${k}"><b>${k + 1}. ${esc(q[0])}</b><small class="trs">${esc(q[1])}</small>
      <div class="opts col">${shuffle(q[2]).map(o => `<button class="opt" data-o="${esc(o)}">${esc(o)}</button>`).join('')}</div></div>`).join('')}
    <div class="feedback" id="fb"></div>`;
  wireSay();
  $$('.rq').forEach(card => {
    const k = +card.dataset.k, q = r.qs[k];
    $$('.opt', card).forEach(btn => btn.onclick = () => {
      const ok = btn.dataset.o === q[2][0];
      $$('.opt', card).forEach(o => { o.disabled = true; if (o.dataset.o === q[2][0]) o.classList.add('ok'); });
      if (!ok) btn.classList.add('bad');
      record('read', `r-${r.id}-${k}`, ok ? 1 : 0); beep(ok);
      answered++; if (ok) right++;
      if (answered === r.qs.length) {
        const next = READING[(READING.indexOf(r) + 1) % READING.length];
        $('#fb').innerHTML = `<div class="fb-row">${cat(right === answered ? 'happy' : 'normal')}<div><b>${right} / ${answered} doğru</b><br>${right === answered ? 'Mükemmel! 🎉' : 'Yanlışlara metinde tekrar bak 👀'}</div></div>
          <a class="btn" href="#/read/${next.id}">Sonraki metin ›</a>`;
        $('#fb').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// --- Sözlü sınav ---
function oral(kind, id) {
  if (kind === 'intro') return oralIntro();
  if (kind === 'm') return oralMono(id);
  if (kind === 'd') return oralDialog(id);
  const doneTag = k => S.done[k] ? ' ✅' : '';
  app.innerHTML = `${topbar('🎤 Sözlü Sınav')}
    <div class="card tipcard"><b>Sözlü sınav 3 aşama</b> (6–8 dk + 10 dk hazırlık): 1) Kendini tanıt 2) Monolog: bir soruya 1–2 dk cevap 3) Diyalog: rol yapma. Hazır kalıplar en çok puanı getirir! 💜</div>
    <h3 class="sec">1️⃣ Kendini tanıtma</h3>
    <div class="list"><a class="row hot" href="#/oral/intro"><span class="r-emoji">🙋‍♀️</span><span><b>Kendimi tanıtıyorum</b><small>Dinle, tekrar et, kendini kaydet${doneTag('intro')}</small></span></a></div>
    <h3 class="sec">2️⃣ Monolog</h3>
    <div class="list">${MONOLOGUES.map(m => `<a class="row" href="#/oral/m/${m[0]}"><span class="r-emoji">💭</span><span><b>${esc(m[2])}</b><small>${esc(m[1])}${doneTag('m-' + m[0])}</small></span></a>`).join('')}</div>
    <h3 class="sec">3️⃣ Diyalog</h3>
    <div class="list">${DIALOGUES.map(d => `<a class="row" href="#/oral/d/${d.id}"><span class="r-emoji">${d.emoji}</span><span><b>${esc(d.title)}</b><small>${esc(d.fr)}${doneTag('d-' + d.id)}</small></span></a>`).join('')}</div>
    <div class="card"><h3>Diyalog kalıpları</h3>${DIALOG_PHRASES.map(p => `<div class="form"><button class="mini-say" data-say="${esc(p[0])}">🔊</button><div><b>${esc(p[0])}</b><small>${esc(p[1])}</small></div></div>`).join('')}</div>`;
  wireSay();
}

function markOral(key) {
  S.done[key] = (S.done[key] || 0) + 1;
  S.log.push({ t: Date.now(), m: 'oral', id: key, ok: 1 });
  S.days[today()] = (S.days[today()] || 0) + 5;
  save(); beep(true); say('Bravo Neslihan !');
}

function oralIntro() {
  const text = S.intro || INTRO_DEFAULT;
  app.innerHTML = `${topbar('🙋‍♀️ Kendimi tanıtıyorum', '#/oral')}
    <div class="card tipcard">📌 Bu metni ezberle: sınavın ilk dakikası bu! Her cümleye dokun, dinle ve yüksek sesle tekrar et.</div>
    <div class="sounds"><button class="btn purple" id="all">▶️ Tümünü dinle</button><button class="btn ghost" id="slow">🐢 Yavaş</button></div>
    <div id="lines">${lineList(splitSent(text))}</div>
    ${recorderHTML()}
    <button class="btn green wide" id="done">✅ Bugün çalıştım</button>
    <details class="card"><summary>✏️ Metni kendime göre düzenle</summary>
      <p class="hint dark">Yaş, meslek gibi bilgileri kendine göre değiştir (Ecem yardım edebilir).</p>
      <textarea id="txt" class="field area" autocorrect="off" spellcheck="false">${esc(text)}</textarea>
      ${accentBar()}
      <button class="btn ghost" id="reset">↩️ Orijinal metne dön</button>
    </details>`;
  wireSay(); wireRecorder();
  const txt = $('#txt');
  wireAccents(txt);
  txt.oninput = () => { S.intro = txt.value; save(); $('#lines').innerHTML = lineList(splitSent(txt.value)); wireSay(); };
  $('#all').onclick = () => sayAll(splitSent(txt.value));
  $('#slow').onclick = () => sayAll(splitSent(txt.value), true);
  $('#reset').onclick = () => { S.intro = ''; save(); oralIntro(); };
  $('#done').onclick = () => markOral('intro');
}

function oralMono(id) {
  const k = MONOLOGUES.findIndex(m => m[0] === id);
  if (k < 0) return go('#/oral');
  const [, q, tr, model] = MONOLOGUES[k], next = MONOLOGUES[(k + 1) % MONOLOGUES.length][0];
  app.innerHTML = `${topbar('💭 Monolog', '#/oral')}
    <div class="card center"><div class="fr">${esc(q)}</div><div class="tr">${esc(tr)}</div><button class="round" data-say="${esc(q)}">🔊</button></div>
    <div class="card"><h3>Cevap iskeleti (1–2 dk)</h3>
      <ol class="skel"><li><b>Cevap ver:</b> Je préfère… / J'aime… / Le week-end dernier, je suis allée…</li>
      <li><b>Sebep söyle:</b> parce que c'est pratique / agréable…</li>
      <li><b>Örnek ver (geçmiş zaman):</b> Samedi, j'ai… / Quand j'étais petite, je…</li>
      <li><b>Kapanış:</b> Mais à l'avenir, j'aimerais… / C'était super !</li></ol></div>
    <p class="lead small">Önce kendin konuş ve kaydet, sonra örnek cevaba bak 👇</p>
    ${recorderHTML()}
    <button class="btn ghost wide" id="show">👀 Örnek cevabı göster</button>
    <div class="hidden" id="model">
      <div class="sounds"><button class="btn purple" id="all">▶️ Dinle</button><button class="btn ghost" id="slow">🐢 Yavaş</button></div>
      ${lineList(splitSent(model))}
    </div>
    <div class="stack"><button class="btn green" id="done">✅ Çalıştım</button><a class="btn" href="#/oral/m/${next}">Sonraki soru ›</a></div>`;
  wireSay(); wireRecorder();
  say(q);
  $('#show').onclick = () => { $('#model').classList.remove('hidden'); $('#show').remove(); };
  $('#all').onclick = () => sayAll(splitSent(model));
  $('#slow').onclick = () => sayAll(splitSent(model), true);
  $('#done').onclick = () => markOral('m-' + id);
}

function oralDialog(id) {
  const d = DIALOGUES.find(x => x.id === id);
  if (!d) return go('#/oral');
  const next = DIALOGUES[(DIALOGUES.indexOf(d) + 1) % DIALOGUES.length].id;
  app.innerHTML = `${topbar(d.emoji + ' Diyalog', '#/oral')}
    <div class="card"><b>${esc(d.title)}</b><p class="consigne"><button class="mini-say" data-say="${esc(d.fr)}">🔊</button> <i>${esc(d.fr)}</i></p></div>
    <p class="lead small">🟣 Görevli konuşur, 🟠 sen cevap verirsin. Önce cevabını <b>yüksek sesle söyle</b>, sonra doğrusunu görmek için dokun.</p>
    <div class="dialog">${d.lines.map(([who, t]) => who === 'E'
      ? `<button class="bubble e" data-say="${esc(t)}"><small>Görevli 🔊</small>${esc(t)}</button>`
      : `<button class="bubble c hidden-line" data-t="${esc(t)}"><small>Sen 👆 dokun</small><span>${esc(t)}</span></button>`).join('')}</div>
    <div class="sounds"><button class="btn purple" id="all">▶️ Tüm diyaloğu dinle</button></div>
    ${recorderHTML()}
    <div class="stack"><button class="btn green" id="done">✅ Çalıştım</button><a class="btn" href="#/oral/d/${next}">Sonraki diyalog ›</a></div>`;
  wireSay(); wireRecorder();
  $$('.bubble.c').forEach(b => b.onclick = () => { b.classList.remove('hidden-line'); $('small', b).textContent = 'Sen 🔊'; say(b.dataset.t); });
  $('#all').onclick = () => { $$('.bubble.c').forEach(b => { b.classList.remove('hidden-line'); $('small', b).textContent = 'Sen 🔊'; }); sayAll(d.lines.map(l => l[1])); };
  $('#done').onclick = () => markOral('d-' + id);
}

// ---------- Yönlendirme ----------
const ROUTES = { menu, pick: pickScreen, cards, quiz, listen, speak, order, write, stats, delf, plan, gram, read, oral };
function router() {
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  stopRec();
  const [r, ...args] = location.hash.replace(/^#\/?/, '').split('/');
  (ROUTES[r] || splash)(...args);
  window.scrollTo(0, 0);
}
addEventListener('hashchange', router);
router();
