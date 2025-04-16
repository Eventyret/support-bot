# 🤖 Support Bot - Your AI-Powered Customer Service Sidekick

> Because sometimes humans need a coffee break, but customer service never sleeps!

A smart, snappy support chat bot application that leverages n8n workflows to bring AI-powered assistance to your customers. It's like having a digital support team that never asks for vacations!

![Support Bot Demo](https://via.placeholder.com/800x400?text=Support+Bot+Demo)

## ✨ Features

- **Smart Conversations**: AI-powered responses that actually make sense (most of the time)
- **Session Management**: Keep track of customer conversations without losing your mind
- **Easy Integration**: Plugs into your existing systems without breaking everything
- **Customizable Workflows**: Build your own AI logic flows with n8n (no PhD required)
- **Automated Cleanup**: Old chats vanish like yesterday's problems
- **Modern UI**: A beautiful React frontend that won't make your eyes bleed

## 🏗️ Architecture

Our little robot friend is built with these technologies:

- **Frontend**: React 19 with Vite, Tailwind CSS, and some UI magic
- **Backend**: Express.js REST API (Node.js) - the backbone of our operation
- **Database**: MongoDB - where all the conversation secrets are kept
- **Workflow Engine**: n8n - the brain behind the AI operations
- **Containerization**: Docker - because who wants to deal with "it works on my machine"?
- **Infrastructure**: AWS via Terraform/OpenTofu - for deploying to the cloud with confidence

## 🛠️ Technical Decisions & Implementation Notes

### Development Focus
- Primary focus was on the n8n workflow integration and Express backend
- Frontend was developed with Cursor and 21st Century Dev tools for rapid UI creation
- MongoDB was chosen over Prisma for better native MongoDB support

### AI Implementation
- Using n8n's AI Agent module to handle workflow automation and decision-making
- Google Gemini Flash 001 model powers the core AI functionality (easily swappable)
- System and user prompts were developed collaboratively using Claude, Gemini, and OpenAI
- Vector storage with Pinecone was implemented but faced challenges with memory retention

### Data Management
- MongoDB stores both sessions and messages for persistent chat history
- GDPR-compliant cleanup system using agenda.js for scheduled data removal
- Implemented cleanup API endpoints for manual data management

### Testing & Security
- Unit tests implemented for backend functionality
- Security considerations include API key protection (partial implementation)
- No UI or end-to-end tests were implemented due to time constraints

### Future Improvements
- Enhanced vector database integration for better AI memory
- Additional AI capabilities with more fine-tuned examples
- Potential integration with Notion for automatic knowledge base updates
- Follow-up email workflows after session completion

## 🚀 Quick Start

### The "I Just Want It Working" Method (Docker)

```bash
# Clone the repo (replace with your actual repo URL)
git clone https://github.com/yourusername/support-bot.git
cd support-bot

# Create your environment file
cp .env.example .env

# Edit .env with your preferred text editor
# At minimum, change the CLEANUP_API_KEY and N8N_ENCRYPTION_KEY

# Fire up the containers
docker-compose up -d

# That's it! Your services are running at:
# - Frontend: http://localhost:3000
# - n8n: http://localhost:5678
```

### The "I'm a Developer" Method (Local Setup)

```bash
# Clone the repo (you know the drill)
git clone https://github.com/yourusername/support-bot.git
cd support-bot

# Install all dependencies in one fell swoop
npm run install:all

# Set up your environment
cp .env.example .env
# Edit .env with your favorite editor

# Start MongoDB and n8n with Docker (you still need these)
docker-compose up -d mongodb n8n

# Start both frontend and backend in development mode
npm run dev

# Your development services are now running at:
# - Frontend: http://localhost:5173 (Vite dev server)
# - Backend API: http://localhost:3000
# - n8n: http://localhost:5678
```

## 🔧 Setting Up n8n Workflows

n8n is where all the AI magic happens. Here's how to set it up:

1. Open n8n at http://localhost:5678
2. Create a new account or log in (default creds: admin/password)
3. Create a new workflow
4. Add a **Webhook** node as the entry point:
   - Method: POST
   - Path: `/webhook/support-bot-ai`
   - Authentication: None (or add basic auth if you're security-conscious)
   
5. Add an **AI Assistant** node for processing messages:
   - Connect it to the webhook
   - Configure your preferred AI service (OpenAI, Claude, etc.)
   
6. Add a **Respond to Webhook** node to send the response back:
   - Connect it to the AI node
   - Configure response to return the AI output

7. **Save** and **Activate** the workflow

![n8n Workflow Example](https://via.placeholder.com/800x400?text=n8n+Workflow+Example)

### Advanced n8n Tips

- Create separate workflows for different types of customer questions
- Use **Switch** nodes to route questions to specialized AI prompts
- Integrate with your CRM or ticketing system to create tickets when the AI gets stumped
- Use HTTP Request nodes to fetch data from your knowledge base

### Pre-built Workflows

We've included several ready-to-use n8n workflows in the `N8N` directory:

- **Chat History Lookup** - Retrieves conversation history for a specific session
- **Escalation Handler** - Evaluates when to escalate to human support
- **Cognito FAQ** - Knowledge base implementation with vector search

For detailed setup instructions, credential configuration, and workflow usage, see the [N8N/README.md](N8N/README.md) file.

## 📚 API Documentation

Our backend provides these delightful endpoints for your integration pleasure:

### Chat Sessions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sessions` | Create a new chat session |
| GET | `/api/sessions` | List all sessions (with optional filtering) |
| GET | `/api/sessions/:id` | Get a specific session and its messages |

### Messages

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/messages` | Send a new message |
| GET | `/api/messages/:sessionId` | Get all messages for a session |

### AI Integration

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/chat` | Send a message to the AI assistant |
| GET | `/api/ai/chat/:sessionId` | Get AI chat history for a session |

### Housekeeping

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cleanup/preview` | See what would be cleaned up |
| GET | `/api/cleanup/status` | Check cleanup job status |
| POST | `/api/cleanup/run` | Manually trigger cleanup |
| POST | `/api/cleanup/schedule` | Update cleanup schedule |
| POST | `/api/cleanup/cancel` | Cancel a scheduled cleanup |

Full API documentation is available at `/api/docs` when the server is running.

## 🔄 Development Workflow

We've set up some handy npm scripts to make your life easier:

```bash
# Run both frontend and backend in development mode
npm run dev

# Start the production build
npm start

# Build the frontend
npm run build

# Lint the frontend code
npm run lint
```

## 🌍 Environment Variables

| Variable | Description | Default | Required? |
|----------|-------------|---------|-----------|
| `DATABASE_URL` | MongoDB connection URL | `mongodb://localhost:27017/support-bot` | Yes |
| `PORT` | Backend server port | `3000` | No |
| `NODE_ENV` | Environment (development/production) | `development` | No |
| `N8N_WEBHOOK_URL` | URL for the n8n production workflow | `http://localhost:5678/webhook/support-bot-ai` | Yes |
| `N8N_WEBHOOK_URL_DEV` | URL for the n8n development workflow | `http://localhost:5678/webhook/support-bot-ai-dev` | No |
| `CHAT_CLEANUP_AGE` | Age after which to clean up old chats | `30d` | No |
| `CLEANUP_API_KEY` | API key for cleanup routes | - | Yes |
| `N8N_ENCRYPTION_KEY` | Encryption key for n8n | - | Yes |

## 🐛 Troubleshooting

### "My AI responses are slower than my grandma's internet!"
- Check your n8n workflow for bottlenecks
- Make sure your AI service provider isn't having an existential crisis

### "The Docker containers won't start!"
- Make sure ports 3000, 5678, and 27017 aren't already in use
- Check your Docker logs with `docker-compose logs`

### "MongoDB connection error!"
- If using local setup, verify MongoDB is running: `docker-compose ps`
- Check your DATABASE_URL environment variable

### "n8n can't connect to MongoDB!"
- Make sure both containers are on the same network
- Check the n8n logs: `docker-compose logs n8n`

## ✅ What We're Looking For

This project is a technical assessment. We're not looking for polish or perfection — we want to see:

- Code quality and organisation
- How you scope and approach real problems
- Use of AI tools and third-party libraries
- Communication and collaboration throughout
- Your reasoning behind tradeoffs and technical choices

## 📦 Deliverables

For this assessment, please provide:

- A GitHub repo with your code and this README
- The working application with instructions to run locally (as outlined above)
- A short write-up (~300 words) covering:
  - What you focused on
  - What you'd improve with more time
  - Any open questions or thoughts
- A Loom video walkthrough of:
  - The project structure
  - Key decisions you made
  - A demo of the functionality

## CI/CD

This project uses GitHub Actions for continuous integration. The following workflows are available:

### Backend CI

The backend workflow (`backend-ci.yml`) focuses on automated testing:
- Runs tests against a MongoDB service in a GitHub Actions environment
- Ensures code changes don't break existing functionality

### Frontend CI

The frontend workflow (`frontend-ci.yml`) focuses on code quality:
- Runs ESLint to ensure code quality and consistency
- Helps catch and prevent common coding issues before they're merged

### Code Quality

The code quality workflow (`code-quality.yml`) helps maintain good PR practices:
- Runs on pull requests only
- Checks for high-level security vulnerabilities using npm audit
- Analyzes PR size and flags excessively large changes

This minimal CI setup ensures code quality without requiring complex deployment pipelines. For deployment, manual processes are used as this project is primarily for local development.

## 📦 AWS Deployment Setup

The project includes Terraform/OpenTofu configuration for AWS deployment. Before initializing the infrastructure, you must create the S3 bucket and DynamoDB table for state management:

```bash
# Create the S3 bucket for Terraform state storage
aws s3 mb s3://support-bot-terraform-state --region eu-west-2

# Enable versioning on the bucket
aws s3api put-bucket-versioning --bucket support-bot-terraform-state --versioning-configuration Status=Enabled

# Create DynamoDB table for state locking
aws dynamodb create-table \
  --table-name support-bot-terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region eu-west-2
```

After creating these resources, you can initialize and apply the Terraform configuration:

```bash
# Navigate to the infrastructure directory
cd infra

# Initialize Terraform/OpenTofu
tofu init

# Plan the deployment
tofu plan -out=tfplan

# Apply the changes
tofu apply tfplan
```

This will set up the following AWS resources:
- VPC with public and private subnets
- ECR repository for Docker images
- ECS Fargate for running the backend
- ALB for routing traffic
- S3 bucket for hosting the frontend
- AWS Secrets Manager for sensitive configuration

<p align="center">Made with ❤️ and a bit too much coffee</p>
