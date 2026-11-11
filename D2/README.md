# SIT313 Task D2: Browse Posts Page

Part of the DEV@Deakin web platform. This task adds backend post storage and a Browse Posts page. A logged-in user can save a Question or an Article as a Free or Paid post, and the Browse Posts page shows each user only the posts their plan allows. The React frontend talks to an ExpressJS backend, which stores users and posts in Cloud Firestore.

## Features

- **Post form:** choose a post type (Question or Article) and a post plan (Free or Paid). All fields are validated, and the fields clear after a successful post.
- **Backend post storage:** the Post button sends the post to the backend, which requires a login, validates the data again, and saves it in Firestore with the author's ID, the author's name and the date created.
- **Browse Posts page:** lists posts as cards with a preview, and a click expands the full Question or Article.
- **Plan-based access, decided by the backend:**
  - Visitors (not logged in) see free posts only.
  - Logged-in Free users see free posts only.
  - Logged-in Paid users see free and paid posts.
  - Paid posts are removed on the server, so they never reach a Free user's browser.
- **Filtering:** by post type, post plan, tag and posted-on-or-after date.
- **Hide:** removes a post from the user's list. Firestore is not changed.
- **Reset:** clears all filters and hidden posts.
- **Upgrade notice:** visitors and Free users see a notice on the Browse page with a link to Pricing.
- **Plan badge:** the navigation bar shows whether the user is on the Free or Paid plan.
- **Login, logout, Pricing and Upgrade:** carried over from Task D1. Only one paid plan can be bought.

No real payment is processed and no card details are stored.

## Tech Stack

- **Frontend:** React (Vite), React Router, plain CSS (one CSS file per component)
- **Backend:** Node.js, ExpressJS
- **Database:** Cloud Firestore through the Firebase Admin SDK
- **Security:** bcrypt, JSON Web Tokens (jsonwebtoken)
- **Email:** SendGrid (@sendgrid/mail)

## Project Structure

```
D2/
├── Backend/
│   ├── server.js
│   ├── package.json
│   ├── .env                      (not committed)
│   └── serviceAccountKey.json    (not committed)
├── Frontend/
│   └── Subscription/             (React app)
│       └── src/
│           ├── styles/           (one CSS file per component)
│           ├── App.jsx
│           ├── App.css           (global styles only)
│           ├── NavigationBar.jsx
│           ├── Post.jsx
│           ├── BrowsePosts.jsx
│           ├── Pricing.jsx
│           ├── Upgrade.jsx
│           ├── Login.jsx
│           ├── Signup.jsx
│           └── ...
├── .gitignore
└── README.md
```

## API

| Method | Route        | Protected | Purpose                                         |
| ------ | ------------ | --------- | ----------------------------------------------- |
| POST   | `/register`  | No        | Create an account                               |
| POST   | `/login`     | No        | Check credentials and return a JWT              |
| GET    | `/me`        | Yes       | Return the logged-in user and plan              |
| POST   | `/upgrade`   | Yes       | Buy a paid plan (`education` or `pro`)          |
| POST   | `/posts`     | Yes       | Save a post (type, plan, title, text, tags)     |
| GET    | `/posts`     | Optional  | Return the posts the current user's plan allows |
| POST   | `/subscribe` | No        | Send the newsletter welcome email               |

Protected routes need the header `Authorization: Bearer <token>`. `GET /posts` works without a token (as a visitor). If a token is sent, the backend reads the user's plan from Firestore.

Status codes used: 200, 201, 400 (invalid data), 401 (missing or invalid token, wrong login), 404, 409 (email already registered, or already on a paid plan) and 500.

## Firestore Collections

- **users:** name, email, password (bcrypt hash), plan (`free` or `paid`), selectedPlan, createdAt
- **posts:** type, plan (`free` or `paid`), title, tags, authorId, authorName, createdAt, plus description (question) or abstract and articleText (article)

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

Open the local link shown in the terminal (usually `http://localhost:5173`).

## Testing

To try the plan-based access:

1. Register two accounts. Leave one on the Free plan and upgrade the other on the Pricing page.
2. Post a free question, a paid question, a free article and a paid article, with different tags.
3. Open Browse Posts as a visitor, as the Free user and as the Paid user. Only the Paid user should see the paid posts.
4. Try the filters, Hide, Reset and expanding a post.
