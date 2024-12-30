import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebaseConfig'; // Adjust the import to where your firebase configuration is located
import { collection, getDocs } from 'firebase/firestore';


const ProfilePage = () => {
  const [username, setUsername] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [friends, setFriends] = useState([]);
  const [friendEmail, setFriendEmail] = useState('');
  const navigate = useNavigate();
  
const fetchUsers = async () => {
  try {
    // Reference to the users collection
    const usersRef = collection(db, 'users'); // Assuming you have a "users" collection in Firestore
    const querySnapshot = await getDocs(usersRef);

    // Loop through the documents and log the username
    querySnapshot.forEach((doc) => {
      const userData = doc.data(); // Get the user data
      console.log('Username:', userData.username); // Log the username
    });
  } catch (error) {
    console.error('Error fetching users:', error); // Log any errors
  }
};

// Call the function to fetch users
fetchUsers();
  // Handle profile picture upload
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  // Handle adding a friend
  const handleAddFriend = () => {
    if (friendEmail) {
      setFriends([...friends, friendEmail]);
      setFriendEmail('');
    }
  };

  // Inline styles
  const profilePicContainerStyle = {
    position: 'relative',
    width: '120px', // Decreased size
    height: '120px', // Decreased size
    margin: '0 auto', // Center the profile picture
  };

  const profileImgStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #f8f9fa',
  };

  const profileSectionStyle = {
    display: 'flex',
    justifyContent: 'center', // Center both sections
    alignItems: 'flex-start',
    gap: '20px',
  };

  const rightSectionStyle = {
    width: '300px',
    paddingLeft: '20px',
    borderLeft: '2px solid #f8f9fa',
    paddingTop: '20px',
  };

  const ovalButtonStyle = {
    fontSize: '0.8rem', // Smaller font size
    padding: '8px 10px', // Adjusted padding for oval shape
    borderRadius: '20px', // Rounded edges for oval shape
    backgroundColor: '#007bff', // Blue background color
    color: 'white', // White text color
    border: 'none', // Remove border
    cursor: 'pointer', // Pointer cursor on hover
    transition: 'background-color 0.3s', // Smooth transition for hover effect
  };

  const ovalButtonHoverStyle = {
    backgroundColor: '#0056b3', // Darker shade on hover
  };

  const friendTextStyle = {
    color: 'white',  // White text
    fontWeight: 'bold', // Bold text
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
              <div style={profileSectionStyle}>
                {/* Left Section: Profile Picture and Username */}
                <div style={{ textAlign: 'center' }}>
                  <div className="form-group">
                    <div className="profile-pic-container" style={profilePicContainerStyle}>
                      <img
                        src={profilePic || "https://bootdey.com/img/Content/avatar/avatar1.png"}
                        alt="Profile"
                        className="profile-img"
                        style={profileImgStyle}
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
                    {/* <label className="form-control-label">Username</label> */}
                    <input
                      type="text"
                      className="form-control"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                {/* Right Section: Add Friend and Friends List */}
                <div style={rightSectionStyle}>
                  {/* Add Friend Section */}
                  <div className="form-group">
                    <label className="form-control-label">Search Friend</label>
                    <div className="input-group">
                      <input
                        type="text"
                        value={friendEmail}
                        onChange={(e) => setFriendEmail(e.target.value)}
                        className="form-control"
                        placeholder="Enter friend's email"
                      />
                      {/* <button
                        type="button"
                        style={ovalButtonStyle} // Apply oval button styles
                        onMouseEnter={(e) => e.target.style.backgroundColor = ovalButtonHoverStyle.backgroundColor} // Hover effect
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'} // Reset hover effect
                        onClick={handleAddFriend}
                      >
                        Add Friend
                      </button> */}
                    </div>
                  </div>

                  {/* Friends List */}
                  <div className="form-group">
                    <label className="form-control-label">Friends</label>
                    <ul>
                      {friends.map((friend, index) => (
                        <li key={index} style={friendTextStyle}>{friend}</li> // Applying text styles
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-2"></div>
        </div>
      </div>
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

