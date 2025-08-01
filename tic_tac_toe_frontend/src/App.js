import React, { useState, useEffect } from 'react';
import './App.css';

/* Soft Candy theme: no hardcoded color tokens, all colors come from App.css */

// Winner lines to check win conditions
const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * PUBLIC_INTERFACE
 * Returns 'X', 'O', 'tie', or null.
 */
function getWinner(squares) {
  for (let line of WIN_LINES) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a]; // 'X' or 'O'
    }
  }
  // If no empty squares and no winner => tie
  if (squares.every(Boolean)) {
    return 'tie';
  }
  return null;
}

// PUBLIC_INTERFACE
function Square({ value, onClick, disabled }) {
  return (
    <button
      className="ttt-square"
      onClick={onClick}
      disabled={disabled || value}
      aria-label={value ? `Square with ${value}` : 'Empty square'}
      tabIndex={disabled ? -1 : 0}
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onSquareClick, gameOver }) {
  return (
    <div className="ttt-board">
      {squares.map((value, idx) => (
        <Square
          key={idx}
          value={value}
          onClick={() => onSquareClick(idx)}
          disabled={gameOver}
        />
      ))}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Main App: handles state, gameplay, layout, and theme.
 */
function App() {
  // Game state: 9 squares, player, winner.
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [theme, setTheme] = useState('light');

  // Detect game status on state change
  useEffect(() => {
    const result = getWinner(squares);
    setWinner(result);
  }, [squares]);

  // Effect to apply theme to document (already in template)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const handleSquareClick = idx => {
    if (winner || squares[idx]) return;
    const next = squares.slice();
    next[idx] = xIsNext ? 'X' : 'O';
    setSquares(next);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  const handleRestart = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
  };

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Determine status message
  let status;
  if (winner === 'X') {
    status = 'Winner: X 🎉';
  } else if (winner === 'O') {
    status = 'Winner: O 🎉';
  } else if (winner === 'tie') {
    status = "It's a tie!";
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <div className="App ttt-outer">
      <header className="App-header ttt-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <div className="ttt-container-outer">
          <h2 className="ttt-title">Tic Tac Toe</h2>
          <div className="ttt-status">{status}</div>
          <Board squares={squares} onSquareClick={handleSquareClick} gameOver={!!winner} />
          <button className="ttt-restart" onClick={handleRestart}>
            Restart Game
          </button>
        </div>
        <footer className="ttt-footer">
          <span>
            Made with <span aria-label="love" role="img">❤</span> |{' '}
            <a
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="App-link"
            >
              React
            </a>
          </span>
        </footer>
      </header>
    </div>
  );
}

export default App;
