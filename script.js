let allQuestions = [];
let workingSet = [];
let currentIndex = 0;
let correctStreak = 0;

const qText = document.getElementById('question-text');
const optionsDiv = document.getElementById('options');
const feedback = document.getElementById('feedback');
const congrats = document.getElementById('congrats');
const nextBtn = document.getElementById('next-btn');
const levelSelect = document.getElementById('level');
const langSelect = document.getElementById('language');
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

async function init() {
    try {
        const res = await fetch('questions.json');
        allQuestions = await res.json();
    } catch (e) {
        console.error('Failed to load questions.json', e);
        qText.textContent = 'Failed to load questions. Check Live Server and file path.';
        return;
    }
    const savedLang = localStorage.getItem('lang');
    const savedLevel = localStorage.getItem('level');
    if (savedLang) langSelect.value = savedLang;
    if (savedLevel) levelSelect.value = savedLevel;
}

function startQuiz() {
    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    buildWorkingSet();
    renderQuestion();
}

function saveSettings() {
    localStorage.setItem('lang', langSelect.value);
    localStorage.setItem('level', levelSelect.value);
}

function buildWorkingSet() {
    const level = levelSelect.value;
    workingSet = allQuestions.filter(q => q.level === level);
    shuffle(workingSet);
    currentIndex = 0;
    correctStreak = 0;
}

function renderQuestion() {
    feedback.textContent = '';
    congrats.textContent = '';
    if (workingSet.length === 0) {
        qText.textContent = 'No questions found for this level.';
        optionsDiv.innerHTML = '';
        return;
    }
    const q = workingSet[currentIndex % workingSet.length];
    const lang = langSelect.value;

    qText.textContent = lang === 'en' ? q.question_en : q.question_ta;
    optionsDiv.innerHTML = '';
    const opts = lang === 'en' ? q.options_en : q.options_ta;

    opts.forEach((text, idx) => {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.addEventListener('click', () => checkAnswer(idx, q.answer));
        optionsDiv.appendChild(btn);
    });
}

function checkAnswer(selected, correct) {
    if (selected === correct) {
        feedback.textContent = langSelect.value === 'en' ? 'Correct!' : 'சரி!';
        feedback.style.color = '#15803d';
        correctStreak++;
        if (correctStreak === 3) {
            congrats.textContent = langSelect.value === 'en'
                ? '🎉 Congratulations! 3 correct answers in a row!'
                : '🎉 வாழ்த்துக்கள்! தொடர்ந்து 3 சரியான பதில்கள்!';
            correctStreak = 0;
        }
    } else {
        feedback.textContent = langSelect.value === 'en' ? 'Wrong!' : 'தவறு!';
        feedback.style.color = '#dc2626';
        correctStreak = 0;
    }
}

function nextQuestion() {
    currentIndex++;
    renderQuestion();
}
