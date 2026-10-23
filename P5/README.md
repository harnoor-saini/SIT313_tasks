# DEV@Deakin: New Post Page (SIT313 Task C1)

A React web app for the DEV@Deakin platform with a New Post page. The user chooses to submit either a Question or an Article, and the form changes to show the matching fields. Every field is validated, and a popup tells the user whether the post was sent or an error occurred.

This project builds on Task P4, so the navigation bar, footer, routing, login page and sign-up page are still included.

## Features

- New Post page at `/post`, reached from the **Post** link in the navigation bar
- Post type selection (Question or Article) using radio buttons
- Conditional rendering with React `useState`, so the form changes with the selected type
  - Question: Title, Describe your problem, Tags
  - Article: Title, Abstract, Article Text, Tags
- Validation on every field, with red messages under the field that needs fixing
- Tags check: 1 to 3 tags, separated by commas, no empty tags, each 20 characters or less
- Popup after pressing Post: success message or error message
- Navigation bar and footer shown on every page

Note: posts are not saved anywhere in this task. The popup only confirms the result. Saving posts will be added in a future task.

## Tech Stack

- React (Vite)
- React Router (`react-router-dom`)
- Firebase Firestore (used by the login and sign-up pages from Task P4)
- bcryptjs (used by the login and sign-up pages from Task P4)
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
├── Signup.jsx          # Sign-up page and logic
├── Post.jsx            # New Post page (conditional rendering, validation, popup)
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

### 3. Create the `.env` file

The login and sign-up pages use Firebase. Create a `.env` file in the project root (next to `package.json`):

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Fill in each value from your Firebase project, with no quotes. The `.env` file is listed in `.gitignore` and is not included in the repository.

### 4. Run the app

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
SIT313 Secure Frontend Applications
