import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTimestampFromObjectId(objectId: string) {
  return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
}

export function formatDate(objectId: string) {
  return getTimestampFromObjectId(objectId).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatLastSeen(value: string | null): string {
  if (!value) return "Offline";

  const date = new Date(value);
  if (isNaN(date.getTime())) return "Offline";

  const diffMins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diffMins < 1) return "last seen just now";
  if (diffMins < 60)
    return `last seen ${diffMins} min${diffMins > 1 ? "s" : ""} ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24)
    return `last seen ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

  return `last seen ${date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })}`;
}
