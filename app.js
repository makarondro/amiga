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
];

let currentIndex = 0;
let quizIndex = Math.floor(Math.random() * vocab.length);

const wordCard = document.getElementById("wordCard");
const nextWordBtn = document.getElementById("nextWordBtn");

const mascotHint = document.getElementById("mascotHint");

const quizPrompt = document.getElementById("quizPrompt");
const quizInput = document.getElementById("quizInput");
const checkBtn = document.getElementById("checkBtn");
const quizResult = document.getElementById("quizResult");

function renderWord(index) {
  const word = vocab[index];
  wordCard.innerHTML = `
    <p><strong>EN:</strong> ${word.en}</p>
    <p><strong>ES:</strong> ${word.es}</p>
    <p><strong>Пояснення:</strong> ${word.note}</p>
  `;
  mascotHint.textContent = `Санта Аміґа каже: ${word.hint}`;
}

function renderQuiz(index) {
  quizPrompt.textContent = `Як буде англійською: "${vocab[index].es}"?`;
  quizInput.value = "";
  quizResult.textContent = "";
  quizResult.className = "quiz-result";
}

nextWordBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % vocab.length;
  renderWord(currentIndex);
});

checkBtn.addEventListener("click", () => {
  const userAnswer = quizInput.value.trim().toLowerCase();
  const rightAnswer = vocab[quizIndex].en.toLowerCase();

  if (userAnswer === rightAnswer) {
    quizResult.textContent = "Круто! Правильна відповідь ✅";
    quizResult.classList.add("ok");
    mascotHint.textContent = "Санта Аміґа: супер! Ти молодець. Йдемо далі.";
    quizIndex = Math.floor(Math.random() * vocab.length);
    renderQuiz(quizIndex);
    return;
  }

  quizResult.textContent = `Майже. Правильно: ${vocab[quizIndex].en}`;
  quizResult.classList.add("bad");
  mascotHint.textContent = `Санта Аміґа: спокійно, це нормально. Пам'ятай: ${vocab[quizIndex].hint}`;
});

renderWord(currentIndex);
renderQuiz(quizIndex);
