# AI Wedding Studio

Welcome to the AI Wedding Studio workspace. This project has been structured into a clean monorepo-style layout containing separate directories for the **frontend** and the **backend**.

## Repository Structure

```
ai-wedding-studio/
├── frontend/             # React + Vite + TypeScript application
│   ├── src/              # Application source code
│   ├── public/           # Static assets
│   ├── package.json      # Frontend dependencies & build scripts
│   └── ...
└── backend/              # Supabase database configuration & migrations
    ├── supabase/         # Supabase project settings
    │   ├── config.toml   # Config file
    │   └── migrations/   # SQL schema migrations
    └── README.md         # Backend setup guide
```

---

## Quick Start

### 1. Frontend

The frontend is built using **Vite, React, TypeScript, and Tailwind CSS**.

To run the frontend locally:

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Start the local development server
npm run dev
```

The app will run at `http://localhost:8080` by default.

### 2. Backend

The backend is managed using **Supabase CLI**.

Please refer to the [backend README](./backend/README.md) for details on setting up database migrations locally or deploying them to production.
