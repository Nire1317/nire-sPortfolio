import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDBH9dfRj-czPFP7HU73935EUA8UjnaAY",
  authDomain: "erin-portfolio-bfba7.firebaseapp.com",
  projectId: "erin-portfolio-bfba7",
  storageBucket: "erin-portfolio-bfba7.firebasestorage.app",
  messagingSenderId: "402031057329",
  appId: "1:402031057329:web:d900f673f51376844d8590",
  measurementId: "G-9EDL46F7SW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let analytics;
// Ensure analytics is only initialized on the client side since this project uses TanStack Start (SSR)
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, db, analytics };
