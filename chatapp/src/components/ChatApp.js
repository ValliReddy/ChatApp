// import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "font-awesome/css/font-awesome.min.css";
// import './chatApp.css';

// const ChatApp = () => {
//   return (
//     <div className="container">
//       <div className="row clearfix">
//         <div className="col-lg-12">
//           <div className="card chat-app">
//             {/* People List */}
//             <div id="plist" className="people-list">
//               <div className="input-group">
//                 <div className="input-group-prepend">
//                   <span className="input-group-text">
//                     <i className="fa fa-search"></i>
//                   </span>
//                 </div>
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Search..."
//                 />
//               </div>
//               <ul className="list-unstyled chat-list mt-2 mb-0">
//                 {[
//                   {
//                     name: "Vincent Porter",
//                     status: "left 7 mins ago",
//                     img: "https://bootdey.com/img/Content/avatar/avatar1.png",
//                     online: false,
//                   },
//                   {
//                     name: "Aiden Chavez",
//                     status: "online",
//                     img: "https://bootdey.com/img/Content/avatar/avatar2.png",
//                     online: true,
//                   },
//                   // Additional list items can be added here
//                 ].map((user, index) => (
//                   <li key={index} className={`clearfix ${user.online ? "active" : ""}`}>
//                     <img src={user.img} alt="avatar" />
//                     <div className="about">
//                       <div className="name">{user.name}</div>
//                       <div className="status">
//                         <i
//                           className={`fa fa-circle ${
//                             user.online ? "online" : "offline"
//                           }`}
//                         ></i>{" "}
//                         {user.status}
//                       </div>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//             {/* Chat Section */}
//             <div className="chat">
//               <div className="chat-header clearfix">
//                 <div className="row">
//                   <div className="col-lg-6">
//                     <a
//                       href="#view_info"
//                       data-toggle="modal"
//                       className="d-flex align-items-center"
//                     >
//                       <img
//                         src="https://bootdey.com/img/Content/avatar/avatar2.png"
//                         alt="avatar"
//                       />
//                       <div className="chat-about ml-2">
//                         <h6 className="mb-0">Aiden Chavez</h6>
//                         <small>Last seen: 2 hours ago</small>
//                       </div>
//                     </a>
//                   </div>
//                   <div className="col-lg-6 d-flex justify-content-end">
//   {["camera", "image", "cogs", "question"].map((icon, idx) => (
//     <button
//       key={idx}
//       className={`btn btn-outline-${icon === "question" ? "warning" : "primary"}`}
//     >
//       <i className={`fa fa-${icon}`}></i>
//     </button>
//   ))}
// </div>

//                 </div>
//               </div>
//               {/* Chat History */}
//               <div className="chat-history">
//                 <ul className="list-unstyled">
//                   <li className="clearfix">
//                     {/* <div className="message-data text-right">
//                       <span className="message-data-time">10:10 AM, Today</span>
//                       <img
//                         src="https://bootdey.com/img/Content/avatar/avatar7.png"
//                         alt="avatar"
//                       />
//                     </div> */}
//                     <div className="message other-message float-right">
//                       Hi Aiden, how are you? How is the project coming along?
//                     </div>
//                   </li>
//                   <li className="clearfix">
//                     <div className="message-data">
//                       <span className="message-data-time">10:12 AM, Today</span>
//                     </div>
//                     <div className="message my-message">Are we meeting today?</div>
//                   </li>
//                   <li className="clearfix">
//                     <div className="message-data">
//                       <span className="message-data-time">10:15 AM, Today</span>
//                     </div>
//                     <div className="message my-message">
//                       Project has been already finished and I have results to
//                       show you.
//                     </div>
//                   </li>
//                 </ul>
//               </div>
//               {/* Chat Message Input */}
//               <div className="chat-message clearfix">
//                 <div className="input-group mb-0">
//                   <div className="input-group-prepend">
//                     <span className="input-group-text">
//                       <i className="fa fa-send"></i>
//                     </span>
//                   </div>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Enter text here..."
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatApp;





// import React, { useState, useEffect, useRef } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'font-awesome/css/font-awesome.min.css';
// import './chatApp.css';  // Add custom CSS for styling
// import io from 'socket.io-client';

