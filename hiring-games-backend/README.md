# Hiring Games Platform - Backend API

A Node.js/Express backend API for the Hiring Games Platform with MongoDB integration.

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Game Progress Tracking**: Track user progress across three games (Minesweeper, Unblock Me, Water Capacity)
- **Progressive Game Unlocking**: Games unlock based on completion of previous games
- **Session Management**: Track individual game sessions with detailed statistics
- **Leaderboard**: Global leaderboard and user rankings
- **Admin Panel**: Admin routes for user management
- **Security**: Rate limiting, CORS, helmet security headers

## Games

1. **Minesweeper** - Logic & Pattern Recognition
2. **Unblock Me** - Spatial Reasoning & Planning (unlocked after Minesweeper)
3. **Water Capacity** - Mathematical Reasoning (unlocked after Unblock Me)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/hiring-games
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   CLIENT_URL=http://localhost:5173
   ```

4. Start MongoDB (make sure MongoDB is running)

5. Run the server:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Games
- `GET /api/games/progress` - Get user's game progress
- `POST /api/games/start` - Start a game session
- `POST /api/games/end` - End game session and update score
- `POST /api/games/reset` - Reset user's game progress
- `GET /api/games/stats` - Get detailed game statistics

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/leaderboard` - Get leaderboard
- `GET /api/users/:id` - Get user by ID (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Deactivate user (Admin only)

### Health Check
- `GET /api/health` - API health status

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (candidate/admin),
  gameProgress: {
    minesweeper: { completed, score, bestScore, attempts, completedAt },
    unblockme: { completed, score, bestScore, attempts, completedAt, locked },
    watercapacity: { completed, score, bestScore, attempts, completedAt, locked }
  },
  totalScore: Number,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date
}
```

### GameSession Model
```javascript
{
  user: ObjectId,
  gameType: String,
  startTime: Date,
  endTime: Date,
  score: Number,
  moves: Number,
  timeSpent: Number,
  completed: Boolean,
  gameData: Object,
  metadata: Object
}
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Helmet security headers
- Input validation and sanitization

## Development

```bash
# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev

# Run in production mode
npm start
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/hiring-games |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | 7d |
| `CLIENT_URL` | Frontend URL for CORS | http://localhost:5173 |

## MongoDB Setup

### Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use default connection: `mongodb://localhost:27017/hiring-games`

### MongoDB Atlas (Cloud)
1. Create account at mongodb.com
2. Create cluster and database
3. Get connection string
4. Update `MONGODB_URI` in `.env`

## Deployment

### Heroku
1. Create Heroku app
2. Set environment variables
3. Connect MongoDB Atlas
4. Deploy:
   ```bash
   git push heroku main
   ```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## Frontend Integration

Update your React frontend to use the API:

```javascript
// API base URL
const API_URL = 'http://localhost:5000/api';

// Authentication header
const authHeader = {
  'Authorization': `Bearer ${localStorage.getItem('token')}`
};
```

## Testing

```bash
# Test API endpoints
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## License

MIT License