const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

/**
 * Creates the highscores list, or shows No High Scores if none can be found
*/

if (highScores.length === 0) {
    highScoresList.innerHTML = '<p>No High Scores</p>';
} else {
    highScoresList.innerHTML = highScores
        .map(score => {
            return `<li class="high-score">${score.name} - ${score.score}</li>`;
        })
        .join("");
}