import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Logout = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err.message);
    }
  };

  return <button onClick={handleLogout}>Вийти</button>;
};

export default Logout;
