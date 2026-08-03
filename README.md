# ChatBot Design

A React design-review workspace connected to a real Gemini-powered review agent. The browser sends text and optional JPEG, PNG, or WebP screenshots to the separate TypeScript backend; the Gemini key never enters the frontend bundle.

## Free API setup

1. Create a Gemini API key in [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Install both projects:

   ```bash
   npm install
   npm --prefix backend install
   ```

3. Create the private backend configuration:

   ```bash
   cp backend/.env.example backend/.env
   ```

4. Replace `replace_with_your_key` in `backend/.env`. Never commit or share this file.
5. Start the frontend and backend together:

   ```bash
   npm run dev:all
   ```

Open `http://localhost:5173`. The backend listens only on `127.0.0.1:3001` and Vite proxies `/api` requests to it.

## Commands

```bash
npm run dev:all
npm run lint
npm run build
npm --prefix backend run typecheck
```

## API

- `GET /api/health` returns backend availability without exposing or testing the key.
- `POST /api/reviews` accepts multipart fields `message`, `mode`, optional `previousReview`, and up to five repeated `images` files.

The backend uses `gemini-3.6-flash` by default. Change `GEMINI_MODEL` only in the backend environment.

## Privacy and deployment

Messages and images are sent to Google Gemini. Do not upload passwords, API keys, personal customer data, or confidential production screenshots. Review Google’s current Gemini API data-use terms before using the free tier for sensitive work.

This version is deliberately local and stateless: chat data lives in browser memory and disappears on refresh. Before exposing the backend publicly, add authentication, per-user quotas, persistent storage with ownership checks, production HTTPS, and a provider budget alert. CORS and IP rate limiting alone are not user authentication.
