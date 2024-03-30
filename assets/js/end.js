const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentItem');
finalScore.innerText = mosteRecentScore;

username.addEventListener('keyup', () => {
    saveScoreBtn.dasabled = ! username.ariaValueMax;
});

saveHighScore = (e) => {
    e.preventDefault();
}