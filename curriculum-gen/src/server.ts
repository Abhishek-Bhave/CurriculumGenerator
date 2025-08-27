import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import curriculaRouter from "./api/curricula";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/api/curricula", curriculaRouter);

app.use(express.static(path.resolve("src/public")));

app.get("/*", (_req, res) => {
  res.sendFile(path.resolve("src/public/index.html"));
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

