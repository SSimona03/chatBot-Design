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

## Deploy to Render

The included `render.yaml` deploys the built frontend and backend together as one Render web service.

1. Push the repository only after confirming no real key is tracked or present in Git history.
2. In Render, choose **New > Blueprint** and connect this repository.
3. During setup, enter the newly rotated key for the secret `GEMINI_API_KEY` environment variable.
4. Deploy and open the generated `onrender.com` URL.

Never add the hosted key to GitHub or to `render.yaml`. Render stores it separately as a secret.

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

The backend uses `gemini-3.1-flash-lite` by default for its larger free-tier allowance. Change `GEMINI_MODEL` only in the backend environment.

## Design-only agent safeguards

Every request passes through isolated model roles:

1. The safety-and-scope agent checks the untrusted message and images for adult/sexual content, nudity, graphic violence, hate, self-harm, dangerous content, rule overrides, and design relevance. It returns only a validated decision and request type.
2. The design-review agent runs for approved new designs and returns the accessibility and edge-case report schema.
3. The report-chat agent answers approved follow-up questions using only the validated report.

Direct attempts to override or reveal rules are rejected before any model call. The gate fails closed, has no tools, applies Gemini's strict harm thresholds, and blocks general chat, essays, creative writing, coding, translation, advice, unsafe media, and non-interface images. New reports and report follow-ups normally consume two Gemini requests; blocked semantic checks consume one.

When an uploaded image is clearly a design, short or imperfect captions such as “review this,” “thoughts?”, or “what are the terms underneath?” are allowed and interpreted in the context of that image.

## Privacy and deployment

Messages and images are sent to Google Gemini. Do not upload passwords, API keys, personal customer data, or confidential production screenshots. Review Google’s current Gemini API data-use terms before using the free tier for sensitive work.

This version is deliberately local and stateless: chat data lives in browser memory and disappears on refresh. Before exposing the backend publicly, add authentication, per-user quotas, persistent storage with ownership checks, production HTTPS, and a provider budget alert. CORS and IP rate limiting alone are not user authentication.
