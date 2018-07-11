// Generate a random number between 1 and 100
function generateWinningNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

// Shuffle an array using fisher-yates algorithm
function shuffle(arr) {
  let rand;
  for (let i = arr.length; i > 0; i--) {
    rand = Math.floor(Math.random() * i);
    arr[i - 1] = [arr[rand], arr[rand] = arr[i - 1]][0];
  }
  return arr;
}

// Game constructor function
function Game() {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

// Game methods
Game.prototype.difference = function() {
  return Math.abs(this.playersGuess - this.winningNumber);
};

Game.prototype.isLower = function() {
  return this.playersGuess < this.winningNumber;
};

Game.prototype.playersGuessSubmission = function(guess) {
  if (guess < 1 || guess > 100 || isNaN(guess)) {
    throw "That is an invalid guess.";
  }
  this.playersGuess = guess;
  return this.checkGuess();
};

Game.prototype.checkGuess = function() {
  let dif = this.difference();
  if (!dif) {
    return "You Win!";
  }
  if (this.pastGuesses.includes(this.playersGuess)) {
    return "You have already guessed that number.";
  }
  this.pastGuesses.push(this.playersGuess);
  if (this.pastGuesses.length === 5) {
    return "You Lose.";
  }
  if (dif < 10) {
    return "You\'re burning up!";
  }
  if (dif < 25) {
    return "You\'re lukewarm.";
  }
  if (dif < 50) {
    return "You're a bit chilly."
  }
  return "You\'re ice cold!";
};

Game.prototype.provideHint = function() {
  return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);
};

function newGame() {
  return new Game();
}