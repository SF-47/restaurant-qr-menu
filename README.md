# Shawarma Story QR Menu

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%7C%20Auth%20%7C%20Hosting-FFCA28?logo=firebase&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-38B2AC?logo=tailwindcss&logoColor=white)

A live mobile-first QR menu web app for Shawarma Story with bilingual support, cart ordering, WhatsApp checkout, Firebase database, and admin panel.

## Live Website

**Live website:** https://shawarmastory.com  
**Admin demo:** Not public for security reasons

## Screenshots

> Screenshots will be added before the public portfolio release.

| Public menu mobile | Arabic RTL menu | Cart drawer |
| --- | --- | --- |
| Screenshot placeholder | Screenshot placeholder | Screenshot placeholder |

| Admin dashboard | Admin item form |
| --- | --- |
| Screenshot placeholder | Screenshot placeholder |

## Features

- Public QR menu.
- English/Arabic language support.
- RTL Arabic layout.
- Category filtering.
- Cart and quantity controls.
- Customer note.
- WhatsApp order message.
- Instagram and Google Maps links.
- Opening hours.
- Hidden admin panel.
- Firebase Auth admin login.
- Firestore menu management.
- Add, edit, and delete items.
- Availability and category management.

## Tech Stack

- React
- Vite
- Tailwind CSS
- Firebase Firestore
- Firebase Auth
- Firebase Hosting
- React Router
- React Icons

## Project Structure

```text
Story_Res_Menu/
  README.md
  .gitignore
  frontend/
    .env.example
    firebase.json
    firestore.rules
    package.json
    vite.config.js
    tailwind.config.js
    src/
      App.jsx
      firebase.js
      main.jsx
      config/
        restaurantConfig.js
      pages/
        PublicMenuPage.jsx
        AdminMenuPage.jsx
      components/
        admin/
        cart/
        common/
        layout/
        menu/
      data/
        constants.js
      i18n/
        translations.js
        adminTranslations.js
      utils/
        cartUtils.js
        categoryUtils.js
        languageUtils.js
        menuUtils.js
        whatsappUtils.js
      assets/
```

## Local Development

### Prerequisites

- Node.js
- npm
- Firebase project access for Shawarma Story
- Firebase CLI, required only for deployment

### Install Dependencies

```bash
cd frontend
npm install
```

### Environment Variables

Create a local `.env` file inside `frontend/` from the safe example file:

```bash
cp .env.example .env
```

Then add the Firebase web app config for the Shawarma Story Firebase project.

The app reads Firebase configuration from Vite environment variables:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Use [frontend/.env.example](frontend/.env.example) as the reference file. Never commit a real `.env` file.

### Run Locally

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

## Firebase Notes

- Firestore stores menu items in the existing `menuItems` collection.
- Admin access uses Firebase Auth.
- Admin authorization depends on Firestore admin documents.
- Firestore rules live in [frontend/firestore.rules](frontend/firestore.rules).
- Firebase Hosting configuration lives in [frontend/firebase.json](frontend/firebase.json).

## Security Notes

- Do not commit `.env` files.
- Do not commit `serviceAccountKey.json` or any service account file.
- Keep service account files outside the repository.
- The admin route is intentionally not listed publicly.
- Admin credentials are not stored in this repo.
- Protect admin access with Firebase Auth and Firestore rules.
- Firebase web config values are project-specific configuration, not service account secrets.

## Author

**Sami Farhat**

- GitHub: [SF-47](https://github.com/SF-47)
- LinkedIn: [www.linkedin.com/in/sami-farhat-46692641a](https://www.linkedin.com/in/sami-farhat-46692641a)
