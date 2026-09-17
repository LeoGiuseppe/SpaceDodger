const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let player = { x: 50, y: 180, width: 20, height: 20, speed: 4 };
let asteroids = [];
let frameCount = 0;
let gameOver = false;
let keys = {};

window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

function gameLoop() {
  if (gameOver) return;
  frameCount++;

  // Movimento su 2D
  if (keys["ArrowUp"] && player.y > 0) player.y -= player.speed;
  if (keys["ArrowDown"] && player.y < canvas.height - player.height) player.y += player.speed;
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x < canvas.width - player.width) player.x += player.speed;

  // Genera asteroide ogni 40 frame
  if (frameCount % 40 === 0) {
    asteroids.push({
      x: canvas.width,
      y: Math.random() * (canvas.height - 20),
      width: 20,
      height: 20,
      speed: 3
    });
  }

  // Aggiorna asteroidi
  for (let i = asteroids.length - 1; i >= 0; i--) {
    let a = asteroids[i];
    a.x -= a.speed;

    // Collisione AABB
    if (player.x < a.x + a.width && player.x + player.width > a.x &&
        player.y < a.y + a.height && player.y + player.height > a.y) {
      gameOver = true;
    }

    // Rimozione asteroidi fuori schermo
    if (a.x + a.width < 0) asteroids.splice(i, 1);
  }

  // Disegna
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.fillStyle = "cyan";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Asteroidi
  ctx.fillStyle = "gray";
  asteroids.forEach(a => ctx.fillRect(a.x, a.y, a.width, a.height));

  // Punteggio
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText("Tempo: " + Math.floor(frameCount / 60), 10, 20);

  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  } else {
    ctx.fillText("GAME OVER", 150, 200);
  }
}

gameLoop();