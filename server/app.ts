import "dotenv/config";
import express from "express";
import path from "path";
import { configureApp } from "./config";
import { connectToDB } from "./db";
import addErrorHandlingToApp from "./error-handling";
import authRoutes from "./routes/auth.routes";
import indexRoutes from "./routes/index.routes";
import userRoutes from "./routes/user.routes";

connectToDB();

const app = express();

configureApp(app);

app.use("/api", indexRoutes);
app.use("/auth", authRoutes);
app.use("/api", userRoutes);
app.use(express.static(path.join(__dirname, "public")));

addErrorHandlingToApp(app);

export default app;
