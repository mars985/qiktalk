import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
