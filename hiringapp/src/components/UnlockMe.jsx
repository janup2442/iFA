import React, { useState } from "react";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

const GRID_SIZE = 6;
const EXIT_ROW = 2;
const EXIT_COL = GRID_SIZE - 1;

function initialBlocks() {
  return [
    { id: "locked", row: EXIT_ROW, col: 0, length: 2, horizontal: true, isLocked: true },
    { id: "b1", row: 0, col: 0, length: 3, horizontal: false },
    { id: "b2", row: 0, col: 3, length: 2, horizontal: true },
    { id: "b3", row: 3, col: 2, length: 2, horizontal: false },
    { id: "b4", row: 4, col: 1, length: 3, horizontal: true },
    { id: "b5", row: 2, col: 3, length: 2, horizontal: false },
  ];
}

function getBlockCells(block) {
  const cells = [];
  for (let i = 0; i < block.length; i++) {
    cells.push(block.horizontal ? `${block.row},${block.col + i}` : `${block.row + i},${block.col}`);
  }
  return cells;
}

function canMove(blocks, block, dRow, dCol) {
  for (let i = 0; i < block.length; i++) {
    const r = block.horizontal ? block.row + dRow : block.row + i + dRow;
    const c = block.horizontal ? block.col + i + dCol : block.col + dCol;
    if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return false;
    for (const other of blocks) {
      if (other.id !== block.id) {
        if (getBlockCells(other).includes(`${r},${c}`)) return false;
      }
    }
  }
  return true;
}

function UnlockMe() {
  const [blocks, setBlocks] = useState(initialBlocks());
  const [selected, setSelected] = useState(null);
  const [gameWon, setGameWon] = useState(false);

  function handleCellClick(row, col) {
    if (gameWon) return;
    const block = blocks.find(b => getBlockCells(b).includes(`${row},${col}`));
    if (block) setSelected(block.id);
    else setSelected(null);
  }

  function moveSelected(dir) {
    if (!selected || gameWon) return;
    const block = blocks.find(b => b.id === selected);
    if (!block) return;
    let dRow = 0, dCol = 0;
    if (block.horizontal) {
      if (dir === "left") dCol = -1;
      if (dir === "right") dCol = 1;
    } else {
      if (dir === "up") dRow = -1;
      if (dir === "down") dRow = 1;
    }
    if (canMove(blocks, block, dRow, dCol)) {
      const newBlocks = blocks.map(b =>
        b.id === block.id ? { ...b, row: b.row + dRow, col: b.col + dCol } : b
      );
      setBlocks(newBlocks);
      const locked = newBlocks.find(b => b.isLocked);
      if (
        locked.horizontal &&
        locked.row === EXIT_ROW &&
        locked.col + locked.length - 1 === EXIT_COL
      ) {
        setGameWon(true);
      }
    }
  }

  function reset() {
    setBlocks(initialBlocks());
    setSelected(null);
    setGameWon(false);
  }

  return (
    <Box sx={{ maxWidth: 420, margin: '0 auto', p: 2, bgcolor: '#f8f9fa', borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>Unlock Me</Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>How to Play:</Typography>
        <ul style={{ paddingLeft: 18 }}>
          <li>Goal: Move the red locked block to the exit (right edge).</li>
          <li>Click a block to select it.</li>
          <li>Use arrow buttons to move the selected block (horizontal blocks: left/right, vertical: up/down).</li>
          <li>Blocks cannot overlap or move outside the grid.</li>
          <li>Press Reset to restart the puzzle.</li>
        </ul>
      </Box>
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        {gameWon ? (
          <Alert severity="success">You Unlocked It!</Alert>
        ) : (
          <Typography variant="body1">Select a block and use controls</Typography>
        )}
      </Box>
      <Box sx={{ display: 'grid p-2', gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`, gap: 1, bgcolor: '#bdbdbd', borderRadius: 1, mb: 2 }}>
        {[...Array(GRID_SIZE)].map((_, r) => (
          <Box key={r} sx={{ display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gap: 1 }}>
            {[...Array(GRID_SIZE)].map((_, c) => {
              const block = blocks.find(b => getBlockCells(b).includes(`${r},${c}`));
              const isLocked = block?.isLocked;
              const isSelected = block?.id === selected;
              return (
                <Button
                  key={c}
                  variant={isSelected ? "contained" : "outlined"}
                  sx={{
                    minWidth: 40,
                    minHeight: 40,
                    bgcolor: isLocked ? '#e57373' : block ? '#64b5f6' : '#e0e0e0',
                    border: isSelected ? '2px solid #1976d2' : '1px solid #ccc',
                    fontSize: '1.3em',
                    p: 0,
                    position: 'relative',
                  }}
                  onClick={() => handleCellClick(r, c)}
                >
                  {isLocked ? "🔒" : block ? "■" : ""}
                  {r === EXIT_ROW && c === EXIT_COL && (
                    <Typography sx={{ position: 'absolute', right: 2, bottom: 2, fontSize: '1em' }}>🚪</Typography>
                  )}
                </Button>
              );
            })}
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
        <Button variant="contained" onClick={() => moveSelected("up")}>↑</Button>
        <Button variant="contained" onClick={() => moveSelected("down")}>↓</Button>
        <Button variant="contained" onClick={() => moveSelected("left")}>←</Button>
        <Button variant="contained" onClick={() => moveSelected("right")}>→</Button>
      </Box>
      <Button variant="contained" color="error" fullWidth onClick={reset}>Reset</Button>
    </Box>
  );
}


export default UnlockMe