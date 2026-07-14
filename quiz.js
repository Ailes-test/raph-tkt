// --- Données ---
const WARMUP_QUESTIONS = [
  {
    question: "Tu vas bien ?",
    options: [
      { text: "Oui", reaction: "Ça fait plaisir à entendre" },
      { text: "Non", reaction: "Ah, je te dis quoi moi mtn" }
    ]
  },
  {
    question: "Chat ou chien ?",
    options: [
      { text: "Chien", reaction: "Je comprends, c'est mignon (enfin ça dépend)" },
      { text: "Chat", reaction: "Pareil, c'est plus tranquille" }
    ]
  },
  {
    question: "Sucré ou salé ?",
    options: [
      { text: "Sucré", reaction: "Un cœur sucré ;), ça se voit" },
      { text: "Salé", reaction: "Team apéro finalement, je vois ça" }
    ]
  },
  {
    question: "Pizza ananas : oui ou non ?",
    options: [
      { text: "Oui", reaction: "Ok on va devoir en reparler" },
      { text: "Non", reaction: "Bon choix, merci" },
      { text: "Qui fait ça même ?", reaction: "Voilà, merci" },
      { text: "En secret je kiffe ça en vrai", reaction: "Ok on va devoir en reparler" }
    ]
  },
  {
    question: "Tu dis ce que tu penses ou tu tournes autour du pot ?",
    options: [
      { text: "Je dis ce que je pense", reaction: "Ok direct, j'aime bien" },
      { text: "Je dis pas ce que je pense", reaction: "Mystérieuse toi en fait" },
      { text: "Ça dépend du sujet", reaction: "Ah ouais t'es relou en fait mdr" }
    ]
  },
  {
    question: "Tu réponds vite aux messages ou tu laisses en vu ?",
    options: [
      { text: "Souvent oui", reaction: "Parfait ça" },
      { text: "Souvent non", reaction: "Bon à savoir, mais va falloir changer" },
      { text: "Quand j'ai envie", reaction: "Tant que tu me réponds ça va" },
      { text: "Frero si c'est toi tu vas attendre mon grand", reaction: "Aïe, ça pique un peu mais j'accepte et mon cœur reste ouvert ahaha" }
    ]
  }
];

const Q1_OPTIONS = [
  { text: "Rien de spécial, je n'y ai pas fait attention", tag: "curieux" },
  { text: "Je me suis dit bizarre mais sympa", tag: "curieux" },
  { text: "Je me suis dit bizarre mais bon qu'est-ce qu'il veut encore lui", tag: "fin" },
  { text: "J'ai capté le move et ça m'a fait plaisir", tag: "curieux" },
  { text: "J'ai capté le move et bon pas que je te déteste mais flemme", tag: "curieux" },
  { text: "Frero je suis en couple lâche ça", tag: "fin" }
];

const FOOD_OPTIONS = ["Pizza", "Sushi", "Burger", "Pâtes", "Kebab"];

const INVITATION_OPTIONS = [
  "Non désolé",
  "Allez pourquoi pas",
  "Je dis pas non mais avant faut qu'on discute"
];

// --- État global ---
const state = {
  warmupAnswers: [], // { question, answer }
  q1Selected: [],   // textes des options cochées
  food: null,
  music: null,
  path: null,        // "fin" ou "complet"
  invitationAnswer: null
};

function showScene(id) {
  document.querySelectorAll('.scene').forEach(s => s.dataset.active = 'false');
  document.getElementById(id).dataset.active = 'true';
}

// ---------- Warm-up ----------
let warmupIndex = 0;
const warmupQuestionEl = document.getElementById('warmupQuestion');
const warmupOptionsEl = document.getElementById('warmupOptions');
const warmupProgressEl = document.getElementById('warmupProgress');

function animateChars(el, phrase) {
  el.innerHTML = '';
  phrase.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.animationDelay = `${i * 0.025}s`;
    el.appendChild(span);
  });
}

function renderWarmup() {
  const q = WARMUP_QUESTIONS[warmupIndex];
  warmupProgressEl.textContent = `question ${warmupIndex + 1} / ${WARMUP_QUESTIONS.length}`;
  warmupQuestionEl.textContent = q.question;
  warmupOptionsEl.innerHTML = '';
  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.type = 'button';
    btn.textContent = opt.text;
    btn.addEventListener('click', () => {
      state.warmupAnswers.push({ question: q.question, answer: opt.text });
      showReaction(opt.reaction, () => {
        warmupIndex++;
        if (warmupIndex < WARMUP_QUESTIONS.length) {
          renderWarmup();
          showScene('scene-warmup');
        } else {
          playTransition();
        }
      });
    });
    warmupOptionsEl.appendChild(btn);
  });
}

renderWarmup();

// ---------- Réaction animée après chaque réponse warm-up ----------
function showReaction(text, onDone) {
  showScene('scene-reaction');
  const el = document.getElementById('reactionText');
  animateChars(el, text);
  const duration = Math.max(3000, 700 + text.length * 25);
  setTimeout(onDone, duration);
}

// ---------- Transition animée avant la vraie question ----------
function playTransition() {
  showScene('scene-transition');
  const el = document.getElementById('transitionText');
  const phrase = 'La question qui arrive est à choix multiple, bonne chance !';
  animateChars(el, phrase);
  setTimeout(() => showScene('scene-q1'), 3200);
}

// ---------- Question 1 ----------
// ---------- Question 1 (Version sécurisée) ----------
const q1OptionsEl = document.getElementById('q1Options');
const q1ContinueBtn = document.getElementById('q1ContinueBtn');

// On vide d'abord pour éviter les doublons au cas où
q1OptionsEl.innerHTML = ''; 

