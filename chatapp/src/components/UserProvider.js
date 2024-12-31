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
  
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const friendIds = userData.friends || [];  // Fetch the friend IDs (user emails)
  
          // Fetch details for each friend using their email (userId)
          const friendsData = await Promise.all(
            friendIds.map(async (friendId) => {
              const friendRef = doc(db, 'users', friendId);  // Use friendId as the doc ID (email)
              const friendSnap = await getDoc(friendRef);
              return friendSnap.exists() 
                ? { ...friendSnap.data(), userId: friendSnap.id } 
                : null;
            })
          );
  
          setFriends(friendsData.filter(Boolean)); // Filter out null friends (in case of missing data)
        }
      } else {
        sessionStorage.removeItem('user'); // Remove user from sessionStorage on logout
      }
    });
  
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Log friends after setting the state
  useEffect(() => {
    // console.log('Friends:', friends);
  }, [friends]);  // Log whenever friends state changes
  

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
