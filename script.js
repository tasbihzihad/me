document.addEventListener("DOMContentLoaded", function() {
    const board = document.getElementById("tic-tac-toe-board");
    const resultScreen = document.getElementById("result-screen");
    const resultMessage = document.getElementById("result-message");
    const newGameBtn = document.getElementById("new-game-btn");

    let currentPlayer = "X";
    let cells = Array(9).fill(null);
    let isComputerTurn = false;

    function checkWinner() {
      const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
      ];

      for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
          return cells[a];
        }
      }

      return null;
    }

    function isBoardFull() {
      return cells.every(cell => cell !== null);
    }

    function handleCellClick(index) {
      if (cells[index] || checkWinner() || isComputerTurn) {
        return;
      }

      cells[index] = currentPlayer;
      renderBoard();

      const winner = checkWinner();
      if (winner) {
        showResult(`${winner} wins!`);
      } else if (isBoardFull()) {
        showResult("It's a draw!");
      } else {
        currentPlayer = "X";
        isComputerTurn = true;
        setTimeout(computerMove, 500);
      }
    }

    function computerMove() {
      if (isComputerTurn && !checkWinner() && !isBoardFull()) {
        let bestMove = findBestMove();
        cells[bestMove] = "O";
        renderBoard();

        const winner = checkWinner();
        if (winner) {
          showResult("Computer wins!");
        } else if (isBoardFull()) {
          showResult("It's a draw!");
        } else {
          isComputerTurn = false;
          currentPlayer = "X";
        }
      }
    }

    function findBestMove() {
      let bestVal = -Infinity;
      let bestMove = -1;

      for (let i = 0; i < cells.length; i++) {
        if (!cells[i]) {
          cells[i] = "O";
          let moveVal = minimax(cells, 0, false);
          cells[i] = null;

          if (moveVal > bestVal) {
            bestMove = i;
            bestVal = moveVal;
          }
        }
      }

      return bestMove;
    }

    function minimax(board, depth, isMaximizing) {
      let score = evaluate(board);

      if (score === 10 || score === -10) {
        return score;
      }

      if (!isMovesLeft(board)) {
        return 0;
      }

      if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < board.length; i++) {
          if (!board[i]) {
            board[i] = "O";
            best = Math.max(best, minimax(board, depth + 1, !isMaximizing));
            board[i] = null;
          }
        }
        return best - depth;
      } else {
        let best = Infinity;
        for (let i = 0; i < board.length; i++) {
          if (!board[i]) {
            board[i] = "X";
            best = Math.min(best, minimax(board, depth + 1, !isMaximizing));
            board[i] = null;
          }
        }
        return best + depth;
      }
    }

    function evaluate(board) {
      const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
      ];

      for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return board[a] === "O" ? 10 : -10;
        }
      }

      return 0;
    }

    function isMovesLeft(board) {
      return board.some(cell => !cell);
    }

    function showResult(message) {
      resultMessage.textContent = message;
      resultScreen.style.display = "flex";
    }

    function renderBoard() {
      board.innerHTML = "";
      cells.forEach((value, index) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.textContent = value;
        cell.addEventListener("click", () => handleCellClick(index));
        board.appendChild(cell);
      });
    }

    function resetGame() {
      cells = Array(9).fill(null);
      currentPlayer = "X";
      isComputerTurn = false;
      renderBoard();
      resultScreen.style.display = "none";
    }

    newGameBtn.addEventListener("click", resetGame);

    renderBoard();
  });