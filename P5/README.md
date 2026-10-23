# SIT313 Task P5: Newsletter

Part of the DEV@Deakin web platform. This task connects the React frontend to the ExpressJS backend (from Task P2) so users can subscribe to the Daily Insider newsletter from the home page. When a user subscribes, a welcome email is sent using the SendGrid Email API.

## Tech Stack

- **Frontend:** React (Vite), plain CSS
- **Backend:** Node.js, ExpressJS
- **Email API:** SendGrid (`@sendgrid/mail`)
- **Other packages:** cors, dotenv

## Project Structure

```
P5/
├── Backend/
│   ├── server.js
│   ├── package.json
│   └── .env              (not committed)
├── Frontend/
│   └── Newsletter/       (React app)
│       └── src/
│           └── SubscribeContainer.jsx
├── .gitignore
└── README.md
```

## How It Works

1. The user types an email into the subscribe box on the home page and clicks **Subscribe**.
2. The React frontend checks the email format, then sends a `POST` request to `http://localhost:3000/subscribe`.
3. The ExpressJS backend validates the email again and sends a welcome email through SendGrid.
4. The backend responds with a status code and message, and the frontend shows the result to the user.

## API

### POST `/subscribe`

Request body:

```json
{ "email": "user@example.com" }
```

| Status | Meaning | Response |
| ------ | ------- | -------- |
| 200 | Email sent successfully | `{ "message": "Subscribed successfully!" }` |
| 400 | Email missing or invalid | `{ "error": "Email is required" }` or `{ "error": "Please enter a valid email address" }` |
| 500 | SendGrid failed to send | `{ "error": "Failed to subscribe" }` |

Note: SendGrid itself returns status 202 (Accepted) when it queues an email. The backend logs this in the terminal and then responds to the frontend with 200.

## Validation and Error Handling

- The email is checked on the **frontend** (empty and invalid format) before any request is sent.
- The email is checked again on the **backend**, since requests can be sent without using the form.
- Both sides use `try-catch` to handle failed requests.
- Errors show under the input field with a red border, and clear when the user starts typing. Success shows as a green message.

## Setup and Run

### 1. Backend

```
cd Backend
npm install
```

Create a `.env` file in the `Backend` folder:

```
SENDGRID_API_KEY=your_sendgrid_api_key
PORT=3000
```

Start the server:

```
node server.js
```

### 2. Frontend

In a second terminal:

```
cd Frontend/Newsletter
npm install
npm run dev
```

Open the local link shown in the terminal (usually `http://localhost:5173`).

## Notes

- `node_modules` and `.env` are excluded from the repository using `.gitignore`.
- The sender address used in SendGrid must be a verified sender.
