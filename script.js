const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(pointer: coarse)').matches;

/* ============ CUSTOM CURSOR ============ */
if (!isTouch) {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  function animateRing(){
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .tab, .stack-card, .proj-card, .bot-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('active'));
  });
}

/* ============ MUSIC TOGGLE (independen, tanpa intro) ============ */
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');

bgMusic.addEventListener('error', () => {
  musicToggle.title = 'Belum ada file background.mp3 di folder ini';
});

musicToggle.addEventListener('click', () => {
  if (!bgMusic.currentSrc && bgMusic.error) {
    musicToggle.title = 'Belum ada file background.mp3 di folder ini';
    return;
  }
  if (bgMusic.paused) {
    bgMusic.volume = 0.35;
    bgMusic.play().then(() => {
      musicToggle.textContent = '🔊';
      musicToggle.classList.add('playing');
    }).catch(() => {
      musicToggle.title = 'Belum ada file background.mp3 di folder ini';
    });
  } else {
    bgMusic.pause();
    musicToggle.textContent = '🔈';
    musicToggle.classList.remove('playing');
  }
});

/* ============ Partikel emas melayang ============ */
if (!reduceMotion) {
  const field = document.getElementById('particles');
  const total = window.innerWidth < 640 ? 12 : 26;
  for (let i = 0; i < total; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = (Math.random() * 100) + 'vw';
    const size = 2 + Math.random() * 3;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.animationDuration = (10 + Math.random() * 14) + 's';
    p.style.animationDelay = -(Math.random() * 14) + 's';
    p.style.setProperty('--drift', (Math.random() * 60 - 30) + 'px');
    field.appendChild(p);
  }
}

/* ============ Bintang kelap-kelip ============ */
if (!reduceMotion) {
  const starField = document.getElementById('stars');
  const totalStars = window.innerWidth < 640 ? 30 : 60;
  for (let i = 0; i < totalStars; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.left = Math.random() * 100 + 'vw';
    s.style.top = Math.random() * 100 + 'vh';
    s.style.animationDuration = (2 + Math.random() * 3) + 's';
    s.style.animationDelay = -(Math.random() * 4) + 's';
    starField.appendChild(s);
  }
}

/* ============ Parallax orb ngikutin mouse ============ */
if (!reduceMotion && !isTouch) {
  const orbs = document.querySelectorAll('.orb');
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    orbs.forEach((orb, i) => {
      const strength = (i + 1) * 10;
      orb.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });
  });
}

/* ============ Tab aktif + magic line ============ */
const tabs = document.querySelectorAll('.tab');
const sections = document.querySelectorAll('section[id]');
const magicLine = document.getElementById('magicLine');

function moveMagicLine(tabEl) {
  if (!tabEl || !magicLine) return;
  magicLine.style.left = tabEl.offsetLeft + 'px';
  magicLine.style.width = tabEl.offsetWidth + 'px';
}
function setActive(id) {
  tabs.forEach(t => t.classList.toggle('active', t.dataset.target === id));
  moveMagicLine(document.querySelector(`.tab[data-target="${id}"]`));
}
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    document.getElementById(tab.dataset.target).scrollIntoView({ behavior: 'smooth' });
  });
});
window.addEventListener('load', () => moveMagicLine(document.querySelector('.tab.active')));
window.addEventListener('resize', () => moveMagicLine(document.querySelector('.tab.active')));

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => navObserver.observe(s));

/* ============ Reveal saat scroll ============ */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObserver.unobserve(entry.target); }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

/* ============ Project card reveal + tilt ============ */
const cards = document.querySelectorAll('.proj-card');
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) { setTimeout(() => entry.target.classList.add('in-view'), i * 100); cardObserver.unobserve(entry.target); }
  });
}, { threshold: 0.2 });
cards.forEach(c => cardObserver.observe(c));

if (!reduceMotion && !isTouch) {
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -6;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6;
      card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = 'perspective(700px) rotateX(0) rotateY(0) translateY(0)'; });
  });
}

/* ============ Sparkle ngikutin cursor ============ */
if (!reduceMotion && !isTouch) {
  let lastSparkle = 0;
  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastSparkle < 60) return;
    lastSparkle = now;
    const s = document.createElement('div');
    s.className = 'cursor-sparkle';
    s.style.left = e.clientX + 'px';
    s.style.top = e.clientY + 'px';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 800);
  });
}

