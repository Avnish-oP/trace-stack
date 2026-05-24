import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import logsRoutes from "./routes/logs";

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

app.use("/api/v1/logs", logsRoutes);

app.get("/health", (_, res) => {
  res.json({
    success: true,
    data: {
      service: "ingestion-api",
      status: "ok",
      timestamp: new Date().toISOString(),
    },
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[ingestion-api] running on port ${PORT}`);
});