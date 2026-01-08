import { v4 as uuid } from "uuid";

export function getPlayerId(): string {
  if (typeof window === "undefined") {
    // Server-side render safety
    return "";
  }

  let id = localStorage.getItem("playerId");

  if (!id) {
    id = uuid();
    localStorage.setItem("playerId", id);
  }

  return id;
}