import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/api-client";

export interface LogEntry {
  id: string;
  serviceName: string;
  level: string;
  message: string;
  metadata: any;
  source: string | null;
  timestamp: string;
  createdAt: string;
  projectId: string;
}

interface LogResponse {
  data: LogEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useLogs(projectId: string, params: Record<string, any> = {}) {
  return useQuery({
    queryKey: ["logs", projectId, params],
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: LogResponse }>(`/api/v1/projects/${projectId}/logs`, {
        params,
      });
      return res.data.data;
    },
    enabled: !!projectId,
    refetchInterval: 5000, // auto-refresh every 5s for now (until we do WebSockets)
  });
}
