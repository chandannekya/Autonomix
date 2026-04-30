<div align="center">
  <img src="./frontend/public/favicon.png" width="100" height="100" alt="AutonomiX Logo"/>
  <h1>🤖 AutonomiX</h1>
  <p><strong>A Next-Generation Autonomous AI Agent Platform</strong></p>
  
  ![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
  ![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
  ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
  ![Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google)
</div>

---

AutonomiX is a powerful, full-stack platform designed for building, managing, and executing autonomous AI agents. Powered by Google's Gemini Flash models, these agents can reason, execute complex workflows, search the web, manipulate memory, generate PDFs, schedule calendar events, and manage integrations seamlessly.

## ✨ Core Features

*   **🧠 Advanced Agent Reasoning:** Powered by **Google Gemini 2.5 Flash** & LangChain, the agents run iterative execution loops, utilizing tools dynamically based on user prompts.
*   **🛠️ Extensive Tool Ecosystem:** 
    *   🌍 **Tavily Web Search:** Real-time fact-finding and data gathering.
    *   📅 **Google Calendar:** Seamless event scheduling and listing.
    *   📧 **Gmail / SMTP:** Send formatted emails autonomously.
    *   📄 **PDF Generation:** Create and upload PDF reports on the fly (via Cloudinary & PDFKit).
    *   🧮 **Calculator & Summarizer:** Data manipulation and text processing.
*   **💾 Vector Memory:** Integrated with **ChromaDB** for long-term agent memory and RAG capabilities.
*   **⏱️ Task Scheduling:** Automate agent workflows with cron-based scheduling to run tasks continuously in the background.
*   **🔐 Secure Authentication:** Seamless Google OAuth & credential-based login powered by Next-Auth v5.
*   **🎨 Premium UI/UX:** A stunning, responsive "Terminal/Mission Control" dark aesthetic built with TailwindCSS v4 and React 19.

---

## 🛠️ Architecture & Tech Stack

### 💻 Frontend (`/frontend`)
*   **Framework:** Next.js 16 (App Router)
*   **UI & Styling:** React 19, Tailwind CSS v4, Lucide React
*   **State Management:** Zustand, React Query
*   **Auth:** Next-Auth v5 Beta

### ⚙️ Backend (`/backend`)
*   **Framework:** Node.js, Express.js
*   **Database:** PostgreSQL (managed via Prisma ORM)
*   **AI Engine:** `@langchain/google-genai`, `@google/generative-ai`
*   **Vector DB:** ChromaDB
*   **Assets:** Cloudinary

---

## 🚀 Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18 or higher)
*   [PostgreSQL](https://www.postgresql.org/) database
*   API Keys: Google Gemini, Google OAuth, Cloudinary, Tavily, Chroma DB.

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies (this will automatically generate the Prisma client):
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory:
    ```env
    # Database
    DATABASE_URL="postgresql://username:password@localhost:5432/Autonomix?schema=public"

    # AI Integration
    GOOGLE_API_KEY="your_google_gemini_api_key"
    TAVILY_API_KEY="your_tavily_api_key"

    # Vector Memory
    CHROMA_API_KEY="your_chroma_api_key"
    CHROMA_TENANT="your_chroma_tenant_id"
    CHROMA_DB_NAME="Autonomix"

    # Asset Management
    CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
    CLOUDINARY_API_KEY="your_cloudinary_api_key"
    CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

    # Email Service
    MAIL_HOST="smtp.gmail.com"
    MAIL_USER="your_email@gmail.com"
    MAIL_PASS="your_app_password"

    # Google OAuth
    GOOGLE_CLIENT_ID="your_google_client_id"
    GOOGLE_CLIENT_SECRET="your_google_client_secret"
    GOOGLE_REDIRECT_URI="http://localhost:4000/auth/google/callback"
    GOOGLE_REFRESH_TOKEN="your_google_refresh_token"
    ```
4.  Push the Prisma schema to your database:
    ```bash
    npx prisma db push
    ```
5.  Start the backend development server (Port 4000):
    ```bash
    npm run dev
    ```

### 2. Frontend Setup

1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `frontend` directory:
    ```env
    NEXT_PUBLIC_BASE_URL="http://localhost:4000/api"
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="your_secure_random_nextauth_secret"
    
    GOOGLE_CLIENT_ID="your_google_client_id"
    GOOGLE_CLIENT_SECRET="your_google_client_secret"
    ```
4.  Start the Next.js frontend server:
    ```bash
    npm run dev
    ```
5.  Visit [http://localhost:3000](http://localhost:3000) to access the AutonomiX Command Center.

---

## 📄 License

This project is licensed under the ISC License (Backend). Frontend assets are private.
