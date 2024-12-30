import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from './firebaseConfig'; // Import your Firebase setup
import { collection, getDocs, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const ProfilePage = () => {
  const [username, setUsername] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [friends, setFriends] = useState([]);  // To store the list of friends
  const [registered, setRegistered] = useState([]);  // To store all registered users
  const [friendEmail, setFriendEmail] = useState('');
  const [searchText, setSearchText] = useState('');  // For searching users by name
  const navigate = useNavigate();

  // Fetch all users once on component mount
  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      const newRegistered = [];

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.username && !newRegistered.includes(userData.username)) {
          newRegistered.push(userData.username);
        }
      });

      setRegistered(newRegistered);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch current user's friends from Firestore
  const fetchUserFriends = async (userEmail) => {
    const userRef = doc(db, 'users', userEmail);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      setFriends(userData.friends || []);  // Default to empty array if no friends
    } else {
      console.log("User not found.");
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch all registered users
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User signed in:", user.email);

        // Fetch user data from Firestore
        fetchUserFriends(user.email);  // Get the user's friends

        // Check if user data exists in Firestore, create it if not
        const userRef = doc(db, 'users', user.email);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            username: user.displayName || 'Guest',
            profilePic: user.photoURL || '',
            friends: [],  // Start with an empty friends list
            chats: []  // Empty chats list initially
          });
          console.log("User data created in Firestore.");
        } else {
          console.log("User data already exists in Firestore.");
        }
      }
    });

    return () => unsubscribe(); // Clean up the listener when component unmounts
  }, []);

  // Handle adding a friend
  const handleAddFriend = async (friendUsername) => {
    const user = auth.currentUser;

    if (user && friendUsername) {
      const userRef = doc(db, 'users', user.email);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        // Check if the user is already friends with the selected friend
        if (userData.friends.includes(friendUsername)) {
          alert(`${friendUsername} is already in your friends list.`);
          return; // Don't add them again
        }

        const updatedFriends = [...userData.friends, friendUsername];

        // Update the current user's friends list in Firestore
        await updateDoc(userRef, {
          friends: updatedFriends
        });
        console.log(`Added ${friendUsername} to friends`);

        // Update local state for friends and re-fetch friends list
        setFriends(updatedFriends);
      }
    }
  };

  // Handle profile picture upload
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  // Filter registered users based on search input
  const filteredUsers = registered.filter((user) =>
    user.toLowerCase().includes(searchText.toLowerCase())
  );

  // Handle saving the updated profile info
  const handleSave = async () => {
    const user = auth.currentUser;

    if (user) {
      const userRef = doc(db, 'users', user.email);
      await updateDoc(userRef, {
        username: username || user.displayName,
        profilePic: profilePic || user.photoURL
      });
      console.log('Profile updated successfully!');
      alert('Profile updated!');
    }
  };

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-2"></div>
          <div className="col-lg-6 col-md-8 login-box">
            <div className="col-lg-12 login-key">
              <i className="fa fa-user" aria-hidden="true"></i>
            </div>
            <div className="col-lg-12 login-title">Profile Page</div>

            <div className="col-lg-12 login-form">
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                {/* Left Section: Profile Picture and Username */}
                <div style={{ textAlign: 'center' }}>
                  <div className="form-group">
                    <div className="profile-pic-container" style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto' }}>
                      <img
                        src={profilePic || "https://bootdey.com/img/Content/avatar/avatar1.png"}
                        alt="Profile"
                        className="profile-img"
                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid #f8f9fa' }}
                      />
                      <input
                        type="file"
                        onChange={handleProfilePicChange}
                        className="form-control mt-2"
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                    />
                  </div>
                  <button
        onClick={handleSave}
        style={{
          // position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '10px 20px',
          borderRadius: '10px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Save
      </button>
                </div>

                {/* Right Section: Add Friend and Friends List */}
                <div style={{ width: '300px', paddingLeft: '20px', borderLeft: '2px solid #f8f9fa', paddingTop: '20px' }}>
                  {/* Search Registered Users */}
                  <div className="form-group">
                    <label className="form-control-label">Search Friend</label>
                    <div className="input-group">
                      <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="form-control"
                        placeholder="Enter friend's name"
                      />
                    </div>
                  </div>

                  {/* Registered Users List */}
                  <div className="form-group">
                    <label className="form-control-label">All Registered Users</label>
                    <ul>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((friend, index) => (
                          <li key={index} style={{ color: 'white', fontWeight: 'bold' }}>
                            {friend} 
                            <button
                              onClick={() => handleAddFriend(friend)}
                              style={{
                                marginLeft: '10px',
                                padding: '6px 12px',
                                borderRadius: '20px', // Oval button
                                backgroundColor: '#007bff', 
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer',
                              }}
                            >
                              Add Friend
                            </button>
                          </li>
                        ))
                      ) : (
                        <li>No users found</li>
                      )}
                    </ul>
                  </div>

                  {/* Friends List */}
                  <div className="form-group">
                    <label className="form-control-label">Your Friends</label>
                    <ul>
                      {friends.length > 0 ? (
                        friends.map((friend, index) => (
                          <li key={index} style={{ color: 'white', fontWeight: 'bold' }}>{friend}</li>
                        ))
                      ) : (
                        <li>No friends yet</li>
                      )}
                    </ul>
                    
                  </div>
                  
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-2"></div>
        </div>
        
      </div>

      {/* Save Button */}
     
    </div>
  );
};

export default ProfilePage;






// import { useEffect } from 'react';
// import { auth, db } from './firebaseConfig';  // Import your Firebase setup
// import { onAuthStateChanged } from 'firebase/auth';
// import { doc, setDoc,getDoc } from 'firebase/firestore';

// const ProfilePage = () => {
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         console.log("User signed in:", user.email);

//         // Check if the user already exists in Firestore
//         const userRef = doc(db, 'users', user.email);
//         const userSnap = await getDoc(userRef);

//         // If user doesn't exist, create a new document with their email
//         if (!userSnap.exists()) {
//           await setDoc(userRef, {
//             username: user.displayName || 'Sagar',  // You can add more fields here
//             profilePic: user.photoURL || '',  // Default or provided photo URL
//             friends: [],  // Empty friends list initially
//             chats: []  // Empty chats list initially
//           });
//           console.log("User data created in Firestore.");
//         } else {
//           console.log("User data already exists in Firestore.");
//         }
//       }
//     });

//     return () => unsubscribe(); // Clean up the listener when the component unmounts
//   }, []);

//   return (
//     <div>
//       <h1>Test Firebase Integration</h1>
//     </div>
//   );
// };

// export default ProfilePage;

