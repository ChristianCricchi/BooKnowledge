const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const categorySelect = document.getElementById('category');
const categoryContainer = document.getElementById('categorySelect');
const categoryForm = document.getElementById('categoryForm');
const difficultySelect = document.getElementById('difficulty');
const loader = document.getElementById('loader');
const gameArea = document.getElementById('gameArea');
const errorMessage = document.getElementById('error');
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 6;
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let difficulty;
let questions = [];

/**
 * Fetches categories from API while loading spinner shows.
 * Once categories are fetched successfully, loading spinner is removed.
 * Categories and difficulty select options then appear.
*/

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
                    option.selected = true;
                }
                categorySelect.appendChild(option);
            });
            loader.classList.add('hide');
            categoryContainer.classList.remove('hide');
        })
        .catch(() => {
            loader.classList.add('hide');
            errorMessage.classList.remove('hide');
        });
}

getCategories();

/**
 * Gets the questions based on the category and difficulty chosen, then starts the game.
*/

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

/**
 * Once categoryForm is submitted, get the category ID and pass it to the getQuestions function
*/

categoryForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const selectedCategoryId = categorySelect.value;
        getQuestions(selectedCategoryId);
    });

difficulty = difficultySelect.value;

/**
 * Starts the game
*/

function startGame() {
    questionCounter = 0;
    score = 0;
    availableQuestions = questions;
    getNewQuestion();
}

/**
 * If there are no more questions or max questions is reached, the quiz is over and score is set.
 * Otherwise, move to the next question and update the progressBar.
 * Answers are populated in a random order, so they are not always in the same box when question is repeated.
*/

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

/**
 * Informs the user which question they are on.
 * Also fills the progressBar as the user progresses through the quiz.
*/

function setProgressBar() {
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
}

/**
 * Handles answer choices, informs user if the choice is correct or incorrect
 * Score is incremented when answer is correct
 * Moves to next question
*/

choices.forEach((choice) => {
    choice.addEventListener('click', (event) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = event.target;

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

/**
 * Increments the users score 
*/

function incrementScore(num) {
    score += num;
    scoreText.innerText = score;
}

/**
 * Allows answers to be randomised each time a question appears
*/

function shuffleArray(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        array.push(array[randomIndex]);
        array.splice(randomIndex, 1);
    }
    return array;
}






