const gameboard = (() => {
  let board = [];

  const init = () => {
    const containerSpot = document.querySelectorAll(".container__spot");
    containerSpot.forEach((spot) => {
      spot.innerHTML = "";
      spot.classList.remove("spot--filled");
    });
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
    return new Promise((resolve) => {
      const playerDialog = document.querySelector(".players__dialog");
      const submitButton = document.querySelector(".button--submit");
      const startButton = document.querySelector(".button--start");
      startButton.disabled = true;
      gameboard.init();
      playerDialog.showModal();
      submitButton.addEventListener("click", (event) => {
        event.preventDefault();
        const player1Name = document.getElementById("player1").value;
        const player2Name = document.getElementById("player2").value;

        if (player1Name && player2Name) {
          player1 = playerFactory(player1Name, "X");
          player2 = playerFactory(player2Name, "O");
          playerDialog.close();
          currentPlayer = player1;
          gameActive = true;
          resolve();
        } else {
          alert("Please enter both player names.");
        }
      });
    });
  };

  const getUserinput = () => {
    return new Promise((resolve) => {
      const containerSpot = document.querySelectorAll(".container__spot");

      const handleClick = (event) => {
        const spot = event.target.closest(".container__spot");
        if (!spot) return;

        const index = parseInt(spot.dataset.index);
        if (gameboard.updateBoard(index, currentPlayer.symbol)) {
          renderSymbol(spot, currentPlayer.symbol);
          spot.classList.add("spot--filled");
          containerSpot.forEach((s) =>
            s.removeEventListener("click", handleClick)
          );
          resolve();
        } else {
          alert("Cet emplacement est déjà pris");
        }
      };

      containerSpot.forEach((spot) => {
        spot.addEventListener("click", handleClick);
      });
    });
  };

  const renderSymbol = (spotElement, symbol) => {
    spotElement.innerHTML =
      symbol === "X"
        ? `<svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#1f1f1f"
          class="container__svg"
  
        >
          <path
            d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
          />
        </svg>`
        : `        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#1f1f1f"
          class="container__svg"
  
        >
          <path
            d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
          />
        </svg>`;
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
    const winnerDialog = document.querySelector(".winner__dialog");
    const winnerText = document.querySelector(".winner__text");
    const winnerScore = document.querySelector(".winner__score");
    currentPlayer.score++;
    winnerText.textContent = `Congratulation ${currentPlayer.name} you won this round !`;
    winnerScore.textContent = `Game Over! Final Score: ${player1.name}: ${player1.score}, ${player2.name}: ${player2.score}`;
    winnerDialog.showModal();
  };

  const displayDraw = () => {
    const winnerDialog = document.querySelector(".winner__dialog");
    const winnerText = document.querySelector(".winner__text");
    const winnerScore = document.querySelector(".winner__score");
    winnerText.textContent = `It's a draw !`;
    winnerScore.textContent = `Game Over! Final Score: ${player1.name}: ${player1.score}, ${player2.name}: ${player2.score}`;
    winnerDialog.showModal();
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    displayPlayerSymbol();
  };

  const playRound = async () => {
    await getUserinput();

    if (checkWinner()) {
      displayWinner();
      gameActive = false;
      return;
    }

    if (gameboard.getBoard().every((cell) => cell !== null)) {
      displayDraw();
      gameActive = false;
      return;
    }

    switchPlayer();
  };

  const displayPlayerSymbol = () => {
    const containerSpot = document.querySelectorAll(".container__spot");

    const handleMouseEnter = (event) => {
      const spot = event.target;

      if (
        gameActive &&
        !spot.classList.contains("spot--filled") &&
        !spot.querySelector("svg")
      ) {
        const symbolToShow = currentPlayer === player1 ? "X" : "O";
        spot.dataset.hoverSymbol = symbolToShow;
        spot.innerHTML =
          symbolToShow === "X"
            ? `<svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#1f1f1f"
            class="container__svg"
            style="opacity: 0.5;"
          >
            <path
              d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
            />
          </svg>`
            : ` <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#1f1f1f"
            class="container__svg"
            style="opacity: 0.5;"
          >
            <path
              d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
            />
          </svg>`;
      }
    };
    const handleMouseLeave = (event) => {
      const spot = event.target;
      if (spot.dataset.hoverSymbol) {
        spot.innerHTML = "";
        delete spot.dataset.hoverSymbol;
      }
    };

    containerSpot.forEach((spot) => {
      spot.addEventListener("mouseenter", handleMouseEnter);
      spot.addEventListener("mouseleave", handleMouseLeave);
    });
  };

  const startGame = async () => {
    await init();
    displayPlayerSymbol();
    while (gameActive) {
      await playRound();
    }
    if (player1 && player2) {
      document.querySelector(".button--start").disabled = false;
    }
  };

  return { startGame };
})();

const startButton = document.querySelector(".button--start");
startButton.addEventListener("click", () => {
  gameController.startGame();
});
