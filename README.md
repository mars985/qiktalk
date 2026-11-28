# QikTalk — Frontend

Web client for **QikTalk**, a real-time chat app with direct messages, group chats, live presence
and avatars.

Built with **React 19**, **TypeScript**, **Vite 7**, **Tailwind CSS v4** and **DaisyUI 5**. It talks
to the backend over **REST (axios)** and **Socket.IO**.

> The API and socket server live in [`qiktalk-backend`](https://github.com/mars985/qiktalk-backend).

## Features

- **Auth:** sign up and log in. The session is an httpOnly cookie set by the backend, and route guards keep signed-out users on the auth pages.
- **DMs and groups:** a "New chat / New group" flow lets you search users, pick group members and name the group.
- **Real-time messaging:** messages arrive live, the conversation list reorders on activity, and group previews show the sender's name.
- **Live presence:** green dots and `Online` / `last seen…` labels update in real time in the chat header and the conversation list.
- **Avatars:** upload, view and remove your own avatar or a group's. Group avatar changes appear for every member live.
- **Themes:** a DaisyUI theme switcher whose choice persists in `localStorage`.
- **Responsive layout:** a resizable two-pane layout on desktop and a stacked layout with back navigation on mobile.

## Tech stack

| Concern    | Choice                                        |
| ---------- | --------------------------------------------- |
| Framework  | React 19                                      |
| Language   | TypeScript (strict)                           |
| Build      | Vite 7                                        |
| Styling    | Tailwind CSS v4, DaisyUI 5, shadcn/ui (Radix) |
| Routing    | react-router-dom 7                            |
| HTTP       | axios                                         |
| Realtime   | socket.io-client 4 (typed events)             |
| Validation | Zod 4                                         |
| Icons      | lucide-react                                  |

## Project structure

```
src/
├── main.tsx, App.tsx       Bootstrap, routes and providers
├── pages/                  LoginPage, SignupPage, HomePage
│   └── guards/             ProtectedRoute, PublicRoute
├── components/
│   ├── sidebar/            SideBar, ConversationsList, ConversationTile, ToggleTheme, LogoutButton
│   ├── chat/               ChatHeader, MessagePanel, MessageTile, MessageBox, DateDivider
│   ├── new-conversation/   NewChatDropdown, NewChatPanel, NewGroupPanel, SearchBar
│   ├── avatar/             Avatar, ImageViewer (view/upload/remove)
│   └── ui/                 shadcn/ui primitives
├── api/                    REST wrappers (user.api.ts, conversation.api.ts)
├── socket/                 Typed emit/listen event maps and socket hooks
├── contexts/               UserContext, PresenceContext
├── hooks/                  useUser, usePresence, useConversations
├── lib/                    axios instance, socket singleton, utils
├── validators/, constants/ Zod schemas and limits shared with the backend
└── types/                  User, Conversation, Message
```

The `@/` import alias points to `src/`.

## Getting started

### Prerequisites

- Node.js 20+
- The [backend](https://github.com/mars985/qiktalk-backend) running, with `CORS_ORIGIN` set to this
  app's origin (`http://localhost:5173` in development)

### Setup

```bash
npm install
cp .env.example .env
npm run dev
```

| Variable           | Description                                       | Example                 |
| ------------------ | ------------------------------------------------- | ----------------------- |
| `VITE_BACKEND_URL` | Backend origin, used for both REST and Socket.IO. | `http://localhost:4501` |

axios appends `/api/v1` to this URL itself, so leave the prefix out.

### Scripts

| Command           | Description                                 |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Start the Vite dev server on port 5173.     |
| `npm run build`   | Type-check (`tsc -b`) and build to `dist/`. |
| `npm run preview` | Serve the production build locally.         |
| `npm run lint`    | Run ESLint.                                 |

## How it talks to the backend

### REST

`lib/axios.ts` creates an axios instance with `baseURL = VITE_BACKEND_URL + "/api/v1"` and
`withCredentials: true`, so the auth cookie goes with every request. Endpoints are wrapped in
`api/user.api.ts` (`UserRequest`) and `api/conversation.api.ts` (`ConversationRequest`).

### Socket.IO

`lib/socket.ts` exports one typed `Socket<ListenEvents, EmitEvents>` with `autoConnect: false` and
`withCredentials: true`. `ProtectedRoute` connects it once the user is verified and disconnects it on
unmount. The backend reads the user from the authenticated handshake, so the client never sends its own ID.

Event types are declared in `socket/emit.events.ts` and `socket/listen.events.ts`, so emits, acks and
listeners are all checked by TypeScript. Components subscribe through `useSocketEvent`, which keeps
the latest handler in a ref and re-subscribes only when the event name changes.

| Direction       | Events                                                                                  |
| --------------- | --------------------------------------------------------------------------------------- |
| Client → server | `sendMessage`, `createDM`, `createGroup`, `joinConversation`, `presence:request`        |
| Server → client | `newMessage`, `newGroup`, `conversationUpdated`, `presence:snapshot`, `presence:update` |

### Presence

`PresenceContext` keeps a live map of who is online:

1. On mount it emits `presence:request` and loads the returned `presence:snapshot`.
2. It then applies every `presence:update` (`{ userId, online, lastSeen }`).

`ChatHeader` loads a DM partner's status once with `GET /users/getOnlineStatus/:userId` and lets live
updates take over from there. The same context drives the presence dots in the conversation list.

### Avatars

`ImageViewer` opens an avatar full-size and, for your own avatar or a group's, lets you upload or remove
it. Files are checked on the client (JPEG/PNG/WebP/GIF, up to 5 MB) before they are sent as
`multipart/form-data`. Group changes reach other members through the `conversationUpdated` event.

## Deployment

The app is a static SPA. `vercel.json` rewrites every path to `/`, so client-side routes survive a
page refresh on Vercel. On other hosts, set up an equivalent fallback to `index.html`.

In production, `VITE_BACKEND_URL` must be the deployed backend's HTTPS origin. The backend's
`CORS_ORIGIN` must match the frontend's origin, and the auth cookie is `secure` with `SameSite=None`.

## CI

`.github/workflows/ci.yml` runs on pull requests and pushes to `main`: `npm ci`,
`prettier --check .`, `npm run lint` and `npm run build`.

## Notes

- In development, requests send `ngrok-skip-browser-warning`, and Vite allows `*.ngrok-free.app` hosts, so the dev server can be shared over ngrok.
- Validation limits in `src/constants/` mirror the backend's and must be kept in sync.
