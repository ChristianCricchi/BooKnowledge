const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const categorySelect = document.getElementById('category');
const categoryContainer = document.getElementById('categorySelect');
const categoryForm = document.getElementById('categoryForm')
const difficultySelect = document.getElementById('difficulty');
const loader = document.getElementById('loader');
const gameArea = document.getElementById('gameArea');
const errorMessage = document.getElementById('error');
const CORRECT_BONUS = 1;
const MAX_QUESTIONS = 6;
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let difficulty;
let questions = [];

function getCategories() {
    fetch('https://opentdb.com/api_category.php')
        .then((res) => res.json())
        .then((data) => data.trivia_categories)
        .then((categories) => {
        
            categories.forEach((category, index) => {
                const option = document.createElement('option');
                option.value = category.id;
                option.innerText = category.name;
                if (index === 0) {
                    option.select = true;
                }
                categorySelect.appendChild(option);
            });
            loader.classList.add('hide');
            gameArea.classList.remove('hide');
            categoryContainer.classList.remove('hide');
        })
        .catch(() =>{
            loader.classList.add('hide');
            errorMessage.classList.remove('hide');
        });
}

getCategories();

function getQuestions(category) {
    fetch(
        `https://opentdb.com/api.php?amount=6&category=${category}&difficulty=${difficulty}&type=multiple`
    )
        .then((res) => {
            return res.json();
        })
        .then((resp) => resp.results)
        .then((loadedQuestions) => {
            questions = loadedQuestions;
            startGame();
        })
        .catch((err) => {
            console.error(err);
        })
        .finally(() => {
            gameArea.classList.remove('hide');
            categoryContainer.classList.add('hide');
        });
}

    categoryForm.addEventListener('submit', function (event) {
        event.preventDefault();
     

        const selectedCategoryId = categorySelect.value;});
        getQuestions(selectedCategoryId);
       

function startGame() {
    questionCounter = 0;
    score = 0;
    availableQuestions = questions;
    getNewQuestion();
}

function getNewQuestion() {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        return window.location.assign('end.html');
    }

    questionCounter++;
    setProgressBar();
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerHTML = currentQuestion.question;

    const answersArray = shuffleArray([
        ...currentQuestion.incorrect_answers,
        currentQuestion.correct_answer,
    ]);

    choices.forEach((choice, index) => {
        choice.innerHTML = answersArray[index];
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
}

function setProgressBar() {
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
}

choices.forEach((choice) => {
    choice.addEventListener('click', (event) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = event.target;

        console.log(currentQuestion);

        const classToApply =
            currentQuestion.correct_answer === event.target.innerHTML
                ? 'correct'
                : 'incorrect';

        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

function incrementScore(num) {
    score += num;
    scoreText.innerText = score;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        array.push(array[randomIndex]);
        array.splice(randomIndex, 1);
    }
    return array;
}






