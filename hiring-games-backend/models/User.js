const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['candidate', 'admin'],
    default: 'candidate'
  },
  gameProgress: {
    minesweeper: {
      completed: { type: Boolean, default: false },
      score: { type: Number, default: 0 },
      bestScore: { type: Number, default: 0 },
      completedAt: { type: Date },
      attempts: { type: Number, default: 0 }
    },
    unblockme: {
      completed: { type: Boolean, default: false },
      score: { type: Number, default: 0 },
      bestScore: { type: Number, default: 0 },
      completedAt: { type: Date },
      attempts: { type: Number, default: 0 },
      locked: { type: Boolean, default: true }
    },
    watercapacity: {
      completed: { type: Boolean, default: false },
      score: { type: Number, default: 0 },
      bestScore: { type: Number, default: 0 },
      completedAt: { type: Date },
      attempts: { type: Number, default: 0 },
      locked: { type: Boolean, default: true }
    }
  },
  totalScore: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Calculate total score
userSchema.methods.calculateTotalScore = function() {
  this.totalScore = 
    this.gameProgress.minesweeper.score +
    this.gameProgress.unblockme.score +
    this.gameProgress.watercapacity.score;
  return this.totalScore;
};

// Update game progress - modified to unlock next game after any completion
userSchema.methods.updateGameProgress = function(gameType, score) {
  if (!this.gameProgress[gameType]) {
    return false;
  }

  const gameData = this.gameProgress[gameType];
  gameData.score = score;
  gameData.attempts += 1;
  gameData.completedAt = new Date();
  
  if (score > gameData.bestScore) {
    gameData.bestScore = score;
  }
  
  // Mark as completed after any attempt (no winning requirement)
  gameData.completed = true;
  
  // Unlock next game after completion (not based on score)
  if (gameType === 'minesweeper') {
    this.gameProgress.unblockme.locked = false;
  } else if (gameType === 'unblockme') {
    this.gameProgress.watercapacity.locked = false;
  }
  
  this.calculateTotalScore();
  return true;
};

module.exports = mongoose.model('User', userSchema);