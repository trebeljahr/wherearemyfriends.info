import express from "express";
import type { NextFunction, Request, Response } from "express";

const router = express.Router();

router.get("/", (_: Request, res: Response, next: NextFunction) => {
  res.json("All good in here");
});

export default router;
