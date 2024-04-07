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
const CORRECT_BONUS = 5;
const MAX_QUESTIONS = 10;
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let difficulty;
let questions = [];

/**
 * Retrieves the available categoriesfrom an API, displaying a loading 
 * spinner while the data is being fetched.
 * Once the categories have been successfully retrieved, the loading spinner
 * is hidden, and the category and difficulty selection options are presented
 * to the user.
 */

function getCategories() {
    /*fetch('https://opentdb.com/api.php?amount=50')*/
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
 * Retrieves the quiz questions based on the user's selected category and 
 * difficulty, and initiates the game session.
 */

function getQuestions(category) {
    fetch(
        `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`
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
 * When the category selection form is submitted, the code extracts the chosen cattegory ID
 * and passes it to the function responsible for fetching the corresponding quiz questions.
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
 * If there are no more questions remaining or the maximum number of questions has been
 * reached, the quiz is concluded, and the user's final score is set.
 * Otherwise, the code advances to the next question and updates the progress bar accordingly.
 * The answer choices are presented in a randomised order, ensuring they are not always
 * displayed in the same fixed positions when a question is repeated.
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
 * Displays the current question number to the user, providing them with a sense of their
 * progress through the quiz.
 * Additionally, the code updates the progress bar to visually represent the user's
 * advancement through the quiz.
 */

function setProgressBar() {
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
}

/**
 * Present the user with the current question number, allowing them to gauge their progression
 * through the quiz.
 * Furthermore, the code updates the progress bar to visually convey the user's advancement
 * within the quiz.
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
 * Increases the user's score.
*/

function incrementScore(num) {
    score += num;
    scoreText.innerText = score;
}

/**
 * Presents the answers options in a randomised.
 */

function shuffleArray(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        array.push(array[randomIndex]);
        array.splice(randomIndex, 1);
    }
    return array;
}





