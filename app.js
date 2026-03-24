const vocab = [
  {
    en: "actually",
    es: "en realidad",
    note: "False friend: ES 'actualmente' = EN 'currently'",
    hint: "Підказка: 'actually' = 'en realidad', не 'actualmente'.",
  },
  {
    en: "library",
    es: "biblioteca",
    note: "Не плутати з ES 'librería' (bookstore)",
    hint: "Підказка: biblioteca → library, а librería → bookstore.",
  },
  {
    en: "embarrassed",
    es: "avergonzado/a",
    note: "Не ES 'embarazada' (pregnant)",
    hint: "Увага: embarrassed ≠ embarazada.",
  },
  {
    en: "support",
    es: "apoyar",
    note: "В EN це дієслово/іменник: support",
    hint: "Якщо бачиш apoyar, часто EN буде support.",
  },
  {
    en: "I am used to it",
    es: "estoy acostumbrado/a",
    note: "EN: 'used to' часто складний для ES-спікерів",
    hint: "Фраза цілком: estoy acostumbrado/a → I am used to it.",
  },
  {
    en: "kitchen",
    es: "cocina",
    note: "Кімната для готування",
    hint: "cocina (room) → kitchen.",
  },
  {
    en: "breakfast",
    es: "desayuno",
    note: "Ранковий прийом їжі",
    hint: "desayuno → breakfast.",
  },
  {
    en: "lunch",
    es: "almuerzo",
    note: "Денний прийом їжі",
    hint: "almuerzo → lunch.",
  },
  {
    en: "dinner",
    es: "cena",
    note: "Вечеря",
    hint: "cena → dinner.",
  },
  {
    en: "water",
    es: "agua",
    note: "Базове слово щоденного вжитку",
    hint: "agua → water.",
  },
  {
    en: "coffee",
    es: "café",
    note: "Напій",
    hint: "café → coffee.",
  },
  {
    en: "bread",
    es: "pan",
    note: "Продукт харчування",
    hint: "pan → bread.",
  },
  {
    en: "market",
    es: "mercado",
    note: "Місце для покупок",
    hint: "mercado → market.",
  },
  {
    en: "store",
    es: "tienda",
    note: "Магазин",
    hint: "tienda → store.",
  },
  {
    en: "street",
    es: "calle",
    note: "Вулиця",
    hint: "calle → street.",
  },
  {
    en: "bus",
    es: "autobús",
    note: "Транспорт",
    hint: "autobús → bus.",
  },
  {
    en: "work",
    es: "trabajo",
    note: "Робота / працювати (контекст)",
    hint: "trabajo → work.",
  },
  {
    en: "today",
    es: "hoy",
    note: "Сьогодні",
    hint: "hoy → today.",
  },
  {
    en: "tomorrow",
    es: "mañana",
    note: "Завтра",
    hint: "mañana → tomorrow.",
  },
  {
    en: "family",
    es: "familia",
    note: "Сімʼя",
    hint: "familia → family.",
  },
  {
    en: "friend",
    es: "amigo/amiga",
    note: "Друг / подруга",
    hint: "amigo/amiga → friend.",
  },
  {
    en: "house",
    es: "casa",
    note: "Будинок/дім",
    hint: "casa → house.",
  },
  {
    en: "bathroom",
    es: "baño",
    note: "Кімната для гігієни",
    hint: "baño → bathroom.",
  },
  {
    en: "bedroom",
    es: "dormitorio",
    note: "Спальня",
    hint: "dormitorio → bedroom.",
  },
  {
    en: "clean",
    es: "limpiar",
    note: "Дієслово: прибирати",
    hint: "limpiar (verb) → clean.",
  },
];

let currentIndex = 0;
const STORAGE_KEY = "santa_amiga_progress_v1";
const STREAK_KEY = "santa_amiga_streak_v1";
const ONBOARDING_KEY = "santa_amiga_onboarding_seen_v1";
let progress = loadProgress();
let quizIndex = pickQuizIndex();
let streakData = loadStreakData();