// const ChatApp = () => {
//   // State for messages, input, current user, and username input
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [username, setUsername] = useState('');
//   const [currentUser, setCurrentUser] = useState(null);  // Track current user
//   const [onlineUsers, setOnlineUsers] = useState([]);    // Track online users
//   const socket = useRef(null);

//   // Establish Socket connection on component mount
//   useEffect(() => {
//     if (currentUser) {
//       socket.current = io('http://localhost:5000');

//       // Listen for incoming messages
//       socket.current.on('connect', () => {
//         console.log('Socket connected');
//       });

//       socket.current.on('receive_message', (msg) => {
//         console.log('Received message:', msg);
//         setMessages((prevMessages) => [...prevMessages, msg]); // Add new message to the state
//       });

//       // Listen for updated user list
//       socket.current.on('update_users', (users) => {
//         console.log('Updated user list:', users);
//         setOnlineUsers(users); // Update the list of online users
//       });

//       // Register user when they connect
//       socket.current.emit('register_user', currentUser);

//       return () => {
//         socket.current.disconnect();
//       };
//     }
//   }, [currentUser]);

//   // Handle username submission
//   const handleUsernameSubmit = () => {
//     if (username.trim()) {
//       setCurrentUser(username);
//     } else {
//       alert('Please enter a valid username');
//     }
//   };

//   // Send a new message
//   const handleSendMessage = (receiver) => {
//     if (newMessage.trim()) {
//       const message = {
//         sender: currentUser,
//         receiver: receiver,
//         text: newMessage,
//         time: new Date().toLocaleTimeString(),
//       };
//       console.log('Sending message:', message); // Log message to be sent
//       socket.current.emit('send_message', message); // Emit the message to the server
//       setNewMessage('');
//     }
//   };

//   return (
//     <div className="container">
//       {!currentUser ? (
//         <div className="row clearfix">
//           <div className="col-lg-12">
//             <div className="card chat-app">
//               <div className="chat">
//                 <div className="chat-header clearfix">
//                   <h6 className="mb-0">Enter your username</h6>
//                 </div>
//                 <div className="chat-message clearfix">
//                   <div className="input-group mb-0">
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={username}
//                       onChange={(e) => setUsername(e.target.value)}
//                       placeholder="Enter username..."
//                     />
//                     <button
//                       className="btn btn-primary"
//                       onClick={handleUsernameSubmit}
//                     >
//                       Join Chat
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="row clearfix">
//           <div className="col-lg-12">
//             <div className="card chat-app">
//               {/* People List */}
//               <div id="plist" className="people-list">
//                 <ul className="list-unstyled chat-list mt-2 mb-0">
//                   {onlineUsers.map((user, index) => (
//                     <li key={index} className="clearfix">
//                       <img
//                         src="https://bootdey.com/img/Content/avatar/avatar1.png"
//                         alt="avatar"
//                       />
//                       <div className="about">
//                         <div className="name">{user}</div>
//                         <div className="status">
//                           <i className="fa fa-circle online"></i> online
//                         </div>
//                       </div>
//                       {/* When you click on a user, the message will be sent */}
//                       <button onClick={() => handleSendMessage(user)}>Send Message</button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               {/* Chat Section */}
//               <div className="chat">
//                 <div className="chat-header clearfix">
//                   <div className="row">
//                     <div className="col-lg-6">
//                       <div className="chat-about ml-2">
//                         <h6 className="mb-0">{currentUser}</h6>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Chat History */}
//                 <div className="chat-history">
//                   <ul className="list-unstyled">
//                     {messages.map((msg, idx) => (
//                       <li key={idx} className="clearfix">
//                         <div
//                           className={`message ${
//                             msg.sender === currentUser ? 'my-message' : 'other-message'
//                           } float-${msg.sender === currentUser ? 'left' : 'right'}`}
//                         >
//                           {msg.text}
//                         </div>
//                         <div className="message-data">
//                           <span className="message-data-time">{msg.time}</span>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 {/* Chat Message Input */}
//                 <div className="chat-message clearfix">
//                   <div className="input-group mb-0">
//                     <div className="input-group-prepend">
//                       <span className="input-group-text">
//                         <i className="fa fa-send"></i>
//                       </span>
//                     </div>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={newMessage}
//                       onChange={(e) => setNewMessage(e.target.value)}
//                       placeholder="Enter text here..."
//                     />
//                     <button
//                       className="btn btn-primary"
//                       onClick={() => handleSendMessage('valli')} // Example user to send message to
//                     >
//                       Send
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatApp;



