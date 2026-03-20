# 🤖 Autonomix

Autonomix is a powerful full-stack platform designed for building, managing, and executing autonomous AI agents. The platform features a responsive Next.js frontend and a robust Node.js/Express backend, integrated with Google's Generative AI, Chroma vector database for long-term memory, and robust asset management.

## ✨ Features

- **Agent Builder Interface**: A dedicated workspace to create, configure, and manage autonomous AI agents.
- **Advanced AI Capabilities**: Powered by Google Generative AI (Gemini) via Langchain integration.
- **Vector Memory**: Utilizes Chroma DB for agent memory, enabling context-aware operations and RAG (Retrieval-Augmented Generation).
- **Web Research**: Integrated with Tavily for autonomous web searching and fact-finding.
- **Asset Management**: Automatic media handling and storage via Cloudinary.
- **Secure Authentication**: User authentication flow seamlessly handled by Next-Auth and Google OAuth.
- **Document Processing**: PDF generation and file processing capabilities using PDFKit.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI & Styling**: React 19, Tailwind CSS v4, Lucide React
- **State Management**: Zustand, React Query
- **Authentication**: Next-Auth

### Backend
- **Framework**: Node.js with Express
- **Database ORM**: Prisma (with PostgreSQL adapter)
- **AI & LLM**: `@langchain/google-genai`, `@langchain/core`
- **Vector Database**: Chroma DB
- **Utilities**: Nodemailer (Email), PDFKit (Document generation), Cloudinary (Images/Assets)

---

## 🚀 Getting Started

### Prerequisites
Before running the project locally, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/) database
- API Keys for Google Gemini, Google OAuth, Cloudinary, Tavily, and Chroma DB.

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory with the following variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/Autonomix?schema=public"

   # AI integration
   GOOGLE_API_KEY="your_google_api_key_here"
   TAVILY_API_KEY="your_tavily_api_key_here"

   # Vector Memory
   CHROMA_API_KEY="your_chroma_api_key_here"
   CHROMA_TENANTE="your_chroma_tenant_id"
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
4. Push the Prisma schema to your PostgreSQL database:
   ```bash
   npx prisma db push
   ```
5. Start the development server (runs on port 4000 by default):
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` directory:
   ```env
   NEXT_PUBLIC_BASE_URL="http://localhost:4000/api"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your_nextauth_secret_key"
   
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📄 License
This project is licensed under the ISC License (Backend) and private for Frontend.
