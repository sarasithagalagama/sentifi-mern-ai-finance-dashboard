import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDHKlXVOSSuAQrRVzCqnPYni89LvAGQerY",
  authDomain: "sentifi-ca5fd.firebaseapp.com",
  projectId: "sentifi-ca5fd",
  storageBucket: "sentifi-ca5fd.firebasestorage.app",
  messagingSenderId: "637872254106",
  appId: "1:637872254106:web:b55b6c7b1efb79721a8323"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
