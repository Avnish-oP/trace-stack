import { Request, Response } from "express";
import { validateApiKey } from "../services/ingestion";
import prisma from "../lib/prisma";
import { LogSchema } from "../types/log";

export const ingestLogsController = async (req: Request, res: Response) => {
  //1.api key validation
  //2.payload schema validation
  //3.validate req field
  //4. save logs to db in batch

  try {

    const apiKey = req.headers["x-api-key"] as string;
    if (!apiKey) {
      return res.status(401).json({ error: "API key is required" });
    }

    const isValidKey = await validateApiKey(apiKey);

    if (!isValidKey) {
      return res.status(401).json({ error: "API key is invalid" });
    }
    
    const logs=req.body.logs;
    if (!logs || !Array.isArray(logs)) {
      return res.status(400).json({ error: "Logs must be an array" });
    }
    
    // validate each log entry
    logs.forEach((log: LogSchema) => {
      if (!log.message || !log.level || !log.timestamp) {
        return res.status(400).json({ error: "Invalid log entry" });
      }
    });

    await prisma.log.createMany({
      data: logs.map((log: LogSchema) => ({
        message: log.message,
        level: log.level,
        timestamp: new Date(log.timestamp),
        projectId: isValidKey,
        serviceName: log.serviceName,
        source: log.source,
        metadata: log.metadata
      }))
    });

    res.status(200).json({ message: "Logs ingested successfully" });

  } catch (error) {
    console.error("Error ingesting logs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};