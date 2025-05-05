import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db, updateUserProfile } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import './Profile.css';

const Profile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    const fetchUserData = async () => {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserData(userSnap.data());
      } else {
        // Якщо документа немає — створюємо
        const newUser = {
          name: currentUser.displayName || '',
          photoURL: currentUser.photoURL || '',
          trainings: [],
          completedTrainings: [],
          meals: {}
        };
        await setDoc(userRef, newUser);
        setUserData(newUser);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/trainer');
  };

  const handleChangePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const newPhotoURL = reader.result;
      await updateUserProfile({ displayName: userData.name, photoURL: newPhotoURL });

      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, { photoURL: newPhotoURL });

      setUserData(prev => ({ ...prev, photoURL: newPhotoURL }));
    };
    reader.readAsDataURL(file);
  };

  const handleNameChange = (e) => {
    setUserData(prev => ({ ...prev, name: e.target.value }));
  };

  const handleSaveName = async () => {
    await updateUserProfile({ displayName: userData.name, photoURL: userData.photoURL });

    const userRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userRef, { name: userData.name });
  };

  if (!userData) return <p>Завантаження...</p>;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2>Ваш профіль</h2>
        <div className="profile-details">
          <div className="profile-photo-container">
            <div className="profile-photo">
              {userData.photoURL ? (
                <img src={userData.photoURL} alt="Profile" className="profile-photo-img" />
              ) : (
                <div>Фото</div>
              )}
            </div>
            <input
              type="file"
              id="photo-upload"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleChangePhoto}
            />
            <label htmlFor="photo-upload" className="change-photo-btn">Змінити фото</label>
          </div>

          <div className="profile-info">
            <p><strong>Ваше ім'я:</strong></p>
            <input
              type="text"
              value={userData.name}
              onChange={handleNameChange}
              className="name-input"
            />
            <button onClick={handleSaveName} className="save-name-btn">Зберегти</button>
          </div>

          <div className="trainings-list">
            <h3>Мої тренування</h3>
            {userData.trainings.length > 0 ? (
              <ul>
                {userData.trainings.map((training, index) => (
                  <li key={index}>
                    <p><strong>Дата:</strong> {training.date}</p>
                    <p><strong>Час:</strong> {training.time}</p>
                    <p><strong>Тренер:</strong> {training.trainerName}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>У вас немає запланованих тренувань.</p>
            )}
          </div>

          <button className="logout-btn" onClick={handleLogout}>Вийти</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
