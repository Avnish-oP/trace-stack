import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import { config } from "./config";
import { subscriber } from "./lib/redis";
import { verifyToken } from "./lib/auth";
import { registerConnectionHandlers } from "./handlers/connection";

// ─── HTTP + Socket.IO Server ─────────────────────────────────

const httpServer = http.createServer((_, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      success: true,
      data: {
        service: "ws-server",
        status: "ok",
        timestamp: new Date().toISOString(),
      },
    })
  );
});

const io = new Server(httpServer, {
  cors: {
    origin: config.CORS_ORIGIN,
    credentials: true,
  },
});

// ─── Auth Middleware ──────────────────────────────────────────
// Verify the JWT from the Socket.IO handshake before allowing connection.

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("Authentication required"));
  }

  try {
    const user = verifyToken(token);
    socket.data.user = user;
    next();
  } catch {
    next(new Error("Invalid or expired token"));
  }
});

// ─── Connection Handler ──────────────────────────────────────

io.on("connection", (socket) => {
  registerConnectionHandlers(socket);
});

// ─── Redis Pub/Sub → Socket.IO Broadcast ─────────────────────
// Subscribe to all `logs:*` channels.
// When the processing-worker publishes a log, broadcast it to the
// corresponding Socket.IO room.

subscriber.psubscribe("logs:*", (err) => {
  if (err) {
    console.error("[ws-server] Failed to subscribe to logs:*", err);
    process.exit(1);
  }
  console.log("[ws-server] Subscribed to Redis Pub/Sub pattern: logs:*");
});

subscriber.on("pmessage", (_pattern, channel, message) => {
  // channel = "logs:<projectId>"
  const projectId = channel.split(":")[1];
  if (!projectId) return;

  try {
    const log = JSON.parse(message);
    io.to(`project:${projectId}`).emit("log", log);
  } catch {
    console.error("[ws-server] Failed to parse Pub/Sub message");
  }
});

// ─── Start Server ────────────────────────────────────────────

httpServer.listen(config.PORT, () => {
  console.log(`[ws-server] running on port ${config.PORT}`);
  console.log(`[ws-server] environment: ${config.NODE_ENV}`);
  console.log(`[ws-server] CORS origin: ${config.CORS_ORIGIN}`);
});
