# GolfHeroes — Full Stack Platform

## Stack
- **Backend**: Node.js + Express.js + MongoDB (Mongoose)
- **Frontend**: React.js + Tailwind CSS
- **Auth**: JWT (Bearer tokens)
- **File uploads**: Multer (local storage)

---

## Project Structure

```
golf-heroes/
├── backend/
│   ├── controllers/       # Business logic
│   ├── middleware/        # auth, upload
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routers
│   ├── uploads/           # Uploaded files (gitignore in prod)
│   ├── .env               # Environment variables
│   ├── seed.js            # Seed admin + charities
│   └── server.js          # Entry point
│
└── frontend/
    ├── public/
    └── src/
        ├── components/
        │   ├── admin/         # Admin layout
        │   ├── common/        # Navbar, Footer, StatCard, Spinner
        │   └── dashboard/     # Dashboard layout
        ├── context/           # AuthContext
        ├── pages/
        │   ├── admin/         # Admin pages
        │   └── dashboard/     # User dashboard pages
        └── utils/             # Axios API helper
```

---

## Quick Start

### 1. Backend setup
```bash
cd backend
npm install
# Fill in your MongoDB URI in .env
npm run dev       # Development
npm start         # Production
```

### 2. Seed the database
```bash
cd backend
node seed.js
```
This creates the admin account and 4 starter charities.

**Default Admin:**
- Email: `admin@golfheroes.com`
- Password: `Admin@123456`

### 3. Frontend setup
```bash
cd frontend
npm install
npm start
```

Frontend runs on: http://localhost:3000
Backend runs on:  http://localhost:5000

---

## Environment Variables (backend/.env)

| Variable          | Description                          |
|-------------------|--------------------------------------|
| `MONGO_URI`       | MongoDB connection string            |
| `JWT_SECRET`      | Secret key for JWT signing           |
| `PORT`            | Server port (default 5000)           |
| `CLIENT_URL`      | Frontend URL for CORS                |
| `EMAIL_HOST`      | SMTP host for nodemailer             |
| `EMAIL_USER`      | SMTP email address                   |
| `EMAIL_PASS`      | SMTP app password                    |
| `ADMIN_EMAIL`     | Admin seed email                     |
| `ADMIN_PASSWORD`  | Admin seed password                  |

---

## Key Features Implemented

### User Side
- Register / Login with JWT auth
- Subscribe (monthly / yearly) — demo mode (payment gateway placeholder)
- Enter Stableford scores (1–45), max 5, rolling window, no duplicate dates
- Select charity + set contribution percentage (10–100%)
- View winnings, upload verification proof
- Profile management + password change

### Admin Panel
- Full dashboard with live stats
- User management (view, edit, activate/deactivate, subscription control)
- Edit any user's scores
- Draw management: create → simulate → publish
- Charity CRUD (create, edit, feature, remove)
- Winner verification (approve/reject) + payout tracking

### Draw Engine
- Monthly draws with Random or Algorithmic number generation
- Algorithmic mode: weighted by most frequent scores across all users
- Matches 3, 4, or 5 numbers against user score history
- Prize pool auto-split among winners per tier
- Jackpot (5-match pool) rolls over to next month if no winner

---

## API Endpoints

| Method | Route                              | Auth       |
|--------|-------------------------------------|------------|
| POST   | /api/auth/register                  | Public     |
| POST   | /api/auth/login                     | Public     |
| GET    | /api/auth/me                        | User       |
| GET    | /api/scores                         | Subscriber |
| POST   | /api/scores                         | Subscriber |
| PUT    | /api/scores/:id                     | Subscriber |
| DELETE | /api/scores/:id                     | Subscriber |
| GET    | /api/charities                      | Public     |
| PUT    | /api/charities/select               | User       |
| POST   | /api/charities                      | Admin      |
| GET    | /api/draws                          | Public     |
| POST   | /api/draws                          | Admin      |
| POST   | /api/draws/:id/simulate             | Admin      |
| POST   | /api/draws/:id/publish              | Admin      |
| GET    | /api/winners/my                     | User       |
| POST   | /api/winners/:drawId/:winnerId/proof| User       |
| GET    | /api/winners/admin/all              | Admin      |
| PUT    | /api/winners/admin/:d/:w/verify     | Admin      |
| PUT    | /api/winners/admin/:d/:w/pay        | Admin      |
| GET    | /api/admin/stats                    | Admin      |
| GET    | /api/admin/users                    | Admin      |
| PUT    | /api/admin/users/:id/subscription   | Admin      |

---

## Notes
- Payment gateway (Stripe) is **not included** — subscription activation is a demo flow
- Emails are configured but template implementation is optional via nodemailer
- Production deployment: set `NODE_ENV=production`, use environment variables securely