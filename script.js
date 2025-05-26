let currentPlayer = 'X';
let gameBoard = [];
let gameOver = false;

const resetBtn = document.getElementById("reset-button");
const currentPlayerSpan = document.getElementById("current-player");
const historyList = document.getElementById("history-list");
const themeToggleBtn = document.getElementById("theme-toggle");

function initializeGame() {
  gameBoard = [];
  gameOver = false;
  currentPlayer = 'X';
  updateCurrentPlayerDisplay();

  for (let i = 0; i < 9; i++) {
    gameBoard.push('');
    const cell = document.getElementById(`cell-${i}`);
    cell.textContent = '';
    cell.classList.remove('X', 'O');
    // Add event listener only once
    if (!cell.dataset.listenerAdded) {
      cell.addEventListener('click', handleCellClick);
      cell.dataset.listenerAdded = "true";
    }
  }
}

function updateCurrentPlayerDisplay() {
  currentPlayerSpan.textContent = currentPlayer;
  if (currentPlayer === 'X') {
    currentPlayerSpan.style.color = getComputedStyle(document.documentElement).getPropertyValue('--player-x-color').trim();
  } else {
    currentPlayerSpan.style.color = getComputedStyle(document.documentElement).getPropertyValue('--player-o-color').trim();
  }
}

function handleCellClick(event) {
  if (gameOver) return;

  const cellIndex = Number(event.target.id.split('-')[1]);
  if (gameBoard[cellIndex] === '') {
    gameBoard[cellIndex] = currentPlayer;
    event.target.textContent = currentPlayer;
    event.target.classList.add(currentPlayer);

    if (checkForWin()) {
      alert(`Player ${currentPlayer} wins!`);
      addToHistory(`Player ${currentPlayer} won`);
      gameOver = true;
      return;
    }

    if (checkForDraw()) {
      alert("It's a draw!");
      addToHistory("Game ended in a draw");
      gameOver = true;
      return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateCurrentPlayerDisplay();
  }
}

function checkForWin() {
  const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  return winConditions.some(([a, b, c]) => {
    return (
      gameBoard[a] &&
      gameBoard[a] === gameBoard[b] &&
      gameBoard[b] === gameBoard[c]
    );
  });
}

function checkForDraw() {
  return !gameBoard.includes('');
}

function addToHistory(text) {
  const li = document.createElement('li');
  li.textContent = text;
  // Prepend new history entry on top
  if (historyList.firstChild) {
    historyList.insertBefore(li, historyList.firstChild);
  } else {
    historyList.appendChild(li);
  }
}

function resetTable() {
  initializeGame();
}

function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  themeToggleBtn.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('darkTheme', isDark);
}

function loadThemePreference() {
  const savedTheme = localStorage.getItem('darkTheme');
  if (savedTheme === 'true') {
    document.body.classList.add('dark-theme');
    themeToggleBtn.textContent = '☀️';
  } else {
    themeToggleBtn.textContent = '🌙';
  }
}

resetBtn.addEventListener("click", resetTable);
themeToggleBtn.addEventListener("click", toggleTheme);

window.onload = () => {
  initializeGame();
  loadThemePreference();
};
