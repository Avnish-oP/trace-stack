import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/api-client";
import { CreateApiKeyInput } from "@trace-stack/shared";

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  isActive: boolean;
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  projectId: string;
}

export function useApiKeys(projectId: string) {
  return useQuery({
    queryKey: ["apiKeys", { projectId }],
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: ApiKey[] }>(`/api/v1/projects/${projectId}/api-keys`);
      return res.data.data;
    },
    enabled: !!projectId,
  });
}

export function useCreateApiKey(projectId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateApiKeyInput) => {
      // Returns ApiKey + `key` (the raw key)
      const res = await apiClient.post<{ success: boolean; data: ApiKey & { key: string } }>(
        `/api/v1/projects/${projectId}/api-keys`, 
        data
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys", { projectId }] });
    },
  });
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ keyId }: { keyId: string }) => {
      const res = await apiClient.delete<{ success: boolean; data: null }>(`/api/v1/api-keys/${keyId}`);
      return res.data;
    },
    onSuccess: (_, variables) => {
      // Since we don't have projectId here easily without passing it, we can invalidate all apiKeys or pass it
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
    },
  });
}
