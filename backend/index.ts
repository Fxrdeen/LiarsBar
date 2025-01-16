import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend URL
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
  socket.on("disconnect", () => {
    const roomId = [...socket.rooms].find((room) => rooms[room]);
    if (roomId) {
      const room = rooms[roomId];
      if (room) {
        // Remove the disconnected player
        const updatedPlayers = rooms[roomId].filter(
          (player) => player.id !== socket.id
        );
        rooms[roomId] = updatedPlayers;

        // Notify remaining players
        io.to(roomId).emit("updatePlayers", updatedPlayers);
      }
    }
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
