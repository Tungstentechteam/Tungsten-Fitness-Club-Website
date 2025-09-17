const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAG5VgFrw7dpTVCu0OtE00HQht2HN9O2rE",
  authDomain: "tungsten-user-management.firebaseapp.com",
  projectId: "tungsten-user-management",
  storageBucket: "tungsten-user-management.firebasestorage.app",
  messagingSenderId: "81220252865",
  appId: "1:81220252865:web:693895e1d91306f1ba5040",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firestore instance
const db = getFirestore(app);

module.exports = { db };
