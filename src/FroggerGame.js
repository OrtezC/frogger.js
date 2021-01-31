var canvas = document.querySelector('#gameDisplay');
var ctx = canvas.getContext('2d');
var gameInterval, hEnemiesInterval, eEnemiesInterval;

var bgMusic = document.createElement('audio');
bgMusic.src = '../assets/backgroundMusic.ogg';
bgMusic.toggleAttribute('loop');
var toggleMusic = document.querySelector('span');
var muted = true;
toggleMusic.addEventListener('click', function () {
  if (!muted) {
    toggleMusic.innerHTML = "<i class='fas fa-volume-mute'></i>";
    bgMusic.pause();
  } else {
    toggleMusic.innerHTML = "<i class='fas fa-volume-up'></i>";
    bgMusic.play();
  }
  muted = !muted;
});

var playerWalk = document.createElement('audio');
playerWalk.src = '../assets/playerWalk.mp3';

var playerScore = document.createElement('audio');
playerScore.src = '../assets/playerScore.mp3';

var playerCollision = document.createElement('audio');
playerCollision.src = '../assets/playerCollide.mp3';

var resetGame = document.createElement('audio');
resetGame.src = '../assets/reset.mp3';

var gameOver = document.createElement('audio');
gameOver.src = '../assets/gameOver.mp3';

var player = {
  score: 0,
  lives: 3,
  posX: 8,
  posY: 15,
  image: '../assets/frogUp.png',

  drawPlayer: function () {
    addImageComponent(
      (canvas.width / 16) * this.posX,
      (canvas.height / 16) * this.posY,
      canvas.width / 16,
      canvas.height / 16,
      this.image
    );
  },

  resetPlayer: function () {
    this.score = 0;
    this.lives = 3;
    this.resetPlayerPos();
    this.image = '../assets/frogUp.png';
  },
  resetPlayerPos: function () {
    this.posX = 8;
    this.posY = 15;
  },
};

const enemiesHardImage = '../assets/Car2.png';

var enemiesHard = [
  {
    posX: 0,
    posY: 1,
    image: enemiesHardImage,
    goingRight: true,
  },
  {
    posX: 0,
    posY: 2,
    image: enemiesHardImage,
    goingRight: true,
  },
  {
    posX: 0,
    posY: 4,
    image: enemiesHardImage,
    goingRight: true,
  },
  {
    posX: 0,
    posY: 5,
    image: enemiesHardImage,
    goingRight: false,
  },
  {
    posX: 0,
    posY: 6,
    image: enemiesHardImage,
    goingRight: true,
  },
];

const enemiesEasyImage = '../assets/Car1.png';

var enemiesEasy = [
  {
    posX: 0,
    posY: 8,
    image: enemiesEasyImage,
    goingRight: false,
  },
  {
    posX: 0,
    posY: 9,
    image: enemiesEasyImage,
    goingRight: true,
  },
  {
    posX: 0,
    posY: 10,
    image: enemiesEasyImage,
    goingRight: false,
  },
  {
    posX: 0,
    posY: 12,
    image: enemiesEasyImage,
    goingRight: true,
  },
  {
    posX: 0,
    posY: 13,
    image: enemiesEasyImage,
    goingRight: false,
  },
  {
    posX: 0,
    posY: 14,
    image: enemiesEasyImage,
    goingRight: true,
  },
];

window.addEventListener('keydown', playerControl);

startGame();
function startGame() {
  player.resetPlayer();
  generateEnemyPos();
  gameInterval = setInterval(updateGame, 20);
  hEnemiesInterval = setInterval(updateEnemiesHard, 50);
  eEnemiesInterval = setInterval(updateEnemiesEasy, 100);
}

function clearGame() {
  clearInterval(gameInterval);
  clearInterval(hEnemiesInterval);
  clearInterval(eEnemiesInterval);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const background = '../assets/background.svg';

function endGame() {
  clearGame();
  gameOver.play();
  addImageComponent(0, 0, canvas.width, canvas.height, background);
  drawScore();
  var fontSize = canvas.height / 16 - 8;
  ctx.font = fontSize + 'px Verdana';
  ctx.fillText('Game Over!', canvas.width / 2.6, (canvas.height / 16) * 15.8);
}

function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  loadCanvas();
}

