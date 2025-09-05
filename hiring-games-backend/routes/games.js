const express = require('express');
const User = require('../models/User');
const GameSession = require('../models/GameSession');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user's game progress
// @route   GET /api/games/progress
// @access  Private
router.get('/progress', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      gameProgress: user.gameProgress,
      totalScore: user.totalScore
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Start a game session
// @route   POST /api/games/start
// @access  Private
router.post('/start', protect, async (req, res) => {
  try {
    const { gameType, metadata } = req.body;
    
    if (!['minesweeper', 'unblockme', 'watercapacity'].includes(gameType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid game type'
      });
    }

    // Check if game is unlocked
    const user = await User.findById(req.user.id);
    if (user.gameProgress[gameType].locked) {
      return res.status(403).json({
        success: false,
        message: 'Game is locked. Complete previous games first.'
      });
    }

    // Create new game session
    const gameSession = await GameSession.create({
      user: req.user.id,
      gameType,
      metadata: metadata || {}
    });

    res.json({
      success: true,
      message: 'Game session started',
      sessionId: gameSession._id,
      gameType: gameSession.gameType,
      startTime: gameSession.startTime
    });
  } catch (error) {
    console.error('Start game error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    End a game session and update score
// @route   POST /api/games/end
// @access  Private
router.post('/end', protect, async (req, res) => {
  try {
    const { sessionId, score, moves, gameData } = req.body;
    
    if (!sessionId || score === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Session ID and score are required'
      });
    }

    // Find and update game session
    const gameSession = await GameSession.findOne({
      _id: sessionId,
      user: req.user.id,
      completed: false
    });

    if (!gameSession) {
      return res.status(404).json({
        success: false,
        message: 'Game session not found or already completed'
      });
    }

    // End the session
    gameSession.endSession(score, moves || 0, gameData || {});
    await gameSession.save();

    // Update user's game progress
    const user = await User.findById(req.user.id);
    user.updateGameProgress(gameSession.gameType, score);
    await user.save();

    res.json({
      success: true,
      message: 'Game completed successfully',
      score,
      gameProgress: user.gameProgress,
      totalScore: user.totalScore,
      session: {
        id: gameSession._id,
        gameType: gameSession.gameType,
        score: gameSession.score,
        timeSpent: gameSession.timeSpent,
        moves: gameSession.moves
      }
    });
  } catch (error) {
    console.error('End game error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Reset user's game progress
// @route   POST /api/games/reset
// @access  Private
router.post('/reset', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Reset game progress
    user.gameProgress = {
      minesweeper: {
        completed: false,
        score: 0,
        bestScore: 0,
        attempts: 0
      },
      unblockme: {
        completed: false,
        score: 0,
        bestScore: 0,
        attempts: 0,
        locked: true
      },
      watercapacity: {
        completed: false,
        score: 0,
        bestScore: 0,
        attempts: 0,
        locked: true
      }
    };
    
    user.totalScore = 0;
    await user.save();

    res.json({
      success: true,
      message: 'Game progress reset successfully',
      gameProgress: user.gameProgress,
      totalScore: user.totalScore
    });
  } catch (error) {
    console.error('Reset progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get game statistics
// @route   GET /api/games/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Get user's game sessions
    const sessions = await GameSession.find({ 
      user: req.user.id,
      completed: true 
    }).sort({ createdAt: -1 });

    // Calculate statistics
    const stats = {
      totalGamesPlayed: sessions.length,
      totalTimeSpent: sessions.reduce((sum, session) => sum + session.timeSpent, 0),
      averageScore: sessions.length > 0 ? 
        sessions.reduce((sum, session) => sum + session.score, 0) / sessions.length : 0,
      gameBreakdown: {
        minesweeper: {
          played: sessions.filter(s => s.gameType === 'minesweeper').length,
          bestScore: user.gameProgress.minesweeper.bestScore,
          totalAttempts: user.gameProgress.minesweeper.attempts
        },
        unblockme: {
          played: sessions.filter(s => s.gameType === 'unblockme').length,
          bestScore: user.gameProgress.unblockme.bestScore,
          totalAttempts: user.gameProgress.unblockme.attempts
        },
        watercapacity: {
          played: sessions.filter(s => s.gameType === 'watercapacity').length,
          bestScore: user.gameProgress.watercapacity.bestScore,
          totalAttempts: user.gameProgress.watercapacity.attempts
        }
      },
      recentSessions: sessions.slice(0, 10).map(session => ({
        gameType: session.gameType,
        score: session.score,
        timeSpent: session.timeSpent,
        moves: session.moves,
        completedAt: session.endTime
      }))
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;