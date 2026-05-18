<div align="center">
  <img src="./frontend/public/favicon.png" width="120" height="120" alt="AutonomiX Logo"/>
  <h1>AutonomiX</h1>
  <p><strong>A Next-Generation Full-Stack Autonomous AI Agent Platform</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Express-API-blue?style=for-the-badge&logo=express" alt="Express" />
    <img src="https://img.shields.io/badge/PostgreSQL-DB-blue?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Gemini-AI-orange?style=for-the-badge&logo=google" alt="Gemini" />
  </p>
</div>

---

## 🚀 Overview

**AutonomiX** is a powerful platform designed to build, manage, schedule, and run autonomous AI agents. Powered by Google Generative AI (Gemini 2.5/2.0 Flash) and LangChain, it provides a comprehensive "Mission Control" interface to orchestrate complex, multi-step agent workflows seamlessly.

Whether you need an agent to scrape the web, manage your calendar, fetch stock prices, or summarize documents, AutonomiX provides a robust, scalable environment with persistent vector memory and flexible scheduling capabilities.

---

## ✨ Key Features

- 🧠 **Advanced AI Agents**: Powered by Google Generative AI (Gemini) and LangChain for highly intelligent, autonomous decision-making.
- 🛠️ **Extensive Tool Integration**: Out-of-the-box support for Web Search, Email (Gmail/SMTP), Google Calendar, Document Summarization, PDF Generation, Stock Prices, and Weather.
- 💾 **Vector Memory**: Intelligent agent recall powered by ChromaDB, allowing agents to remember past interactions and context.
- ⏰ **Background Scheduling**: Create cron-based schedules for recurring agent execution without manual intervention.
- 🎨 **Premium UI/UX**: A state-of-the-art Bento-style "Mission Control" dashboard built with Next.js 16, Tailwind CSS v4, and Zustand.
- 🔒 **Secure Authentication**: Seamless Google OAuth integration via Next-Auth v5.
- 🐳 **Docker Ready**: Fully containerized setup via `docker-compose` for rapid deployment.

---

## 🛠️ Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React 19, Tailwind CSS v4, Zustand, React Query, Next-Auth |
| **Backend** | Node.js, Express, Prisma ORM |
| **Database** | PostgreSQL (Relational), ChromaDB (Vector Search) |
| **AI / ML** | Google Generative AI (Gemini), LangChain |
| **Integrations** | Cloudinary (Media), NodeMailer (SMTP), Puppeteer (Web), PDFKit |
| **Infrastructure** | Docker, Docker Compose |

---

## 📂 Project Structure

```text
AutonomiX/
├── backend/                  # Express API, Agent Orchestration, Tools
│   ├── src/agents/           # LangChain Agent definitions & LLM setup
│   ├── src/tools/            # Integrations: Web Search, Gmail, Calendar, etc.
│   ├── src/memory/           # ChromaDB Vector Store operations
│   └── prisma/               # Database schemas and migrations
├── frontend/                 # Next.js Application
│   ├── src/app/              # App Router pages (Dashboard, Settings, etc.)
│   ├── src/components/       # Reusable UI components (Bento UI, Modals)
│   └── src/store/            # Zustand global state management
└── docker-compose.yml        # Full stack container configuration
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js >= 20.x
- Docker & Docker Compose (for ChromaDB/PostgreSQL/Quickstart)
- API Keys: Google Gemini, Cloudinary (optional), Gmail App Password (optional)

### 🐳 Quick Start (Docker)

The fastest way to get AutonomiX running locally:

```bash
# 1. Clone the repository
git clone https://github.com/chandannekya/Autonomix.git
cd Autonomix

# 2. Configure environment variables (See section below)
# Copy example env files if provided, or create them.

# 3. Build and spin up the entire stack
docker compose up --build
```
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:4000`
- **PostgreSQL**: `localhost:5432`
- **ChromaDB**: `localhost:8000`

### 💻 Manual Setup

If you prefer to run services manually:

<details>
<summary><b>1. Backend Setup</b></summary>

```bash
cd backend
npm install

# Push database schema (requires running Postgres instance)
npx prisma db push

# Start the development server
npm run dev
```
</details>

<details>
<summary><b>2. Frontend Setup</b></summary>

```bash
cd frontend
npm install

# Start the Next.js frontend
npm run dev
```
</details>

---

## 🔐 Environment Variables

You need to configure `.env` files in both `frontend` and `backend` directories. 

### `backend/.env`
```env
# Server
PORT=4000
FRONTEND_URL="http://localhost:3000"
JWT_SECRET="your_secure_jwt_secret"

# Database & ChromaDB
DATABASE_URL="postgresql://postgres:password@localhost:5432/autonomix?schema=public"
CHROMA_URL="http://localhost:8000"

# AI Integrations
GOOGLE_API_KEY="your_google_gemini_api_key"
TAVILY_API_KEY="your_tavily_api_key_for_web_search"

# External Tools (Optional depending on usage)
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
MAIL_HOST="smtp.gmail.com"
MAIL_USER="your_email@gmail.com"
MAIL_PASS="your_app_password"

# OAuth Backend Handlers
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_REDIRECT_URI="http://localhost:4000/auth/google/callback"
```

### `frontend/.env`
```env
# Frontend Config
NEXT_PUBLIC_BASE_URL="http://localhost:4000/api"

# Next-Auth Settings
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

---

## 🤖 Available Tools

Agents in AutonomiX are equipped with powerful tools they can invoke autonomously:

- **Web Search**: Live internet search capability using Puppeteer / Tavily.
- **Email & Gmail**: Send outgoing emails and read inboxes using secure SMTP integration.
- **Google Calendar**: Retrieve and schedule events.
- **Document Summarization**: Intelligent summarization of lengthy texts.
- **PDF Generation**: Dynamically compile agent research into formatted PDFs.
- **Financial & Weather**: Live retrieval of stock prices and weather updates.

---

<div align="center">
  <i>Built with ❤️ for the future of autonomous intelligence.</i>
</div>
