import { initializeApp } from "firebase/app";
import { getAuth, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0AYCIYUJW5rDXJlnwFivPxky5RLGpi7U",
  authDomain: "my-react-app-755da.firebaseapp.com",
  projectId: "my-react-app-755da",
  storageBucket: "my-react-app-755da.firebasestorage.app",
  messagingSenderId: "87523770033",
  appId: "1:87523770033:web:84c3f53d08f925645eec90"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

//Оновлення профілю користувача
export const updateUserProfile = async ({ displayName, photoURL }) => {
  const user = auth.currentUser;
  if (user) {
    try {
      await updateProfile(user, { displayName, photoURL });
      console.log("Профіль оновлено!");
    } catch (error) {
      console.error("Помилка оновлення профілю:", error.message);
    }
  } else {
    console.log("Користувач не авторизований.");
  }
};

//Google Auth
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("Успішний Google-вхід:", result.user);
    return result.user;
  } catch (error) {
    console.error("Помилка входу через Google:", error.message);
    throw error;
  }
};

export default app;