/* ============ Ripple tombol WA ============ */
const waBtn = document.querySelector('.wa-btn');
if (waBtn) {
  waBtn.addEventListener('click', (e) => {
    const rect = waBtn.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    waBtn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);

    // confetti kecil
    for (let i = 0; i < 14; i++) {
      const conf = document.createElement('div');
      conf.style.position = 'fixed';
      conf.style.left = e.clientX + 'px';
      conf.style.top = e.clientY + 'px';
      conf.style.width = '5px';
      conf.style.height = '5px';
      conf.style.borderRadius = '2px';
      conf.style.background = ['#d4af37', '#c084fc', '#e879f9', '#7ee787'][i % 4];
      conf.style.zIndex = '999';
      conf.style.pointerEvents = 'none';
      document.body.appendChild(conf);
      const angle = Math.random() * Math.PI * 2;
      const dist = 40 + Math.random() * 60;
      const dx = Math.cos(angle) * dist, dy = Math.sin(angle) * dist;
      conf.animate([
        { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) rotate(${Math.random()*360}deg)`, opacity: 0 }
      ], { duration: 700 + Math.random() * 300, easing: 'ease-out' });
      setTimeout(() => conf.remove(), 1000);
    }
  });
}

/* ============ Stack bar animasi ============ */
const stackCards = document.querySelectorAll('.stack-card');
const stackObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) { setTimeout(() => entry.target.classList.add('in-view'), i * 90); stackObserver.unobserve(entry.target); }
  });
}, { threshold: 0.25 });
stackCards.forEach(c => stackObserver.observe(c));

/* ============ Typewriter role hero ============ */
const roleEl = document.querySelector('.hero-role .str');
if (roleEl && !reduceMotion) {
  const roles = ['"Creative Developer"', '"Suka bikin website"', '"Masih terus belajar"', '"Open to chat"'];
  let roleIndex = 0, charIndex = 0, deleting = false;
  function typeLoop() {
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      roleEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) { deleting = true; setTimeout(typeLoop, 1400); return; }
    } else {
      charIndex--;
      roleEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
    }
    setTimeout(typeLoop, deleting ? 35 : 65);
  }
  typeLoop();
}

/* ============ Visitor counter (CountAPI, butuh online beneran) ============ */
(function visitorCounter(){
  const badge = document.getElementById('visitorBadge');
  fetch('https://api.countapi.xyz/hit/rm-erlangga-portfolio/visits')
    .then(res => res.json())
    .then(data => { badge.textContent = `👀 ${data.value} orang sudah mengunjungi web ini`; })
    .catch(() => { badge.textContent = '👀 penghitung aktif setelah web online'; });
})();

/* ============ AI BOTS (scripted, tapi ngerti pertanyaan umum) ============ */
function generalAnswer(msg) {
  if (/web ini|website ini|situs ini/.test(msg) && /apa|maksud|tujuan|guna/.test(msg)) {
    return 'Web ini portfolio pribadi R.M Erlangga — isinya project, tech stack yang lagi dipelajari, dan cara buat langsung chat lewat WhatsApp.';
  }
  if (/kamu (itu )?siapa|siapa kamu|namamu siapa/.test(msg)) {
    return 'Aku robot kecil yang nemenin kamu explore web ini. Kalau mau kenal pemilik web-nya, coba scroll ke bagian About ya.';
  }
  if (/erlangga|pemilik|yang punya web/.test(msg)) {
    return 'Yang punya web ini R.M Erlangga — bisa baca ceritanya di bagian About, atau langsung chat di bagian Contact.';
  }
  if (/(cara|gimana).*(kontak|hubungi|chat)/.test(msg) || /^wa$/.test(msg)) {
    return 'Scroll ke paling bawah, ada tombol hijau "Chat via WhatsApp" — tinggal klik.';
  }
  if (/halo|hai|hi|hey/.test(msg)) {
    return 'Halo juga! Ada yang mau ditanyain soal web ini?';
  }
  if (/makasih|terima kasih|thanks/.test(msg)) {
    return 'Sama-sama! Seneng bisa bantu 🙌';
  }
  return null;
}

const botPersonas = {
  guide: {
    name: '🤖 Robo Guide',
    greet: 'Halo! Aku Robo Guide. Tanya apa aja soal web ini, contoh: "web ini apa" atau "gimana cara kontak".',
    reply: (msg) => {
      const general = generalAnswer(msg);
      if (general) return general;
      if (msg.includes('about')) return 'Section About berisi cerita singkat tentang R.M Erlangga.';
      if (msg.includes('project')) return 'Section Project nunjukin 3 karya yang udah dibikin.';
      if (msg.includes('stack')) return 'Tech Stack nunjukin bahasa pemrograman yang lagi dipelajari.';
      return 'Coba tanya soal: about, project, stack, atau cara kontak ya.';
    }
  },
  fun: {
    name: '🎭 Robo Fun',
    greet: 'Yo! Aku Robo Fun. Ketik apa aja, atau ketik "lucu" kalau mau lawakan receh.',
    reply: (msg) => {
      const general = generalAnswer(msg);
      if (general) return general + ' 😄';
      if (/lucu|becanda|lawak/.test(msg)) {
        const jokes = [
          'Kenapa programmer suka gelap? Karena dia takut sama bug di lampu terang 😂',
          'HTML bukan bahasa pemrograman... tapi tetep aku sayang HTML kok 💛',
          'Kenapa developer benci alam? Terlalu banyak bug tanpa fitur report.'
        ];
        return jokes[Math.floor(Math.random() * jokes.length)];
      }
      return 'Hmm aku robot receh, kalau bingung jawab apa aku ketawa aja deh 😆';
    }
  },
  motivator: {
    name: '🔥 Robo Motivator',
    greet: 'Semangat! Ketik apa aja, aku kasih semangat balik.',
    reply: (msg) => {
      const general = generalAnswer(msg);
      if (general) return general;
      const quotes = [
        'Belajar dikit-dikit tiap hari itu lebih kuat daripada belajar banyak sekali terus berhenti.',
        'Error itu bukan tanda kamu gagal, tapi tanda kamu lagi coba sesuatu yang baru.',
        'Konsisten kecil > niat besar tapi jarang jalan. Terus aja!'
      ];
      return quotes[Math.floor(Math.random() * quotes.length)];
    }
  },
  tech: {
    name: '🛰️ Robo Tech',
    greet: 'Tanya apa aja, atau ketik "trivia" buat fakta unik dunia coding.',
    reply: (msg) => {
      const general = generalAnswer(msg);
      if (general) return general;
      if (/trivia|fakta/.test(msg)) {
        const trivia = [
          'Tau gak? Python dinamain dari acara komedi Monty Python, bukan dari ular.',
          'CSS pertama kali dirilis tahun 1996, lebih tua dari kebanyakan developer sekarang.',
          'PHP awalnya singkatan dari "Personal Home Page", bukan "PHP Hypertext Preprocessor".'
        ];
        return trivia[Math.floor(Math.random() * trivia.length)];
      }
      return 'Ketik "trivia" kalau mau fakta unik dunia coding!';
    }
  },
  assistant: {
    name: '🧭 Robo Assistant',
    greet: 'Mau ngobrol langsung sama R.M Erlangga? Ketik "wa" buat langsung ke WhatsApp, atau tanya apa aja soal web ini.',
    reply: (msg) => {
      if (msg.includes('wa') || msg.includes('kontak') || msg.includes('chat')) {
        window.open('https://wa.me/6287873716403', '_blank');
        return 'Oke, aku bukain WhatsApp-nya ya!';
      }
      const general = generalAnswer(msg);
      if (general) return general;
      return 'Ketik "wa" kalau mau langsung chat ke R.M Erlangga.';
    }
  }
};

const botChat = document.getElementById('botChat');
const botChatName = document.getElementById('botChatName');
const botChatBody = document.getElementById('botChatBody');
const botInput = document.getElementById('botInput');
const botSend = document.getElementById('botSend');
const botChatClose = document.getElementById('botChatClose');
let activeBot = null;

function addBotMsg(text, who) {
  const div = document.createElement('div');
  div.className = 'bot-msg ' + who;
  div.textContent = text;
  botChatBody.appendChild(div);
  botChatBody.scrollTop = botChatBody.scrollHeight;
}

document.querySelectorAll('.bot-card').forEach(card => {
  card.addEventListener('click', () => {
    const key = card.dataset.bot;
    activeBot = botPersonas[key];
    botChatName.textContent = activeBot.name;
    botChatBody.innerHTML = '';
    addBotMsg(activeBot.greet, 'bot');
    botChat.classList.add('open');
    botChat.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});

botChatClose.addEventListener('click', () => botChat.classList.remove('open'));

function sendBotMsg() {
  const val = botInput.value.trim();
  if (!val || !activeBot) return;
  addBotMsg(val, 'user');
  const lower = val.toLowerCase();
  setTimeout(() => addBotMsg(activeBot.reply(lower), 'bot'), 350);
  botInput.value = '';
}
botSend.addEventListener('click', sendBotMsg);
botInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendBotMsg(); });

/* ============ Guestbook (localStorage, per-device) ============ */
const guestForm = document.getElementById('guestForm');
const guestList = document.getElementById('guestList');
const GUEST_KEY = 'rm-erlangga-guestbook';

function loadGuests() {
  let data = [];
  try { data = JSON.parse(localStorage.getItem(GUEST_KEY)) || []; } catch (e) { data = []; }
  guestList.innerHTML = '';
  if (data.length === 0) {
    guestList.innerHTML = '<p class="guest-empty">Belum ada pesan. Jadi yang pertama nulis!</p>';
    return;
  }
  data.slice().reverse().forEach(item => {
    const div = document.createElement('div');
    div.className = 'guest-item';
    const nameEl = document.createElement('span');
    nameEl.className = 'g-name';
    nameEl.textContent = item.name;
    const msgEl = document.createElement('p');
    msgEl.className = 'g-msg';
    msgEl.textContent = item.msg;
    div.appendChild(nameEl);
    div.appendChild(msgEl);
    guestList.appendChild(div);
  });
}

guestForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('guestName').value.trim();
  const msg = document.getElementById('guestMsg').value.trim();
  if (!name || !msg) return;
  let data = [];
  try { data = JSON.parse(localStorage.getItem(GUEST_KEY)) || []; } catch (e) { data = []; }
  data.push({ name, msg });
  localStorage.setItem(GUEST_KEY, JSON.stringify(data));
  guestForm.reset();
  loadGuests();
});

loadGuests();