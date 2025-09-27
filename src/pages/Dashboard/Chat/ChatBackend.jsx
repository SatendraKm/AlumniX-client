// const { Server } = require("socket.io");
// const express = require("express");
// const http = require("http");

// // Initialize Express and HTTP server
// const app = express();
// const server = http.createServer(app);

// // WebSocket server configuration
// const io = new Server(server, {
//   transports: ["websocket"], // Ensure WebSocket is allowed
//   cors: {
//     origin: [
//       "https://n-square-backend.onrender.com",
//       "https://network-next-backend.onrender.com",
//       "https://n-square.vercel.app",
//       "http://localhost:5173",
//       "http://localhost:3001",
//       "https://n-square-chat-app.vercel.app",
//     ],
//     credentials: true,
//   },
// });

// // Global map to manage online users and support multi-device connections
// global.onlineUsers = new Map();

// io.on("connection", (socket) => {
//   console.log(`New WebSocket connection established: ${socket.id}`);

//   // Add a user to the online users map
//   socket.on("add-user", (userId) => {
//     console.log(`User added with ID: ${userId}`);
//     if (!userId) {
//       console.error("Invalid userId received.");
//       return;
//     }

//     // Initialize or update user's connections
//     if (!onlineUsers.has(userId)) {
//       onlineUsers.set(userId, new Set()); // Use Set for unique socket IDs
//     }
//     onlineUsers.get(userId).add(socket.id);
//   });

//   // Handle sending messages
//   socket.on("send-msg", (data) => {
//     const { from, to, msg } = data;

//     if (!to || !msg) {
//       console.error("Invalid message data received:", data);
//       return;
//     }

//     console.log(`Message from ${from} to ${to}: ${msg}`);

//     const recipientSockets = onlineUsers.get(to);
//     if (recipientSockets) {
//       recipientSockets.forEach((recipientSocketId) => {
//         console.log(`Sending message to socket: ${recipientSocketId}`);
//         io.to(recipientSocketId).emit("msg-recieve", { from, msg });
//       });
//     } else {
//       console.log(`User ${to} is not online.`);
//     }
//   });

//   // Handle disconnection
//   socket.on("disconnect", () => {
//     console.log(`Socket disconnected: ${socket.id}`);

//     // Remove the socket ID from all users
//     for (const [userId, socketSet] of onlineUsers.entries()) {
//       socketSet.delete(socket.id);
//       if (socketSet.size === 0) {
//         onlineUsers.delete(userId); // Remove user if no active sockets remain
//       }
//     }
//   });

//   // Handle unexpected socket errors
//   socket.on("error", (err) => {
//     console.error(`Socket error on ${socket.id}:`, err.message);
//   });
// });

// // Define basic API routes (optional, for testing or health checks)
// app.get("/", (req, res) => {
//   res.send("WebSocket Server is running!");
// });

// app.get("/health", (req, res) => {
//   res.status(200).send({ status: "OK", uptime: process.uptime() });
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
