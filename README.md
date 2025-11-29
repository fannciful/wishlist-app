# WishList App

A modern CRUD React application for managing your wishlist.

🔗 **Live Demo:** https://fannciful.github.io/wishlist-app/

## Features

- ✅ Create, Read, Update, Delete wishes
- ✅ Filter by date and price
- ✅ Responsive design (320px+)
- ✅ Form validation
- ✅ Success/error notifications
- ✅ Minimalist UI design

## Tech Stack

- React 18 + TypeScript
- Tailwind CSS
- React Router
- Context API
- JSON Server (local) / My JSON Server (production)

## Installation
```bash
git clone https://github.com/fannciful/wishlist-app.git
cd wishlist-app
npm install
```

## Running Locally

### Option 1: Run separately

**Terminal 1:**
```bash
npm run server
```

**Terminal 2:**
```bash
npm start
```

### Option 2: Run together
```bash
npm run dev
```

Open http://localhost:3000

## API

### Local Development
Uses **JSON Server** on http://localhost:3001

### Production
Uses **My JSON Server** at https://my-json-server.typicode.com/fannciful/wishlist-app/wishes

**Note:** My JSON Server simulates POST/PUT/DELETE but doesn't persist changes (free tier limitation).

## Deployment
```bash
npm run deploy
```

Then configure GitHub Pages:
- Settings → Pages → Source: `gh-pages` branch

## Project Structure
```
src/
├── components/
│   ├── Dashboard/
│   ├── WishPage/
│   └── common/
├── context/
├── hooks/
├── types/
└── App.tsx
```

## Requirements Met

- ✅ React 18 + TypeScript
- ✅ Functional components only
- ✅ Custom hooks (useApi)
- ✅ Context API
- ✅ Tailwind CSS
- ✅ JSON Server
- ✅ No Redux/MobX/Axios
- ✅ Responsive design
- ✅ GitHub Pages deployment

## Author

**Yuliia** (fannciful)
- GitHub: [@fannciful](https://github.com/fannciful)

