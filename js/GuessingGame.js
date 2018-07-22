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
  this.finished = false;
  this.hint = this.provideHint();
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
    $("#title").text("That is an invalid guess.");
    throw "That is an invalid guess.";
  }
  this.playersGuess = guess;
  return this.checkGuess();
};

Game.prototype.checkGuess = function() {
  let dif = this.difference();
  if (this.pastGuesses.includes(this.playersGuess)) {
    return "You have already guessed that number.";
  }
  this.pastGuesses.push(this.playersGuess);
  if (!dif) {
    this.finished = true;
    return "You Win!";
  }
  if (this.pastGuesses.length === 5) {
    this.finished = true;
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
  this.hint = [this.winningNumber];
  while (this.hint.length < 3) {
    const number = generateWinningNumber();
    if (!(this.hint.includes(number))) {
      this.hint.push(number);
    }
  }
  return shuffle(this.hint);
};

function newGame() {
  return new Game();
}

function submitGuess(game) {
  if (game.finished) {
    return;
  }
  const playerInput = $("#input").val();
  $("#input").val("");
  const output = game.playersGuessSubmission(playerInput);
  $("#title").text(output);
  if (output === "You have already guessed that number.") {
    return;
  } 
  const $li = $("ul li:nth-child(" + game.pastGuesses.length + ")");
  $li.text(playerInput);
  if (output === "You Win!" || output === "You Lose.") {
    $("#submit, #hint, #input").prop("disabled", true);
  }
  $subtitle = $("#subtitle");
  if (output === "You Win!") {
    $li.css("color", "#f6546a");
    $subtitle.text("Reset to play more.");
  } else if (output === "You Lose.") {
    $subtitle.text("The winning number was " + game.winningNumber + "! Reset to play more.");
  } else if (game.isLower()) {
    $subtitle.text("Guess Higher.");
  } else {
    $subtitle.text("Guess Lower.");
  }
}

$(document).ready(function() {
  let game = newGame();
  $("#submit").click(function() {
    submitGuess(game);
  });
  $("#input").keypress(function(e) {
    if (e.which === 13) {
      e.preventDefault();
      submitGuess(game);
      return false;
    }
  });
  $("#reset").click(function() {
    game = newGame();
    $("#title").text("Welcome to Guessing Game!");
    $("#subtitle").text("Guess a number between 1-100!");
    $(".guess").text("!");
    $("#submit, #hint, #input").removeAttr("disabled");
    $("ul li").css("color", "");
  });
  $("#hint").click(function() {
    const hint = game.hint;
    $("#title").text("The winning number is " + hint[0] + ", " + hint[1] + " or " + hint[2] + ".");
  });
});