function loadCanvas() {
  resizeCanvas();
  addImageComponent(0, 0, canvas.width, canvas.height, background);
  player.drawPlayer();
  drawEnemies(enemiesEasy);
  drawEnemies(enemiesHard);
  detectPlayerPos();
  drawScore();
  if (player.lives === 0) {
    endGame();
  }
}

function updateEnemiesEasy() {
  moveEnemies(enemiesEasy);
}

function updateEnemiesHard() {
  moveEnemies(enemiesHard);
}

function resizeCanvas() {
  if (window.innerHeight / 2 < 960) {
    canvas.height = window.innerHeight / 2;
  } else {
    canvas.height = 960;
  }

  if (window.innerWidth / 2 < 960) {
    canvas.width = window.innerWidth / 2;
  } else {
    canvas.width = 960;
  }
}

function addImageComponent(x, y, width, height, imageURL) {
  image = new Image();
  image.src = imageURL;
  ctx.drawImage(image, x, y, width, height);
}

function generateEnemyPos() {
  enemiesEasy.forEach(function (element) {
    element.posX = Math.floor(Math.random() * 16);
  });
  enemiesHard.forEach(function (element) {
    element.posX = Math.floor(Math.random() * 16);
  });
}

function drawEnemies(enemies) {
  enemies.forEach(function (element) {
    addImageComponent(
      (canvas.width / 16) * element.posX,
      (canvas.height / 16) * element.posY,
      canvas.width / 16,
      canvas.height / 16,
      element.image
    );
  });
}

function moveEnemies(enemies) {
  enemies.forEach(function (element) {
    if (element.goingRight && element.posX !== 15) {
      element.posX++;
    } else if (!element.goingRight & (element.posX !== 0)) {
      element.posX--;
    } else {
      element.goingRight = !element.goingRight;
    }
  });
}

function playerControl(key) {
  switch (key.keyCode) {
    case 37:
      if (player.posX === 0) break;
      //left
      else {
        player.image = '../assets/frogLeft.png';
        player.posX--;
        playerWalk.play();
        break;
      }

    case 38:
      if (player.posY === 0) break;
      //up
      else {
        player.image = '../assets/frogUp.png';
        player.posY--;
        playerWalk.play();
        break;
      }
    case 39:
      if (player.posX === 15) break;
      //right
      else {
        player.image = '../assets/frogRight.png';
        player.posX++;
        playerWalk.play();
        break;
      }

    case 40:
      if (player.posY === 15) break;
      //down
      else {
        player.image = '../assets/frogDown.png';
        player.posY++;
        playerWalk.play();
        break;
      }
    case 82: {
      clearGame();
      startGame();
      resetGame.play();
    }
  }
}

function detectPlayerPos() {
  if (player.posY === 0) {
    playerScore.play();
    player.score += 10;
    player.resetPlayerPos();
    generateEnemyPos();
  } else {
    detectPlayerCollision(enemiesEasy);
    detectPlayerCollision(enemiesHard);
  }
}
function detectPlayerCollision(enemies) {
  enemies.forEach(function (enemy) {
    if (player.posX === enemy.posX && player.posY === enemy.posY) {
      playerCollision.play();
      player.resetPlayerPos();
      player.lives--;
    }
  });
}

function drawScore() {
  ctx.fillStyle = 'white';
  var fontSize = canvas.height / 16 - 8;
  ctx.font = fontSize + 'px Verdana';
  ctx.fillText(
    'Score: ' + player.score,
    (canvas.width / 16) * 0.2,
    (canvas.height / 16) * 0.8
  );
  ctx.fillText(
    'Lives: ' + player.lives,
    (canvas.width / 16) * 8,
    (canvas.height / 16) * 0.8
  );
}
