# Support Bot

A real-time chat application with anonymous sessions and message history.

## Project Structure

- `frontend/` - React-based frontend application
- `backend/` - Express.js backend server

## Features

- Real-time chat functionality
- Anonymous chat sessions
- Message history storage
- No authentication required

## Tech Stack

### Frontend
- React
- Vite
- TailwindCSS

### Backend
- Express.js
- MongoDB
- Prisma ORM

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Docker and Docker Compose (for local development)

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd support-bot
```

2. Install all dependencies
```bash
npm run install:all
```

3. Set up environment variables
```bash
cp backend/.env.example backend/.env
```

### Running the Application

#### Using Docker (Recommended for Development)

1. Start the services
```bash
docker-compose up -d
```

2. Run database migrations
```bash
npm run prisma:push
```

3. Start the frontend development server
```bash
npm run dev:frontend
```

#### Without Docker

1. Start MongoDB locally
```bash
# Make sure MongoDB is running on port 27017
```

2. Start the backend
```bash
npm run dev:backend
```

3. Start the frontend
```bash
npm run dev:frontend
```

Or run both concurrently:
```bash
npm run dev
```

## Environment Variables

### Backend (.env)
```
PORT=3000
DATABASE_URL="mongodb://localhost:27017/support-bot"
```

## API Endpoints

### Chat Sessions
- `POST /api/sessions` - Create a new chat session
- `GET /api/sessions/:id` - Get session details
- `GET /api/sessions/:id/messages` - Get messages for a session

### Messages
- `POST /api/messages` - Send a new message
- `GET /api/messages/:sessionId` - Get messages for a session

## Docker Commands

### Useful Docker Commands
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up -d --build

# Remove all data (including database)
docker-compose down -v
```

## License

MIT
