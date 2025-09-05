import React, { useState } from "react";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

function WaterCapacity() {
  // Simple water jug puzzle: 2 jugs (5L, 3L), goal: get 4L in 5L jug
  const [jug5, setJug5] = useState(0);
  const [jug3, setJug3] = useState(0);
  const [message, setMessage] = useState("");
  const [moves, setMoves] = useState(0);

  const actions = [
    { label: "Fill 5L Jug", fn: () => { setJug5(5); setMoves(m => m + 1); } },
    { label: "Fill 3L Jug", fn: () => { setJug3(3); setMoves(m => m + 1); } },
    { label: "Empty 5L Jug", fn: () => { setJug5(0); setMoves(m => m + 1); } },
    { label: "Empty 3L Jug", fn: () => { setJug3(0); setMoves(m => m + 1); } },
    { 
      label: "Pour 3L into 5L", 
      fn: () => {
        const total = jug5 + jug3;
        setJug5(Math.min(5, total));
        setJug3(total > 5 ? total - 5 : 0);
        setMoves(m => m + 1);
      }
    },
    { 
      label: "Pour 5L into 3L", 
      fn: () => {
        const total = jug5 + jug3;
        setJug3(Math.min(3, total));
        setJug5(total > 3 ? total - 3 : 0);
        setMoves(m => m + 1);
      }
    },
  ];

  React.useEffect(() => {
    if (jug5 === 4) {
      setMessage(`Congratulations! You solved the puzzle in ${moves} moves.`);
    } else {
      setMessage("");
    }
  }, [jug5, jug3, moves]);

  function reset() {
    setJug5(0);
    setJug3(0);
    setMessage("");
    setMoves(0);
  }

  return (
    <Box sx={{ maxWidth: 420, margin: '0 auto', p: 2, bgcolor: '#f8f9fa', borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>Water Capacity Game</Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>How to Play:</Typography>
        <ul style={{ paddingLeft: 18 }}>
          <li>Goal: Get exactly 4L in the 5L jug.</li>
          <li>You have two jugs: 5L and 3L capacity.</li>
          <li>Use the buttons to fill, empty, or pour water between jugs.</li>
          <li>Solve the puzzle in minimum moves!</li>
        </ul>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3, textAlign: 'center' }}>
        <Box>
          <Typography variant="h6">5L Jug</Typography>
          <Box sx={{ 
            width: 60, 
            height: 120, 
            border: '3px solid #333', 
            borderRadius: 1,
            position: 'relative',
            bgcolor: '#e3f2fd',
            mx: 'auto'
          }}>
            <Box sx={{ 
              position: 'absolute',
              bottom: 0,
              width: '100%',
              height: `${(jug5/5) * 100}%`,
              bgcolor: '#2196f3',
              borderRadius: '0 0 4px 4px'
            }} />
            <Typography sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 600 }}>
              {jug5}L
            </Typography>
          </Box>
        </Box>
        
        <Box>
          <Typography variant="h6">3L Jug</Typography>
          <Box sx={{ 
            width: 50, 
            height: 120, 
            border: '3px solid #333', 
            borderRadius: 1,
            position: 'relative',
            bgcolor: '#e8f5e8',
            mx: 'auto'
          }}>
            <Box sx={{ 
              position: 'absolute',
              bottom: 0,
              width: '100%',
              height: `${(jug3/3) * 100}%`,
              bgcolor: '#4caf50',
              borderRadius: '0 0 4px 4px'
            }} />
            <Typography sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 600 }}>
              {jug3}L
            </Typography>
          </Box>
        </Box>
      </Box>

      <Typography variant="body1" align="center" sx={{ mb: 2 }}>
        Moves: {moves}
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, justifyContent: 'center' }}>
        {actions.map((action, idx) => (
          <Button 
            key={idx} 
            variant="outlined" 
            size="small"
            onClick={action.fn}
            sx={{ flexBasis: '45%' }}
          >
            {action.label}
          </Button>
        ))}
      </Box>

      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Button variant="contained" color="error" fullWidth onClick={reset}>Reset</Button>
    </Box>
  );
}



export default WaterCapacity