# QikTalk — Frontend

The web client for **QikTalk**, a real-time one-to-one and group chat app. Built with
**React 19 + TypeScript + Vite**, styled with **Tailwind CSS v4 + DaisyUI** (with a few
**shadcn/ui** components for auth), and talking to the backend over **REST (axios)** and
**Socket.IO**.

> Backend lives in the [`qiktalk-backend`](https://github.com/mars985/qiktalk-backend) repo.

---

## Features

- **Auth** — login / signup against the backend; an httpOnly JWT cookie keeps the session.
- **Conversations** — direct messages and named groups, with a polished **New chat / New group**
  flow (search users, build a group, name it).
- **Real-time messaging** — messages stream in live over Socket.IO; the conversation list reorders
  as new messages arrive.
- **Live presence** — online status updates **in real time**. A green dot and an
  `Online` / `last seen…` label reflect presence as it changes, in both the chat header and the
  conversation list.
- **Theming** — DaisyUI themes via a theme switcher (persisted to `localStorage`).
- **Responsive** — a resizable two-pane desktop layout and a stacked mobile layout with back nav.

---

## Tech stack

| Concern    | Choice                                       |
| ---------- | -------------------------------------------- |
| Framework  | React 19                                     |
| Build tool | Vite 7                                       |
| Language   | TypeScript (strict)                          |
| Styling    | Tailwind CSS v4, DaisyUI 5, shadcn/ui (auth) |
| Icons      | lucide-react                                 |
| Routing    | react-router-dom 7                           |
| HTTP       | axios                                        |
| Realtime   | socket.io-client                             |

---

## Project structure

```
qiktalk/src/
├── main.tsx                # App bootstrap (Router)
├── App.tsx                 # Routes + providers
├── pages/
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   └── HomePage.tsx        # Desktop (resizable) / mobile layouts
├── components/
│   ├── SideBar.tsx
│   ├── ConversationsList.tsx · ConversationTile.tsx · ConversationAvatar.tsx
│   ├── NewChatDropdown.tsx · NewChatPanel.tsx · NewGroupPanel.tsx · SearchUsers.tsx
│   ├── MessagePanel.tsx · MessageTile.tsx · MessageBox.tsx · ChatHeader.tsx · DateDivider.tsx
│   ├── ProtectedRoute.tsx · LogoutButton.tsx · ToggleTheme.tsx
│   └── ui/                 # shadcn/ui primitives (button, card, input, label, ...)
├── contexts/
│   ├── UserContext.tsx     # Current user
│   └── PresenceContext.tsx # Live online/last-seen map from socket events
├── hooks/
│   ├── useUser.ts
│   ├── usePresence.ts
│   └── useConversations.ts
├── lib/
│   ├── axios.ts            # axios instance (baseURL, withCredentials)
│   ├── socket.ts           # socket.io-client singleton (withCredentials)
│   └── utils.ts            # cn(), ObjectId timestamp helpers
└── types/                  # user / conversation / message types
```

---

## Getting started

### Prerequisites

The [backend](../qiktalk-backend) should be running and reachable, with its `CORS_ORIGIN`
set to this app's dev origin (default `http://localhost:5173`).

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

| Variable           | Description                                                       | Example                 |
| ------------------ | ----------------------------------------------------------------- | ----------------------- |
| `VITE_BACKEND_URL` | Base URL of the backend (REST + Socket.IO). Used by axios/socket. | `http://localhost:4501` |

### 3. Run

```bash
npm run dev       # start the Vite dev server
npm run build     # type-check (tsc -b) + production build
npm run preview   # preview the production build
npm run lint      # run ESLint
```

The dev server runs at `http://localhost:5173` by default.

---

## How it connects to the backend

- **`lib/axios.ts`** — an axios instance pointed at `VITE_BACKEND_URL` with `withCredentials: true`
  so the JWT cookie travels with every request.
- **`lib/socket.ts`** — a single `socket.io-client` instance (`autoConnect: false`,
  `withCredentials: true`). `ProtectedRoute` calls `socket.connect()` once the user is known and
  `socket.disconnect()` on unmount. The backend derives identity from the authenticated handshake,
  so the client doesn't announce itself.

### Real-time presence

`PresenceContext` listens to the backend's presence events and keeps a live map of who's online:

- on mount it emits `presence:request` and applies the returned `presence:snapshot` (the current
  online roster);
- it applies each `presence:update` (`{ userId, online, lastSeen }`) as users come and go.

`ChatHeader` seeds a DM partner's status once via `GET /getOnlineStatus/:userId` (so a freshly
opened chat is correct immediately) and then lets live socket updates take over. The same context
drives the green presence dots in the conversation list. This replaces the previous approach, which
fetched status only once and never updated.

---

## Notes

- The chat UI uses **DaisyUI theme tokens** (`base-*`, `primary`, `secondary`, `success`, …) so it
  adapts across all DaisyUI themes offered by the theme switcher.
- `index.html` defaults to the `light` theme; the selected theme is saved to `localStorage`.
