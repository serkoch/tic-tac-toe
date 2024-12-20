function Gameboard() {
  const cells = 9;
  const board = [];

  for (let i = 0; i < cells; i++) {
    board.push(Cell());
  }
  const getBoard = () => board;

  const placeMarker = (index, player) => {
    const targetCell = board[index];
    const isCellOccupied = targetCell && targetCell.getValue() !== '';

    if (isCellOccupied) return false;

    targetCell.addMarker(player);
    return true;
  };

  return { getBoard, placeMarker };
}

function Cell() {
  let value = '';

  const addMarker = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { addMarker, getValue };
}

function GameControl(playerOneName = 'X', playerTwoName = 'O') {
  const board = Gameboard();
  const players = [
    { name: playerOneName, marker: 'X', score: 0 },
    { name: playerTwoName, marker: 'O', score: 0 },
  ];

  let activePlayer = players[0];
  let roundWinner = null;
  let gameWinner = null;
  let winningCombo = null;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;
  const getPlayers = () => players;
  const getRoundWinner = () => roundWinner;
  const getGameWinner = () => gameWinner;
  const getWinningCombo = () => winningCombo;

  const checkRoundWinner = (board, marker) => {
    const winCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    const winCombo = winCombos.filter((combo) => combo.every((index) => board[index].getValue() === marker));

    return winCombo;
  };

  const playRound = (cell) => {
    if (roundWinner || gameWinner) return;

    const moveSuccessful = board.placeMarker(cell, getActivePlayer().marker);
    if (moveSuccessful) {
      const winningCombos = checkRoundWinner(board.getBoard(), getActivePlayer().marker);
      if (winningCombos.length > 0) {
        roundWinner = getActivePlayer();
        winningCombo = winningCombos[0];
        getActivePlayer().score++;
        if (getActivePlayer().score === 3) {
          gameWinner = getActivePlayer();
        }
      } else if (board.getBoard().every((cell) => cell.getValue() !== '')) {
        roundWinner = 'Draw';
      } else {
        switchPlayerTurn();
      }
    }
  };

  const resetRound = () => {
    board.getBoard().forEach((cell) => cell.addMarker(''));
    activePlayer = players[0];
    roundWinner = null;
    winningCombo = null;
  };
  const resetGame = () => {
    board.getBoard().forEach((cell) => cell.addMarker(''));
    activePlayer = players[0];
    roundWinner = null;
    gameWinner = null;
    winningCombo = null;
    players.forEach((player) => (player.score = 0));
  };

  return { playRound, getActivePlayer, getPlayers, getRoundWinner, getGameWinner,getWinningCombo, resetRound, resetGame, getBoard: board.getBoard };
}

function ScreenControl() {
  let game = GameControl();
  const playerTurnDiv = document.querySelector('.playerTurn');
  const boardDiv = document.querySelector('.gameBoard');
  const controlsDiv = document.querySelector('.controls');
  const scoreDiv = document.querySelector('.score');

  const renderScores = () => {
    scoreDiv.textContent = '';
    game.getPlayers().forEach((player) => {
      const scoreElement = document.createElement('div');
      scoreElement.classList.add(`player${player.name}`);
      const name = document.createElement('p');
      name.textContent = `Player ${player.name}`;
      const score = document.createElement('p');
      score.textContent = player.score;
      scoreElement.append(name, score);
      scoreDiv.appendChild(scoreElement);
    });
  };

  const renderBoard = () => {
    boardDiv.textContent = '';
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();
    const winningCombo = game.getWinningCombo();

    playerTurnDiv.textContent = `${activePlayer.name} turn`;

    board.forEach((cell, index) => {
      const cellButton = document.createElement('button');
      cellButton.classList.add('cell');
      cellButton.dataset.cell = index;
      cellButton.textContent = cell.getValue();
      cellButton.disabled = cell.getValue() !== '';
      if (winningCombo && winningCombo.includes(index)) {
        cellButton.classList.add('winning-cell');
      }
      boardDiv.appendChild(cellButton);
    });

    const roundWinner = game.getRoundWinner();
    if (roundWinner) {
      if (roundWinner === 'Draw') {
        playerTurnDiv.textContent = `It's a draw!`;
      } else {
        playerTurnDiv.textContent = `${roundWinner.name} wins this round!`;
        console.log(roundWinner);
      }
      boardDiv.querySelectorAll('button').forEach((button) => (button.disabled = true));
      renderReplayButton(false);
    }

    const gameWinner = game.getGameWinner();
    if (gameWinner) {
      playerTurnDiv.textContent = `${gameWinner.name} wins the game!`;
      boardDiv.querySelectorAll('button').forEach((button) => (button.disabled = true));
      renderReplayButton(true);
    }
  };

  function handleBoardClick(e) {
    const selectedCell = e.target.dataset.cell;
    if (!selectedCell) return;
    game.playRound(parseInt(selectedCell));
    renderBoard();
    renderScores();
  }

  const renderReplayButton = (isGameOver) => {
    controlsDiv.textContent = '';
    const controlButton = document.createElement('button');
    controlButton.textContent = isGameOver ? 'Play again' : 'Next round';
    controlButton.classList.add(isGameOver ? 'replay-button' : 'next-round-button');
    controlButton.addEventListener('click', isGameOver ? resetGame : resetRound);
    controlsDiv.appendChild(controlButton);
  };

  const resetRound = () => {
    game.resetRound();
    controlsDiv.textContent = '';
    playerTurnDiv.textContent = '';
    renderBoard();
    renderScores();
  };

  const resetGame = () => {
    game.resetGame();
    controlsDiv.textContent = '';
    playerTurnDiv.textContent = '';
    renderBoard();
    renderScores();
  };

  boardDiv.addEventListener('click', handleBoardClick);

  renderBoard();
  renderScores();
}

ScreenControl();
