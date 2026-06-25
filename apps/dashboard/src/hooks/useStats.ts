import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface DashboardStats {
  totalProjects: number;
  logsIngested30d: number;
  growthRate: number;
}

export function useStats() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async (): Promise<DashboardStats> => {
      if (!session?.accessToken) {
        throw new Error("Not authenticated");
      }
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/api/v1/auth/me/stats`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch stats");
      }

      const json = await res.json();
      return json.data;
    },
    enabled: !!session?.accessToken,
  });
}
