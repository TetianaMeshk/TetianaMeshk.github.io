import { initializeApp } from "firebase/app";
import { getAuth, updateProfile } from "firebase/auth";
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
// Функція для оновлення профілю користувача
export const updateUserProfile = async ({ displayName, photoURL }) => {
  const user = auth.currentUser;  // Отримуємо поточного користувача

  if (user) {
    try {
      await updateProfile(user, {
        displayName: displayName,   // Оновлюємо ім'я
        photoURL: photoURL          // Оновлюємо фото
      });
      console.log("Профіль успішно оновлено!");
    } catch (error) {
      console.error("Помилка при оновленні профілю: ", error.message);
    }
  } else {
    console.log("Користувач не авторизований.");
  }
};

export default app;
