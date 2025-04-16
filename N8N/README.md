# 🔄 N8N Workflows for Support Bot

This directory contains the n8n workflow configurations that power the AI capabilities of the Support Bot. These workflows handle everything from answering customer queries to escalating issues to human support when needed.

## 📋 Available Workflows

1. **Chat_History_Lookup.json** - Retrieves the conversation history for a specific chat session.
2. **Escalation_Handler.json** - Evaluates whether a support conversation needs human escalation.
3. **Cognito_FAQ.json** - Knowledge base implementation using vector search for intelligent answers.

## 🚀 Setting Up n8n

### Prerequisites

Before setting up the workflows, ensure you have:

- n8n running (via Docker or standalone installation)
- Access to the services used by the workflows:
  - MongoDB (for storing chat history)
  - Google Gemini API (for AI capabilities)
  - Pinecone (for vector database storage)
  - OpenAI API (for embeddings)
  - Google Drive (for FAQ document storage)
  - Gmail (for sending escalation emails)

### Step 1: Access n8n

If you've launched the application using Docker Compose as described in the main README:

```bash
# Navigate to n8n in your browser
http://localhost:5678
```

Create an account or log in with the default credentials:
- Username: `admin`
- Password: `password`

### Step 2: Configure Credentials

Before importing the workflows, you'll need to set up these credentials in n8n:

1. **MongoDB**
   - Go to Settings > Credentials
   - Click "Add Credential"
   - Select "MongoDB"
   - Configure with:
     - Host: `mongodb` (if using Docker) or `localhost`
     - Port: `27017`
     - Database: `support-bot`

2. **Google Gemini API**
   - Add a credential of type "Google PaLM API"
   - Enter your API Key from Google AI Studio
   - [Get a key here](https://makersuite.google.com/app/apikey)

3. **OpenAI API**
   - Add a credential of type "OpenAI API"
   - Enter your API Key from OpenAI
   - [Get a key here](https://platform.openai.com/api-keys)

4. **Pinecone API**
   - Add a credential of type "Pinecone API"
   - Enter your API Key and Environment from Pinecone
   - [Sign up here](https://www.pinecone.io/)

5. **Google Drive & Gmail** (For FAQ storage and escalation emails)
   - Add OAuth2 credentials for Google Drive and Gmail
   - Follow the n8n prompts to authorize the connection

### Step 3: Import Workflows

1. From the n8n dashboard, click "Workflows" in the left sidebar
2. Click the "Import from File" button (or press `i`)
3. Select one of the JSON files from this directory
4. Repeat for each workflow file

### Step 4: Configure Workflow Settings

After importing, you'll need to update some settings in each workflow:

#### For Chat_History_Lookup.json
1. Open the workflow
2. Check the MongoDB node and ensure the credential is correctly selected
3. Verify the collection names match your MongoDB setup (`sessions` and `messages`)

#### For Escalation_Handler.json
1. Open the workflow
2. Check the MongoDB node credentials
3. In the "Escalate To Team" Gmail node:
   - Update the recipient email to your support team's address
   - Verify the Gmail credentials are working

#### For Cognito_FAQ.json
1. Open the workflow
2. Check the Google Drive node and update the folder ID to your FAQ documents folder
3. Verify the Pinecone index name matches your setup
4. Test the connections to each service

### Step 5: Activate the Workflows

For each workflow:
1. Click the "Active" toggle in the top-right to enable the workflow
2. Save the workflow

## 🔌 Connecting Workflows to the Support Bot

The Support Bot backend is configured to send requests to n8n workflows using webhook URLs. Make sure these environment variables are set correctly:

```
N8N_WEBHOOK_URL=http://n8n:5678/webhook/support-bot-ai
N8N_WEBHOOK_URL_DEV=http://n8n:5678/webhook/support-bot-ai-dev
```

For local development without Docker, use:
```
N8N_WEBHOOK_URL=http://localhost:5678/webhook/support-bot-ai
```

## 📚 Creating Knowledge Base Documents

For the Cognito_FAQ workflow:

1. Create Markdown (.md) files with your FAQ content
2. Upload them to your configured Google Drive folder
3. Include metadata in the filenames:
   - `FAQ_` prefix for general FAQs
   - `escalation_` prefix for issues that might need human intervention
   - `common_` prefix for common questions

Example document structure:
```markdown
# Invoice Questions

## How do I find my invoice number?
Your invoice number starts with COG- and can be found...

## How do I update my billing information?
To update your billing details, please...
```

## 🔍 Testing Workflows

### Testing Chat History Lookup
1. Open the workflow
2. Click "Test" in the Execute Workflow node
3. Enter a valid session ID
4. Run the workflow and check the output

### Testing Escalation Handler
1. Open the workflow
2. Click "Test" in the Execute Workflow Trigger node
3. Enter a session ID that contains messages
4. Run the workflow and verify if escalation is triggered

### Testing Cognito FAQ
1. Open the workflow
2. Click "Test workflow"
3. Verify that documents are retrieved from Google Drive
4. Check that the documents are processed and stored in Pinecone

## 🛠️ Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB is running
- Check that the credentials and connection settings are correct
- Ensure the collections exist in the database

### AI Service Issues
- Verify your API keys are valid and have sufficient quota
- Check the node execution logs for error messages
- Test the API connections individually

### Webhook Issues
- Ensure the webhooks are properly activated
- Check the webhook URLs match what's in your environment variables
- Verify that n8n is accessible from the backend service

For more help, refer to the [n8n documentation](https://docs.n8n.io/).

## 🔄 Updating Workflows

After making changes to workflows in n8n:

1. Export the workflow as JSON (click the three dots > Export)
2. Save the JSON file to this directory, overwriting the existing file
3. Commit the changes to version control

This helps keep your workflow configurations tracked and shareable with the team. 