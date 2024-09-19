import * as express from "express";
import { Express } from "express";
import * as logger from "morgan";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";

const FRONTEND_URL: string = process.env.ORIGIN;

if (!FRONTEND_URL) {
  console.error("Please provide the FRONTEND_URL in the .env file.");
  process.exit(1);
}

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
