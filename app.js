const studyDisplay = document.getElementById("study");
const gameDisplay = document.getElementById("game");

let mode = null; // "study" or "game"
let timerId = null;
let lastTime = 0;

let studyTime = 0; // ms
let gameTime = 0;  // ms

const rateSlider = document.getElementById("rate");
const rateValue = document.getElementById("rateValue");

let rate = 1.0;
let streak = 0;              // 連続勉強回数
let bonusRate = 0;           // ボーナス倍率
let currentStudySession = 0; // 今回の勉強時間(ms)

document.getElementById("streak").textContent = streak;
document.getElementById("bonus").textContent = bonusRate.toFixed(1);

function updateBonus() {
  if (streak >= 5) bonusRate = 0.5;
  else if (streak >= 3) bonusRate = 0.2;
  else if (streak >= 2) bonusRate = 0.1;
  else bonusRate = 0;
}

rateSlider.oninput = () => {
  rate = Number(rateSlider.value);
  rateValue.textContent = rate.toFixed(1);
};

function update() {
  const now = Date.now();
  const diff = now - lastTime;
  lastTime = now;

 if (mode === "study") {
  studyTime += diff;
  gameTime += diff * rate; // ← 倍率反映
}


  if (mode === "game") {
    gameTime -= diff;
    if (gameTime <= 0) {
      gameTime = 0;
      stop();
      alert("ゲーム時間終了！");
    }
  }

  studyDisplay.textContent = (studyTime / 1000).toFixed(1);
  gameDisplay.textContent = (gameTime / 1000).toFixed(1);
}

function start(newMode) {
  stop();
  mode = newMode;
  lastTime = Date.now();
  timerId = setInterval(update, 50);
}

function stop() {
  clearInterval(timerId);
  timerId = null;

  if (mode === "study") {
    if (currentStudySession >= 5 * 60 * 1000) { // 5分以上
      streak++;
    } else {
      streak = 0;
    }
    updateBonus();
    currentStudySession = 0;
  }

  mode = null;
}


document.getElementById("studyBtn").onclick = () => start("study");
document.getElementById("gameBtn").onclick = () => {
  if (gameTime > 0) start("game");
};
document.getElementById("stopBtn").onclick = stop;

document.getElementById("resetBtn").onclick = () => {
  stop();
  studyTime = 0;
  gameTime = 0;
  studyDisplay.textContent = "0.0";
  gameDisplay.textContent = "0.0";
};
