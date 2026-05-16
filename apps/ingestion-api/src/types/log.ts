export interface LogSchema {
  message: string;
  level: string;
  timestamp: string;
  serviceName: string;
  source?: string;
  metadata?: Record<string, any>;
}