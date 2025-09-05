const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameType: {
    type: String,
    required: true,
    enum: ['minesweeper', 'unblockme', 'watercapacity']
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  score: {
    type: Number,
    default: 0
  },
  moves: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  gameData: {
    type: mongoose.Schema.Types.Mixed, // Store game-specific data
    default: {}
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    screenResolution: String
  }
}, {
  timestamps: true
});

// Calculate time spent when session ends
gameSessionSchema.methods.endSession = function(score, moves = 0, gameData = {}) {
  this.endTime = new Date();
  this.timeSpent = Math.floor((this.endTime - this.startTime) / 1000);
  this.score = score;
  this.moves = moves;
  this.gameData = gameData;
  this.completed = true;
  return this;
};

module.exports = mongoose.model('GameSession', gameSessionSchema);