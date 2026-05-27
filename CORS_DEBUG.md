# CORS debug notes (Render + Netlify)

If the browser shows:
- `Access-Control-Allow-Origin missing` and/or
- `preflight` fails,

then ensure the backend Express `cors()` middleware includes:
- the correct `origin` for the deployed frontend
- `credentials: true`
- and that you handle OPTIONS preflight.

In this repo:
- `server.js` sets `origin: process.env.FRONTEND_URL || "http://localhost:5173"`

So the critical environment variable is:
- `FRONTEND_URL` = your Netlify frontend origin, e.g. `https://<site>.netlify.app`

Also make sure cookies work with:
- `res.cookie(... { secure: true, sameSite: 'none' })` for cross-site.


