import test from 'node:test';
import assert from 'node:assert/strict';
import { getFirebaseConfig } from './firebaseConfig.js';

test('detects placeholder Firebase config values', () => {
  const { isConfigured, missing } = getFirebaseConfig({
    VITE_FIREBASE_API_KEY: 'your_firebase_api_key',
    VITE_FIREBASE_AUTH_DOMAIN: 'your_project.firebaseapp.com',
    VITE_FIREBASE_PROJECT_ID: 'your_project_id',
    VITE_FIREBASE_STORAGE_BUCKET: 'your_project.appspot.com',
    VITE_FIREBASE_MESSAGING_SENDER_ID: 'your_sender_id',
    VITE_FIREBASE_APP_ID: 'your_app_id',
  });

  assert.equal(isConfigured, false);
  assert.deepEqual(missing, [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
  ]);
});

test('accepts a complete Firebase config', () => {
  const { isConfigured, missing } = getFirebaseConfig({
    VITE_FIREBASE_API_KEY: 'AIzaSyRealKey1234567890',
    VITE_FIREBASE_AUTH_DOMAIN: 'storymenures.firebaseapp.com',
    VITE_FIREBASE_PROJECT_ID: 'storymenures',
    VITE_FIREBASE_STORAGE_BUCKET: 'storymenures.appspot.com',
    VITE_FIREBASE_MESSAGING_SENDER_ID: '1234567890',
    VITE_FIREBASE_APP_ID: '1:1234567890:web:abcdef123456',
  });

  assert.equal(isConfigured, true);
  assert.deepEqual(missing, []);
});
