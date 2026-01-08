// lib/playerName.ts
export function getPlayerName(): string {
  if (typeof window === "undefined") return "";

  let name = localStorage.getItem("playerName");
  if (!name) {
    name = prompt("Enter your name") || "Player";
    localStorage.setItem("playerName", name);
  }
  return name;
}