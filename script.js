// ========================================
// NUMBER GUESSING GAME
// ========================================

// ========================================
// GAME VARIABLES
// ========================================

let secretNumber;

let attempts = 0;

let score = 100;

let bestScore = null;

let maxNumber = 100;

let timeLeft = 30;

let timer;

let currentDifficulty = "medium";

let gameOver = false;

// ========================================
// DIFFICULTY SETTINGS
// ========================================

const difficultySettings = {
  easy: {
    maxNumber: 50,
    time: 45,
    score: 100,
  },

  medium: {
    maxNumber: 100,
    time: 30,
    score: 150,
  },

  hard: {
    maxNumber: 500,
    time: 20,
    score: 250,
  },
};

// ========================================
// GET HTML ELEMENTS
// ========================================

const guessInput = document.getElementById("guessInput");

const guessButton = document.getElementById("guessButton");

const newGameButton = document.getElementById("newGameButton");

const result = document.getElementById("result");

const attemptsDisplay = document.getElementById("attempts");

const scoreDisplay = document.getElementById("score");

const bestScoreDisplay = document.getElementById("bestScore");

const timerDisplay = document.getElementById("timer");

const rangeText = document.getElementById("rangeText");

const difficultyButtons = document.querySelectorAll(".difficulty-button");

// ========================================
// START GAME
// ========================================

function startGame() {
  // Stop previous timer
  clearInterval(timer);

  // Get settings
  const settings = difficultySettings[currentDifficulty];

  // Apply settings
  maxNumber = settings.maxNumber;

  timeLeft = settings.time;

  score = settings.score;

  attempts = 0;

  gameOver = false;

  // Generate secret number
  secretNumber = Math.floor(Math.random() * maxNumber) + 1;

  // Update UI
  attemptsDisplay.textContent = "Attempts: 0";

  scoreDisplay.textContent = "Score: " + score;

  timerDisplay.textContent = "⏱️ Time: " + timeLeft;

  rangeText.textContent = `Guess a number between 1 and ${maxNumber}`;

  result.textContent = "🎯 Start guessing!";

  // Enable controls
  guessInput.disabled = false;

  guessButton.disabled = false;

  // Reset input
  guessInput.value = "";

  // Remove animations
  result.classList.remove("win");
  result.classList.remove("shake");

  // Focus
  guessInput.focus();

  // Start timer
  startTimer();
}

// ========================================
// TIMER
// ========================================

function startTimer() {
  timer = setInterval(function () {
    timeLeft--;

    timerDisplay.textContent = "⏱️ Time: " + timeLeft;

    // Warning when time is low
    if (timeLeft <= 5 && timeLeft > 0) {
      timerDisplay.classList.add("shake");

      setTimeout(function () {
        timerDisplay.classList.remove("shake");
      }, 300);
    }

    // Time finished
    if (timeLeft <= 0) {
      clearInterval(timer);

      gameOver = true;

      result.textContent = `⏰ Time's up! The number was ${secretNumber}.`;

      guessInput.disabled = true;

      guessButton.disabled = true;
    }
  }, 1000);
}

// ========================================
// MAKE A GUESS
// ========================================

function makeGuess() {
  // Don't allow guesses after game over
  if (gameOver) {
    return;
  }

  // Get input
  const userGuess = Number(guessInput.value);

  // Validate
  if (
    guessInput.value === "" ||
    !Number.isInteger(userGuess) ||
    userGuess < 1 ||
    userGuess > maxNumber
  ) {
    result.textContent = `⚠️ Enter a whole number between 1 and ${maxNumber}.`;

    result.classList.remove("shake");

    void result.offsetWidth;

    result.classList.add("shake");

    return;
  }

  // Increase attempts
  attempts++;

  attemptsDisplay.textContent = "Attempts: " + attempts;

  // ====================================
  // CORRECT
  // ====================================

  if (userGuess === secretNumber) {
    clearInterval(timer);

    gameOver = true;

    // Add remaining time as bonus
    score += timeLeft;

    result.textContent = `🎉 Correct! The number was ${secretNumber}!`;

    // Disable controls
    guessInput.disabled = true;

    guessButton.disabled = true;

    // Update score
    scoreDisplay.textContent = "Score: " + score;

    // Win animation
    result.classList.add("win");

    // Best score
    if (bestScore === null || score > bestScore) {
      bestScore = score;

      bestScoreDisplay.textContent = "🏆 Best Score: " + bestScore;
    }

    return;
  }

  // ====================================
  // TOO LOW
  // ====================================

  if (userGuess < secretNumber) {
    result.textContent = "📈 Too low! Try a higher number.";
  }

  // ====================================
  // TOO HIGH
  // ====================================
  else {
    result.textContent = "📉 Too high! Try a lower number.";
  }

  // Reduce score
  score -= 10;

  // Minimum score
  if (score < 0) {
    score = 0;
  }

  scoreDisplay.textContent = "Score: " + score;

  // Shake animation
  result.classList.remove("shake");

  void result.offsetWidth;

  result.classList.add("shake");

  // Clear input
  guessInput.value = "";

  guessInput.focus();
}

// ========================================
// GUESS BUTTON
// ========================================

guessButton.addEventListener("click", makeGuess);

// ========================================
// ENTER KEY
// ========================================

guessInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    makeGuess();
  }
});

// ========================================
// NEW GAME
// ========================================

newGameButton.addEventListener("click", function () {
  startGame();
});

// ========================================
// DIFFICULTY BUTTONS
// ========================================

difficultyButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    // Get difficulty
    currentDifficulty = button.dataset.level;

    // Remove active
    difficultyButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });

    // Highlight selected
    button.classList.add("active");

    // Start new game
    startGame();
  });
});

// ========================================
// SELECT MEDIUM BY DEFAULT
// ========================================

difficultyButtons.forEach(function (button) {
  if (button.dataset.level === "medium") {
    button.classList.add("active");
  }
});

// ========================================
// START THE GAME
// ========================================

startGame();
