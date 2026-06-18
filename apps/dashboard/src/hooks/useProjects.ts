import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/api-client";
import { CreateProjectInput } from "@trace-stack/shared";

export interface Project {
  id: string;
  name: string;
  environment: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export function useProjects(orgId: string) {
  return useQuery({
    queryKey: ["projects", { orgId }],
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: Project[] }>(`/api/v1/projects/orgs/${orgId}`);
      return res.data.data;
    },
    enabled: !!orgId,
  });
}

export function useProject(projectId: string) {
  return useQuery({
    queryKey: ["projects", projectId],
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: Project }>(`/api/v1/projects/${projectId}`);
      return res.data.data;
    },
    enabled: !!projectId,
  });
}

export function useCreateProject(orgId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateProjectInput) => {
      const res = await apiClient.post<{ success: boolean; data: Project }>(`/api/v1/projects/orgs/${orgId}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", { orgId }] });
    },
  });
}