const onboardingTip = document.getElementById("onboardingTip");
const closeOnboardingBtn = document.getElementById("closeOnboardingBtn");
const wordCard = document.getElementById("wordCard");
const nextWordBtn = document.getElementById("nextWordBtn");
const wordStatus = document.getElementById("wordStatus");
const markKnownBtn = document.getElementById("markKnownBtn");
const markLearningBtn = document.getElementById("markLearningBtn");

const mascotHint = document.getElementById("mascotHint");

const quizPrompt = document.getElementById("quizPrompt");
const quizInput = document.getElementById("quizInput");
const checkBtn = document.getElementById("checkBtn");
const quizResult = document.getElementById("quizResult");
const modeEsToEnBtn = document.getElementById("modeEsToEnBtn");
const modeEnToEsBtn = document.getElementById("modeEnToEsBtn");
const countNew = document.getElementById("countNew");
const countLearning = document.getElementById("countLearning");
const countKnown = document.getElementById("countKnown");
const knownPercent = document.getElementById("knownPercent");
const streakCount = document.getElementById("streakCount");
let quizDirection = "es_to_en";

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function loadStreakData() {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return { streak: 0, lastActiveDate: null };
    return JSON.parse(raw);
  } catch {
    return { streak: 0, lastActiveDate: null };
  }
}

function saveStreakData() {
  localStorage.setItem(STREAK_KEY, JSON.stringify(streakData));
}

function diffDays(fromDate, toDate) {
  const from = new Date(`${fromDate}T00:00:00Z`);
  const to = new Date(`${toDate}T00:00:00Z`);
  const ms = to.getTime() - from.getTime();
  return Math.round(ms / 86400000);
}

function updateStreakOnActivity() {
  const today = todayString();

  if (!streakData.lastActiveDate) {
    streakData = { streak: 1, lastActiveDate: today };
    saveStreakData();
    return;
  }

  const gap = diffDays(streakData.lastActiveDate, today);

  if (gap <= 0) {
    return;
  }

  if (gap === 1) {
    streakData.streak += 1;
  } else {
    streakData.streak = 1;
  }

  streakData.lastActiveDate = today;
  saveStreakData();
}

function renderStreak() {
  streakCount.textContent = `Streak: ${streakData.streak} днів`;
}

function renderOnboarding() {
  const isSeen = localStorage.getItem(ONBOARDING_KEY) === "true";
  onboardingTip.classList.toggle("hidden", isSeen);
}

closeOnboardingBtn.addEventListener("click", () => {
  localStorage.setItem(ONBOARDING_KEY, "true");
  onboardingTip.classList.add("hidden");
});

function getWordStatus(word) {
  return progress[word.en] || "new";
}

function setWordStatus(word, status) {
  progress[word.en] = status;
  saveProgress();
}

function pickQuizIndex() {
  const learningIndexes = [];

  vocab.forEach((word, index) => {
    if (getWordStatus(word) === "learning") {
      learningIndexes.push(index);
    }
  });

  if (learningIndexes.length > 0) {
    const randomPoolIndex = Math.floor(Math.random() * learningIndexes.length);
    return learningIndexes[randomPoolIndex];
  }

  return Math.floor(Math.random() * vocab.length);
}

function renderProgress() {
  let newCount = 0;
  let learningCount = 0;
  let knownCount = 0;

  vocab.forEach((word) => {
    const status = getWordStatus(word);
    if (status === "known") {
      knownCount += 1;
      return;
    }

    if (status === "learning") {
      learningCount += 1;
      return;
    }

    newCount += 1;
  });

  countNew.textContent = String(newCount);
  countLearning.textContent = String(learningCount);
  countKnown.textContent = String(knownCount);
  const knownRatio = Math.round((knownCount / vocab.length) * 100);
  knownPercent.textContent = `% known: ${knownRatio}%`;
}

