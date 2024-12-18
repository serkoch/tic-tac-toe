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

  const printBoard = () => {
    const boardWithCellValues = board.map((cell) => cell.getValue());
    console.log(boardWithCellValues);
  };
  return { getBoard, placeMarker, printBoard };
}

function Cell() {
  let value = '';

  const addMarker = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { addMarker, getValue };
}

function GameControl(playerOneName = 'PlayerOne', playerTwoName = 'PlayerTwo') {
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

  const printNewRound = () => {
    board.printBoard();
    console.log(`It's ${getActivePlayer().name}'s turn`);
  };

  const playRound = (cell) => {
    const moveSuccessful = board.placeMarker(cell, getActivePlayer().marker);
    if (moveSuccessful) {
      switchPlayerTurn();
    }

    printNewRound();
  };

  printNewRound();

  return { playRound, getActivePlayer, getBoard: board.getBoard };
}

function ScreenControl() {
  const game = GameControl();
  const playerTurnDiv = document.querySelector('.playerTurn');
  const boardDiv = document.querySelector('.gameBoard');

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
  };

  function handleBoardClick(e) {
    const selectedCell = e.target.dataset.cell;
    if (!selectedCell) return;
    game.playRound(parseInt(selectedCell));
    renderBoard();
  }

  boardDiv.addEventListener('click', handleBoardClick);

  renderBoard();
}

ScreenControl();
