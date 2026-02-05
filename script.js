const timerEl = document.getElementById("timer");
const countdownScreen = document.getElementById("countdown-screen");
const questionScreen = document.getElementById("question-screen");
const yesButtonsWrap = document.getElementById("yes-buttons");
const yesButtons = document.querySelectorAll(".yes-btn");
const confettiCanvas = document.getElementById("confetti-canvas");
const confettiCtx = confettiCanvas.getContext("2d");

let confettiPieces = [];
let confettiFrame = null;
let countdownInterval = null;

function getTargetDate() {
  return new Date(2026, 1, 21, 22, 0, 0, 0);
}

function formatTime(msRemaining) {
  const totalSeconds = Math.floor(msRemaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const dayStr = String(days).padStart(2, "0");
  const hourStr = String(hours).padStart(2, "0");
  const minStr = String(minutes).padStart(2, "0");
  const secStr = String(seconds).padStart(2, "0");

  return `${dayStr}:${hourStr}:${minStr}:${secStr}`;
}

function showQuestionScreen() {
  countdownScreen.classList.add("hidden");
  questionScreen.classList.remove("hidden");
}

function updateCountdown() {
  const now = new Date();
  const target = getTargetDate();
  const remaining = target - now;

  if (remaining <= 0) {
    clearInterval(countdownInterval);
    timerEl.textContent = "00:00:00:00";
    showQuestionScreen();
    return;
  }

  timerEl.textContent = formatTime(remaining);
}

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

function createConfettiBurst() {
  confettiPieces = [];
  const colors = [
    "#ff4f8a",
    "#ff8ab2",
    "#ffc2d7",
    "#ffd166",
    "#8ecae6",
    "#bde0fe",
  ];
  const count = 180;

  for (let i = 0; i < count; i += 1) {
    confettiPieces.push({
      x: confettiCanvas.width / 2,
      y: confettiCanvas.height / 2,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.8) * 14,
      gravity: 0.18 + Math.random() * 0.18,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
      size: 6 + Math.random() * 8,
      alpha: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }
}

function drawConfetti() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  let activePieces = 0;
  for (const piece of confettiPieces) {
    if (piece.alpha <= 0) continue;
    activePieces += 1;

    piece.x += piece.vx;
    piece.y += piece.vy;
    piece.vy += piece.gravity;
    piece.rotation += piece.rotationSpeed;
    piece.alpha -= 0.008;

    confettiCtx.save();
    confettiCtx.globalAlpha = Math.max(piece.alpha, 0);
    confettiCtx.translate(piece.x, piece.y);
    confettiCtx.rotate(piece.rotation);
    confettiCtx.fillStyle = piece.color;
    confettiCtx.fillRect(
      -piece.size / 2,
      -piece.size / 2,
      piece.size,
      piece.size * 0.6,
    );
    confettiCtx.restore();
  }

  if (activePieces > 0) {
    confettiFrame = requestAnimationFrame(drawConfetti);
  } else {
    cancelAnimationFrame(confettiFrame);
    confettiFrame = null;
  }
}

function triggerConfetti() {
  confettiCanvas.classList.remove("hidden");
  resizeCanvas();
  createConfettiBurst();
  drawConfetti();
}

yesButtons.forEach((button) => {
  button.addEventListener("click", () => {
    yesButtonsWrap.classList.add("hidden");
    triggerConfetti();
  });
});

window.addEventListener("resize", resizeCanvas);

updateCountdown();
countdownInterval = setInterval(updateCountdown, 1000);
