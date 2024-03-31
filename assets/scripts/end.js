const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");
const mostRecentScore = localStorage.getItem("mostRecentScore");
const highScores = JSON.parse(localStorage.getItem("highScores"))  || [];

const MAX_HIGH_SCORES = 5;

window.onload(Swal.fire("Sweetalert2 is working!"));

finalScore.innerText = mostRecentScore;

username.addEventListener("keyup", () => {
    saveScoreBtn.dasabled = ! username.ariaValueMax;
});

saveHighScore = (e) => {
    e.preventDefault();


const score = {
    score: mostRecentScore,
    name: username.value,
};

highScores.push(score);
highScores.sort((a, b) => b.score - a.score);
highScores.splice(5);

localStorage.setItem("highScore", JSON.stringify(highScore));
window.location.assign('/');

};