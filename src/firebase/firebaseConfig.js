import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, PhoneAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB6-Zo78RK8izg3HKxW3pDcZgT86MtZ_rc",
  authDomain: "tic-tac-toe-l4.firebaseapp.com",
  projectId: "tic-tac-toe-l4",
  storageBucket: "tic-tac-toe-l4.firebasestorage.app",
  messagingSenderId: "273393465641",
  appId: "1:273393465641:web:a4b5128b54329aca361f38",
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, app, db };
