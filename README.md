# 🤖 Support Bot - Your AI-Powered Customer Service Sidekick

> Because sometimes humans need a coffee break, but customer service never sleeps!

A smart, snappy support chat bot application that leverages n8n workflows to bring AI-powered assistance to your customers. This README focuses on the technical setup and running the project locally using Docker or a local development environment.

## ✨ Features

- **Smart Conversations**: AI-powered responses powered by customizable n8n workflows.
- **Session Management**: Persistent tracking of customer conversations.
- **Modular Integration**: Designed to plug into workflow engines like n8n.
- **Customizable Workflows**: Define AI logic and integrations using a visual tool like n8n.
- **Automated Cleanup**: Configurable system for removing old chat data.
- **Modern UI**: A responsive React frontend for the chat interface.

## 🏗️ Architecture

The Support Bot is built with the following key technologies:

-   **Frontend**: React 19 with Vite, Tailwind CSS - Provides the customer chat interface.
-   **Backend**: Express.js REST API (Node.js) - Handles sessions, messages, and communication with the workflow engine.
-   **Database**: MongoDB - Stores chat session and message data.
-   **Workflow Engine**: n8n - Executes the AI logic and potential third-party integrations.
-   **Containerization**: Docker - Used for easily running dependencies (MongoDB, n8n) or the entire application stack.

## 🛠️ Technical Decisions & Implementation Notes

### Development Focus
- Primary focus was on the n8n workflow integration and Express backend.
- Frontend was developed with rapid UI creation tools.
- MongoDB was chosen for native document database capabilities over an ORM like Prisma.

### AI Implementation
- Leverages n8n's capabilities (like the AI Agent module) for workflow automation and decision-making.
- Core AI functionality currently powered by Google Gemini Flash 001, configured within n8n workflows (model is swappable in n8n).
- System and user prompts were developed collaboratively using various AI tools.
- Note: Vector storage with Pinecone was explored but presented challenges with memory retention in this implementation.

### Data Management
- MongoDB stores both sessions and messages for persistent chat history.
- A data retention policy is implemented using agenda.js for scheduled cleanup based on age.
- API endpoints are available for manual cleanup management.

## 🚀 Quick Start - Running Locally

You can run the Support Bot using Docker Compose for all services or by running the frontend/backend locally alongside Dockerized dependencies.

### Prerequisites
-   Docker and Docker Compose installed.
-   Node.js and npm installed (for the "Developer Method").

### 🐳 The Docker Method (Recommended)

This method uses Docker Compose to run all services (frontend, backend, MongoDB, n8n) in containers.

1.  **Clone the repository:**
    ```bash
    git clone git@github.com:Eventyret/support-bot.git
    cd support-bot
    ```
2.  **Create environment file:** Copy the example environment file.
    ```bash
    cp .env.example .env
    ```
3.  **Configure Environment:** Edit the newly created `.env` file with your preferred text editor.
    -   At minimum, set values for `CLEANUP_API_KEY` and `N8N_ENCRYPTION_KEY`. These can be any non-empty string values you choose.
    -   `CLEANUP_API_KEY` is used to secure the manual cleanup endpoints.
    -   `N8N_ENCRYPTION_KEY` is required by n8n to securely store credentials and sensitive data.
4.  **Start the services:** Build and run the containers in detached mode.
    ```bash
    docker-compose up --build -d
    ```
5.  **Access the application:**
    -   Frontend (Chat UI): `http://localhost:3000`
    -   Backend API: `http://localhost:3000` (The backend runs directly on port 3000 within its container, mapped to 3000 locally)
    -   n8n Workflow Engine: `http://localhost:5678`

### 🧑‍💻 The Developer Method (Local Frontend/Backend)

This method runs the frontend and backend directly on your machine while using Docker for MongoDB and n8n.

1.  **Clone the repository:**
    ```bash
    git clone <your_repository_url_here>
    cd support-bot
    ```
2.  **Install Dependencies:** This script navigates into the `frontend` and `backend` directories and runs `npm install` in each after running it in the root.
    ```bash
    npm run install:all
    ```
