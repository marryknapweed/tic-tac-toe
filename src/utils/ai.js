export function makeAIMove(currentSquares, botLevel) {
  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const findMove = player => {
    for (const line of winningLines) {
      const [a, b, c] = line;
      const squares = [currentSquares[a], currentSquares[b], currentSquares[c]];
      if (
        squares.filter(square => square === player).length === 2 &&
        squares.includes(null)
      ) {
        return line.find(index => currentSquares[index] === null);
      }
    }
    return null;
  };

  // Easy level
  if (botLevel === "easy") {
    const emptyCells = currentSquares
      .map((square, index) => (square === null ? index : null))
      .filter(index => index !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  // Medium level
  if (botLevel === "medium") {
    let move = findMove("O"); // Попытка завершить линию
    if (move !== null) {
      return move;
    }
    move = findMove("X"); // Блокировка линии игрока
    if (move !== null) {
      return move;
    }
    return makeAIMove(currentSquares, "easy"); // Иначе случайный ход
  }

  // Hard level
  if (botLevel === "hard") {
    let move = findMove("O"); // Попытка завершить линию
    if (move !== null) {
      return move;
    }
    move = findMove("X"); // Блокировка линии игрока
    if (move !== null) {
      return move;
    }
    if (currentSquares[4] === null) {
      // Попытка занять центр
      return 4;
    }
    return makeAIMove(currentSquares, "medium"); // Иначе уровень medium
  }

  return null; // Если ход невозможен
}
