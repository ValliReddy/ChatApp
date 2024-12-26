const express = require('express');
const cors = require('cors');
const socketIo = require('socket.io');
const http = require('http');

// Initialize express app
const app = express();
const server = http.createServer(app);

// Initialize socket.io
const io = socketIo(server);

// Middleware to handle CORS
app.use(cors());

// Store users in an object to track active connections
const users = {};

// Handling socket.io connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Register the user with a username
  socket.on('register_user', (username) => {
    users[username] = socket;
    console.log(`${username} connected`);
    console.log('Current users:', Object.keys(users));  // Log all registered users
  });

  // Handle incoming messages from users
  socket.on('send_message', (data) => {
    console.log('Message received from', data.sender);
    console.log('Users:', Object.keys(users));  // Log users when receiving the message
    // Send the message to the intended receiver
    const receiverSocket = users[data.receiver];
    if (receiverSocket) {
      receiverSocket.emit('receive_message', {
        sender: data.sender,
        text: data.text
      });
      console.log(`Message sent to ${data.receiver}`);
    } else {
      console.log(`Receiver ${data.receiver} not found`);
    }
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    // Find and remove user from the users list
    for (const username in users) {
      if (users[username] === socket) {
        delete users[username];
        console.log(`${username} disconnected`);
        break;
      }
    }
  });
});

// Basic route to check server status
app.get('/', (req, res) => {
  res.send('Chat server is running');
});

// Start the server
server.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
