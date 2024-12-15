import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBDiElXGsVFd38visHT64W3rg9T15SrR8E",
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGEING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
  };
const app = initializeApp(firebaseConfig);

export const fireAuth = getAuth(app);