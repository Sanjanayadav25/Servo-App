import { io } from "socket.io-client";

const socket = io(
  "https://servo-app-yp59.onrender.com"
);

export default socket;