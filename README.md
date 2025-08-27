# Blog App

A simple full-stack blog application for practice, including backend (Node.js + Express) and frontend (HTML/CSS/JS).

---

## Features

* Create, read, update, and delete blog posts (CRUD).
* Backend API built with Express.
* Frontend fetches posts from backend and displays them.
* Uses `dotenv` for configuration and `cors` for cross-origin support.

---

## Project Structure

```
blog-app/
├── backend/
│   ├── app.js          # Express server entry
│   ├── routes/.        # API route handlers
│   └── ...
└── frontend/
    ├── index.html      # Frontend UI
    ├── app.js          # Fetch and render posts
    └── styles.css      # Basic styling
```

---

## Backend Setup

1. Navigate to the backend folder
2. Install dependencies:
3. Create `.env` file
4. Start the server:

   ```bash
   node app.js
   ```

   Server will run at: `http://localhost:3000`

---

## Frontend Setup

1. Navigate to the frontend folder
2. Open `index.html` directly in the browser, or use a simple HTTP server:

   ```bash
   npx serve .
   ```
3. The frontend will fetch posts from the backend API.

---

## Tech Stack

* **Backend**: Node.js, Express, dotenv, cors, body-parser
* **Frontend**: HTML, CSS, JavaScript (vanilla)
