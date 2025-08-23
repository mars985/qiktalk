import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  autoConnect: false,  // connect only when needed
  withCredentials: true
});

export default socket;
