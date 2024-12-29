// const express = require('express');
// const cors = require('cors');
// const socketIo = require('socket.io');
// const http = require('http');

// // Initialize express app
// const app = express();
// const server = http.createServer(app);

// // Initialize socket.io
// const io = socketIo(server);

// // Middleware to handle CORS
// app.use(cors());

// // Store users in an object to track active connections
// const users = {};

// // Handling socket.io connections
// io.on('connection', (socket) => {
//   console.log('A user connected');

//   // Register the user with a username
//   socket.on('register_user', (username) => {
//     users[username] = socket;
//     console.log(`${username} connected`);
//     console.log('Current users:', Object.keys(users));  // Log all registered users
//   });

//   // Handle incoming messages from users
//   socket.on('send_message', (data) => {
//     console.log('Message received from', data.sender);
//     console.log('Users:', Object.keys(users));  // Log users when receiving the message
//     // Send the message to the intended receiver
//     const receiverSocket = users[data.receiver];
//     if (receiverSocket) {
//       receiverSocket.emit('receive_message', {
//         sender: data.sender,
//         text: data.text
//       });
//       console.log(`Message sent to ${data.receiver}`);
//     } else {
//       console.log(`Receiver ${data.receiver} not found`);
//     }
//   });

//   // Handle user disconnect
//   socket.on('disconnect', () => {
//     // Find and remove user from the users list
//     for (const username in users) {
//       if (users[username] === socket) {
//         delete users[username];
//         console.log(`${username} disconnected`);
//         break;
//       }
//     }
//   });
// });

// // Basic route to check server status
// app.get('/', (req, res) => {
//   res.send('Chat server is running');
// });

// // Start the server
// server.listen(5000, () => {
//   console.log('Server is running on http://localhost:5000');
// });

//restart control +c to see changes

const express = require('express');
const cors = require('cors');
const socketIo = require('socket.io');
const http = require('http');

// Initialize express app
const app = express();
const server = http.createServer(app);

// Initialize socket.io with CORS configuration
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Allow frontend on this port
    methods: ["GET", "POST"], // Allow these methods
    allowedHeaders: ["Content-Type"], // Allow headers like Content-Type
  }
});

// Middleware to handle CORS
app.use(cors());

// Store users in an object to track active connections
const users = {};

// Handling socket.io connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Register the user with a username  //on means listening to emit for both client and server
  socket.on('register_user', (username) => {
    users[username] = socket;
    console.log(`${username} connected`);
    console.log('Current users:', Object.keys(users));  // Log all registered users

    // Broadcast the list of online users to all clients
    io.emit('update_users', Object.keys(users));  // Broadcast to all clients
  });

  // Handle incoming messages from users
  socket.on('send_message', (data) => {
    console.log('Message received from', data.sender);
    console.log('Message:', data.text);

    // Send the message to the intended receiver
    // console.log(users);
    // console.log(users[data.receiver]);
    const receiverSocket = users[data.receiver];
    if (receiverSocket) {
      receiverSocket.emit('receive_message', {
        sender: data.sender,
        text: data.text,
        time:data.time,
        
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

    // Broadcast updated user list after someone disconnects
    io.emit('update_users', Object.keys(users));  // Broadcast to all clients
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
