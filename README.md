# Cognito Technical Assessment - Support Bot

A chatbot for help pages that can answer user questions based on internal support knowledge, with escalation to support for unresolved issues handled through n8n.

## Project Overview

This project was developed as part of a technical assessment for Cognito. The goal was to create an AI-powered FAQ chatbot that helps users find answers to their questions, with the ability to escalate unresolved issues to the support team through an n8n workflow.

### Core Features

- User-friendly chat interface
- AI-powered question answering based on internal knowledge base
- Support request escalation through n8n workflow automation
- Session management for conversation continuity
- Logging of queries and conversation history
- Scalable database design for future expansion

## Tech Stack

### Frontend
- React with Vite
- TailwindCSS
- Radix UI components
- AI SDK for chat interfaces

### Backend
- Express.js
- MongoDB for data storage
- Mongoose ODM
- n8n for workflow automation

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Docker and Docker Compose (for local development)
- MongoDB (local or Docker)
- n8n instance (for handling escalation workflows)

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
# Backend environment setup
cp backend/.env.example backend/.env

# Frontend environment setup
cp frontend/.env.example frontend/.env
```

### Running the Application

#### Using Docker (Recommended for Development)

1. Start the services
```bash
docker-compose up -d
```

2. Start the frontend development server
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
N8N_WEBHOOK_URL="http://your-webhook-url"
```

### Frontend (.env)
```
VITE_API_URL="http://localhost:3000/api"
```

## API Endpoints

### Chat Sessions
- `POST /api/sessions` - Create a new chat session
- `GET /api/sessions/:id` - Get session details
- `GET /api/sessions/:id/messages` - Get messages for a session

### Messages
- `POST /api/messages` - Send a new message
- `GET /api/messages/:sessionId` - Get messages for a session

### AI Chat
- `POST /api/ai/chat` - Process chat messages with AI and n8n
- `GET /api/ai/chat/:sessionId` - Get AI chat history

## Project Write-up

### What I Focused On

I focused on creating a well-structured, scalable foundation for the chatbot with clean architecture and code organization. Key focus areas included:

1. **User Experience**: Creating a responsive and intuitive chat interface that feels natural to use, with real-time feedback and appropriate loading states.

2. **Scalable Backend**: Designing a backend that could handle thousands or millions of queries, with proper session management and database design.

3. **Maintainable Codebase**: Implementing clean code practices with proper separation of concerns, consistent error handling, and comprehensive documentation.

4. **AI Integration**: Developing a flexible integration approach that works with n8n for AI processing and workflow automation.

### What I Would Improve With More Time

With additional time, I would enhance the project in several ways:

1. **Advanced Vector Search**: Implement a proper vector database (like Pinecone or Milvus) for more sophisticated semantic search capabilities.

2. **Analytics Dashboard**: Add a dashboard to track common questions, user satisfaction, and AI response quality.

3. **Multi-language Support**: Expand the system to handle queries in multiple languages.

4. **Enhanced Context Management**: Improve how the AI maintains context between messages in the same conversation.

5. **Integration Testing**: Develop more comprehensive end-to-end tests to ensure reliability.

### Open Questions & Thoughts

- **Knowledge Base Management**: How would content editors update the FAQ knowledge base? A dedicated CMS integration could streamline this process.

- **AI Provider Selection**: For production, would a specialized customer service AI (like ChatGPT) or a custom-trained model better serve our specific needs?

- **Privacy Considerations**: How should we handle sensitive user information in chat logs while maintaining useful analytics?

- **Scaling Strategy**: As user volume grows, what components would need to be optimized first?

- **n8n Workflow Design**: What would be the optimal workflow design in n8n to handle complex support escalations and routing?

## Video Walkthrough

I've created a video walkthrough that demonstrates the project and explains key decisions:

[Watch the Demo Video](your-loom-video-link)

In this video, I cover:
- The overall architecture and component interaction
- The user experience and interface design
- How the AI integration works with n8n
- Database design and scaling considerations
- The support escalation workflow

## Testing

The backend includes comprehensive unit tests using Vitest. Test files are located in the `backend/tests` directory.

### Test Structure

- `/unit`: Unit tests for individual components and utility functions
  - `/lib`: Tests for utility functions (mongoose connection, message utilities)
  - `/models`: Tests for database models (Session, Message)
  - `/routes`: Tests for route handlers (session routes)

### Running Tests

```bash
# Run all tests once
cd backend
npm test

# Run tests in watch mode (useful during development)
npm run test:watch

# Run tests with UI for better visualization
npm run test:ui
```

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
