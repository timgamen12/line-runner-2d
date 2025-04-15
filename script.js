const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let player, gravity, jumpPower, obstacles, frame, jumpsLeft, score, powerUps;

function initGame() {
  player = {
    x: 100,
    y: canvas.height / 2,
    size: 30,
    color: "#0f0",
    dy: 0,
  };

  gravity = 0.5;
  jumpPower = -10;
  obstacles = [];
  powerUps = [];
  frame = 0;
  jumpsLeft = 2;
  score = 0;
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
  ctx.fill();
}

function createObstacle() {
  const height = Math.random() * 100 + 40;
  obstacles.push({
    x: canvas.width,
    y: canvas.height - height,
    width: 40,
    height: height,
    color: "#f00"
  });
}

function drawObstacles() {
  obstacles.forEach(obs => {
    ctx.fillStyle = obs.color;
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    obs.x -= 6;
  });

  obstacles = obstacles.filter(obs => obs.x + obs.width > 0);
}

// Create Power-up
function createPowerUp() {
  const size = 20;
  const powerUp = {
    x: canvas.width,
    y: Math.random() * (canvas.height - size),
    width: size,
    height: size,
    color: "#ff0"
  };
  powerUps.push(powerUp);
}

function drawPowerUps() {
  powerUps.forEach(powerUp => {
    ctx.fillStyle = powerUp.color;
    ctx.beginPath();
    ctx.arc(powerUp.x, powerUp.y, powerUp.width / 2, 0, Math.PI * 2);
    ctx.fill();
    powerUp.x -= 4; // Move power-up to the left
  });

  powerUps = powerUps.filter(powerUp => powerUp.x + powerUp.width > 0);
}

// Detect collision with obstacles and power-ups
function detectCollision() {
  for (let obs of obstacles) {
    if (
      player.x + player.size > obs.x &&
      player.x - player.size < obs.x + obs.width &&
      player.y + player.size > obs.y
    ) {
      return true;
    }
  }

  // Check if the player collects a power-up
  for (let powerUp of powerUps) {
    if (
      player.x + player.size > powerUp.x &&
      player.x - player.size < powerUp.x + powerUp.width &&
      player.y + player.size > powerUp.y &&
      player.y - player.size < powerUp.y + powerUp.height
    ) {
      // Collect the power-up and increase the score
      powerUps = powerUps.filter(p => p !== powerUp);
      score += 5; // Increase score when power-up is collected
    }
  }

  return false;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  frame++;

  drawPlayer();
  drawObstacles();
  drawPowerUps();

  player.dy += gravity;
  player.y += player.dy;

  if (player.y + player.size > canvas.height) {
    player.y = canvas.height - player.size;
    player.dy = 0;
    jumpsLeft = 2; // Reset jumps when the player hits the ground
  }

  if (frame % 60 === 0) createObstacle(); // Create new obstacle every 60 frames
  if (frame % 200 === 0) createPowerUp(); // Create new power-up every 200 frames

  if (detectCollision()) {
    initGame(); // Restart the game when collision occurs
  }

  // Display score
  ctx.fillStyle = "#fff";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  requestAnimationFrame(gameLoop);
}

function handleJump() {
  if (jumpsLeft > 0) {
    player.dy = jumpPower;
    jumpsLeft--;
  }
}

window.addEventListener("touchstart", handleJump);
window.addEventListener("keydown", e => {
  if (e.code === "Space") handleJump();
});

initGame();
gameLoop();