function renderWord(index) {
  const word = vocab[index];
  const status = getWordStatus(word);
  wordCard.innerHTML = `
    <p><strong>EN:</strong> ${word.en}</p>
    <p><strong>ES:</strong> ${word.es}</p>
    <p><strong>Пояснення:</strong> ${word.note}</p>
  `;
  wordStatus.textContent = `Статус: ${status}`;
  mascotHint.textContent = `Санта Аміґа каже: ${word.hint}`;
}

function renderQuiz(index) {
  if (quizDirection === "en_to_es") {
    quizPrompt.textContent = `Як буде іспанською: "${vocab[index].en}"?`;
    quizInput.placeholder = "Введи іспанське слово";
  } else {
    quizPrompt.textContent = `Як буде англійською: "${vocab[index].es}"?`;
    quizInput.placeholder = "Введи англійське слово";
  }

  quizInput.value = "";
  quizResult.textContent = "";
  quizResult.className = "quiz-result";
}

function renderQuizModeButtons() {
  if (quizDirection === "en_to_es") {
    modeEnToEsBtn.classList.add("btn-active");
    modeEsToEnBtn.classList.remove("btn-active");
    return;
  }

  modeEsToEnBtn.classList.add("btn-active");
  modeEnToEsBtn.classList.remove("btn-active");
}

function normalizeAnswer(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ");
}

nextWordBtn.addEventListener("click", () => {
  updateStreakOnActivity();
  renderStreak();
  currentIndex = (currentIndex + 1) % vocab.length;
  renderWord(currentIndex);
});

markKnownBtn.addEventListener("click", () => {
  updateStreakOnActivity();
  renderStreak();
  const word = vocab[currentIndex];
  setWordStatus(word, "known");
  renderWord(currentIndex);
  renderProgress();
  quizIndex = pickQuizIndex();
  renderQuiz(quizIndex);
  mascotHint.textContent = "Санта Аміґа: супер, позначила як 'known'.";
});

markLearningBtn.addEventListener("click", () => {
  updateStreakOnActivity();
  renderStreak();
  const word = vocab[currentIndex];
  setWordStatus(word, "learning");
  renderWord(currentIndex);
  renderProgress();
  quizIndex = pickQuizIndex();
  renderQuiz(quizIndex);
  mascotHint.textContent = "Санта Аміґа: окей, це слово ще в роботі (learning).";
});

modeEsToEnBtn.addEventListener("click", () => {
  quizDirection = "es_to_en";
  renderQuizModeButtons();
  renderQuiz(quizIndex);
});

modeEnToEsBtn.addEventListener("click", () => {
  quizDirection = "en_to_es";
  renderQuizModeButtons();
  renderQuiz(quizIndex);
});

checkBtn.addEventListener("click", () => {
  updateStreakOnActivity();
  renderStreak();
  const userAnswer = normalizeAnswer(quizInput.value);
  const rightAnswer =
    quizDirection === "en_to_es"
      ? normalizeAnswer(vocab[quizIndex].es)
      : normalizeAnswer(vocab[quizIndex].en);

  if (userAnswer === rightAnswer) {
    quizResult.textContent = "Круто! Правильна відповідь ✅";
    quizResult.classList.add("ok");
    quizResult.classList.add("celebrate");
    mascotHint.textContent = "Санта Аміґа: супер! Ти молодець. Йдемо далі.";
    setTimeout(() => {
      quizIndex = pickQuizIndex();
      renderQuiz(quizIndex);
    }, 450);
    return;
  }

  const expectedText = quizDirection === "en_to_es" ? vocab[quizIndex].es : vocab[quizIndex].en;
  quizResult.textContent = `Майже. Правильно: ${expectedText}`;
  quizResult.classList.add("bad");
  mascotHint.textContent = `Санта Аміґа: спокійно, це нормально. Пам'ятай: ${vocab[quizIndex].hint}`;
});

renderWord(currentIndex);
renderQuiz(quizIndex);
renderProgress();
renderQuizModeButtons();
updateStreakOnActivity();
renderStreak();
renderOnboarding();
