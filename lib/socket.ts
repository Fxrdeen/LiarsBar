import { io } from "socket.io-client";

// Create a function to get socket instance
export const getSocket = () => {
  return io("http://localhost:4000", {
    autoConnect: false,
  });
};
