import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import router from "next/router";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

interface Player {
  id: string;
  username: string;
}

interface Rooms {
  [roomId: string]: Player[];
}

const rooms: Rooms = {}; // Store rooms and their players

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running!");
});

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ roomId, username }) => {
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

    // Check if player already exists in the room
    const existingPlayerIndex = rooms[roomId].findIndex(
      (player) => player.username === username
    );

    if (existingPlayerIndex !== -1) {
      // Update existing player's socket ID
      rooms[roomId][existingPlayerIndex].id = socket.id;
    } else {
      // Add new player with unique ID combining socket.id and username
      const player = {
        id: `${socket.id}_${username}`,
        username,
      };
      rooms[roomId].push(player);
    }

    socket.join(roomId);
    io.to(roomId).emit("updatePlayers", rooms[roomId]);
    console.log(`${username} joined room ${roomId}`);
  });
  socket.on("leaveRoom", ({ roomId, username }) => {
    const room = rooms[roomId];
    if (room) {
      // Remove the player from the room
      const updatedPlayers = room.filter(
        (player) => player.username !== username
      );
      rooms[roomId] = updatedPlayers;

      // Notify all remaining players in the room
      io.to(roomId).emit("updatePlayers", updatedPlayers);
    }
    socket.leave(roomId);
  });
  socket.on("startGame", ({ roomId }) => {
    io.to(roomId).emit("gameStarted");
  });
  socket.on("joinGameRoom", ({ roomId, username }) => {
    socket.join(roomId);

    // If the room doesn't exist in our rooms object, initialize it
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

    // Add the player if they're not already in the room
    const playerExists = rooms[roomId].find(
      (player) => player.username === username
    );
    if (!playerExists) {
      rooms[roomId].push({
        id: socket.id,
        username: username,
      });
    }

    // Emit the updated player list to all clients in the room
    io.to(roomId).emit("updateGamePlayers", rooms[roomId]);

    // Debug log
    console.log(`Players in room ${roomId}:`, rooms[roomId]);
  });
  socket.on("disconnect", () => {
    // Find and remove the player from any room they were in
    for (const [roomId, players] of Object.entries(rooms)) {
      rooms[roomId] = players.filter((player) => player.id !== socket.id);
      io.to(roomId).emit("updateGamePlayers", rooms[roomId]);
    }
  });
  socket.on("sendMessage", ({ roomId, username, message, timestamp }) => {
    // Broadcast to all OTHER clients in the room
    socket.to(roomId).emit("newMessage", { username, message, timestamp });
  });
});

const PORT = 4000;
server.listen(process.env.PORT || PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
