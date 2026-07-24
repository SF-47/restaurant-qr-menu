export function getFirebaseConfig(env = import.meta.env) {
  const requiredKeys = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
  ];

  const values = Object.fromEntries(requiredKeys.map((key) => [key, env[key]]));
  const missing = requiredKeys.filter((key) => {
    const value = values[key];
    return !value || /your_|example|demo/i.test(value);
  });

  return { values, missing, isConfigured: missing.length === 0 };
}
