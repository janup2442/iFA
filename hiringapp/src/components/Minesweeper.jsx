
import React, { useState } from "react";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

function generateEmptyBoard(rows, cols) {
  return Array(rows)
    .fill()
    .map(() => Array(cols).fill({ mine: false, revealed: false, flagged: false, adjacent: 0 }));
}

function placeMines(board, rows, cols, mines, firstClickR, firstClickC) {
  const newBoard = cloneBoard(board);
  let placed = 0;
  
  // Get safe zone around first click (3x3 area)
  const safeZone = new Set();
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const r = firstClickR + dr;
      const c = firstClickC + dc;
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        safeZone.add(`${r},${c}`);
      }
    }
  }
  
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    const key = `${r},${c}`;
    
    if (!newBoard[r][c].mine && !safeZone.has(key)) {
      newBoard[r][c] = { ...newBoard[r][c], mine: true };
      placed++;
    }
  }
  
  // Calculate adjacent mine counts
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (newBoard[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (
            r + dr >= 0 &&
            r + dr < rows &&
            c + dc >= 0 &&
            c + dc < cols &&
            newBoard[r + dr][c + dc].mine
          ) {
            count++;
          }
        }
      }
      newBoard[r][c] = { ...newBoard[r][c], adjacent: count };
    }
  }
  return newBoard;
}

function cloneBoard(board) {
  return board.map(row => row.map(cell => ({ ...cell })));
}

const ROWS = 9;
const COLS = 9;
const MINES = 10;

function Minesweeper() {
  const [board, setBoard] = useState(() => generateEmptyBoard(ROWS, COLS));
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [flags, setFlags] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const [firstClick, setFirstClick] = useState(true);
  const [gameId, setGameId] = useState(0); // To force different combinations

  function reveal(r, c) {
    if (gameOver || board[r][c].revealed || board[r][c].flagged) return;
    
    let newBoard;
    if (firstClick) {
      // Place mines after first click to ensure first click is safe
      newBoard = placeMines(board, ROWS, COLS, MINES, r, c);
      setFirstClick(false);
    } else {
      newBoard = cloneBoard(board);
    }
    
    let queue = [[r, c]];
    let revealed = 0;
    while (queue.length) {
      const [x, y] = queue.pop();
      if (newBoard[x][y].revealed || newBoard[x][y].flagged) continue;
      newBoard[x][y].revealed = true;
      revealed++;
      if (newBoard[x][y].mine) {
        setGameOver(true);
        setBoard(newBoard);
        return;
      }
      if (newBoard[x][y].adjacent === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nx = x + dr;
            const ny = y + dc;
            if (
              nx >= 0 && nx < ROWS && ny >= 0 && ny < COLS &&
              !newBoard[nx][ny].revealed && !newBoard[nx][ny].flagged
            ) {
              queue.push([nx, ny]);
            }
          }
        }
      }
    }
    setBoard(newBoard);
    setRevealedCount(revealedCount + revealed);
    checkWin(newBoard, revealedCount + revealed);
  }

  function toggleFlag(r, c, e) {
    e.preventDefault();
    if (gameOver || board[r][c].revealed) return;
    const newBoard = cloneBoard(board);
    newBoard[r][c].flagged = !newBoard[r][c].flagged;
    setBoard(newBoard);
    setFlags(flags + (newBoard[r][c].flagged ? 1 : -1));
  }

  function checkWin(newBoard, revealed) {
    const totalSafe = ROWS * COLS - MINES;
    if (revealed === totalSafe) {
      setWin(true);
      setGameOver(true);
    }
  }

  function reset() {
    setBoard(generateEmptyBoard(ROWS, COLS));
    setGameOver(false);
    setWin(false);
    setFlags(0);
    setRevealedCount(0);
    setFirstClick(true);
    setGameId(prev => prev + 1); // Force different combination
  }

  return (
    <Box sx={{ maxWidth: 420, margin: '0 auto', p: 2, bgcolor: '#f8f9fa', borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>Minesweeper</Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>How to Play:</Typography>
        <ul style={{ paddingLeft: 18 }}>
          <li>Click a cell to reveal it.</li>
          <li>Right-click to flag/unflag a cell as a mine.</li>
          <li>Numbers show how many mines are adjacent.</li>
          <li>Win by revealing all safe cells. Lose if you reveal a mine.</li>
        </ul>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        {gameOver && win && <Alert severity="success" sx={{ flex: 1, mr: 2 }}>You Win!</Alert>}
        {gameOver && !win && <Alert severity="error" sx={{ flex: 1, mr: 2 }}>Game Over!</Alert>}
        <Typography variant="body1">Flags: {flags} / {MINES}</Typography>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateRows: `repeat(${ROWS}, 1fr)`, gap: 1, bgcolor: '#bdbdbd', borderRadius: 1, mb: 2 }}>
        {board.map((row, r) => (
          <Box key={r} sx={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 1 }}>
            {row.map((cell, c) => (
              <Button
                key={c}
                variant={cell.revealed ? "contained" : "outlined"}
                color={cell.mine && cell.revealed ? "error" : cell.flagged ? "warning" : "primary"}
                sx={{
                  minWidth: 32,
                  minHeight: 32,
                  bgcolor: cell.revealed ? '#fff' : cell.flagged ? '#ffe082' : '#e0e0e0',
                  color: cell.revealed && !cell.mine ? '#000' : 'inherit',
                  fontWeight: cell.mine ? 700 : 600,
                  fontSize: '1.2em',
                  p: 0,
                  border: cell.revealed ? '1px solid #ccc' : 'inherit',
                }}
                onClick={() => reveal(r, c)}
                onContextMenu={e => toggleFlag(r, c, e)}
                disabled={gameOver}
              >
                {cell.revealed
                  ? cell.mine
                    ? "💣"
                    : cell.adjacent > 0
                    ? cell.adjacent
                    : ""
                  : cell.flagged
                  ? "🚩"
                  : ""}
              </Button>
            ))}
          </Box>
        ))}
      </Box>
      <Button variant="contained" color="primary" fullWidth onClick={reset}>Reset</Button>
    </Box>
  );
}


export default Minesweeper