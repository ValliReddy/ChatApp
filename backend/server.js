// Import the required modules
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Enable CORS for all origins (you can restrict it to specific origins if needed)
app.use(cors());

// Serve frontend build folder (for production)
app.use(express.static('../frontend/build'));

// Middleware to parse JSON
app.use(express.json()); 

// Example REST API endpoint for testing with Postman
app.post('/send-message', (req, res) => {
  const { message } = req.body;
  
  if (message) {
    console.log('Received message:', message);
    // Emit the message to all connected socket clients
    io.emit('chat message', { text: message });

    return res.status(200).send({ success: true, message: 'Message sent!' });
  } else {
    return res.status(400).send({ success: false, message: 'No message provided' });
  }
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log('a user connected');
  
  // Handle receiving a message
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg.text); // Log the message received from the client
    io.emit('chat message', msg); // Broadcast message to all clients
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
