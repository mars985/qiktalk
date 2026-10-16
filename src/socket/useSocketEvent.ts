import { useEffect, useRef } from "react";

import socket from "@/lib/socket";
import type { ListenEvent, ListenEvents } from "./listen.events";

export function useSocketEvent<E extends ListenEvent>(
  event: E,
  handler?: ListenEvents[E],
) {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  });

  const enabled = handler !== undefined;

  useEffect(() => {
    if (!enabled) return;

    const listener = ((...args: Parameters<ListenEvents[E]>) => {
      (handlerRef.current as (...a: typeof args) => void)?.(...args);
    }) as ListenEvents[E];

    socket.on(event, listener as never);
    return () => {
      socket.off(event, listener as never);
    };
  }, [event, enabled]);
}
