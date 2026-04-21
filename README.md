# Gastly — Personal Finance Manager

A full-stack personal finance web application with a modern dark mode design and fintech-level features.

## Live Demo

[Live App](https://gestor-gastos-frontend-chi.vercel.app/login) · [API Docs](https://gestor-gastos-api-bb5e.onrender.com/docs)

## Features

- JWT authentication — register, login and persistent session
- Dashboard with financial summary, recent transactions and spending by category
- Full transaction management with filters by type and date range
- Custom categories classified by expense and income
- Budget system per category with animated progress bars and alerts
- Savings goals with real-time progress tracking
- Statistics with bar and pie charts
- Fully responsive design with mobile drawer navigation
- Smooth animations powered by Framer Motion
- Dark mode interface

## Tech Stack

**Frontend:** React 18, TypeScript, Tailwind CSS, Framer Motion, Recharts, Axios

**Backend:** Python, FastAPI, SQLAlchemy, PostgreSQL, JWT, bcrypt

**Infrastructure:** Supabase (database), Render (backend API), Vercel (frontend)

## Running Locally

### Backend
```bash
cd gestor-gastos-api
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd gestor-gastos-frontend
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` and fill in your values.
