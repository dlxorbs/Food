// firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyB5rA_o0BmWkZEMjrDJMK7ReOB2N19jhL8",
    authDomain: "nendoroid-2c1a2.firebaseapp.com",
    projectId: "nendoroid-2c1a2",
    storageBucket: "nendoroid-2c1a2.firebasestorage.app",
    messagingSenderId: "227551429293",
    appId: "1:227551429293:web:eb261cd6ecb8626b9a3c24",
    measurementId: "G-S9EG21R8K6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firestore instance
const db = getFirestore(app);

export { db };  // 다른 파일에서 Firestore를 import 해서 사용하기 위해
