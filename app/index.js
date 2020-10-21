(function() {
  const $board = document.querySelector('.board');
  const $info = document.querySelector('.infos');
  const $score = document.querySelector('.scores');
  const $startButton = document.getElementById('start-button');
  const $restartButton = document.getElementById('restart-button');
  let $playerIndicators;

  const players = [{ name: 'O', score: 0 }, { name: 'X', score: 0 }];
  const initialSquares = [
    null, null, null,
    null, null, null,
    null, null, null,
  ];
  let squares = [...initialSquares];
  let started = false;

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
  
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
  
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
  
    return null;
  }

  function getScoreItemHTML(name, score) {
    return `<li><span>${name}</span><span>${score}</span></li>`;
  }

  function handleClickCell(index) {
    const gameEnded = calculateWinner(squares);
    const indexOfTurn = squares.filter(square => square !== null).length;
    const currentPlayerName = players[indexOfTurn % players.length].name;
    const currentPlayerIndex = indexOfTurn % players.length;

    if (gameEnded || !started) {
      return;
    }

    squares[index] = currentPlayerName;
    renderBoard(squares);
    renderInfo({ started: true, indexOfTurn: indexOfTurn + 1 });

    const winner = calculateWinner(squares);

    if (!winner) {
      renderActivePlayer(indexOfTurn + 1);
      return;
    }

    players[currentPlayerIndex].score += 1;
    renderScore({ started: true, players });
  }

  function handleClickRestartButton() {
    if (!started) {
      return;
    }

    const indexOfTurn = 0;

    squares = [...initialSquares];
    renderBoard(squares);
    renderInfo({ started, indexOfTurn });
    renderActivePlayer(indexOfTurn);
  }

  function handleClickStartButton() {
    if (started) {
      return;
    }

    const indexOfTurn = 0;

    started = true;
    renderInfo({ started, indexOfTurn });
    renderScore({ started, players });
    renderActivePlayer(indexOfTurn);
  }

  function initializeGame() {
    renderBoard(squares);
    renderInfo({ started: false });
    renderScore({ started: false, players });
    $startButton.addEventListener('click', handleClickStartButton);
    $restartButton.addEventListener('click', handleClickRestartButton);
  }

  function renderActivePlayer(indexOfTurn) {
    const indexOfActivePlayer = indexOfTurn % players.length;
    const activeItem = $playerIndicators.find(indicator => indicator.className.includes('active'));

    if (activeItem) {
      activeItem.classList.remove('active');
    }

    $playerIndicators[indexOfActivePlayer].classList.add('active');
  }

  function renderBoard(squares) {
    if ($board.hasChildNodes()) {
      $board.innerHTML = '';
    }

    squares.forEach((square, index) => {
      const $cell = document.createElement('div');

      $cell.classList.add('board-cell');

      if (square === null) {
        $cell.addEventListener('click', () => {
          handleClickCell(index);
        });
      } else {
        $cell.innerText = square;
      }

      $board.appendChild($cell);
    });
  }

  function renderInfo({ started, indexOfTurn }) {
    if (!started) {
      $info.innerText = 'Click Start Button!';
      return;
    }

    const winner = calculateWinner(squares);
    const playerName = players[indexOfTurn % players.length].name;

    if (winner) {
      $info.innerHTML = `Winner is <strong>${winner}</strong>`;
      return;
    }

    $info.innerHTML = `<strong>${playerName}</strong> Turn`;
  }

  function renderScore({ started, players }) {
    if ($score.hasChildNodes()) {
      $score.innerHTML = '';
    }

    if (!started) {
      players.forEach(({ name }) => {
        $score.innerHTML += getScoreItemHTML(name, '-');
      });

      $playerIndicators = Array.from($score.querySelectorAll('li'));
      return;
    }

    players.forEach(({ name, score }) => {
      $score.innerHTML += getScoreItemHTML(name, score);
    });

    $playerIndicators = Array.from($score.querySelectorAll('li'));
  }

  initializeGame();
})();
