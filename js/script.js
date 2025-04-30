const gameboard = (() => {
  let board = [];

  const init = () => {
    board = Array(9).fill(null);
  };

  const display = () => {
    console.log(board);
  };

  const updateBoard = (index, symbol) => {
    if (board[index] === null) {
      board[index] = symbol;
      display();
      return true;
    }
    return false;
  };

  const getBoard = () => [...board];

  return { init, display, updateBoard, getBoard };
})();

const playerFactory = (name, symbol) => {
  let score = 0;
  return { name, symbol, score };
};

const gameController = (() => {
  let player1 = null;
  let player2 = null;
  let currentPlayer = null;
  let gameActive = false;

  const init = () => {
    player1 = playerFactory(prompt("Player 1, enter your name :"), "X");
    player2 = playerFactory(prompt("Player 2, enter your name :"), "O");
    currentPlayer = player1;
    gameActive = true;
    gameboard.init();
  };

  const getUserinput = () => {
    return new Promise((resolve) => {
      let input = prompt(` ${currentPlayer.name} entrez un chiffre (1-9):`);
      let index = parseInt(input) - 1;

      if (isNaN(index) || index < 0 || index > 8) {
        alert("Entrée invalide. Veuillez entrer un nombre entre 1 et 9.");
        resolve(getUserinput());
        return;
      }

      if (gameboard.updateBoard(index, currentPlayer.symbol)) {
        resolve();
      } else {
        alert("Cet emplacement est déjà pris");
        resolve(getUserinput());
      }
    });
  };

  const checkWinner = () => {
    const board = gameboard.getBoard();
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return true;
      }
    }

    return false;
  };

  const displayWinner = () => {
    alert(`Congratulation ${currentPlayer.name} you won this round !`);
    currentPlayer.score++;
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const playRound = async () => {
    await getUserinput();

    if (checkWinner()) {
      displayWinner();
      gameActive = false;
      return;
    }

    if (gameboard.getBoard().every((cell) => cell !== null)) {
      alert("It's a draw !");
      gameActive = false;
      return;
    }

    switchPlayer();
  };

  const startGame = async () => {
    init();
    while (gameActive) {
      await playRound();
    }
  };

  return { startGame };
})();

gameController.startGame();
