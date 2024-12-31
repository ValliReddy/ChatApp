import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from './firebaseConfig';  // Import your Firebase setup
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// Create the Context
const UserContext = createContext();

// Create a Provider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user); // Store current user

        // Fetch friends list from Firestore
        const userRef = doc(db, 'users', user.email);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const friendIds = userData.friends || [];

          // Fetch each friend's details
          const friendsData = await Promise.all(
            friendIds.map(async (friendId) => {
              const friendRef = doc(db, 'users', friendId);
              const friendSnap = await getDoc(friendRef);
              return friendSnap.exists() ? friendSnap.data() : null;
            })
          );

          setFriends(friendsData.filter(Boolean)); // Filter out null friends
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, friends }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook to access the context
export const useUserContext = () => {
  return useContext(UserContext);
};