Q1_OPTIONS.forEach(opt => {
  const btn = document.createElement('button');
  btn.className = 'option-btn';
  btn.type = 'button';
  btn.textContent = opt.text;
  
  btn.addEventListener('click', () => {
    btn.classList.toggle('selected');
    
    if (btn.classList.contains('selected')) {
      // On ajoute l'option sélectionnée
      state.q1Selected.push(opt);
    } else {
      // On la retire si elle est désélectionnée
      state.q1Selected = state.q1Selected.filter(o => o.text === opt.text);
    }
    // Active le bouton continuer si au moins une option est cochée
    q1ContinueBtn.disabled = state.q1Selected.length === 0;
  });
  
  q1OptionsEl.appendChild(btn);
});

q1ContinueBtn.addEventListener('click', () => {
  // On vérifie si parmis les choix sélectionnés, il y a le tag "curieux"
  const hasCurieux = state.q1Selected.some(o => o.tag === 'curieux');
  
  if (hasCurieux) {
    state.path = 'complet';
    showScene('scene-food');
  } else {
    state.path = 'fin';
    showEndScreen();
  }
});

// ---------- Question 2 : plat ----------
const foodOptionsEl = document.getElementById('foodOptions');
const foodOtherInput = document.getElementById('foodOtherInput');
const foodContinueBtn = document.getElementById('foodContinueBtn');
let selectedFoodBtn = null;

FOOD_OPTIONS.forEach(food => {
  const btn = document.createElement('button');
  btn.className = 'option-btn';
  btn.type = 'button';
  btn.textContent = food;
  btn.addEventListener('click', () => selectFood(food, btn));
  foodOptionsEl.appendChild(btn);
});

const otherBtn = document.createElement('button');
otherBtn.className = 'option-btn';
otherBtn.type = 'button';
otherBtn.textContent = 'Autre';
otherBtn.addEventListener('click', () => {
  foodOtherInput.style.display = 'block';
  foodOtherInput.focus();
  selectFood(null, otherBtn);
});
foodOptionsEl.appendChild(otherBtn);

function selectFood(food, btn) {
  if (selectedFoodBtn) selectedFoodBtn.classList.remove('selected');
  selectedFoodBtn = btn;
  btn.classList.add('selected');
  if (food) {
    foodOtherInput.style.display = 'none';
    foodOtherInput.value = '';
    state.food = food;
  } else {
    state.food = null; // sera rempli via le champ texte
  }
  updateFoodContinueState();
}

foodOtherInput.addEventListener('input', () => {
  state.food = foodOtherInput.value.trim() || null;
  updateFoodContinueState();
});

function updateFoodContinueState() {
  const valid = state.food && state.food.length > 0;
  foodContinueBtn.disabled = !valid;
}

foodContinueBtn.addEventListener('click', () => {
  if (selectedFoodBtn === otherBtn) {
    state.food = foodOtherInput.value.trim();
  }
  showScene('scene-music');
});

// ---------- Question 3 : musique ----------
const musicInput = document.getElementById('musicInput');
const musicContinueBtn = document.getElementById('musicContinueBtn');

musicInput.addEventListener('input', () => {
  musicContinueBtn.disabled = musicInput.value.trim().length === 0;
});

musicContinueBtn.addEventListener('click', () => {
  state.music = musicInput.value.trim();
  showEndScreen();
});

// ---------- Écran de fin ----------
function showEndScreen() {
  const endEyebrow = document.getElementById('endEyebrow');
  const endTitle = document.getElementById('endTitle');
  const endText = document.getElementById('endText');
  const invitationOptionsEl = document.getElementById('invitationOptions');
  invitationOptionsEl.innerHTML = '';

  if (state.path === 'fin') {
    endEyebrow.textContent = 'oups';
    endTitle.textContent = "Ah, désolé du dérangement";
    endText.textContent = "Pas de souci, merci d'avoir répondu honnêtement. Bonne continuation !";
  } else {
    endEyebrow.textContent = 'merci';
    endTitle.textContent = "Parfait, merci !";
    endText.textContent = `Donc si je t'invite manger ${state.food} t'accepte ?`;

    let selectedInvitationBtn = null;
    INVITATION_OPTIONS.forEach(text => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.type = 'button';
      btn.textContent = text;
      btn.addEventListener('click', () => {
        if (selectedInvitationBtn) selectedInvitationBtn.classList.remove('selected');
        selectedInvitationBtn = btn;
        btn.classList.add('selected');
        state.invitationAnswer = text;
      });
      invitationOptionsEl.appendChild(btn);
    });
  }
  showScene('scene-end');
}

// ---------- Envoi du mail via le backend (Resend) ----------
const sendBtn = document.getElementById('sendBtn');
const sendStatus = document.getElementById('sendStatus');
const freeMessageEl = document.getElementById('freeMessage');

sendBtn.addEventListener('click', async () => {
  sendBtn.disabled = true;
  sendStatus.textContent = 'Envoi en cours...';

  const payload = {
    warmupAnswers: state.warmupAnswers,
    q1Answers: state.q1Selected.map(o => o.text),
    path: state.path,
    food: state.food,
    music: state.music,
    invitationAnswer: state.invitationAnswer,
    message: freeMessageEl.value.trim() || null
  };

  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      let detail = '';
      try {
        const data = await res.json();
        detail = data.error || '';
      } catch (_) {}
      throw new Error(detail || `Échec de l'envoi (code ${res.status})`);
    }

    sendStatus.textContent = 'Message envoyé, merci !';
    sendBtn.textContent = 'Envoyé';
  } catch (err) {
    sendStatus.textContent = `Erreur : ${err.message}`;
    sendBtn.disabled = false;
    console.error(err);
  }
});
