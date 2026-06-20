"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useProject } from "../../../../../hooks/useProjects";
import { useLogs, LogEntry } from "../../../../../hooks/useLogs";
import { Card } from "../../../../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../../../components/ui/Table";
import { Badge } from "../../../../../components/ui/Badge";
import { Input } from "../../../../../components/ui/Input";
import { Button } from "../../../../../components/ui/Button";
import { EmptyState } from "../../../../../components/ui/EmptyState";
import { Skeleton } from "../../../../../components/ui/Skeleton";
import { 
  Search, Filter, RefreshCw, ChevronDown, ChevronRight, 
  Terminal, Play, Pause, Download, Maximize2, Activity
} from "lucide-react";

export default function LogsViewer() {
  const params = useParams();
  const projectId = params.projectId as string;
  
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [page, setPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [isLiveStream, setIsLiveStream] = useState(true);

  const { data: project } = useProject(projectId);
  const { data: logData, isLoading, isFetching, refetch } = useLogs(projectId, { 
    page, 
    limit: 50,
    ...(search ? { search } : {}),
    ...(level ? { level } : {})
  }, {
    refetchInterval: (isLiveStream && page === 1 && !search && !level) ? 3000 : false
  });

  const toggleRow = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newSet = new Set(expandedRows);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedRows(newSet);
  };

  const getLevelBadgeVariant = (levelStr: string) => {
    switch (levelStr.toLowerCase()) {
      case "error":
      case "fatal":
        return "error";
      case "warn":
        return "warning";
      case "info":
        return "success";
      case "debug":
        return "default";
      default:
        return "default";
    }
  };

  // Syntax highlighting for JSON
  const formatJSON = (obj: any) => {
    const jsonStr = JSON.stringify(obj, null, 2);
    // Very simple Regex-based highlighting for basic JSON (strings, numbers, booleans, keys)
    return jsonStr.split('\n').map((line, i) => {
      // Colorize keys vs values
      const parts = line.split(': ');
      if (parts.length > 1) {
        return (
          <div key={i} className="leading-snug">
            <span className="text-purple-400">{parts[0]}</span>: 
            <span className={parts[1].startsWith('"') ? "text-green-400" : "text-yellow-400"}> {parts[1]}</span>
          </div>
        );
      }
      return <div key={i} className="text-gray-400 leading-snug">{line}</div>;
    });
  };

  return (
    <div className="space-y-4 h-[calc(100vh-6rem)] flex flex-col animate-fade-in">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-1.5 bg-[var(--color-brand-primary)]/20 rounded-md text-[var(--color-brand-primary)]">
              <Terminal size={18} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{project?.name || "Log Explorer"}</h1>
            <Badge variant="outline" className="ml-2 uppercase tracking-wider text-[10px] text-gray-400 border-white/10">Log Viewer</Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className={`gap-2 ${isLiveStream ? "border-[var(--color-brand-success)] text-[var(--color-brand-success)] hover:bg-[var(--color-brand-success)]/10" : "text-gray-400"}`}
            onClick={() => {
              setIsLiveStream(!isLiveStream);
              if (!isLiveStream) {
                setPage(1);
                setSearch("");
                setLevel("");
              }
            }}
          >
            {isLiveStream ? (
              <><Pause size={14} /> Pause Stream</>
            ) : (
              <><Play size={14} /> Live Tail</>
            )}
          </Button>
          <Button variant="outline" size="sm" className="gap-2 text-gray-400">
            <Download size={14} /> Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2 text-gray-400" onClick={() => refetch()}>
            <RefreshCw size={14} className={isFetching && !isLiveStream ? "animate-spin" : ""} /> Refresh
          </Button>
        </div>
      </div>

      {/* Main Viewer Card */}
      <Card className="flex-1 flex flex-col overflow-hidden p-0 border-[var(--color-border-subtle)] bg-black/40 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        
        {/* Toolbar */}
        <div className="p-3 border-b border-[var(--color-border-subtle)] bg-black/60 backdrop-blur-md flex flex-wrap items-center gap-3 z-10 sticky top-0">
          <div className="relative flex-1 min-w-[250px] max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-500" />
            </div>
            <input 
              placeholder="Search logs (e.g. error OR service:api)..." 
              className="w-full pl-10 pr-4 h-9 bg-[var(--color-bg-surface-hover)] border border-transparent focus:border-[var(--color-brand-primary)] rounded-md text-sm text-white placeholder:text-gray-500 focus:outline-none transition-colors font-mono"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (e.target.value) setIsLiveStream(false);
              }}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500 hidden sm:block" />
            <select 
              className="h-9 bg-[var(--color-bg-surface-hover)] border border-transparent focus:border-[var(--color-brand-primary)] rounded-md px-3 text-sm text-white focus:outline-none transition-colors cursor-pointer appearance-none pr-8 relative"
              value={level}
              onChange={(e) => {
                setLevel(e.target.value);
                if (e.target.value) setIsLiveStream(false);
              }}
              style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='gray' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em' }}
            >
              <option value="">All Levels</option>
              <option value="error">Error</option>
              <option value="warn">Warn</option>
              <option value="info">Info</option>
              <option value="debug">Debug</option>
            </select>
          </div>

          <div className="ml-auto flex items-center gap-4">
            {isLiveStream && (
              <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-[var(--color-brand-success)]/10 border border-[var(--color-brand-success)]/20 animate-pulse-glow">
                <span className="w-2 h-2 rounded-full bg-[var(--color-brand-success)] animate-pulse" />
                <span className="text-xs font-medium text-[var(--color-brand-success)] uppercase tracking-wider">Live</span>
              </div>
            )}
            <span className="text-sm font-mono text-gray-400 border-l border-white/10 pl-4">
              {logData?.pagination.total ? logData.pagination.total.toLocaleString() : 0} events
            </span>
          </div>
        </div>

        {/* Log Table Area */}
        <div className="flex-1 overflow-auto bg-[#0A0A0C] custom-scrollbar relative">
          {isLoading ? (
            <div className="p-4 space-y-1">
              {[...Array(15)].map((_, i) => (
                <Skeleton key={i} variant="table-row" className="h-8 opacity-20" />
              ))}
            </div>
          ) : !logData?.data || logData.data.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <EmptyState 
                icon={<Activity className="text-gray-500" />}
                title="No logs found"
                description={search || level ? "Try adjusting your filters or search query." : "Waiting for logs to stream in..."}
              />
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-black/80 sticky top-0 z-10 backdrop-blur-md border-b border-white/10">
                <TableRow className="hover:bg-transparent border-0">
                  <TableHead className="w-10 py-2 h-8 text-[11px] uppercase tracking-wider text-gray-500"></TableHead>
                  <TableHead className="w-48 py-2 h-8 text-[11px] uppercase tracking-wider text-gray-500">Timestamp</TableHead>
                  <TableHead className="w-28 py-2 h-8 text-[11px] uppercase tracking-wider text-gray-500">Level</TableHead>
                  <TableHead className="w-48 py-2 h-8 text-[11px] uppercase tracking-wider text-gray-500">Service</TableHead>
                  <TableHead className="py-2 h-8 text-[11px] uppercase tracking-wider text-gray-500">Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logData.data.map((log: LogEntry) => (
                  <React.Fragment key={log.id}>
                    <TableRow 
                      className={`cursor-pointer border-b border-white/5 transition-colors group ${
                        expandedRows.has(log.id) ? "bg-[var(--color-bg-surface-active)]" : "hover:bg-[var(--color-bg-surface)]"
                      }`}
                      onClick={(e) => toggleRow(log.id, e)}
                    >
                      <TableCell className="w-10 px-2 py-1.5 text-center text-gray-600 group-hover:text-gray-300">
                        {expandedRows.has(log.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </TableCell>
                      <TableCell className="py-1.5 text-xs text-gray-400 font-mono whitespace-nowrap">
                        {new Date(log.timestamp).toISOString().replace('T', ' ').replace('Z', '')}
                      </TableCell>
                      <TableCell className="py-1.5">
                        <Badge variant={getLevelBadgeVariant(log.level)} className="uppercase text-[9px] tracking-wider py-0 px-1.5 rounded-sm">
                          {log.level}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-1.5 text-xs text-gray-300 font-medium truncate">
                        {log.serviceName}
                      </TableCell>
                      <TableCell className="py-1.5 text-xs text-gray-300 font-mono truncate max-w-xl group-hover:text-white transition-colors">
                        {log.message}
                      </TableCell>
                    </TableRow>
                    
                    {expandedRows.has(log.id) && (
                      <TableRow className="bg-[#050505] border-b border-white/10">
                        <TableCell colSpan={5} className="p-0 border-0">
                          <div className="p-4 pl-12 bg-gradient-to-r from-[var(--color-bg-surface-active)]/50 to-transparent">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Log Details</h4>
                              <Button variant="ghost" size="sm" className="h-6 text-[10px] text-gray-500 hover:text-white gap-1 px-2">
                                <Maximize2 size={12} /> View Raw
                              </Button>
                            </div>
                            <div className="bg-[#0A0A0C] rounded-lg border border-[var(--color-border-subtle)] p-4 overflow-auto max-h-[400px] custom-scrollbar shadow-inner">
                              <pre className="text-[11px] font-mono">
                                {formatJSON({
                                  _id: log.id,
                                  timestamp: log.timestamp,
                                  level: log.level,
                                  service: log.serviceName,
                                  source: log.source,
                                  message: log.message,
                                  metadata: log.metadata,
                                })}
                              </pre>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        
        {/* Pagination Footer */}
        {logData && logData.pagination.totalPages > 1 && !isLiveStream && (
          <div className="p-3 border-t border-[var(--color-border-subtle)] bg-black/60 backdrop-blur-md flex items-center justify-between z-10">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Page <span className="text-white">{logData.pagination.page}</span> of {logData.pagination.totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="h-8 text-xs"
              >
                Previous
              </Button>
              <Button 
                variant="outline"
                size="sm"
                disabled={page === logData.pagination.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="h-8 text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
