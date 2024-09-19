import express from "express";
import { Express } from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

console.log(process.env);

const FRONTEND_URL = process.env.ORIGIN as string;
const TOKEN_SECRET = process.env.TOKEN_SECRET as string;
const MONGODB_URI = process.env.MONGODB_URI as string;

if (!FRONTEND_URL) {
  console.error("Please provide the FRONTEND_URL in the .env file.");
  process.exit(1);
}

if (!process.env.TOKEN_SECRET) {
  console.error("TOKEN_SECRET not provided in the environment");
  process.exit(1);
}

if (!MONGODB_URI) {
  console.error("No MONGODB_URI provided in the environment");
  process.exit(1);
}

export { FRONTEND_URL, TOKEN_SECRET, MONGODB_URI };

export default (app: Express): void => {
  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: [FRONTEND_URL],
    })
  );

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
};
