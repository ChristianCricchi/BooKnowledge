/* jshint esversion: 6 */
const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

/*
 * Generates the high scores list on the page, or displays a message  if no high scores are available.
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

