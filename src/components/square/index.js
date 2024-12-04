import React from "react";
import "./index.css";

export function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button
      className={`square ${isWinningSquare ? "winning" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}
