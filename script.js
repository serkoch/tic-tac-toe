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
    { name: playerOneName, marker: 'X' },
    { name: playerTwoName, marker: 'O' },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  let winner = '';

  const getWinner = () => winner;

  const checkWinner = (board, marker) => {
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
    return winCombos.some((combo) => {
      return combo.every((index) => board[index].getValue() === marker);
    });
  };

  const playRound = (cell) => {
    if (winner) return;

    const moveSuccessful = board.placeMarker(cell, getActivePlayer().marker);
    if (moveSuccessful) {
      if (checkWinner(board.getBoard(), getActivePlayer().marker)) {
        winner = getActivePlayer();
      } else {
        switchPlayerTurn();
      }
    }
  };

  return { playRound, getActivePlayer, getWinner, getBoard: board.getBoard };
}

function ScreenControl() {
  const game = GameControl();
  const playerTurnDiv = document.querySelector('.playerTurn');
  const boardDiv = document.querySelector('.gameBoard');
  const controlsDiv = document.querySelector('.controls');

  const renderBoard = () => {
    boardDiv.textContent = '';

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnDiv.textContent = `It's ${activePlayer.name}'s turn`;

    board.forEach((cell, index) => {
      const cellButton = document.createElement('button');
      cellButton.classList.add('cell');
      cellButton.dataset.cell = index;
      cellButton.textContent = cell.getValue();
      cellButton.disabled = cell.getValue() !== '';
      boardDiv.appendChild(cellButton);
    });

    const winner = game.getWinner();
    if (winner) {
      playerTurnDiv.textContent = `${winner.name} wins!`;
      boardDiv.querySelectorAll('button').forEach((button) => (button.disabled = true));
      renderReplayButton();
    } else if (board.every((cell) => cell.getValue() !== '')) {
      playerTurnDiv.textContent = `It's a draw!`;
      renderReplayButton();
    }
  };

  function handleBoardClick(e) {
    const selectedCell = e.target.dataset.cell;
    if (!selectedCell) return;
    game.playRound(parseInt(selectedCell));
    renderBoard();
  }

  const renderReplayButton = () => {
    controlsDiv.textContent = '';
    const replayButton = document.createElement('button');
    replayButton.textContent = 'Replay';
    replayButton.classList.add('replay-button');
    replayButton.addEventListener('click', resetGame);
    controlsDiv.appendChild(replayButton);
  };

  const resetGame = () => {
    controlsDiv.textContent = '';
    playerTurnDiv.textContent = '';
    const newGame = GameControl();
    Object.assign(game, newGame);
    renderBoard();
  };

  boardDiv.addEventListener('click', handleBoardClick);

  renderBoard();
}

ScreenControl();
