"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

export interface LiveLog {
  id?: string;
  message: string;
  level: string;
  timestamp: string;
  serviceName?: string;
  source?: string;
  metadata?: Record<string, unknown>;
  projectId: string;
}

type ConnectionStatus = "connecting" | "connected" | "disconnected" | "reconnecting";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3003";
const MAX_LOGS = 1000; // Keep at most 1000 logs in memory

export function useLogStream(projectId: string) {
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);

  const [logs, setLogs] = useState<LiveLog[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [isPaused, setIsPaused] = useState(false);
  const bufferRef = useRef<LiveLog[]>([]);

  // ─── Connect to WebSocket ──────────────────────────────────
  useEffect(() => {
    const token = session?.accessToken;
    if (!token || !projectId) return;

    const socket = io(WS_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketRef.current = socket;
    setStatus("connecting");

    socket.on("connect", () => {
      setStatus("connected");
      socket.emit("join-project", projectId);
    });

    socket.on("joined-project", () => {
      // Confirmed we joined the room
    });

    socket.on("log", (log: LiveLog) => {
      // Generate a client-side ID for React keys
      const enrichedLog = {
        ...log,
        id: log.id || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      };

      if (isPausedRef.current) {
        bufferRef.current.push(enrichedLog);
      } else {
        setLogs((prev) => {
          const next = [...prev, enrichedLog];
          return next.length > MAX_LOGS ? next.slice(-MAX_LOGS) : next;
        });
      }
    });

    socket.on("disconnect", () => {
      setStatus("disconnected");
    });

    socket.io.on("reconnect_attempt", () => {
      setStatus("reconnecting");
    });

    socket.io.on("reconnect", () => {
      setStatus("connected");
      socket.emit("join-project", projectId);
    });

    socket.on("connect_error", (err) => {
      console.error("[useLogStream] Connection error:", err.message);
    });

    return () => {
      socket.emit("leave-project", projectId);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [session?.accessToken, projectId]);

  // Keep a ref in sync with isPaused so the socket callback can read it
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;

  // ─── Pause / Resume ────────────────────────────────────────
  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    // Flush buffer
    if (bufferRef.current.length > 0) {
      setLogs((prev) => {
        const next = [...prev, ...bufferRef.current];
        bufferRef.current = [];
        return next.length > MAX_LOGS ? next.slice(-MAX_LOGS) : next;
      });
    }
    setIsPaused(false);
  }, []);

  const clear = useCallback(() => {
    setLogs([]);
    bufferRef.current = [];
  }, []);

  return {
    logs,
    status,
    isPaused,
    pause,
    resume,
    clear,
    bufferedCount: bufferRef.current.length,
  };
}
