import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:3000",
  "https://cardy-routelle.vercel.app", // Replace with your actual frontend domain
];

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("Not allowed by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const cards = ["King", "Queen", "Ace"];

interface Player {
  id: string;
  username: string;
  cards?: string[];
}

interface Rooms {
  [roomId: string]: {
    players: Player[];
    card: string;
  };
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
      rooms[roomId] = {
        players: [],
        card: "",
      };
    }

    // Check if player already exists in the room
    const existingPlayerIndex = rooms[roomId].players.findIndex(
      (player) => player.username === username
    );

    if (existingPlayerIndex !== -1) {
      // Update existing player's socket ID
      rooms[roomId].players[existingPlayerIndex].id = socket.id;
    } else {
      // Add new player with unique ID combining socket.id and username
      const player = {
        id: `${socket.id}_${username}`,
        username,
      };
      rooms[roomId].players.push(player);
    }

    socket.join(roomId);
    io.to(roomId).emit("updatePlayers", rooms[roomId].players);
    console.log(`${username} joined room ${roomId}`);
  });
  socket.on("leaveRoom", ({ roomId, username }) => {
    const room = rooms[roomId];
    if (room) {
      // Remove the player from the room
      const updatedPlayers = room.players.filter(
        (player) => player.username !== username
      );
      rooms[roomId].players = updatedPlayers;

      // Notify all remaining players in the room
      io.to(roomId).emit("updatePlayers", updatedPlayers);
    }
    socket.leave(roomId);
  });
  socket.on("startGame", ({ roomId, players }) => {
    io.to(roomId).emit("gameStarted");
  });
  socket.on("giveCards", ({ roomId }) => {
    for (const player of rooms[roomId].players) {
      player.cards = Array(5)
        .fill(null)
        .map(() => cards[Math.floor(Math.random() * cards.length)]);
    }
    rooms[roomId].card = cards[Math.floor(Math.random() * cards.length)];
    io.to(roomId).emit("updateRoomPlayers", rooms[roomId].players);
    io.to(roomId).emit("updateRoomCard", rooms[roomId].card);
  });
  socket.on("joinGameRoom", ({ roomId, username }) => {
    socket.join(roomId);

    // If the room doesn't exist in our rooms object, initialize it
    if (!rooms[roomId]) {
      rooms[roomId] = {
        players: [],
        card: "",
      };
    }

    // Add the player if they're not already in the room
    const playerExists = rooms[roomId].players.find(
      (player) => player.username === username
    );
    if (!playerExists) {
      rooms[roomId].players.push({
        id: socket.id,
        username: username,
      });
    }

    // Emit the updated player list to all clients in the room
    io.to(roomId).emit("updateGamePlayers", rooms[roomId].players);

    // Debug log
    console.log(`Players in room ${roomId}:`, rooms[roomId]);
  });
  socket.on("disconnect", () => {
    // Find and remove the player from any room they were in
    for (const [roomId, players] of Object.entries(rooms)) {
      rooms[roomId].players = rooms[roomId].players.filter(
        (player) => player.id !== socket.id
      );
      io.to(roomId).emit("updateGamePlayers", rooms[roomId].players);
    }
  });
  socket.on("sendMessage", ({ roomId, username, message, timestamp }) => {
    // Broadcast to all OTHER clients in the room
    socket.to(roomId).emit("newMessage", { username, message, timestamp });
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
