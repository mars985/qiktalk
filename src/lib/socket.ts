import { io, type Socket } from "socket.io-client";

import type { EmitEvents } from "@/socket/emit.events";
import type { ListenEvents } from "@/socket/listen.events";

const socket: Socket<ListenEvents, EmitEvents> = io(
  import.meta.env.VITE_BACKEND_URL,
  {
    autoConnect: false,
    withCredentials: true,
    extraHeaders: import.meta.env.DEV
      ? {
          "ngrok-skip-browser-warning": "true",
        }
      : {},
  },
);

export default socket;
