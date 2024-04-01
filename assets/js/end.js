const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");
const mostRecentScore = localStorage.getItem("mostRecentScore");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

/**
 * Update text content of finalScore to the value stored in mostRecentScore
*/

finalScore.innerText = mostRecentScore;

/**
 * Disables the save score button until a name is entered
*/

username.addEventListener("keyup", () => {
    saveScoreBtn.disabled = !username.value;
});

/**
 * Get the username and score, then update the high scores list
*/

const saveHighScore = (e) => {
    if (e) {
    e.preventDefault();
    }
    
    if (!username.value) {
        saveScoreBtn.disabled = true;
        return;
    }
    const score = {
        score: mostRecentScore,
        name: username.value,
    };
    highScores.push(score);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(5);

    localStorage.setItem("highScores", JSON.stringify(highScores));
    window.location.assign("index.html");
};

saveHighScore();