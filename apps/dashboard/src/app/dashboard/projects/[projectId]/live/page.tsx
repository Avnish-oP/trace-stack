"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "next/navigation";
import { useProject } from "../../../../../hooks/useProjects";
import { useLogStream, LiveLog } from "../../../../../hooks/useLogStream";
import { Card } from "../../../../../components/ui/Card";
import { Badge } from "../../../../../components/ui/Badge";
import { Button } from "../../../../../components/ui/Button";
import {
  Search, Play, Pause, Trash2, ArrowDown,
  Radio, Wifi, WifiOff, ChevronDown, ChevronRight,
  Maximize2, Terminal
} from "lucide-react";

// ─── Log Level Colors ────────────────────────────────────────
const LEVEL_CONFIG: Record<string, { color: string; bg: string; border: string; badge: "success" | "warning" | "error" | "default" }> = {
  debug: { color: "text-gray-400", bg: "bg-gray-500/10", border: "border-gray-500/20", badge: "default" },
  info:  { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", badge: "success" },
  warn:  { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", badge: "warning" },
  error: { color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", badge: "error" },
  fatal: { color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", badge: "error" },
};

const ALL_LEVELS = ["debug", "info", "warn", "error", "fatal"];

export default function LiveLogViewer() {
  const params = useParams();
  const projectId = params.projectId as string;

  const { data: project } = useProject(projectId);
  const { logs, status, isPaused, pause, resume, clear, bufferedCount } = useLogStream(projectId);

  const [search, setSearch] = useState("");
  const [enabledLevels, setEnabledLevels] = useState<Set<string>>(new Set(ALL_LEVELS));
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // ─── Filtered logs ─────────────────────────────────────────
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (!enabledLevels.has(log.level)) return false;
      if (search && !log.message.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [logs, enabledLevels, search]);

  // ─── Auto-scroll ───────────────────────────────────────────
  useEffect(() => {
    if (isAutoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [filteredLogs.length, isAutoScroll]);

  // Detect manual scroll-up to disable auto-scroll
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
    setIsAutoScroll(atBottom);
  };

  // ─── Level filter toggle ───────────────────────────────────
  const toggleLevel = (level: string) => {
    setEnabledLevels((prev) => {
      const next = new Set(prev);
      if (next.has(level)) next.delete(level);
      else next.add(level);
      return next;
    });
  };

  // ─── Row expand ────────────────────────────────────────────
  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ─── Connection status ─────────────────────────────────────
  const statusConfig = {
    connected: { icon: <Wifi size={14} />, text: "Connected", class: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    connecting: { icon: <Radio size={14} className="animate-pulse" />, text: "Connecting...", class: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    reconnecting: { icon: <Radio size={14} className="animate-pulse" />, text: "Reconnecting...", class: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    disconnected: { icon: <WifiOff size={14} />, text: "Disconnected", class: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
  };

  const currentStatus = statusConfig[status];

  // ─── Format timestamp ──────────────────────────────────────
  const formatTime = (ts: string) => {
    try {
      return new Date(ts).toISOString().replace("T", " ").replace("Z", "");
    } catch {
      return ts;
    }
  };

  return (
    <div className="space-y-4 h-[calc(100vh-6rem)] flex flex-col animate-fade-in">
      {/* ─── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-1.5 bg-emerald-500/20 rounded-md text-emerald-400">
              <Radio size={18} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {project?.name || "Live Stream"}
            </h1>
            <Badge variant="outline" className="ml-2 uppercase tracking-wider text-[10px] text-emerald-400 border-emerald-500/30">
              Live
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Connection Status */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${currentStatus.class}`}>
            {currentStatus.icon}
            {currentStatus.text}
          </div>

          {/* Pause / Resume */}
          <Button
            variant="outline"
            size="sm"
            className={`gap-2 ${isPaused
              ? "border-amber-500/40 text-amber-400 hover:bg-amber-500/10"
              : "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
            }`}
            onClick={() => (isPaused ? resume() : pause())}
          >
            {isPaused ? (
              <>
                <Play size={14} /> Resume
                {bufferedCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-amber-500/20 rounded-full">
                    {bufferedCount}
                  </span>
                )}
              </>
            ) : (
              <><Pause size={14} /> Pause</>
            )}
          </Button>

          {/* Clear */}
          <Button variant="outline" size="sm" className="gap-2 text-gray-400" onClick={clear}>
            <Trash2 size={14} /> Clear
          </Button>
        </div>
      </div>

      {/* ─── Main Viewer Card ───────────────────────────────── */}
      <Card className="flex-1 flex flex-col overflow-hidden p-0 border-[var(--color-border-subtle)] bg-black/40 shadow-[0_0_40px_rgba(0,0,0,0.5)]">

        {/* ─── Toolbar ──────────────────────────────────────── */}
        <div className="p-3 border-b border-[var(--color-border-subtle)] bg-black/60 backdrop-blur-md flex flex-wrap items-center gap-3 z-10">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-500" />
            </div>
            <input
              placeholder="Filter logs..."
              className="w-full pl-10 pr-4 h-9 bg-[var(--color-bg-surface-hover)] border border-transparent focus:border-[var(--color-brand-primary)] rounded-md text-sm text-white placeholder:text-gray-500 focus:outline-none transition-colors font-mono"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Level Filters */}
          <div className="flex items-center gap-1.5">
            {ALL_LEVELS.map((level) => {
              const cfg = LEVEL_CONFIG[level];
              const active = enabledLevels.has(level);
              return (
                <button
                  key={level}
                  onClick={() => toggleLevel(level)}
                  className={`px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider rounded-md border transition-all ${
                    active
                      ? `${cfg.color} ${cfg.bg} ${cfg.border}`
                      : "text-gray-600 bg-transparent border-transparent hover:border-white/10"
                  }`}
                >
                  {level}
                </button>
              );
            })}
          </div>

          {/* Right side info */}
          <div className="ml-auto flex items-center gap-4">
            {status === "connected" && !isPaused && (
              <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Live</span>
              </div>
            )}
            <span className="text-sm font-mono text-gray-400 border-l border-white/10 pl-4">
              {filteredLogs.length.toLocaleString()} events
            </span>
          </div>
        </div>

        {/* ─── Log Stream Area ──────────────────────────────── */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-auto bg-[#0A0A0C] custom-scrollbar relative font-mono text-[12px]"
        >
          {filteredLogs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <Terminal size={40} className="mb-4 opacity-30" />
              <p className="text-sm font-sans">
                {status === "connected" ? "Waiting for logs..." : "Connect to start streaming"}
              </p>
              {status === "connected" && (
                <p className="text-xs mt-2 text-gray-600 font-sans">
                  Send logs via the SDK and they will appear here in real time.
                </p>
              )}
            </div>
          ) : (
            <div className="divide-y divide-white/[0.03]">
              {filteredLogs.map((log) => {
                const cfg = LEVEL_CONFIG[log.level] || LEVEL_CONFIG.debug;
                const isExpanded = expandedRows.has(log.id!);

                return (
                  <div key={log.id}>
                    {/* Log Row */}
                    <div
                      className={`flex items-start gap-3 px-4 py-2 cursor-pointer transition-colors group ${
                        isExpanded ? "bg-white/[0.03]" : "hover:bg-white/[0.02]"
                      }`}
                      onClick={() => toggleRow(log.id!)}
                    >
                      {/* Expand icon */}
                      <span className="mt-0.5 text-gray-600 group-hover:text-gray-400 transition-colors shrink-0">
                        {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                      </span>

                      {/* Timestamp */}
                      <span className="text-gray-500 shrink-0 w-[180px]">
                        {formatTime(log.timestamp)}
                      </span>

                      {/* Level */}
                      <span className={`shrink-0 w-[52px] uppercase font-semibold tracking-wider text-[10px] mt-0.5 ${cfg.color}`}>
                        {log.level}
                      </span>

                      {/* Service */}
                      {log.serviceName && (
                        <span className="shrink-0 text-gray-400 w-[140px] truncate">
                          {log.serviceName}
                        </span>
                      )}

                      {/* Message */}
                      <span className="text-gray-300 group-hover:text-white transition-colors flex-1 truncate">
                        {log.message}
                      </span>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-4 py-3 pl-12 bg-white/[0.02] border-t border-white/[0.05]">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                            Log Details
                          </h4>
                          <Button variant="ghost" size="sm" className="h-5 text-[10px] text-gray-500 hover:text-white gap-1 px-2">
                            <Maximize2 size={10} /> Raw
                          </Button>
                        </div>
                        <pre className="bg-[#050508] rounded-lg border border-white/[0.05] p-3 overflow-auto max-h-[300px] custom-scrollbar text-[11px] leading-relaxed">
                          {JSON.stringify(
                            {
                              timestamp: log.timestamp,
                              level: log.level,
                              service: log.serviceName,
                              source: log.source,
                              message: log.message,
                              metadata: log.metadata,
                              projectId: log.projectId,
                            },
                            null,
                            2
                          )
                            .split("\n")
                            .map((line, i) => {
                              const parts = line.split(": ");
                              if (parts.length > 1) {
                                return (
                                  <div key={i}>
                                    <span className="text-purple-400">{parts[0]}</span>
                                    <span className="text-gray-500">: </span>
                                    <span className={parts.slice(1).join(": ").trim().startsWith('"') ? "text-emerald-400" : "text-amber-400"}>
                                      {parts.slice(1).join(": ")}
                                    </span>
                                  </div>
                                );
                              }
                              return <div key={i} className="text-gray-500">{line}</div>;
                            })}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* ─── Jump to Bottom Button ────────────────────────── */}
        {!isAutoScroll && filteredLogs.length > 0 && (
          <button
            onClick={() => {
              setIsAutoScroll(true);
              bottomRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-[var(--color-brand-primary)] text-white text-xs font-medium rounded-full shadow-lg shadow-[var(--color-brand-primary)]/30 hover:scale-105 transition-transform z-20"
          >
            <ArrowDown size={14} /> Jump to latest
          </button>
        )}
      </Card>
    </div>
  );
}
