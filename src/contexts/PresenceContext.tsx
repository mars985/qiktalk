import React, { createContext, useEffect, useState } from "react";
import socket from "@/lib/socket";

export type PresenceInfo = {
  online: boolean;
  lastSeen: string | null;
};

type PresenceMap = Record<string, PresenceInfo>;

export type PresenceContextType = {
  /** Live presence keyed by userId. Missing entry == not yet known. */
  statuses: PresenceMap;
  getStatus: (userId?: string | null) => PresenceInfo | undefined;
};

const PresenceContext = createContext<PresenceContextType | undefined>(undefined);

/**
 * Keeps a live map of who is online by listening to the server's presence
 * events. The server pushes a `presence:snapshot` (the full online roster) on
 * connect and a `presence:update` whenever a single user goes on/offline, so
 * status stays current in real time instead of being fetched once.
 */
export const PresenceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [statuses, setStatuses] = useState<PresenceMap>({});

  useEffect(() => {
    const handleSnapshot = (userIds: string[]) => {
      setStatuses((prev) => {
        const next = { ...prev };
        for (const id of userIds) {
          next[id] = { online: true, lastSeen: null };
        }
        return next;
      });
    };

    const handleUpdate = (update: {
      userId: string;
      online: boolean;
      lastSeen?: string | null;
    }) => {
      setStatuses((prev) => ({
        ...prev,
        [update.userId]: {
          online: update.online,
          lastSeen: update.lastSeen ?? prev[update.userId]?.lastSeen ?? null,
        },
      }));
    };

    socket.on("presence:snapshot", handleSnapshot);
    socket.on("presence:update", handleUpdate);

    // Request the current roster. socket.io buffers this emit until the
    // connection (opened in ProtectedRoute) is established.
    socket.emit("presence:request");

    return () => {
      socket.off("presence:snapshot", handleSnapshot);
      socket.off("presence:update", handleUpdate);
    };
  }, []);

  const getStatus = (userId?: string | null) =>
    userId ? statuses[userId] : undefined;

  return (
    <PresenceContext.Provider value={{ statuses, getStatus }}>
      {children}
    </PresenceContext.Provider>
  );
};

export { PresenceContext };
