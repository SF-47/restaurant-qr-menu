# Restaurant QR Menu Web App

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%7C%20Auth%20%7C%20Hosting-FFCA28?logo=firebase&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-38B2AC?logo=tailwindcss&logoColor=white)

A mobile-first QR menu system for restaurants with bilingual English/Arabic support, RTL layout, customer cart, WhatsApp ordering, Firebase database integration, Firebase Auth admin management, and Firebase Hosting deployment support.

## Live Demo

**Live Demo:** https://shawarmastory.com  
**Admin Demo:** Not public for security reasons

## Screenshots

> Screenshots will be added before the public portfolio release.

| Public menu mobile | Public menu Arabic RTL | Cart drawer |
| --- | --- | --- |
| Screenshot placeholder | Screenshot placeholder | Screenshot placeholder |

| Admin dashboard | Admin item form |
| --- | --- |
| Screenshot placeholder | Screenshot placeholder |

## Features

### Public Customer Menu

- Mobile-first restaurant menu designed for QR code access.
- Category-based menu browsing.
- Product availability handling.
- Restaurant branding, opening hours, maps, Instagram, and WhatsApp links.
- Loading, empty, and error states for menu data.

### Admin Panel

- Firebase Auth email/password login.
- Add, edit, delete, search, and filter menu items.
- Toggle item availability.
- Manage categories.
- Dashboard-style menu statistics.
- Protected admin workflow for restaurant staff.

### Bilingual / RTL

- English and Arabic language support.
- RTL layout handling for Arabic.
- Language preference stored locally.
- Bilingual menu item names and category labels.

### Cart and WhatsApp Ordering

- Add items to cart.
- Increase, decrease, and remove cart items.
- Customer notes.
- Cart total calculation.
- WhatsApp order message generation.
- One-click order handoff to WhatsApp.

### Firebase / Infrastructure

- Firebase Firestore for menu item data.
- Firebase Auth for admin access.
- Firebase Hosting configuration for SPA deployment.
- Firestore security rules included for future setup.
- Environment-based Firebase web configuration.

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
Restaurant QR Menu Web App/
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
      config/
        restaurantConfig.js
        restaurantConfig.example.js
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

## Getting Started

### Prerequisites

- Node.js
- npm
- Firebase project
- Firebase CLI, required only for deployment

### Clone the Repository

```bash
git clone https://github.com/SF-47/restaurant-qr-menu-web-app.git
cd restaurant-qr-menu-web-app/frontend
```

### Install Dependencies

```bash
npm install
```

### Create Environment File

Create a local `.env` file inside `frontend/`:

```bash
cp .env.example .env
```

Then replace the placeholder values with your Firebase web app config.

### Run Locally

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Environment Variables

The app reads Firebase configuration from Vite environment variables.

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Use [frontend/.env.example](frontend/.env.example) as the template. Never commit a real `.env` file.

## Firebase Setup

1. Create a Firebase project.
2. Create a Firestore database.
3. Enable Email/Password authentication in Firebase Auth.
4. Create an admin user in Firebase Auth.
5. Add the Firebase web app config values to `frontend/.env`.
6. Create an admin document in Firestore:

```text
admins/{firebase_auth_user_uid}
```

7. Review and deploy the Firestore rules from `frontend/firestore.rules`.
8. Build the app and deploy it to Firebase Hosting.

## Using this project as a template

For a new restaurant client:

1. Copy the repo into a new project folder.
2. Create a new Firebase project for the client.
3. Create `frontend/.env` from `frontend/.env.example` and add the client's Firebase web app config. Do not put Firebase env values in `restaurantConfig`.
4. Update `frontend/src/config/restaurantConfig.js` with the client's restaurant name, tagline, WhatsApp number, Instagram URL, Google Maps URL, opening days and hours, currency label, logo, promo images, default language, theme notes, category order, and end categories.
5. Add or replace logo and promo images under `frontend/src/assets/` or use safe public assets.
6. Add menu items through the admin panel or with the seed script, keeping the existing Firestore `menuItems` structure.
7. Create a Firebase Auth admin user.
8. Create the matching Firestore `admins/{uid}` document.
9. Run `npm run lint` and `npm run build` inside `frontend/`.
10. Deploy to Firebase Hosting when ready.
11. Connect the custom domain in Firebase Hosting.
12. Generate a QR code pointing to the public menu URL.
13. Test the menu on a phone, WhatsApp ordering, and admin login before handoff.

Use [TEMPLATE_SETUP_CHECKLIST.md](TEMPLATE_SETUP_CHECKLIST.md) as the client setup checklist.

## Security Notes

- Never commit `.env` files.
- Never commit `serviceAccountKey.json` or any service account file.
- Keep service account files outside the repository.
- Protect admin routes with Firebase Auth and Firestore rules.
- Configure Firestore rules before using the project in production.
- Rotate any keys or service accounts that were exposed publicly.
- Firebase web config values are not service account secrets, but they should still be treated as project-specific configuration.

## Deployment

Install and log in to Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
```

Build the frontend:

```bash
cd frontend
npm run build
```

Deploy hosting:

```bash
firebase deploy --only hosting
```

Deploy Firestore rules when ready:

```bash
firebase deploy --only firestore:rules
```

## Roadmap

- Order database.
- Order status dashboard.
- Analytics.
- Multi-restaurant support.
- Image upload.
- Payment integration.

## Author

**Sami Farhat**

- GitHub: [SF-47](https://github.com/SF-47)
- LinkedIn: [www.linkedin.com/in/sami-farhat-46692641a](https://www.linkedin.com/in/sami-farhat-46692641a)


