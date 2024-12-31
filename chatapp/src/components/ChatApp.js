import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './chatApp.css'; // Add custom CSS for styling
import io from 'socket.io-client';
import { useUserContext } from './UserProvider'; // Import the custom hook
const ChatApp = () => {
  const [messages, setMessages] = useState({}); // Store messages by receiver
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Track selected chat user
  const [typingUser, setTypingUser] = useState(null); // Track who is typing
  const socket = useRef(null);
  const { user, friends } = useUserContext();
 

  useEffect(() => {
    if (user) {
      setCurrentUser(user.email);
    }
  }, [user]);
  console.log(friends)
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

          // Prevent duplicating messages
          const messageExists = newMessages[msg.sender].some(
            (existingMsg) => existingMsg.time === msg.time && existingMsg.text === msg.text
          );

          if (!messageExists) {
            newMessages[msg.sender].push(msg);
          }
          console.log(newMessages)

          return newMessages;
        });
      });

      socket.current.on('update_users', (users) => {
        console.log('Updated user list:', users);
        setOnlineUsers(users);
      });

      socket.current.on('typing', (user) => {
        if (user !== currentUser) {
          setTypingUser(user);
        }
      });

      socket.current.emit('register_user', currentUser);

      return () => {
        socket.current.disconnect();
      };
    }
  }, [currentUser]);

  // const handleUsernameSubmit = () => {
  //   if (username.trim()) {
  //     setCurrentUser(username);
  //   } else {
  //     alert('Please enter a valid username');
  //   }
  // };

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
      socket.current.emit('stop_typing', currentUser); // Stop typing indicator when the message is sent

      setMessages((prevMessages) => {
        const newMessages = { ...prevMessages };
        if (!newMessages[selectedUser]) {
          newMessages[selectedUser] = [];
        }
        // Add new message if it doesn't already exist
        const messageExists = newMessages[selectedUser].some(
          (existingMsg) => existingMsg.time === message.time && existingMsg.text === message.text
        );
        if (!messageExists) {
          newMessages[selectedUser].push(message);
        }
        return newMessages;
      });
      setNewMessage('');
    }
  };

  const handleTyping = () => {
    if (newMessage.trim()) {
      socket.current.emit('typing', currentUser); // Emit typing event
    } else {
      socket.current.emit('stop_typing', currentUser); // Emit stop typing event if the message is empty
    }
  };

 
  

  return (
    <div className="container">
      
        <div className="row clearfix">
          <div className="col-lg-12">
            <div className="card chat-app">
              {/* People List */}
              <div id="plist" className="people-list">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fa fa-search"></i>
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                  />
                </div>
                <ul className="list-unstyled chat-list mt-2 mb-0">
                  {friends.map((user, index) => (
                    user !== currentUser && (
                      <li
                        key={index}
                        className="clearfix"
                        onClick={() => {
                          // Set the selected user to chat with
                          setSelectedUser(user.username);
                        }}
                      >
                        <img
                          src="https://bootdey.com/img/Content/avatar/avatar1.png"
                          alt="avatar"
                        />

                        <div className="about">
                          <div className="name">{user.username}</div>
                          
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
                        <a
                          href="#view_info"
                          data-toggle="modal"
                          className="d-flex align-items-center"
                        >
                          <img
                            src="https://bootdey.com/img/Content/avatar/avatar2.png"
                            alt="avatar"
                          />
                          <div className="chat-about ml-2">
                            <h6 className="mb-0">{selectedUser}</h6>
                            <small>Last seen: 2 hours ago</small>
                          </div>
                        </a>
                      </div>
                      <div className="col-lg-6 d-flex justify-content-end">
                        {["camera", "image", "cogs", "question"].map((icon, idx) => (
                          <button
                            key={idx}
                            className={`btn btn-outline-${icon === "question" ? "warning" : "primary"}`}
                          >
                            <i className={`fa fa-${icon}`}></i>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Chat History */}
                  <div className="chat-history">
                    <ul className="list-unstyled">
                      {(messages[selectedUser] || []).map((msg, index) => (
                        <li key={index} className="clearfix">
                          <div className="message-data">
                            <span className="message-data-name">
                             
                            </span>
                          </div>
                          <div
                            className={`message ${
                              msg.sender === currentUser
                                ? 'my-message'
                                : 'other-message'
                            } float-${
                              msg.sender === currentUser ? 'right' : 'left'
                            }`}
                          >
                            {msg.text}
                            <div className="message-time">{(msg.time)}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {typingUser && typingUser !== currentUser && (
                      <div className="typing-indicator">
                        <span>{typingUser} is typing...</span>
                      </div>
                    )}
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
                        onChange={(e) => {
                          setNewMessage(e.target.value);
                          handleTyping();
                        }}
                        placeholder="Enter text here..."
                      />
                      <button
                        className="my-button"
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
      
    </div>
  );
};

export default ChatApp;
