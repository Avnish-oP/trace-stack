import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/api-client";
import { CreateOrgInput, UpdateOrgInput } from "@trace-stack/shared";

// We'll define simple types since we didn't export full models from shared yet
export interface Organization {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export function useOrgs() {
  return useQuery({
    queryKey: ["orgs"],
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: Organization[] }>("/api/v1/orgs");
      return res.data.data;
    },
  });
}

export function useOrg(orgId: string) {
  return useQuery({
    queryKey: ["orgs", orgId],
    queryFn: async () => {
      const res = await apiClient.get<{ success: boolean; data: Organization }>(`/api/v1/orgs/${orgId}`);
      return res.data.data;
    },
    enabled: !!orgId,
  });
}

export function useCreateOrg() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateOrgInput) => {
      const res = await apiClient.post<{ success: boolean; data: Organization }>("/api/v1/orgs", data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orgs"] });
    },
  });
}
