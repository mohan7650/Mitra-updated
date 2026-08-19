import type { PetConnection } from "@/lib/api";

export type ConnectionState = "self" | "none" | "pending" | "connected";

export function computeConnectionState(
  otherPetId: string,
  selectedPetId: string,
  ownPetIds: Set<string>,
  connections: PetConnection[],
): ConnectionState {
  if (ownPetIds.has(otherPetId)) return "self";

  const conn = connections.find(
    (c) =>
      (c.requesterId === selectedPetId && c.receiverId === otherPetId) ||
      (c.requesterId === otherPetId && c.receiverId === selectedPetId),
  );
  if (!conn) return "none";
  if (conn.status === "ACCEPTED") return "connected";
  if (conn.status === "PENDING") return "pending";
  return "none";
}
