import "dotenv/config";
import express from "express";
import path from "path";
import { configureApp } from "./config";
import { connectToDB } from "./db";
import addErrorHandlingToApp from "./error-handling";
import authRoutes from "./routes/auth.routes";
import indexRoutes from "./routes/index.routes";
import userRoutes from "./routes/user.routes";
import { CORRECT_PATH } from "./config/envVars";

connectToDB();

const app = express();

configureApp(app);

app.use("/api", indexRoutes);
app.use("/auth", authRoutes);
app.use("/api", userRoutes);

console.log({ NODE_ENV: process.env.NODE_ENV });
console.log({ __dirname });
console.log({ parentDir: CORRECT_PATH });

const clientBuild = path.resolve(CORRECT_PATH, "..", "client", "build");
app.use(express.static(path.resolve(CORRECT_PATH, "public")));
app.use(express.static(clientBuild));

app.get("*", (_, res) => {
  const indexFile = path.resolve(clientBuild, "index.html");
  console.log({ indexFile });

  res.sendFile(indexFile);
});

addErrorHandlingToApp(app);

export default app;
