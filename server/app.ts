import "dotenv/config";
import express from "express";
import configureApp from "./config";
import { connectToDB } from "./db";
import addErrorHandlingToApp from "./error-handling";
import indexRoutes from "./routes/index.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import path from "path";

connectToDB();

const app = express();

configureApp(app);

app.use("/api", indexRoutes);
app.use("/auth", authRoutes);
app.use("/api", userRoutes);
app.use(express.static(path.join(__dirname, "public")));

addErrorHandlingToApp(app);

export default app;
