# Shawarma Story Frontend

React/Vite frontend for the Shawarma Story QR menu.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

## Notes

- Firebase web config is loaded from local Vite environment variables.
- Use `.env.example` as the safe reference file.
- Do not commit `.env` or service account files.
- The public menu is served from `/`.
- The admin panel is intentionally hidden and protected by Firebase Auth.