import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './chatApp.css';  // Add custom CSS for styling
import io from 'socket.io-client';

const ChatApp = () => {
  const [messages, setMessages] = useState({}); // Store messages by receiver
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Track selected chat user
  const socket = useRef(null);

  useEffect(() => {
    if (currentUser) {
      socket.current = io('http://localhost:5000');

      socket.current.on('connect', () => {
        console.log('Socket connected');
      });

      socket.current.on('receive_message', (msg) => {
        console.log('Received message:', msg);
        setMessages((prevMessages) => {
          const newMessages = { ...prevMessages };
          if (!newMessages[msg.sender]) {
            newMessages[msg.sender] = [];
          }
          newMessages[msg.sender].push(msg);
          return newMessages;
        });
      });

      socket.current.on('update_users', (users) => {
        console.log('Updated user list:', users);
        setOnlineUsers(users);
      });

      socket.current.emit('register_user', currentUser);

      return () => {
        socket.current.disconnect();
      };
    }
  }, [currentUser]);

  const handleUsernameSubmit = () => {
    if (username.trim()) {
      setCurrentUser(username);
    } else {
      alert('Please enter a valid username');
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedUser) {
      const message = {
        sender: currentUser,
        receiver: selectedUser,
        text: newMessage,
        time: new Date().toLocaleTimeString(),
      };
      console.log('Sending message:', message);
      socket.current.emit('send_message', message);

      setMessages((prevMessages) => {
        const newMessages = { ...prevMessages };
        if (!newMessages[selectedUser]) {
          newMessages[selectedUser] = [];
        }
        newMessages[selectedUser].push(message);
        return newMessages;
      });
      setNewMessage('');
    }
  };

  return (
    <div className="container">
      {!currentUser ? (
        <div className="row clearfix">
          <div className="col-lg-12">
            <div className="card chat-app">
              <div className="chat">
                <div className="chat-header clearfix">
                  <h6 className="mb-0">Enter your username</h6>
                </div>
                <div className="chat-message clearfix">
                  <div className="input-group mb-0">
                    <input
                      type="text"
                      className="form-control"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username..."
                    />
                    <button
                      className="btn btn-primary"
                      onClick={handleUsernameSubmit}
                    >
                      Join Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="row clearfix">
          <div className="col-lg-12">
            <div className="card chat-app">
              {/* Online Users List */}
              <div id="plist" className="people-list">
                <ul className="list-unstyled chat-list mt-2 mb-0">
                  {onlineUsers.map((user, index) => (
                    user !== currentUser && (
                      <li
                        key={index}
                        className="clearfix"
                        onClick={() => {
                          // Set the selected user to chat with
                          setSelectedUser(user);
                        }}
                      >
                        <img
                          src="https://bootdey.com/img/Content/avatar/avatar1.png"
                          alt="avatar"
                        />
                        <div className="about">
                          <div className="name">{user}</div>
                          <div className="status">
                            <i className="fa fa-circle online"></i> online
                          </div>
                        </div>
                      </li>
                    )
                  ))}
                </ul>
              </div>

              {/* Chat Section */}
              {selectedUser && (
                <div className="chat">
                  <div className="chat-header clearfix">
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="chat-about ml-2">
                          <h6 className="mb-0">{selectedUser}</h6>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chat History */}
                  <div className="chat-history">
                    <ul className="list-unstyled">
                      {(messages[selectedUser] || []).map((msg, index) => (
                        <li key={index} className="clearfix">
                          <div
                            className={`message ${
                              msg.sender === currentUser
                                ? 'my-message'
                                : 'other-message'
                            } float-${
                              msg.sender === currentUser ? 'left' : 'right'
                            }`}
                          >
                            {msg.text}
                          </div>
                          <div className="message-data">
                            <span className="message-data-time">{msg.time}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Chat Message Input */}
                  <div className="chat-message clearfix">
                    <div className="input-group mb-0">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="fa fa-send"></i>
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Enter text here..."
                      />
                      <button
                        className="btn btn-primary"
                        onClick={handleSendMessage}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatApp;
