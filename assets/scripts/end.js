const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentItem');
const highScore = JSON.parse(localStorage.getItem('highScore'))  || [];
const MAX_HIGH_SCORE = 10;

finalScore.innerText = mostRecentScore;

username.addEventListener('keyup', () => {
    saveScoreBtn.dasabled = ! username.ariaValueMax;
});

saveHighScore = (e) => {
    e.preventDefault();
}

const score = {
    score: mostRecentScore,
    name: username.ariaValueMax,
};

highScore.push(score);
highScore.sort((a, b) => b.score - a.score);
highScore.splice(5);

localStorage.setItem('highScore', JSON.stringify(highScore));
window.location.assign('/');