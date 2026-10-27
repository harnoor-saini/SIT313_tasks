# SIT313 Task D1: Subscription

Part of the DEV@Deakin web platform. This task adds user session management, a Pricing page and a plan upgrade feature. A React frontend talks to an ExpressJS backend, which stores users, plans and posts in Cloud Firestore.

## Features

- **Register:** the backend validates the details, hashes the password with bcrypt and saves the user in Firestore.
- **Login and logout:** the backend checks the credentials and returns a signed JWT. The frontend keeps it in localStorage and clears it on logout.
- **Pricing page:** compares the Free, Education and Pro plans and highlights the user's current plan.
- **Upgrade:** only logged-in Free users can buy a plan, using a validated demo checkout form. The plan is saved in Firestore. A user on a paid plan cannot upgrade again.
- **Posts:** a logged-in user's valid question or article is saved in Firestore.
- **Newsletter:** the Subscribe box from Task P5 sends a welcome email through SendGrid.

No real payment is processed and no card details are stored.

## Tech Stack

- **Frontend:** React (Vite), React Router, plain CSS
- **Backend:** Node.js, ExpressJS
- **Database:** Cloud Firestore through the Firebase Admin SDK
- **Security:** bcrypt, JSON Web Tokens (jsonwebtoken)
- **Email:** SendGrid (@sendgrid/mail)

## Project Structure

```
D1/
├── Backend/
│   ├── server.js
│   ├── package.json
│   ├── .env                      (not committed)
│   └── serviceAccountKey.json    (not committed)
├── Frontend/
│   └── Subscription/             (React app)
│       └── src/
├── .gitignore
└── README.md
```

## API

| Method | Route        | Protected | Purpose                                |
| ------ | ------------ | --------- | -------------------------------------- |
| POST   | `/register`  | No        | Create an account                      |
| POST   | `/login`     | No        | Check credentials and return a JWT     |
| GET    | `/me`        | Yes       | Return the logged-in user and plan     |
| POST   | `/upgrade`   | Yes       | Buy a paid plan (`education` or `pro`) |
| POST   | `/posts`     | Yes       | Save a post                            |
| POST   | `/subscribe` | No        | Send the newsletter welcome email      |

Protected routes need the header `Authorization: Bearer <token>`.

Status codes used: 200, 201, 400 (invalid data), 401 (missing or invalid token, wrong login), 404, 409 (email already registered, or already on a paid plan) and 500.

## Firestore Collections

- **users:** name, email, password (bcrypt hash), plan (`free` or `paid`), selectedPlan, createdAt
- **posts:** type, title, tags, authorId, authorName, createdAt, plus description (question) or abstract and articleText (article)

## Setup and Run

### 1. Backend

```
cd Backend
npm install
```

Create a `.env` file in the `Backend` folder:

```
PORT=3000
JWT_SECRET=a_long_random_string
SENDGRID_API_KEY=your_sendgrid_api_key
```

Download a service account key from the Firebase console (Project settings, then Service accounts), save it as `Backend/serviceAccountKey.json`, and make sure Firestore is enabled in your Firebase project.

Start the server:

```
node server.js
```

### 2. Frontend

In a second terminal:

```
cd Frontend/Subscription
npm install
npm run dev
```

If `src/firebase.js` is used, create a `.env` file in this folder with your Firebase web app values:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Open the local link shown in the terminal (usually `http://localhost:5173`).

## Notes

- `node_modules`, `.env` files and `serviceAccountKey.json` are excluded from the repository using `.gitignore`.
- The backend must be running for registration, login, upgrade, posts and the newsletter to work.
