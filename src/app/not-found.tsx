'use client'

import { initializeApp } from "firebase-admin";
import { getApps } from "firebase/app";
import { useEffect } from "react";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export default function NotFound() {
    useEffect(() => {
      if (!getApps().length) {
        initializeApp(firebaseConfig);
      }
    }, []);
  
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
      </div>
    );
  }