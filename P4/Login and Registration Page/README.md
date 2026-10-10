# DEV@Deakin: Login and Registration (SIT313 Task P4)

A React web app for the DEV@Deakin platform with a redesigned navigation bar, a login page, and a sign-up page. User records are stored in Firebase Firestore, and passwords are hashed with bcrypt before they are saved.

## Features

- Multi-page navigation with React Router (Home, Login, Sign-up)
- Navigation bar and footer shared across all pages
- Sign-up with validation (full name, valid email, password length, matching passwords)
- Duplicate email check before an account is created
- Password hashing with bcrypt (`bcryptjs`)
- Login that checks the email and password against Firestore
- Redirect to the home page on successful login, and to the login page after sign-up
- Firebase configuration kept in a `.env` file

## Tech Stack

- React (Vite)
- React Router (`react-router-dom`)
- Firebase Firestore
- bcryptjs
- react-icons
- CSS

## Project Structure

```
src/
├── main.jsx            # Entry point, wraps the app in BrowserRouter
├── App.jsx             # Routes and shared layout
├── NavigationBar.jsx   # Top navigation bar
├── Footer.jsx          # Site footer
├── Home.jsx            # Home page content
├── Login.jsx           # Login page and logic
├── Signup.jsx          # Sign-up page, validation and logic
├── Firebase.js         # Firebase and Firestore connection
└── App.css             # Styles
```

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Firebase

1. Create a project in the [Firebase console](https://console.firebase.google.com).
2. Add a web app and copy its configuration values.
3. Create a Firestore database in production mode.
4. In **Firestore Database → Rules**, publish:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, create: if true;
    }
  }
}
```

### 4. Create the `.env` file

Create a `.env` file in the project root (next to `package.json`):

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Fill in each value from your Firebase configuration, with no quotes. The `.env` file is listed in `.gitignore` and is not included in the repository.

### 5. Run the app

```bash
npm run dev
```

Open the local address shown in the terminal (usually `http://localhost:5173`).

## Pages

| Route     | Description  |
| --------- | ------------ |
| `/`       | Home page    |
| `/login`  | Login page   |
| `/signup` | Sign-up page |

## Security Notes

- Passwords are hashed with bcrypt and never stored as plain text.
- Firebase keys are stored in `.env`, which is excluded from version control.
- Firestore rules allow only `read` and `create` on the `users` collection.
- Failed logins show the same message whether the email or the password was wrong.

## Author

Harnoor Saini, 2510994766
SIT313 Secure Frontend Applications, Deakin University
