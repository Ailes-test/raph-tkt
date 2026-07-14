// --- Découpage du "Bonjour" en lettres animées ---
const helloEl = document.getElementById('helloText');
const helloWord = 'Salut Claudie';
helloWord.split('').forEach((char, i) => {
  const span = document.createElement('span');
  span.className = 'char';
  span.textContent = char === ' ' ? '\u00A0' : char;
  span.style.animationDelay = `${i * 0.06}s`;
  helloEl.appendChild(span);
});

const sceneHello = document.getElementById('scene-hello');
const sceneContext = document.getElementById('scene-context');
const sceneChoice = document.getElementById('scene-choice');

function showScene(el) {
  document.querySelectorAll('.scene').forEach(s => s.dataset.active = 'false');
  el.dataset.active = 'true';
}

// Séquence : bonjour (5s) -> contexte (10s) -> choix
const CONTEXT_DELAY = 5000;
const CHOICE_DELAY = CONTEXT_DELAY + 10000;

setTimeout(() => showScene(sceneContext), CONTEXT_DELAY);
setTimeout(() => showScene(sceneChoice), CHOICE_DELAY);

// --- Bouton "Laisse-moi tranquille" qui fuit le curseur et le clic ---
const fleeBtn = document.getElementById('fleeBtn');
const messages = [
  'Laisse-moi tranquille',
  'Non merci',
  'Pas envie',
  'Trop lent',
  'Toujours pas',
  'Presque...',
  'Rate encore'
];

function randomPosition() {
  const margin = 20;
  const maxX = window.innerWidth - fleeBtn.offsetWidth - margin;
  const maxY = window.innerHeight - fleeBtn.offsetHeight - margin;
  const x = Math.max(margin, Math.random() * maxX);
  const y = Math.max(margin, Math.random() * maxY);
  return { x, y };
}

function moveButton() {
  const { x, y } = randomPosition();
  fleeBtn.style.left = `${x}px`;
  fleeBtn.style.top = `${y}px`;
}

// position initiale une fois la scène de choix visible
setTimeout(() => {
  fleeBtn.style.position = 'fixed';
  moveButton();
}, CHOICE_DELAY + 300);

// bouge tout seul en continu
setInterval(moveButton, 1400);

// bouge encore plus vite si le curseur s'approche
document.addEventListener('mousemove', (e) => {
  const rect = fleeBtn.getBoundingClientRect();
  const dx = e.clientX - (rect.left + rect.width / 2);
  const dy = e.clientY - (rect.top + rect.height / 2);
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 140) {
    moveButton();
    fleeBtn.textContent = messages[Math.floor(Math.random() * messages.length)];
  }
});

// au cas où un clic arriverait quand même à passer
fleeBtn.addEventListener('click', (e) => {
  e.preventDefault();
  moveButton();
  fleeBtn.textContent = messages[Math.floor(Math.random() * messages.length)];
});

window.addEventListener('resize', moveButton);
