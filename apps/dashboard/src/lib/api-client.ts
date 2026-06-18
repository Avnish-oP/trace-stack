import axios from "axios";
import { getSession } from "next-auth/react";

/**
 * Pre-configured Axios instance for calling the api-server.
 *
 * - Base URL from env
 * - Automatically attaches the JWT accessToken from NextAuth session
 * - JSON content type by default
 */
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach auth token to every request
apiClient.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

export default apiClient;
