# Splitwise Frontend

This is the **frontend** of the Splitwise app.  
It is built using **React (Vite)** and styled with **TailwindCSS**.  

The app connects to a **FastAPI backend** and provides an interface for managing groups, expenses, and settlements.

## Installation
```bash
# Clone the repository
git clone https://github.com/vin0dkhichar/splitwise-frontend.git
cd splitwise-frontend

# Install dependencies
npm install
```

## Environment Setup

Create a `.env` file in the root:

```
VITE_API_BASE=http://localhost:8000
```

Important: Vite requires env variables to start with `VITE_`.

Access in your code like this:
```javascript
const API_BASE = import.meta.env.VITE_API_BASE;
```

## Running the App

**Development**
```bash
npm run dev
```

The app will be available at: http://localhost:5173

**Build for Production**
```bash
npm run build
```

## Features

- Authentication (login/logout with JWT)
- Groups (create, add/remove members)
- Expenses (equal, exact, percentage split; edit/delete support)
- Settlements (view balances, who pays whom, mark as paid)