import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from './firebaseConfig';  // Import your Firebase setup
import { doc, getDoc,getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// Create the Context
const UserContext = createContext();

// Create a Provider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);

  // This effect checks if there is a user in sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user); // Set user in context
        sessionStorage.setItem('user', JSON.stringify(user)); // Store user in sessionStorage

        // Fetch friends list from Firestore
        const userRef = doc(db, 'users', user.email);
        const userSnap = await getDoc(userRef);
        const querySnapshot = await getDocs(userRef);
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
      } else {
        sessionStorage.removeItem('user'); // Remove user from sessionStorage on logout
      }
    });

    return () => {
      unsubscribe();
    };
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