3.  **Create environment file:** Copy the example environment file in the project root.
    ```bash
    cp .env.example .env
    ```
4.  **Configure Environment:** Edit `.env`.
    -   Configure `CLEANUP_API_KEY` and `N8N_ENCRYPTION_KEY` as described in the Docker method.
    -   Ensure `DATABASE_URL` is set correctly for the dockerized MongoDB (`mongodb://localhost:27017/support-bot`).
    -   Ensure `N8N_WEBHOOK_URL_DEV` is set correctly for your local n8n instance (e.g., `http://localhost:5678/webhook/support-bot-ai-dev`, matching the path configured in your n8n workflow).
5.  **Start Dependencies (MongoDB, n8n):** Use Docker Compose to run only the database and workflow engine containers.
    ```bash
    docker-compose up -d mongodb n8n
    ```
6.  **Start Frontend and Backend:** This script uses `concurrently` to run the development servers.
    ```bash
    npm run dev
    ```
7.  **Access the application:**
    -   Frontend (Chat UI): `http://localhost:5173` (Vite development server)
    -   Backend API: `http://localhost:3000` (Express development server)
    -   n8n Workflow Engine: `http://localhost:5678` (Docker container)

## 🔧 Setting Up n8n Workflows

n8n is the brain behind the AI interactions. You need to configure a workflow for the backend to communicate with.

1.  Open the n8n web interface at `http://localhost:5678`.
2.  Set up your n8n account if it's your first time.
3.  Create a new workflow.
4.  Add a **Webhook** node as the starting point.
    -   Set the **Method** to `POST`.
    -   Define a **Path**, e.g., `/webhook/support-bot-ai` (ensure this path matches the one used in your backend's `N8N_WEBHOOK_URL` or `N8N_WEBHOOK_URL_DEV`). The backend sends requests to n8n at the full URL constructed from the environment variable and this path.
    -   You may configure authentication if desired, but the backend expects no auth by default for the development webhook.
5.  Connect subsequent nodes to build your AI logic (e.g., **AI Assistant** node, data lookups).
6.  Add a **Respond to Webhook** node to send the final response back to the backend.
7.  **Save** and **Activate** the workflow.

**For detailed instructions on configuring n8n, importing and customizing included workflows, prompt engineering techniques, and required credentials, please refer to the dedicated [./N8N/README.md](./N8N/README.md) file.**

## 📚 API Documentation

The backend provides a REST API for managing sessions and messages, and interacting with the AI.

-   When the backend is running (either via Docker or locally), you can access the Swagger UI documentation at `/api-docs` relative to the backend's base URL (e.g., `http://localhost:3000/api-docs`).

Key Endpoints Summary:

| Method | Endpoint             | Description                                   |
| :----- | :------------------- | :-------------------------------------------- |
| POST   | `/api/sessions`      | Create a new chat session                     |
| GET    | `/api/sessions`      | List all sessions (with optional filtering)   |
| GET    | `/api/sessions/:id`  | Get a specific session and its messages       |
| POST   | `/api/messages`      | Send a new message                            |
| GET    | `/api/messages/:sessionId` | Get all messages for a session                |
| POST   | `/api/ai/chat`       | Send a message to the AI assistant via n8n    |
| GET    | `/api/ai/chat/:sessionId` | Get AI chat history for a session (if stored) |
| GET    | `/api/cleanup/preview` | Preview data that would be cleaned up         |
| GET    | `/api/cleanup/status`  | Check cleanup job status                      |
| POST   | `/api/cleanup/run`     | Manually trigger cleanup                      |
| POST   | `/api/cleanup/schedule`| Update cleanup schedule                       |
| POST   | `/api/cleanup/cancel`  | Cancel a scheduled cleanup                    |

## 🔄 Development Workflow

Helpful npm scripts defined in the root `package.json`:

```bash
# Run both frontend and backend in development mode concurrently
npm run dev

# Start the production build (frontend built, backend running)
npm start

# Build the frontend for production
npm run build

# Lint the frontend code
npm run lint

# Install dependencies in root, frontend, and backend
npm run install:all