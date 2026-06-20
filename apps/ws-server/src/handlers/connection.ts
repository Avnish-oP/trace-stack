import { Socket } from "socket.io";

/**
 * Handles Socket.IO connection events: join/leave project rooms.
 */
export function registerConnectionHandlers(socket: Socket) {
  const user = socket.data.user;
  console.log(`[ws-server] User connected: ${user.email} (${socket.id})`);

  // ─── Join a project room ──────────────────────────────────
  socket.on("join-project", (projectId: string) => {
    if (!projectId || typeof projectId !== "string") {
      socket.emit("error", { message: "Invalid projectId" });
      return;
    }

    const room = `project:${projectId}`;
    socket.join(room);
    console.log(`[ws-server] ${user.email} joined room ${room}`);

    socket.emit("joined-project", { projectId });
  });

  // ─── Leave a project room ─────────────────────────────────
  socket.on("leave-project", (projectId: string) => {
    if (!projectId || typeof projectId !== "string") return;

    const room = `project:${projectId}`;
    socket.leave(room);
    console.log(`[ws-server] ${user.email} left room ${room}`);
  });

  // ─── Disconnect ────────────────────────────────────────────
  socket.on("disconnect", (reason) => {
    console.log(`[ws-server] User disconnected: ${user.email} (${reason})`);
  });
}
